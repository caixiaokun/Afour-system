const express = require('express')
const app = express()
const path = require('path')
const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://211.233.81.229:8099/'
})

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
app.use(express.static(path.resolve(__dirname, './ROOT')))

app.get('/api/*', (req, res) => {
  instance.get(req.path, {
    params: req.query,
    headers: {
      usertoken: req.headers.usertoken
    }
  }).then(response => {
    res.json(response.data)
  })
})

app.post('/api/*', (req, res) => {
  instance.post(req.path, {}, {
    params: req.query,
    headers: {
      usertoken: req.headers.usertoken
    }
  }).then(response => {
    res.json(response.data)
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './ROOT/index.html'))
})

app.listen(8089, () => {
  console.log('\x1B[32m%s\x1B[39m', 'app listening on port 8089!')
})
