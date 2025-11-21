# Publishing Checklist for smart-env

Follow these steps to publish smart-env to npm and GitHub.

## ✅ Pre-Publishing Checklist

### 1. Verify Everything Works Locally

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Type check
npm run type-check

# Lint code
npm run lint

# Build package
npm run build

# Verify build outputs
npm run ci:check-build

# Check bundle sizes
npm run ci:check-size

# Test CLI locally
node bin/smart-env.js --help
node bin/smart-env.js init
```

All should pass without errors!

### 2. Test the Package Locally

```bash
# Create a tarball
npm pack

# This creates: smart-env-1.0.0.tgz

# Test in another project
cd /path/to/test/project
npm install /path/to/smart-env/smart-env-1.0.0.tgz

# Try importing and using it
```

### 3. Update Version (if needed)

```bash
# For first release
npm version 1.0.0

# For subsequent releases
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

## 📦 Publishing to npm

### Setup (First Time Only)

1. **Create npm account** at https://www.npmjs.com/signup

2. **Login via CLI:**
   ```bash
   npm login
   ```

3. **Verify login:**
   ```bash
   npm whoami
   ```

### Publish

```bash
# Dry run (see what will be published)
npm publish --dry-run

# Actually publish
npm publish --access public

# If using 2FA, you'll be prompted for a code
```

### Verify Published Package

```bash
# View on npm
open https://www.npmjs.com/package/smart-env

# Install and test
npm install smart-env
```

## 🐙 Publishing to GitHub

### First Time Setup

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: smart-env v1.0.0

- Complete environment variable validation
- Support for 6 types (string, number, boolean, url, json, enum)
- CLI tools (init, validate, scan)
- Full TypeScript support
- Framework integrations (Express, Next.js, NestJS, Fastify, etc.)
- Comprehensive documentation and examples"

# Set main branch
git branch -M main

# Add remote
git remote add origin https://github.com/MainaJoseph/smart-env.git

# Push to GitHub
git push -u origin main
```

### Create GitHub Release

**Option 1: Via Git Tag (Automatic)**

```bash
# Create and push tag
git tag v1.0.0
git push origin v1.0.0

# This triggers the release workflow automatically
```

**Option 2: Via GitHub UI (Manual)**

1. Go to https://github.com/MainaJoseph/smart-env/releases
2. Click "Draft a new release"
3. Create tag: `v1.0.0`
4. Title: `Release 1.0.0`
5. Description:
   ```markdown
   ## 🎉 Initial Release

   smart-env is a professional environment variable validation library with strict type checking for Node.js and TypeScript.

   ### ✨ Features

   - Type-safe environment validation
   - 6 validation types: string, number, boolean, url, json, enum
   - CLI tools: init, validate, scan
   - Framework integrations: Express, Next.js, NestJS, Fastify, Remix, Vite
   - Full TypeScript support with type inference
   - Clear error messages

   ### 📦 Installation

   ```bash
   npm install smart-env
   ```

   ### 📚 Documentation

   Full documentation available at https://github.com/MainaJoseph/smart-env
   ```
6. Click "Publish release"

### Setup GitHub Actions

1. **Add NPM_TOKEN secret:**
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Generate "Automation" token
   - Go to https://github.com/MainaJoseph/smart-env/settings/secrets/actions
   - Add new secret: `NPM_TOKEN` = your token

2. **Verify workflows:**
   - Go to https://github.com/MainaJoseph/smart-env/actions
   - Check that CI workflow runs on push
   - Verify all tests pass

## 🎯 Post-Publishing

### 1. Verify Installation

```bash
# In a new project
npm install smart-env

# Test it
npx smart-env init
npx smart-env validate
```

### 2. Update Documentation

- Add status badges to README (already done ✓)
- Update CHANGELOG.md with release notes
- Add examples to repository

### 3. Share Your Package

- Tweet about it
- Post on Reddit (r/javascript, r/typescript, r/node)
- Share on Dev.to
- Post on LinkedIn
- Add to awesome lists

### 4. Monitor

- Watch for issues: https://github.com/MainaJoseph/smart-env/issues
- Check npm downloads: https://www.npmjs.com/package/smart-env
- Respond to feedback

## 🔄 Updating Published Package

For subsequent releases:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"

# Update version
npm version patch

# Push changes and tags
git push --follow-tags

# This triggers:
# 1. CI workflow (tests)
# 2. Release workflow (GitHub release)
# 3. Publish workflow (npm publish)
```

## 🆘 Troubleshooting

### "You do not have permission to publish"
- Package name might be taken
- Try a different name in package.json
- Or use scoped package: `@yourusername/smart-env`

### "Version already exists"
- You need to bump the version
- Run `npm version patch` (or minor/major)

### Workflow fails
- Check GitHub Actions logs
- Verify NPM_TOKEN is set correctly
- Ensure all tests pass locally first

### Package not found after publishing
- Wait a few minutes for npm to index
- Check spelling: `npm info smart-env`
- Verify it's public: check package.json has no `"private": true`

## ✅ Final Checklist

Before publishing, verify:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] README is complete and accurate
- [ ] LICENSE file exists
- [ ] package.json has correct info
- [ ] .npmignore excludes unnecessary files
- [ ] Tested package locally with `npm pack`
- [ ] Version number is correct
- [ ] Git repository is clean
- [ ] Ready to share with the world! 🚀

## 📊 Success Metrics

After publishing, track:

- npm downloads: https://npm-stat.com/charts.html?package=smart-env
- GitHub stars: https://github.com/MainaJoseph/smart-env/stargazers
- Issues and PRs: https://github.com/MainaJoseph/smart-env/issues
- npm version badge: Shows current published version

## 🎉 You're Ready!

Your package is production-ready and all set to be published!

Good luck! 🍀
