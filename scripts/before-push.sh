#!/bin/bash
# Exit on any error
set -e

echo "🔍 Running pre-push checks..."

# Get the current branch name
BRANCH=$(git symbolic-ref --short HEAD)
FORBIDDEN_BRANCHES=("main" "master" "develop" "staging" "production")

# Check if pushing to protected branches
if [[ " ${FORBIDDEN_BRANCHES[@]} " =~ " ${BRANCH} " ]]; then
  echo "❌ Direct pushing to $BRANCH branch is not allowed."
  echo "   Please create a pull request instead."
  exit 1
fi

# Function to run commands with nice formatting
run_check() {
  echo "⏳ $1..."
  if eval "$2"; then
    echo "✅ $1 passed!"
  else
    echo "❌ $1 failed!"
    exit 1
  fi
}

# Check 1: Run all tests
run_check "Running unit tests" "npm test -- --watchAll=false"

# Check 2: Type checking (for TypeScript)
if [ -f "tsconfig.json" ]; then
  run_check "Type checking" "npx tsc --noEmit"
fi

# Check 3: Lint check
run_check "Linting code" "npm run lint"

# Check 4: Build verification
run_check "Verifying build" "npm run build"

# Check 5: Check for large files
echo "⏳ Checking for large files..."
MAX_SIZE_KB=1000
LARGE_FILES=$(find . -type f -not -path "*/node_modules/*" -not -path "*/build/*" -not -path "*/.git/*" -not -path "*/public/assets/*" -not -path "*/dist/*" -exec du -k {} \; | awk "\$1 > $MAX_SIZE_KB" | cut -f2)

if [ -n "$LARGE_FILES" ]; then
  echo "❌ The following files are too large (over ${MAX_SIZE_KB}KB):"
  echo "$LARGE_FILES"
  echo "   Please consider optimizing or using Git LFS."
  exit 1
else
  echo "✅ No oversized files found!"
fi

# Check 6: Check for leftover conflict markers
echo "⏳ Checking for unresolved merge conflicts..."
if grep -r "^<<<<<<< HEAD" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.css" --include="*.scss" --include="*.html" .; then
  echo "❌ Unresolved merge conflicts found!"
  exit 1
else
  echo "✅ No merge conflicts found!"
fi

# Check 7: Check for incomplete TODO items marked as critical
echo "⏳ Checking for critical TODO items..."
if grep -r "TODO.*CRITICAL" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" .; then
  echo "❌ Critical TODO items found. Please resolve them before pushing."
  exit 1
else
  echo "✅ No critical TODO items found!"
fi

# Check 8: Check for console logs
echo "⏳ Checking for console logs..."
if grep -r "console\.log" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" .; then
  echo "⚠️ Warning: Console logs found. Consider removing them in production code."
fi

# Check 9: Check for commented out code (optional, as warning only)
echo "⏳ Checking for commented out code..."
if grep -r "\/\/.*\<\(if\|for\|function\|class\|const\|let\|var\|return\)\>" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" .; then
  echo "⚠️ Warning: You might have commented out code. Please clean up if unnecessary."
fi

# Check 10: Check dependencies for security issues
echo "⏳ Checking for security vulnerabilities..."
if command -v npx &> /dev/null; then
  if npx audit-ci --moderate; then
    echo "✅ Security check passed!"
  else
    echo "⚠️ Security vulnerabilities found. Consider addressing them soon."
  fi
else
  echo "⚠️ npx not available. Skipping security check."
fi

# Check 11: Check bundle size (if next-bundle-analyzer is installed)
if grep -q "next-bundle-analyzer" package.json; then
  echo "⏳ Analyzing bundle size..."
  npm run analyze || echo "⚠️ Bundle analysis failed, but continuing push."
fi

# Check 12: Check for circular dependencies
echo "⏳ Checking for circular dependencies..."
if command -v npx &> /dev/null; then
  if npx madge --circular src; then
    echo "✅ No circular dependencies found!"
  else
    echo "⚠️ Circular dependencies detected. Consider refactoring."
  fi
else
  echo "⚠️ npx not available. Skipping circular dependency check."
fi

echo "🎉 All checks passed! Pushing to remote repository."

# Add any additional action before push completes
# For example, you could send a notification to a team channel
# curl -X POST "https://api.slack.com/..." -d "message=Push by $(git config user.name) to $BRANCH"

exit 0