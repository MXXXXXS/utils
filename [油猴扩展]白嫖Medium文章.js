// ==UserScript==
// @name         清除Medium的本地记录以白嫖文章
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Read free on Medium!
// @author       MXXXXXS
// @include      /https?://.*medium.com/*/
// @grant        none
// ==/UserScript==

window.onload = function() {
  //清除本地的记录信息, 使Mediun无法跟踪用户
  localStorage.clear()
  document.cookie = ""
  const btns = document.querySelectorAll("button")
  for (const btn in btns) {
    const el = btns[btn]
    //新用户会跳出一个注册/登陆框, 需要关闭, 找到29x29px大小的按钮并点击关闭
    if (el && el.offsetWidth === 29 && el.offsetHeight === 29) {
      console.log(el)
      el.click()
      console.log("LocalStorage and cookie have been cleared on Medium")
    }
  }
  //隐藏Google登录
  const styleEl = document.createElement("style")
  styleEl.innerHTML = `
iframe {
  display: none
}
`
  document.body.appendChild(styleEl)
}
