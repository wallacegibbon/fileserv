const Koa = require('koa')
const static = require('koa-static')
const koaBody = require('koa-body')
const config = require('./config')
const router = require('./router')
const utils = require('./utils')
const getLogger = require('./logger')

const logger = getLogger('fileserv')

const app = new Koa()

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

app.use(async (ctx, next) => {
  const clientIp = utils.getRequestIp(ctx.req)
  logger.info(`serving client [${clientIp}]...`)

  // middlewares not in this file share the same logger.
  ctx.logger = logger
  ctx.clientIp = clientIp

  const start = new Date()
  await next()
  ctx.set('X-Response-Time', `${new Date() - start}ms`)
})

app.use(async (ctx, next) => {
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
})

app.use(koaBody({ multipart: true }))
app.use(router)
app.use(static('static'))


async function start() {
  await utils.ensureDir(config.uploadDir)

  console.log(`Will listen port ${config.port}`)
  app.listen(config.port, e => e && console.error('**Err:', e))  
}

start().catch(console.error)