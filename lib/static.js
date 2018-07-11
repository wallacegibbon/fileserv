const path = require('path')
const fs = require('fs')

async function staticHandler(localPath, ctx, next) {
  await next()
  const fpath = path.join(localPath, ctx.params.dname || '', ctx.params.fname)
  ctx.set('Content-Type', contentTypeOf(fpath))
  try {
    ctx.body = fs.createReadStream(fpath)
  } catch (e) {
    console.error('staticHandler:', e)
    ctx.status = 404
  }
}

function handler(localPath) {
  return (ctx, next) => staticHandler(localPath, ctx, next)
}

function contentTypeOf(pathname) {
  if (pathname.endsWith('.js')) {
    return 'text/javascript; charset=utf-8'
  } else if (pathname.endsWith('.css')) {
    return 'text/css; charset=utf-8'
  } else {
    return 'application/download'
  }
}

module.exports = handler