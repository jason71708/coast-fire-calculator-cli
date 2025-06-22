# 🚀 Coast FIRE Calculator CLI 🔥

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![Made with pnpm](https://img.shields.io/badge/package%20manager-pnpm-blueviolet)](https://pnpm.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> 🏝️ **Calculate when you can coast to financial independence!**
> 🎯 Enter your savings, investments, and goals to see when you can stop contributing and still reach FIRE.

---

## ✨ Features

- 📝 Interactive prompts for all key financial inputs
- 📈 Supports annual, quarterly, and monthly compounding
- 🌈 Colorful, user-friendly CLI output
- ⏳ Calculates the age you can stop investing and still reach your FIRE goal by age 70

---

## 📦 Installation

```bash
pnpm install
```

---

## 🛠️ Usage

```bash
pnpm start
```
or, if you want to run directly:
```bash
node index.js
```

---

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

Run tests with coverage:
```bash
pnpm test:coverage
```

---

## 📝 Committing Changes

This project uses [Commitizen](https://github.com/commitizen/cz-cli) for standardized commit messages. To commit your changes:

```bash
pnpm commit
```

This will guide you through creating a conventional commit message with the following format:
```
type(scope): subject

body

footer
```

### Commit Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

---

## 🚀 Release Management

This project includes a comprehensive release system inspired by popular open-source libraries.

### Quick Release Commands:

```bash
# Patch release (1.0.0 → 1.0.1) - Bug fixes
pnpm release:patch

# Minor release (1.0.0 → 1.1.0) - New features
pnpm release:minor

# Major release (1.0.0 → 2.0.0) - Breaking changes
pnpm release:major

# Pre-release versions
pnpm release:prepatch  # 1.0.0 → 1.0.1-0
pnpm release:preminor  # 1.0.0 → 1.1.0-0
pnpm release:premajor  # 1.0.0 → 2.0.0-0

# Interactive release (asks for type)
pnpm release
```

### What the Release Script Does:

1. **📋 Validation** - Checks git status and validates release type
2. **📝 Version Bump** - Updates `package.json` version
3. **📚 Changelog** - Generates/updates `CHANGELOG.md`
4. **🏷️ Git Tag** - Creates version tag (e.g., `v1.0.1`)
5. **📤 Commit** - Commits all changes with proper message
6. **🚀 Publish** - Optionally publishes to npm

### Release Workflow:

```bash
# 1. Make your changes
git add .
pnpm commit

# 2. Run tests
pnpm test

# 3. Release (choose appropriate type)
pnpm release:patch  # or minor/major

# 4. The script will:
#    - Bump version
#    - Update changelog
#    - Create git tag
#    - Ask if you want to publish to npm
```

### Industry Best Practices:

- **Semantic Versioning**: Follows `MAJOR.MINOR.PATCH` format
- **Conventional Commits**: Uses standardized commit messages
- **Keep a Changelog**: Maintains detailed change history
- **Git Tags**: Creates version tags for easy reference
- **Pre-releases**: Supports alpha/beta/rc versions

---

## 💡 Example

```
? What is your current age? 25
? What is your target fire amount? 2000000
? What is your current amount of assets? 10000
? How much can you invest regularly? 500
? How often do you want to invest? (in months) 1
? What is your annual rate? (in %) 7
? How often is your investment compounded? Monthly
```

---

## 📜 License

ISC

---

Enjoy your journey to financial independence! 🚀💰

---
