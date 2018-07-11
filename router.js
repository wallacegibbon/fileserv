const config = require('./config')
const router = require('koa-router')({ prefix: config.urlPrefix })
const ejs = require('ejs')
const utils = require('./utils')
const fs = require('fs')
const path = require('path')

function redirect(ctx, targetUrl) {
  ctx.redirect(config.urlPrefix + targetUrl)
}

router.get('/', async (ctx) => redirect(ctx, '/index'))

router.get('/index', async (ctx, next) => {
  const params = { files: await utils.readdir(config.uploadDir) }
  ctx.body = await ejs.renderFile(__dirname + '/template/index.ejs', params, { async: true })
  await next()
})

router.post('/upload', async (ctx, next) => {
  const file = ctx.request.files.file
  if (!(file.size > 0)) {
    return redirect(ctx, '/index')
  }
  ctx.logger.info(`receiving new file ${file.name}`)
  const input = fs.createReadStream(file.path)
  const output = fs.createWriteStream(path.join(config.uploadDir, file.name))
  input.pipe(output)
  await next()
  redirect(ctx, '/index')
})

router.all('/remove', async (ctx, next) => {
  const name = ctx.query.name
  if (!name) {
    return redirect(ctx, '/index')
  }
  ctx.logger.info(`removing file ${name}`)
  await utils.unlink(path.join(config.uploadDir, name))
  await next()
  redirect(ctx, '/index')
})

function contentTypeOf(pathname) {
  if (pathname.endsWith('.js')) {
    return 'text/javascript; charset=utf-8'
  } else if (pathname.endsWith('.css')) {
    return 'text/css; charset=utf-8'
  } else {
    return 'application/download'
  }
}

function staticHandler(localPath) {
  return async (ctx, next) => {
    await next()
    const fpath = path.join(localPath, ctx.params.dname || '', ctx.params.fname)
    ctx.set('Content-Type', contentTypeOf(fpath))
    try {
      ctx.body = fs.createReadStream(fpath)
    } catch (e) {
      ctx.status = 404
    }
  }
}

router.all('/web/:dname/:fname', staticHandler('./web'))
router.all('/files/:fname', staticHandler('./files'))

module.exports = router.routes()
