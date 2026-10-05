import test from "node:test";
import assert from "node:assert";
import { summarize } from "./github.js";

test("summarize counts commits, issues, PRs and top contributors", () => {
  const out = summarize({
    repo: { full_name: "a/b", stargazers_count: 3, open_issues_count: 2 },
    commits: [{ author: { login: "x" }, commit: { author: { name: "X" } } }, { author: null, commit: { author: { name: "Y" } } }],
    issues: [{}, { pull_request: {} }],
    releases: [],
  }, 7);
  assert.match(out, /commits:  2/);
  assert.match(out, /issues:   1/);
  assert.match(out, /PRs:      1/);
  assert.match(out, /x \(1\), Y \(1\)/);
});
