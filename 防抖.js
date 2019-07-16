class Debounce {
  constructor() {
    this.time = new Date().getTime();
  }
  debounce(fn, ms) {
    window.clearTimeout(this.tId);
    this.tId = window.setTimeout(() => {
      fn();
      window.clearTimeout();
    }, ms);
  }
}

const debounce = new Debounce();

debounce.debounce(() => {
    
      }, 100)
