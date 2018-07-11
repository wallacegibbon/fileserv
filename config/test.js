const path = require('path')

module.exports = {
  username: 'admin',
  password: '666',
  urlPrefix: '/fileserv',
  port: 8000,
  uploadDir: path.join(__dirname, '/../static/files'),
}