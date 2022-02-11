const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

exports.access = promisify(fs.access)

exports.normalizePath = (input) => path.normalize(input)

/**
 * Finds and returns the path to an upwards file by traversing parent directories
 * until either the file exists or the directory is in the root of the filesystem.
 *
 * @param filename Name of file to look for
 * @param directory (Optional) Directory to start looking in.
 * @returns {string|false} Absolute path to the file.
 */
exports.findUpwardsFile = async (filename, directory = process.cwd()) => {
  const parsedPath = path.parse(path.join(directory, filename))
  const targetFile = path.join(parsedPath.dir, parsedPath.base)
  let fileExists = false
  try {
    await this.access(targetFile)
    fileExists = true
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }
  if (fileExists) {
    // yay!
    return targetFile
  } else {
    if (parsedPath.dir === parsedPath.root) {
      // We're at the root of the filesystem. There's nowhere else to look.
      return false
    } else {
      // Keep digging
      return this.findUpwardsFile(filename, path.dirname(directory))
    }
  }
}
