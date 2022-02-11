# git-skew

A tool for manipulating Git history by changing one or more commits' `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE` either relative to itself or to a fixed point in time.

🕔⇆🕤

## Installation

```sh
npm install -g git-skew
```

## Usage

```
git-skew <commitOrRange> [--absolute <isoDate> | --relative[-reverse] <duration>] [--verbose] [--dry-run]

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
```

The `commitOrRange` argument follows the [semantics of Git Revision Selection](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection), but must be quoted if it contains any spaces.


> ❗ We strongly advice that you always try your git-skew commands with the `--dry-run` flag to avoid accidentally changing the history of your entire repository.

### Single commit by hash

If you know the SHA1 of the commit - or at least the short version - and want to change its datetime to a known point in time.

```
git-skew 70bd49b --absolute 2025-01-01T12:00:00Z
```

### The latest commit

This will update a range of commits to have been committed 1 hour later. It targets everything _after_ `HEAD~1` up to, and _including_, `HEAD`.

```
git-skew HEAD~1..HEAD --relative 1h
```

### Commits made after a certain time

Targets the main branch, starting with commits made after 6pm.

```
git-skew 'main@{"Today 6pm"}..HEAD' --relative 1h
```
