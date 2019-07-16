//promisify 函数, 格式为fn(...args, (err, result) => {})
// function p(_this, fn, args) {
//   return new Promise((res, rej) => {
//     if (args) {
//       fn.call(_this, ...args, (err, result) => {
//         if (err) rej(err)
//         res(result)
//       })
//     } else {
//       fn.call(_this, (err, result) => {
//         if (err) rej(err)
//         res(result)
//       })
//     }
//   })
// }
