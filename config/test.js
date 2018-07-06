const path = require('path')

module.exports = {
  urlPrefix: '/fileserv',
  port: 8000,
  uploadDir: path.join(__dirname, '/../static/files'),
}