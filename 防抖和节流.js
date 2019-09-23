    function debounceByTimer(fn, time) {
      let canExeute = true
      let timer = setTimeout(() => {
        canExeute = true
      }, time)
      return function (...args) {
        if (canExeute) {
          canExeute = false
          fn(...args)
        }
        clearTimeout(timer)
        timer = setTimeout(() => {
          canExeute = true
        }, time)
      }
    }

    function debounceByDate(fn, time) {
      let lastTime = Date.now()
      return function (...args) {
        const curTime = Date.now()
        if (curTime - lastTime > time) {
          fn(...args)
        }
        lastTime = curTime
      }
    }

    function throttleByTimer(fn, time) {
      let canExeute = true
      setInterval(() => {
        canExeute = true
      }, time)
      return function (...args) {
        if (canExeute) {
          canExeute = false
          fn(...args)
        }
      }
    }

    function throttleByDate(fn, time) {
      let lastTime = Date.now()
      return function (...args) {
        const curTime = Date.now()
        if (curTime - lastTime > time) {
          fn(...args)
          lastTime = lastTime + time
        }
      }
    }
