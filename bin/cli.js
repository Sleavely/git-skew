#!/usr/bin/env node

const meow = require('meow')
const self = require('../package.json')

const cli = meow(`
Updates GIT_AUTHOR_DATE and GIT_COMMITTER_DATE in matching commits.

Usage
  $ ${Object.keys(self.bin)[0]} <sha1> [--absolute <isoDate> | --relative[-reverse] <duration>]

Options
  --absolute <isoDate>
      Absolute date to set the matching commits to in ISO8601 format.
  --relative <duration>
      Moves commits forward in time relative to the original commit date.
      Example: --relative 1d2h
  --relative-reverse <duration>
      Like --relative but moves backwards in time
  --help
      Displays this message.

For more information, see:
${self.homepage}
`, {
  description: false,
  flags: {
    absolute: {
      type: 'string',
      isRequired: (flags) => !flags.relative && !flags.relativeReverse,
    },
    relative: {
      type: 'string',
      isRequired: (flags) => !flags.absolute && !flags.relativeReverse,
    },
    relativeReverse: {
      type: 'string',
      isRequired: (flags) => !flags.absolute && !flags.relative,
    },
    dryRun: {
      type: 'boolean',
      default: false,
    },
  },
})

const commitOrRange = cli.input[0]

;(async () => {
  if (!commitOrRange) {
    console.error('\n❌ No commit or range specified')
    cli.showHelp(1)
  }

  // Only one of the time options are allowed at a time.
  if (Object.keys(cli.flags).filter((flag) => ['absolute', 'relative', 'relativeReverse'].includes(flag)).length > 1) {
    console.error('\n❌ Only one of --absolute, --relative, --relative-reverse should be specified')
    cli.showHelp(1)
  }

  console.log('\nMAGIC HAS HAPPENED 🤩✨ 🧙‍♂️')
})().catch(err => {
  console.error(err)
  // console.error(`\nThis may have been an error with ${Object.keys(self.bin)[0]} itself,\nbut here are the instructions just in case:`)
  // cli.showHelp(1)
})
