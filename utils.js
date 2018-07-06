const fs = require('fs')

function getRequestIp(req) {
  if (req.headers.hasOwnProperty('x-forwarded-for')) {
    return req.headers['x-forwarded-for'].split(',')[0].trim()
  } else {
    return req.connection.remoteAddress
  }
}

function readdir(dirname) {
  return new Promise((res, rej) =>
    fs.readdir(dirname, (e, files) => e ? rej(e) : res(files)))
}

function exists(dirname) {
  return new Promise((res, rej) => fs.exists(dirname, res))
}

function mkdir(dirname) {
  return new Promise((res, rej) => fs.mkdir(dirname, e => e ? rej(e) : res(true)))
}

function unlink(filename) {
  return new Promise((res, rej) => fs.unlink(filename, e => e ? rej(e) : res(true)))
}

async function ensureDir(dirname) {
  const e = await exists(dirname)
  if (!e) {
    await mkdir(dirname)
  }
}

module.exports = {
  getRequestIp,
  readdir,
  exists,
  unlink,
  ensureDir,
}