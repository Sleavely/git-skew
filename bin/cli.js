#!/usr/bin/env node

const meow = require('meow')
const self = require('../package.json')
const { resolveCommits, getCommitDate, changeDate } = require('../src/git')
const { format: formatDate, forward, backward } = require('../src/dates')
const parseDuration = require('parse-duration')

const cli = meow(`
Updates GIT_AUTHOR_DATE and GIT_COMMITTER_DATE in matching commits.

Usage
  $ ${Object.keys(self.bin)[0]} <commitOrRange> [--absolute <isoDate> | --relative[-reverse] <duration>] [--verbose] [--dry-run]

Options
  --absolute <isoDate>
      Absolute date to set the matching commits to in ISO8601 format.
  --relative <duration>
      Moves commits forward in time relative to the original commit date.
      Example: --relative 1d2h
  --relative-reverse <duration>
      Like --relative but moves backwards in time.
  --verbose
    Prints helpful information on what is happening.
  --dry-run
    Prints the things that would happen but does not modify the Git repository.
  --help
      Displays this message.

For more information, see:
${self.homepage}
`, {
  description: false,
  flags: {
    absolute: {
      type: 'string',
    },
    relative: {
      type: 'string',
    },
    relativeReverse: {
      type: 'string',
    },
    dryRun: {
      type: 'boolean',
      default: false,
    },
    verbose: {
      type: 'boolean',
      default: false,
    },
  },
})

const commitOrRange = cli.input[0]
const cwd = process.cwd()
const dryRun = cli.flags.dryRun
const verbose = cli.flags.verbose

;(async () => {
  if (!commitOrRange) {
    console.error('\n❌ No commit or range specified')
    cli.showHelp(1)
  }

  // Only one of the time options are allowed at a time.
  if (
    Object.keys(cli.flags).filter((flag) => ['absolute', 'relative', 'relativeReverse'].includes(flag)).length !== 1 ||
    ['absolute', 'relative', 'relativeReverse'].every((flag) => !cli.flags[flag])
  ) {
    console.error('\n❌ One (only) of --absolute, --relative, --relative-reverse must be specified')
    cli.showHelp(1)
  }

  // Attempt to resolve input to one or more commits; this also works as validation
  const matchingCommits = await resolveCommits(cwd, commitOrRange)

  // Validate the target date before iterating commits.
  if (cli.flags.absolute) {
    try {
      formatDate(cli.flags.absolute)
    } catch (_err) {
      console.error('\n❌ Unsupported isoDate provided.\n❌ See https://en.wikipedia.org/wiki/ISO_8601')
      cli.showHelp(1)
    }
  }
  if (cli.flags.relative || cli.flags.relativeReverse) {
    const duration = parseDuration(cli.flags.relative || cli.flags.relativeReverse)
    if (!duration) {
      console.error('\n❌ Unsupported duration provided.\n❌ See https://github.com/jkroso/parse-duration#readme')
      cli.showHelp(1)
    }
  }

  // Iterate commits and update their dates
  for (const hash of matchingCommits) {
    const currentDate = await getCommitDate(cwd, hash)
    if (verbose) console.log(`\n${hash} 📅 Currently: ${currentDate}`)

    const newDate = cli.flags.absolute
      ? formatDate(cli.flags.absolute)
      : cli.flags.relative
        ? forward(currentDate, cli.flags.relative)
        : cli.flags.relative
          ? backward(currentDate, cli.flags.relativeReverse)
          : currentDate

    if (dryRun || verbose) console.log(`${hash} 🔃 Setting to ${newDate}`)
    if (!dryRun) {
      await changeDate(cwd, hash, newDate)
      if (verbose) console.log(`${hash} ✅ Updated`)
    }
  }

  console.log('\nMAGIC HAS HAPPENED 🤩✨')
})().catch(err => {
  console.error(`\n❌ ${err}`)
  console.error(`\nThis may have been an error with ${Object.keys(self.bin)[0]} itself,\nbut here are the instructions just in case:`)
  cli.showHelp(1)
})
