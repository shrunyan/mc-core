'use strict'

/**
 * Looks up a nested object key with dot notation syntax like configs.setting.value
 *
 * @param {object} obj
 * @param {string} dotKey
 * @param {*} [defaultValue]
 * @returns {*}
 */
module.exports = function objectGetByDotNotation(obj, dotKey, defaultValue) {

  // If there is no default value, use null
  defaultValue = (typeof defaultValue !== 'undefined') ? defaultValue : null

  // If the dot-notation key string provided is empty, return the object
  if (!dotKey) {
    return obj
  }

  // Split up the key parts
  let keyParts = dotKey.split('.')

  // Clone the original object so we don't overwrite it
  let clonedObject = Object.assign({}, obj)

  // Narrow the cloned object to the value we are looking for
  for (let x = 0; x < keyParts.length; x++) {

    if (clonedObject !== null && clonedObject.hasOwnProperty(keyParts[x])) {

      clonedObject = clonedObject[keyParts[x]]

    } else {

      return defaultValue

    }

  }

  return clonedObject

}
