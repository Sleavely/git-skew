# git-skew

A tool for manipulating Git history by changing one or more commits' dates either relative to itself or to a fixed point in time.

🕔⇆🕤

## Usage

```
git-skew <sha1> [--absolute <isoDate> | --relative[-reverse] <duration>] [--verbose] [--dry-run]

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
