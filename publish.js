const SftpUpload = require('sftp-upload')
const colors = require('colors/safe')
const fs = require('fs')

const config = {
  host: '103.13.222.132',
  port: 22,
  username: 'root',
  password: '58a48ocgxg'
}

function upload(path, remoteDir) {
  const sftp = new SftpUpload({
    ...config,
    path,
    remoteDir
  })

  sftp
    .on('error', function(err) {
      throw err
    })
    .on('uploading', function(progress) {
      console.log('Uploading', colors.yellow(progress.file))
      console.log(colors.blue(progress.percent + '% completed'))
    })
    .on('completed', function() {
      console.log(colors.green('Upload Completed'))
    })
    .upload()
}

// upload('./serve.js', '/usr/local/tomcat/tomcat8/webapps2')
upload('./dist', '/usr/local/tomcat/tomcat8/webapps2')
