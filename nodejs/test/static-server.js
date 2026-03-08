const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const mime = require('mime-types')

const port = 8080
const baseDir = '/home/yhc/projects/miao'

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)

    // ⭐ 防路径穿越
    const safePath = path.resolve(baseDir, '.' + decodeURIComponent(url.pathname))

    if (!safePath.startsWith(baseDir)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    let stat
    try {
      stat = await fs.promises.stat(safePath)
    } catch {
      res.writeHead(404)
      res.end('Not Found')
      return
    }

    // =========================
    // ⭐ 如果是文件
    // =========================
    if (stat.isFile()) {
      res.writeHead(200, {
        'Content-Type': mime.lookup(safePath) || 'application/octet-stream',
        'Content-Length': stat.size
      })

      fs.createReadStream(safePath).pipe(res)
      return
    }

    // =========================
    // ⭐ 如果是目录
    // =========================
    if (stat.isDirectory()) {

      // 自动补 /
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, {
          Location: url.pathname + '/'
        })
        res.end()
        return
      }

      // ⭐⭐⭐ 关键逻辑：检查 index.html
      const indexPath = path.join(safePath, 'index.html')

      try {
        const indexStat = await fs.promises.stat(indexPath)

        if (indexStat.isFile()) {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': indexStat.size
          })

          fs.createReadStream(indexPath).pipe(res)
          return
        }
      } catch {
        // 没有 index.html → 继续列目录
      }

      // ⭐ 列目录
      const entries = await fs.promises.readdir(safePath, {
        withFileTypes: true
      })

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      })

      res.write(`<h1>Index of ${url.pathname}</h1>`)

      // 上级目录
      if (url.pathname !== '/') {
        res.write(`<div><a href="../">../</a></div>`)
      }

      for (const entry of entries) {
        const name = entry.name + (entry.isDirectory() ? '/' : '')
        const href = path.posix.join(url.pathname, name)

        res.write(`<div><a href="${href}">${name}</a></div>`)
      }

      res.end()
      return
    }

    res.writeHead(403)
    res.end('Forbidden')

  } catch (err) {
    console.error(err.stack)
    res.writeHead(500)
    res.end(err.stack)
  }
})

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
