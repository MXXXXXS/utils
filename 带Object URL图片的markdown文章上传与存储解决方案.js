//浏览器端
//input:file 上传事件处理, 限制类型为图片, 启用多文件选项
function addImgs(event) {
  const imgs = {}
  event.target.files.forEach(file => {
    const imgSrc = URL.createObjectURL(file)
    imgs[imgSrc] = {
      name: file.name,
      blob: file
    }
  })
  return imgs
}

//事先准备包含图片Object URL的markdown,
//图片本体与其Object URL的映射
// const imgs = {
//   imgSrc: { name: 'name', blob: 'file' }//name为图片名称, file继承自blob, 由input触发事件后获得
// }
//输出一个对象
// let output = {
//   info: {title: 'title'},
//   md: '源markdown',
//   imgs: {
//     imgSrc: { name: 'name', blob: 'file' } //imgSrc为括号捕获的Object URL, name为图片名字
//   }
// }
function wrap(markdown, imgs, info) {
  //Object URL的图片链接pip
  const imgReg = /!\[Alt .*\]\((blob:.*[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12})\)/g
  let output = { md: markdown, imgs: {}, info: info }
  let result
  while ((result = imgReg.exec(markdown))) {
    //括号捕获Object URL
    let imgSrc = result[1]
    //核对imgs, 过滤无效链接
    if (imgs.hasOwnProperty(imgSrc)) {
      output.imgs[imgSrc] = {
        name: imgs[imgSrc].name,
        blob: imgs[imgSrc].blob
      }
    }
  }
  return output
}

//上传
function upload(output, path, cb) {
  const formData = new FormData()
  formData.append('info', JSON.stringify(output.info))
  formData.append('md', output.md)
  for (const imgSrc in output.imgs) {
    if (output.imgs.hasOwnProperty(imgSrc)) {
      const name_blob = output.imgs[imgSrc];
      formData.append(imgSrc, name_blob.blob, name_blob.name)
    }
  }
  //xhr版本
  const xhr = new XMLHttpRequest()
  xhr.open('POST', path)
  xhr.send(formData)
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 201) {
      cb(xhr)
    }
  }
  //fetch版本
  fetch(path, {
    body: formData,
    method: 'POST',
  })
  .then(res => {
    cb(res)
  })
  .catch(err => {
    console.error(err)
  })
}

//服务器端
//接收示例
//Files
// {
//   "blob:http://localhost:2335/9500cb18-759a-4d04-ad9e-214459c50d37": {
//     "size": 107670,
//     "path": "",
//     "name": "1.jpg",
//     "type": "image/jpeg",
//     "mtime": "2019-04-27T13:27:56.554Z"
//   },
//   "blob:http://localhost:2335/d1fa9f1f-6dc5-4339-a496-fc34a6602244": {
//     "size": 75835,
//     "path": "",
//     "name": "2.jpg",
//     "type": "image/jpeg",
//     "mtime": "2019-04-27T13:27:56.562Z"
//   },
//   "blob:http://localhost:2335/eef87d1b-9072-44e2-b0e7-d9ca5b6b6850": {
//     "size": 100553,
//     "path": "",
//     "name": "3.jpg",
//     "type": "image/jpeg",
//     "mtime": "2019-04-27T13:27:56.563Z"
//   }
// }
//Fields
//{"info": {title: "test"}, "md":"markdown....."}



module.exports =  function (req, res, mdDir, imgDir, cb) {
  const path = require('path')
  const fs = require('fs')
  const formidable = require(`formidable`)
  const Randexp = require(`randexp`)
  const imgSrcReg = /blob:.*([a-z0-9]{8}(-[a-z0-9]{4}){3}-[a-z0-9]{12})/ //为了验证files是否符合格式

  const prefixReg = /[\w\d]{4}/
  const form = new formidable.IncomingForm()
  form.uploadDir = imgDir
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) throw err
    // console.log(`Fields:` + JSON.stringify(fields) + `Files: ` + JSON.stringify(files))
    let article = fields.md
    let info
    if (fields.info) {
      info = JSON.parse(fields.info)
    } else {
      cb(new Error(`没有info选项`), req, res)
      return
    }
    for (const imgSrc in files) {
      if (files.hasOwnProperty(imgSrc)) {
        if (imgSrcReg.test(imgSrc)) {
          const prefix = new Randexp(prefixReg).gen()
          const img = files[imgSrc]
          //图片改名
          fs.rename(img.path, path.join(imgDir, prefix + `_` + img.name), err => {
            if (err) console.error(`Image renamed failed: ${err}`)
          })
          //文章内的链接地址修改
          const articlePath = path.resolve(mdDir, info.title)
          const imgPath = path.resolve(imgDir, prefix + `_` + img.name)
          article = article.replace(imgSrc, abs2rel(articlePath, imgPath)[1])
        } else {
          cb(new Error(`图片改名与文内链接修改失败, 因为files的key格式不是Object URL`), req, res)
          break
        }
      }
    }
    //文章存储
    fs.writeFile(path.join(mdDir, info.title + `.md`), article, err => {
      if (err) {
        res.status(403).send(`Artcile saved failed: ${err}`)
      } else {
        res.status(201).send(`Article saved`)
      }
    })

    cb(null, req, res, info)
  })
}

//两个绝对路径转成两个各自相对的相对路径
function abs2rel(path0, path1) {
  const p0 = split(path.normalize(path0), path.sep)
  const p1 = split(path.normalize(path1), path.sep)
  let pp = p0.length >= p1.length ? [p0, p1] : [p1, p0]
  let np0 = [], np1 = []
  let i = 0, firstDiff = false
  for (; i < pp[1].length; i++) {
    if (pp[0][i] !== pp[1][i]) {
      if (!firstDiff) {
        np0.push(pp[0][i])
        np1.push(pp[1][i])
        firstDiff = true
      } else {
        np0.unshift('..')
        np0.push(pp[0][i])
        np1.unshift('..')
        np1.push(pp[1][i])
      }
    }
  }
  for (; i < pp[0].length; i++) {
    if (!firstDiff) {
      np0.push(pp[0][i])
      firstDiff = true
    } else {
      np0.unshift('..')
      np0.push(pp[0][i])
    }
  }
  np0 = np0.join(path.sep)
  np1 = np1.join(path.sep)
  return [np0, np1]
}

//解决中文字符使用string.split失败的问题
function split(string, sep) {
  let result = []
  let bufStr = ''
  for (let i = 0; i < string.length; i++) {
    const word = string[i];
    if (word !== sep) {
      bufStr += word
    } else {
      result.push(bufStr)
      bufStr = ''
    }
    if (i === string.length - 1)
    result.push(bufStr)
  }
  return result
}
