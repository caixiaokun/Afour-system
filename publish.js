const SftpUpload = require("sftp-upload");
const colors = require("colors/safe");
const fs = require("fs");

const sftp = new SftpUpload({
  host: '211.233.81.229',
  port: 22,
  username: 'root',
  password: 'ogmkLQNX8125',
  path: './dist',
  remoteDir: '/usr/local/tomcat/webapps2/ROOT'
});

sftp
  .on("error", function(err) {
    throw err;
  })
  .on("uploading", function(progress) {
    console.log("Uploading", colors.yellow(progress.file));
    console.log(colors.blue(progress.percent + "% completed"));
  })
  .on("completed", function() {
    console.log(colors.green("Upload Completed"));
  })
  .upload();
