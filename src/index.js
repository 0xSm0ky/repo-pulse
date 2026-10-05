#!/usr/bin/env node
import { gh, summarize } from "./github.js";

const [slug, daysArg] = process.argv.slice(2);
if (!slug || !/^[\w.-]+\/[\w.-]+$/.test(slug)) {
  console.error("Usage: repo-pulse <owner/repo> [days=30]");
  process.exit(1);
}
const days = Number(daysArg ?? 30);
const since = new Date(Date.now() - days * 864e5).toISOString();

try {
  const [repo, commits, issues, allReleases] = await Promise.all([
    gh(`/repos/${slug}`),
    gh(`/repos/${slug}/commits?since=${since}&per_page=100`),
    gh(`/repos/${slug}/issues?state=all&since=${since}&per_page=100`),
    gh(`/repos/${slug}/releases?per_page=30`),
  ]);
  const releases = allReleases.filter((r) => r.published_at >= since);
  console.log(summarize({ repo, commits, issues, releases }, days));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
