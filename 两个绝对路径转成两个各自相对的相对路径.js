const path = require(`path`)

module.exports = function (path0, path1) {
  const p0 = split(path.normalize(path0), path.sep)
  const p1 = split(path.normalize(path1), path.sep)
  let firstDiffPosition = 0
  for (let i = 0; i < Math.min(p0.length, p1.length); i++) {
    firstDiffPosition = i
    if (p0[i] !== p1[i]) {
      break
    }
  }
  const backP0 = p0.length - firstDiffPosition - 1
  const backP1 = p1.length - firstDiffPosition - 1

  return [
    `../`.repeat(backP1) + p0.slice(firstDiffPosition, p0.length).join(`/`),
    `../`.repeat(backP0) + p1.slice(firstDiffPosition, p1.length).join(`/`)
  ]
}

//解决中文字符使用string.split失败的问题
function split(string, sep) {
  let result = []
  let bufStr = ``
  for (let i = 0; i < string.length; i++) {
    const word = string[i]
    if (word !== sep) {
      bufStr += word
    } else {
      result.push(bufStr)
      bufStr = ``
    }
    if (i === string.length - 1)
      result.push(bufStr)
  }
  return result
}
