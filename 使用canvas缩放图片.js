module.exports = function (
  srcImg,
  targetW,
  targetH,
  toBlob = false,
  keepRatio = true,
  quality = 0.7,
  mimeType = `image/png`
) {
  const canvas = document.createElement(`canvas`)
  const ctx = canvas.getContext(`2d`)
  const img = new Image()
  img.src = URL.createObjectURL(srcImg)
  let resizedW = targetW
  let resizedH = targetH
  return new Promise((res, rej) => {
    img.onload = function () {
      if (keepRatio) {
        const HW_ratio = img.height / img.width
        resizedW = targetW
        resizedH = targetW * HW_ratio
        if (resizedH > targetH) {
          resizedH = targetH
          resizedW = targetH / HW_ratio
        }
      }
      canvas.width = resizedW
      canvas.height = resizedH
      ctx.drawImage(img, 0, 0, resizedW, resizedH)
      if (!toBlob) {
        res(canvas.toDataURL(mimeType, quality))
      } else {
        canvas.toBlob(
          function (blob) {
            res(URL.createObjectURL(blob))
          },
          mimeType,
          quality
        )
      }
    }
  })
}
