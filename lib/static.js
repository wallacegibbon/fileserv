const path = require('path')
const fs = require('fs')

async function handler_1(localPath, ctx, next) {
  await next()
  const fpath = path.join(localPath, ctx.params.dname, ctx.params.fname)
  ctx.set('Content-Type', contentTypeOf(fpath))
  try {
    ctx.body = fs.createReadStream(fpath)
  } catch (e) {
    console.error('handler_1:', e)
    ctx.status = 404
  }
}

async function handler_2(localPath, ctx, next) {
  await next()
  const fpath = path.join(localPath, ctx.params.fname)
  ctx.set('Content-Type', 'application/download')
  try {
    ctx.body = fs.createReadStream(fpath)
  } catch (e) {
    console.error('handler_2:', e)
    ctx.status = 404
  }
}

function handler(localPath, type) {
  switch (type) {
  case 1:
    return (ctx, next) => handler_1(localPath, ctx, next)
  case 2:
    return (ctx, next) => handler_2(localPath, ctx, next)
  }
}

function contentTypeOf(pathname) {
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
    return 'image/jpeg'
  } else if (pathname.endsWith('.png')) {
    return 'image/png'
  } else if (pathname.endsWith('.svg')) {
    return 'image/svg+xml'
  } else if (pathname.endsWith('.gif')) {
    return 'image/gif'
  } else if (pathname.endsWith('.js')) {
    return 'text/javascript; charset=utf-8'
  } else if (pathname.endsWith('.css')) {
    return 'text/css; charset=utf-8'
  }
}

module.exports = handler