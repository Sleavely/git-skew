
const execute = require('./execute')
const dates = require('./dates')

exports.resolveCommits = async (path, commitOrRange) => {
  const stdout = await execute(`cd "${path}" && git log --format=%H ${commitOrRange}`)
  const commits = stdout.split('\n').filter(Boolean)

  // Check if the first commit is an exact or full version of the query
  if (commits[0].startsWith(commitOrRange)) return [commits[0]]

  return commits
}

exports.getCommitDate = async (path, commitHash) => {
  const stdout = await execute(`cd "${path}" && git log -1 --format=%aI ${commitHash}`)
  return stdout.split('\n').filter(Boolean)[0]
}

exports.changeDate = async (path, commitHash, date) => {
  const isoDate = dates.format(date)

  return await execute(`cd "${path}" && git filter-branch -f --env-filter \
    'if [ "$GIT_COMMIT" = "${commitHash}" ]
     then
         export GIT_AUTHOR_DATE="${isoDate}"
         export GIT_COMMITTER_DATE="${isoDate}"
     fi'`)
}
