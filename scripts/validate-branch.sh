#!/bin/bash

branch_name=$(git symbolic-ref --short HEAD)

# 1. Lowercase check
if [[ "$branch_name" =~ [A-Z] ]]; then
  echo "❌ Branch name must be lowercase only. Current: $branch_name"
  exit 1
fi

# 2. No abusive terms
abusive_terms=("shit" "abuse" "idiot" "dumb")
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


# 4. Find console.log and debugger statements
files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$')

if grep -l "console.log\|debugger;" $files; then
  echo "❌ Console logs or debugger statements found in the above files."
  echo "   Please remove them before committing."
  exit 1
fi

# 5. Check for potential API keys, passwords, etc.
files=$(git diff --cached --name-only)

if grep -l "API_KEY\|api_key\|apikey\|password\|secret\|token" $files; then
  echo "❌ Potential secrets found in the above files. Please review before committing."
  exit 1
fi

#!/bin/bash
branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
protected_branches=("main","main-v2.0.0", "develop" "production")

if [[ " ${protected_branches[@]} " =~ " ${branch} " ]]; then
  echo "❌ Direct commits to $branch branch are not allowed. Please create a feature branch and submit a PR."
  exit 1
fi

echo "✅ Branch name validation passed."
