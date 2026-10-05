const API = "https://api.github.com";

export async function gh(path, token = process.env.GITHUB_TOKEN) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "repo-pulse",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    const hint = res.status === 403 && remaining === "0" ? " (rate limited, set GITHUB_TOKEN)" : "";
    throw new Error(`GitHub API ${res.status} for ${path}${hint}`);
  }
  return res.json();
}

export function summarize({ repo, commits, issues, releases }, days) {
  const prs = issues.filter((i) => i.pull_request);
  const onlyIssues = issues.filter((i) => !i.pull_request);
  const authors = new Map();
  for (const c of commits) {
    const name = c.author?.login ?? c.commit.author.name;
    authors.set(name, (authors.get(name) ?? 0) + 1);
  }
  const top = [...authors].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return [
    `${repo.full_name}  (${repo.stargazers_count} stars, ${repo.open_issues_count} open issues/PRs)`,
    `Last ${days} days:`,
    `  commits:  ${commits.length}`,
    `  issues:   ${onlyIssues.length} updated`,
    `  PRs:      ${prs.length} updated`,
    `  releases: ${releases.length}`,
    top.length ? `Top contributors: ${top.map(([n, c]) => `${n} (${c})`).join(", ")}` : "No commits in range.",
  ].join("\n");
}
