const express = require('express')

const app = express()

const port = 3000

app.use((req, res, next) => {
  console.log(req.method, req.url)
  next()
})

app.use('/public', express.static('./public'))

app.get('/hello', (req, res) => {
  res.writeHead(200, {
    'content-type': 'text/html'
  })
  res.end(`
    <h1>hello</h1>
    <script src="jquery.js"></script>`)
})

app.use((req, res, next) => {
  res.end('end')
})

app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method)
  next()
})

app.get('/user/:id', (req, res, next) => {
  res.send('USER')
})

app.listen(port, () => {
  console.log("listening on port", port)
})