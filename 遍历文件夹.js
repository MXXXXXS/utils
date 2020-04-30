const fs = require('fs')
const path = require('path')

function collectFiles(dir, deep = true) {
  const filesCollection = []
  recursion(dir, deep)
  function recursion(dir, deep) {
    let files = fs.readdirSync(dir)
    files.forEach(item => {
      const itemPath = path.resolve(dir, item)
      const isDir = fs.statSync(itemPath).isDirectory()
      if (isDir && deep) {
        recursion(itemPath)
      } else if (!isDir) {
        filesCollection.push(itemPath)
      }
    })
  }
  return filesCollection
}

function traverse(dir, cb, deep = true) {
  fs.readdirSync(dir).forEach(item => {
    const itemPath = path.resolve(dir, item)
    const isDir = fs.statSync(itemPath).isDirectory()
    if (isDir && deep) {
      traverse(itemPath, cb)
    } else if (!isDir) {
      cb(itemPath)
    }
  })
}

module.exports = {collectFiles, traverse}
