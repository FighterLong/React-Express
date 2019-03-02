module.exports = {
  tips: function (res, code = 200, data = null, msg = '') {
    return res.end(JSON.stringify({code, data, msg}))
  }
}
