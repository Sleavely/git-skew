const dayjs = require('dayjs')
const parseDuration = require('parse-duration')

exports.forward = (date, duration) => {
  const ms = parseDuration(duration)
  return dayjs(date).add(ms, 'millisecond').toISOString()
}

exports.backward = (date, duration) => {
  const ms = parseDuration(duration)
  return dayjs(date).subtract(ms, 'millisecond').toISOString()
}

exports.format = (date) => dayjs(date).toISOString()
