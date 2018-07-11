const log4js = require('log4js')
const path = require('path')

log4js.configure({
  appenders: {
    fileserv: {
      type: 'dateFile',
      filename: path.join(__dirname, '../log/fileserv'),
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    }
  },
  categories: {
    default: {
      appenders: [ 'fileserv' ],
      level: 'trace',
    }
  }
})

module.exports = log4js.getLogger.bind(log4js)
