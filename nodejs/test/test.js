const fs = require('node:fs')

function readFile(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

function promiseify(cbFn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      cbFn(...args, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

let readFile = promiseify(fs.readFile)