const Koa = require('koa')
const static = require('koa-static')
const koaBody = require('koa-body')
const config = require('./config')
const router = require('./router')
const utils = require('./utils')
const getLogger = require('./logger')

const logger = getLogger('fileserv')

const app = new Koa()

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

app.use(koaBody({ multipart: true }))
app.use(router)
app.use(static('static'))


async function start() {
  await utils.ensureDir(config.uploadDir)

  console.log(`Will listen port ${config.port}`)
  app.listen(config.port, e => e && console.error('**Err:', e))  
}

start().catch(console.error)