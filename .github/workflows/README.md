# GitHub Actions Workflows

This directory contains automated workflows for CI/CD, publishing, and security.

## 📋 Workflows Overview

### 1. **CI (Continuous Integration)** - `ci.yml`
**Triggers:** Every push and pull request to `main` or `develop`

**What it does:**
- ✅ Builds the library on multiple OS (Ubuntu, Windows, macOS)
- ✅ Tests on Node.js versions 18, 20, and 22
- ✅ Runs all unit tests (39 tests)
- ✅ Verifies TypeScript types
- ✅ Runs ESLint checks
- ✅ Checks bundle size
- ✅ Uploads build artifacts

**Status:** Runs automatically on every commit

---

### 2. **Publish to npm** - `publish.yml`
**Triggers:**
- When a new GitHub Release is created
- Manual trigger via GitHub Actions UI

**What it does:**
- ✅ Runs all tests
- ✅ Builds the library
- ✅ Runs type checks
- ✅ Verifies all build outputs (index.js, index.mjs, index.d.ts, CLI files)
- ✅ Publishes to npm with provenance
- ✅ Creates release summary

**Requirements:** `NPM_TOKEN` secret must be configured

---

### 3. **Create Release** - `release.yml`
**Triggers:** When you push a version tag (e.g., `v1.0.1`)

**What it does:**
- ✅ Runs tests
- ✅ Builds the library
- ✅ Creates GitHub Release
- ✅ Generates changelog from git commits
- ✅ Attaches npm tarball to release

**Usage:**
```bash
npm version patch  # Updates package.json and creates git tag
git push origin v1.0.1
```

---

### 4. **CodeQL Security Analysis** - `codeql.yml`
**Triggers:**
- Every push to `main`
- Every pull request
- Weekly on Sundays

**What it does:**
- ✅ Scans code for security vulnerabilities
- ✅ Detects common coding errors
- ✅ Reports in GitHub Security tab

---

## 🔐 Required Secrets

### NPM_TOKEN (for publishing)

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token" → "Automation"
3. Copy the token
4. Go to your GitHub repo → Settings → Secrets and variables → Actions
5. Click "New repository secret"
6. Name: `NPM_TOKEN`
7. Value: (paste your token)
8. Click "Add secret"

---

## 🚀 How to Use

### Publishing a New Version

**Option 1: Automatic (via npm version command)**
```bash
# Update version and create git tag
npm version patch  # 1.0.0 → 1.0.1
# or
npm version minor  # 1.0.0 → 1.1.0
# or
npm version major  # 1.0.0 → 2.0.0

# Push the tag
git push --follow-tags

# This triggers the release workflow automatically
```

**Option 2: Via GitHub Release**
1. Go to your repo → Releases → "Draft a new release"
2. Create a new tag (e.g., `v1.0.1`)
3. Fill in release notes
4. Click "Publish release"
5. Workflows automatically run and publish to npm

**Option 3: Manual Trigger**
1. Go to Actions → "Publish to npm"
2. Click "Run workflow"
3. Enter version number
4. Click "Run workflow"

---

### Viewing Workflow Results

- **CI Status:** Check the badge on your README
- **Published Packages:** https://www.npmjs.com/package/smart-env
- **Security Alerts:** Repo → Security tab → Code scanning alerts
- **Workflow Runs:** Repo → Actions tab

---

## 📊 Adding Status Badges

Add these to your README.md:

```markdown
[![CI](https://github.com/MainaJoseph/smart-env/workflows/CI/badge.svg)](https://github.com/MainaJoseph/smart-env/actions)
[![npm version](https://img.shields.io/npm/v/smart-env.svg)](https://www.npmjs.com/package/smart-env)
[![npm downloads](https://img.shields.io/npm/dm/smart-env.svg)](https://www.npmjs.com/package/smart-env)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
```

---

## 🛠️ Customization

### Changing Node.js Versions

Edit `ci.yml`:
```yaml
node-version: [18.x, 20.x, 22.x]  # Add or remove versions
```

### Changing Trigger Branches

Edit any workflow:
```yaml
on:
  push:
    branches: [main, develop, your-branch]  # Add branches
```

### Disabling a Workflow

Rename the file to add `.disabled`:
```bash
mv codeql.yml codeql.yml.disabled
```

---

## 📝 Workflow Best Practices

1. ✅ Always test locally before pushing
   ```bash
   npm test
   npm run build
   npm run type-check
   npm run lint
   ```

2. ✅ Use semantic versioning (v1.0.0, v1.0.1, etc.)

3. ✅ Write meaningful commit messages (used in changelogs)
   ```bash
   git commit -m "feat: add new validation type"
   git commit -m "fix: resolve Windows path issue"
   git commit -m "docs: update Next.js examples"
   ```

4. ✅ Keep secrets secure (never commit NPM_TOKEN)

5. ✅ Monitor workflow runs for failures

---

## 🐛 Troubleshooting

### Workflow fails on "npm ci"
- Delete `node_modules` and `package-lock.json`
- Run `npm install` locally
- Commit the updated `package-lock.json`

### Workflow fails on "npm test"
- Run `npm test` locally first
- Fix any failing tests before pushing

### Workflow fails on "npm publish"
- Check if `NPM_TOKEN` secret is set correctly
- Verify you're logged in to npm
- Check if package version already exists
- Ensure package name is available on npm

### TypeScript errors in CI
- Run `npm run type-check` locally first
- Fix any type errors before pushing

### Release workflow doesn't trigger
- Ensure tag format is `v*.*.*` (e.g., `v1.0.0`)
- Check if you pushed the tag: `git push --tags`

### Build artifacts missing
- Verify `npm run build` completes successfully
- Check `dist/` directory exists with all files

---

## 📚 CI Scripts Reference

The following scripts are used by CI workflows (defined in `package.json`):

- `npm test` - Run all Vitest tests
- `npm run build` - Build with Rollup
- `npm run type-check` - TypeScript type checking
- `npm run lint` - ESLint checks
- `npm run ci:check-build` - Verify build outputs exist
- `npm run ci:check-size` - Check bundle size limits

---

## 🎯 Next Steps

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/MainaJoseph/smart-env.git
   git push -u origin main
   ```

2. **Set up NPM_TOKEN secret** (see above)

3. **Create your first release:**
   ```bash
   npm version 1.0.0
   git push --follow-tags
   ```

4. **Monitor workflows** in the Actions tab

---

## 📚 Learn More

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
