const express = require('express')
const app = express()
const path = require('path')
const http = require('http')

app.use(express.static(path.resolve(__dirname, './dist')))

app.all('/api/*', (req, res) => {
  new Promise((resolve, reject) => {
    const options = {
      hostname: '103.13.222.132',
      port: 8099,
      path: req.url,
      method: req.method,
      headers: {
        userToken: req.headers.usertoken,
        'Content-Type': req.headers['content-type']
      }
    }
    if (req.headers['content-length']) {
      options.headers['Content-Length'] = req.headers['content-length']
    }
    const request = http.request(options, (response) => {
      response.setEncoding('utf8')
      let str = ''
      response.on('data', (chunk) => {
        str += chunk
      })
      response.on('end', () => {
        resolve(str)
      })
    })
    request.on('error', (e) => {
      reject(e.message)
    })

    req.on('data', (chunk) => {
      request.write(chunk)
    })
    req.on('end', () => {
      request.end()
    })
  }).then(data => {
    res.send(data)
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

app.listen(8089, () => {
  console.log('\x1B[32mnp%s\x1B[39m', 'app listening on port 8089!')
})
