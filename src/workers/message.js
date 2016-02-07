'use strict'

module.exports = function message(message) {
  message = JSON.parse(message)
  if (!message.id) {
    throw new Error('Message missing ID')
  } else {
    return message
  }
}
