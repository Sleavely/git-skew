const { exec } = require('child_process')

module.exports = exports = (command) => new Promise((resolve, reject) => {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      return reject(stderr)
    }

    return resolve(stdout)
  })
})
