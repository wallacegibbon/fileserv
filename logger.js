const log4js = require('log4js')

log4js.configure({
  appenders: {
    fileserv: {
      type: 'dateFile',
      filename: './log/fileserv',
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
