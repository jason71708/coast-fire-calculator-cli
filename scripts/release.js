#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

// Configuration
const CONFIG = {
  packageName: 'coast-fire-calculator-cli',
  repository: 'yourusername/coast-fire-calculator-cli', // Update this
  changelogFile: 'CHANGELOG.md',
  releaseTypes: ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor']
};

// Utility functions
const log = (message, type = 'info') => {
  const colors = {
    info: chalk.blue,
    success: chalk.green,
    warning: chalk.yellow,
    error: chalk.red
  };
  console.log(colors[type](`[${type.toUpperCase()}] ${message}`));
};

const exec = (command, options = {}) => {
  try {
    return execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
  } catch (error) {
    if (!options.silent) {
      log(`Command failed: ${command}`, 'error');
      log(error.message, 'error');
    }
    return null;
  }
};

const readPackageJson = () => {
  const packagePath = join(process.cwd(), 'package.json');
  return JSON.parse(readFileSync(packagePath, 'utf8'));
};

const writePackageJson = (packageJson) => {
  const packagePath = join(process.cwd(), 'package.json');
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
};

// Version management
const parseVersion = (version) => {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
};

const bumpVersion = (currentVersion, type) => {
  const { major, minor, patch } = parseVersion(currentVersion);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'premajor':
      return `${major + 1}.0.0-0`;
    case 'preminor':
      return `${major}.${minor + 1}.0-0`;
    case 'prepatch':
      return `${major}.${minor}.${patch + 1}-0`;
    default:
      throw new Error(`Invalid release type: ${type}`);
  }
};

// Git operations
const checkGitStatus = () => {
  const status = exec('git status --porcelain', { silent: true });
  if (status && status.trim()) {
    log('You have uncommitted changes. Please commit them first.', 'warning');
    log('Run: git add . && git commit -m "your message"', 'info');
    return false;
  }
  return true;
};

const getLatestCommits = (since) => {
  const command = since
    ? `git log --oneline ${since}..HEAD`
    : 'git log --oneline -10';
  return exec(command, { silent: true }) || '';
};

const createTag = (version) => {
  const tagName = `v${version}`;

  // Check if tag exists
  const existingTag = exec(`git tag -l "${tagName}"`, { silent: true });
  if (existingTag && existingTag.trim()) {
    log(`Tag ${tagName} already exists`, 'warning');
    return false;
  }

  exec(`git tag ${tagName}`);
  log(`Created tag: ${tagName}`, 'success');
  return true;
};

// Changelog generation
const generateChangelog = (version, commits) => {
  const date = new Date().toISOString().split('T')[0];
  const changelogEntry = `## [${version}] - ${date}

### Added
- New features and enhancements

### Changed
- Changes in existing functionality

### Fixed
- Bug fixes

### Breaking Changes
- Breaking changes (if any)

### Commits
${commits.split('\n').map(commit => `- ${commit}`).join('\n')}

---

`;

  const changelogPath = join(process.cwd(), CONFIG.changelogFile);
  let changelog = '';

  if (existsSync(changelogPath)) {
    changelog = readFileSync(changelogPath, 'utf8');
  } else {
    changelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
  }

  // Insert new entry after the header
  const lines = changelog.split('\n');
  const headerEndIndex = lines.findIndex(line => line.startsWith('## '));
  const insertIndex = headerEndIndex > 0 ? headerEndIndex : 2;

  lines.splice(insertIndex, 0, changelogEntry);
  writeFileSync(changelogPath, lines.join('\n'));

  log(`Updated ${CONFIG.changelogFile}`, 'success');
};

// Release process
const performRelease = async (type) => {
  log(`Starting ${type} release...`, 'info');

  // 1. Check git status
  if (!checkGitStatus()) {
    process.exit(1);
  }

  // 2. Read current package.json
  const packageJson = readPackageJson();
  const currentVersion = packageJson.version;
  log(`Current version: ${currentVersion}`, 'info');

  // 3. Calculate new version
  const newVersion = bumpVersion(currentVersion, type);
  log(`New version: ${newVersion}`, 'info');

  // 4. Update package.json
  packageJson.version = newVersion;
  writePackageJson(packageJson);
  log('Updated package.json', 'success');

  // 5. Get recent commits for changelog
  const commits = getLatestCommits();

  // 6. Generate changelog
  generateChangelog(newVersion, commits);

  // 7. Stage changes
  exec('git add .');
  log('Staged changes', 'success');

  // 8. Commit changes
  exec(`git commit -m "chore(release): ${newVersion}

- Bump version to ${newVersion}
- Update changelog"`);
  log('Committed changes', 'success');

  // 9. Create tag
  if (!createTag(newVersion)) {
    process.exit(1);
  }

  // 10. Ask about publishing
  log('\n🤔 Do you want to publish to npm? (y/n)', 'info');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (key) => {
    if (key === 'y' || key === 'Y') {
      publishToNpm();
    } else if (key === 'n' || key === 'N') {
      log('Release completed! Push manually when ready.', 'success');
      log('Commands to run:', 'info');
      log('  git push', 'info');
      log('  git push --tags', 'info');
      log('  npm publish', 'info');
      process.exit(0);
    }
  });
};

const publishToNpm = () => {
  log('Publishing to npm...', 'info');

  // Push to git first
  exec('git push');
  exec('git push --tags');
  log('Pushed to git', 'success');

  // Publish to npm
  exec('npm publish');
  log('Published to npm!', 'success');

  process.exit(0);
};

// CLI interface
const main = () => {
  const type = process.argv[2];

  if (!type || !CONFIG.releaseTypes.includes(type)) {
    log('Usage: node scripts/release.js <type>', 'error');
    log('Types: ' + CONFIG.releaseTypes.join(', '), 'info');
    process.exit(1);
  }

  performRelease(type).catch((error) => {
    log(error.message, 'error');
    process.exit(1);
  });
};

// Run the script
main();