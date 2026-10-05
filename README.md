# repo-pulse

A small CLI that shows what has happened in a GitHub repository recently: commits, updated issues and pull requests, releases, and top contributors. It uses the GitHub REST API and has no dependencies.

Works with GitHub.

## Usage

```
node src/index.js <owner/repo> [days=30]
```

Example:

```
$ node src/index.js octocat/Hello-World 90
```

Set `GITHUB_TOKEN` to raise the rate limit or to read private repositories:

```
GITHUB_TOKEN=ghp_xxx node src/index.js my-org/my-repo 14
```

## Requirements

Node.js 18 or newer.

## Tests

```
npm test
```

## Support

Questions and bug reports: open an issue on this repository or email the support address listed in the project metadata.

## License

MIT
