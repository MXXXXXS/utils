const path = require(`path`)
const fs = require(`fs`)
const readline = require(`readline`)

function config() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const configuration = {
    folder: ``,
    reg: ``,
    str: ``
  }
  let n = 0
  console.log(`The 'folder' in which files' content to be replaced?`)
  rl.on(`line`, line => {
    switch (n) {
      case 0:
        configuration.folder = line
        console.log(`The 'RegExp' used to match content?`)
        n++
        break
      case 1:
        configuration.reg = new RegExp(line)
        console.log(`The 'string' used to replace content?`)
        n++
        break
      case 2:
        configuration.str = line
        console.log(
          `Configuration:
          \tFolder: ${configuration.folder}
          \tRegExp: ${configuration.reg}
          \tString: ${configuration.str}`)
        console.log(`Ready?(y/n)`)
        n++
        break
      case 3:
        const answer = line
        if (answer === `y`) {
          n = 4
          console.log(`Start replacing`)
          replace(configuration)
          console.log(`Replacing finished`)
          process.exit()
        } else if (answer === `n`) {
          n = 0
          console.log(`The 'folder' in which files' content to be replaced?`)
        } else {
          console.log(`Please enter 'y' or 'n'`)
        }
        break
    }
  })
}

function replace(cfg) {
  fs.readdirSync(cfg.folder).forEach(file => {
    const filePath = path.join(cfg.folder, file)
    if (fs.statSync(filePath).isFile()) {
      let data = fs.readFileSync(filePath, {
        encoding: `utf8`
      })
      data = data.replace(cfg.reg, cfg.str)
      fs.writeFileSync(filePath, data)
    }
  })
}

config()
