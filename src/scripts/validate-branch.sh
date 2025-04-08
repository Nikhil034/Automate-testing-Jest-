#!/bin/bash

branch_name=$(git symbolic-ref --short HEAD)

# 1. Lowercase check
if [[ "$branch_name" =~ [A-Z] ]]; then
  echo "❌ Branch name must be lowercase only. Current: $branch_name"
  exit 1
fi

# 2. No abusive terms
abusive_terms=("fuck" "shit" "abuse" "idiot" "dumb")
for term in "${abusive_terms[@]}"; do
  if [[ "$branch_name" == *"$term"* ]]; then
    echo "❌ Branch name contains inappropriate language: $term"
    exit 1
  fi
done

# 3. Check against remote for existing branch (same name in remotes)
if git ls-remote --heads origin "$branch_name" | grep "$branch_name" >/dev/null; then
  echo "❌ A branch with this name already exists remotely."
  exit 1
fi

echo "✅ Branch name validation passed."
