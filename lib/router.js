const config = require('../config')
const router = require('koa-router')({ prefix: config.urlPrefix })
const ejs = require('ejs')
const utils = require('./utils')
const fs = require('fs')
const path = require('path')
const static = require('./static')

function redirect(ctx, targetUrl) {
  ctx.redirect(config.urlPrefix + targetUrl)
}

router.get('/web/:dname/:fname', static(path.join(__dirname, 'web')))
router.get('/files/:fname', static(path.join(__dirname, '../files')))
router.get('/', async (ctx) => redirect(ctx, '/index'))

router.get('/index', async (ctx, next) => {
  const params = { files: await utils.readdir(config.uploadDir) }
  const indexFile = path.join(__dirname, './template/index.ejs')
  ctx.body = await ejs.renderFile(indexFile, params, { async: true })
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

module.exports = router.routes()