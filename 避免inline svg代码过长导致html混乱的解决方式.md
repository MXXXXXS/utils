问题背景:
想要使用inline svg以能够通过css调整其样式, 但inline svg代码过多又导致html代码混乱, 难以维护

解决方式:
- 使用div元素占位, 指定class="icon name", 第一个属性"icon"用于匹配, 第二个"name"设为svg文件的名字(去后缀)
- 将svg代码都收集到一个文件icons.js, 并通过export default {"name0": "<svg ...", "name1": "<svg ..."}导出
- 添加icon.js, 通过class="icon"匹配到所有svg占位, class="icon name"的第二个name作为key从icons.js导出的对象获得svg代码, 插入占位

一种具体实现:
- 收集svg代码

        const fs = require(`fs`)
        const path = require(`path`)    
    
        const icons = path.join(__dirname, `icons`) //存放svg的文件夹路径
        const iconsJson = path.join(__dirname, `icons.js`)  //写入icons.js
        const buf = {}
        fs.readdirSync(icons).forEach(file => {
          const filePath = path.join(icons, file)
          if (fs.statSync(filePath).isFile() && /.svg$/.test(file)) {
            const data = fs.readFileSync(filePath, {
              encoding: `utf8`
            })
            buf[file.slice(0, -4)] = data
          }
        })
        fs.writeFileSync(iconsJson, `export default ${JSON.stringify(buf)}`)
- icon.js

        import icons from './icons.js'
        console.log(icons.add)
        document.querySelectorAll(`.icon`).forEach(el => {
          el.innerHTML += icons[el.classList[1]]
        })
- html文件引入

        <script type="module" src="icon.js"></script>
