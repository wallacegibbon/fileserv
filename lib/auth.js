const utils = require('./utils')
const config = require('../config')

function authFail(res) {
  res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="enter the password"' })
}

/**
 * The rawStr is something like 'Basic ZmFzZGZhczphc2RmYXNmZA=='
 */
function getAuthStr(rawStr) {
  const content = (rawStr || '').split(' ')[1] || ''
  return utils.decodeBase64(content).split(':')
}

async function auth(ctx, next) {
  if (!ctx.headers.authorization) {
    return authFail(ctx.res)
  }
  const [ name, pass ] = getAuthStr(ctx.headers.authorization)
  ctx.logger.info(`trying to login with ${name}:${pass}`)

  if (name != config.username || pass != config.password) {
    ctx.logger.warn(`${name}:${pass} login failed`)
    return authFail(ctx.res)
  }
  await next()
}

module.exports = auth
