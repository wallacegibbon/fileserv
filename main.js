const Koa = require('koa')
const config = require('./config')
const router = require("koa-router")({ prefix: config.urlPrefix })

router.all('/', async (ctx, next) => {
  ctx.body = `<h1>this is the file server</h1>`
  await next()
})

router.all('/upload', async (ctx, next) => {
  await next()
})

const app = new Koa()

app.use(router.routes())

console.log(`Will listen port ${config.port}`)
app.listen(config.port, e => e && console.error('**Err:', e))
