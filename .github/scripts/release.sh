#!/usr/bin/env bash
# Shared release logic for auto-release-pr.yml and release.yml.
#
#   release.sh version <head> [fallback-bump]   key=value lines for $GITHUB_OUTPUT
#   release.sh notes <from-tag> <head>          grouped markdown of the changes
#   release.sh changelog <changelog> <entry>    prepend an entry below the single heading
#
# Changes are read from the first-parent history of <head>: every PR lands on
# develop as one merge commit titled after the PR, so the branch commits behind
# it are left out instead of being listed a second time.
set -euo pipefail

TYPES='feat|fix|improvement|perf|refactor|build|chore|ci|docs|style|test|revert'
CONVENTIONAL="^(${TYPES})(\([^)]+\))?!?: "

latest_tag() {
  local tag
  tag=$(git tag --list 'v[0-9]*' --sort=-v:refname | head -n 1)
  echo "${tag:-v0.0.0}"
}

range() {
  local from=$1 head=$2
  if [ "$from" = "v0.0.0" ]; then echo "$head"; else echo "$from..$head"; fi
}

subjects() {
  git log --first-parent --format='%s' "$(range "$1" "$2")"
}

has_breaking() {
  local from=$1 head=$2
  subjects "$from" "$head" | grep -Eq "^(${TYPES})(\([^)]+\))?!: " && return 0
  git log --first-parent --format='%B' "$(range "$from" "$head")" | grep -Eq '^BREAKING[ -]CHANGE: '
}

cmd_version() {
  local head=${1:?head ref required} fallback=${2:-none}
  local from bump all
  from=$(latest_tag)
  all=$(subjects "$from" "$head")

  if has_breaking "$from" "$head"; then
    bump='major'
  elif grep -Eq '^feat(\([^)]+\))?: ' <<<"$all"; then
    bump='minor'
  elif grep -Eq '^(fix|improvement)(\([^)]+\))?: ' <<<"$all"; then
    bump='patch'
  else
    bump=$fallback
  fi

  local major minor patch next=''
  IFS=. read -r major minor patch <<<"${from#v}"
  case "$bump" in
    major) next="$((major + 1)).0.0" ;;
    minor) next="${major}.$((minor + 1)).0" ;;
    patch) next="${major}.${minor}.$((patch + 1))" ;;
    none) ;;
    *) echo "unknown bump: $bump" >&2; exit 1 ;;
  esac

  echo "latest_tag=$from"
  echo "bump=$bump"
  echo "next_version=$next"
  echo "commit_count=$(grep -c . <<<"$all" || true)"
}

section() {
  local title=$1 pattern=$2 lines=$3 matched
  matched=$(grep -E "^- (${pattern})(\([^)]+\))?!?: " <<<"$lines" || true)
  [ -z "$matched" ] && return 0
  printf '### %s\n\n%s\n\n' "$title" "$matched"
}

cmd_notes() {
  local from=${1:?from tag required} head=${2:?head ref required} lines
  lines=$(git log --first-parent --format='- %s (%h)' "$(range "$from" "$head")" |
    grep -E "^- ${CONVENTIONAL#^}" || true)

  section 'Features' 'feat' "$lines"
  section 'Bug Fixes & Improvements' 'fix|improvement' "$lines"
  section 'Performance & Refactoring' 'perf|refactor' "$lines"
  section 'Other Changes' 'build|chore|ci|docs|style|test|revert' "$lines"
}

cmd_changelog() {
  local changelog=${1:?changelog path required} entry=${2:?entry file required}
  local tmp
  tmp=$(mktemp "$changelog.XXXXXX")
  {
    printf '# Changelog\n\n'
    cat "$entry"
    if [ -f "$changelog" ]; then
      # Drop the existing heading (and the blank line after it) so only one remains.
      awk 'NR == 1 && $0 == "# Changelog" { skip = 1; next }
           skip && $0 == "" { skip = 0; next }
           { skip = 0; print }' "$changelog"
    fi
  } >"$tmp"
  mv "$tmp" "$changelog"
}

case "${1:-}" in
  version) shift; cmd_version "$@" ;;
  notes) shift; cmd_notes "$@" ;;
  changelog) shift; cmd_changelog "$@" ;;
  *) echo "usage: $0 {version|notes|changelog} ..." >&2; exit 2 ;;
esac
