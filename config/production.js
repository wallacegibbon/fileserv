const path = require('path')

module.exports = {
  username: 'admin',
  password: '666',
  urlPrefix: '/fileserv',
  port: 8888,
  uploadDir: path.join(__dirname, '/../static/files'),
}