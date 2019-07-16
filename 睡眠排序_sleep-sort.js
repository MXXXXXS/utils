const time = 100
const amount = 20
let listToSort = []

for (let i = 0; i < amount; i++) {
  listToSort.push(Math.round(Math.random() * time))
}

listToSort = Array.from(new Set(listToSort))
console.log(`待排的数组: ${listToSort}`)
const listSorted = []

const sorting = listToSort.map(t => new Promise((res, rej) => {
  const timer = setTimeout(() => {
    clearTimeout(timer)
    listSorted.push(t)
    res()
  }, t)
}))

Promise
  .all(sorting)
  .then(() => {
    console.log(`排好的数组: ${listSorted}`)
  })
