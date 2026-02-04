# Repository Settings for lcp-spec

## Repository Description
```
Open protocol specification for autonomous AI context orchestration - enabling discovery, negotiation, verification, and settlement
```

## Topics / Tags
```
ai
ai-agents
protocol
specification
blockchain
context
orchestration
autonomous-agents
mcp
decentralized
verification
settlement
open-source
research
```

## Website URL
```
https://turf-tech.github.io/lcp-spec
```

## Social Preview Image
Use the LCP logo at `assets/logos/lcp-logo.svg` or create a custom social card (1280x640px recommended)

## Features to Enable
- [x] Wikis: Disabled (use docs/ instead)
- [x] Issues: Enabled
- [x] Projects: Enabled
- [x] Discussions: Enabled
- [x] Sponsorships: Enabled (via FUNDING.yml)
- [x] Preserve this repository: Enabled (if available)
- [x] Require contributors to sign off on web-based commits: Enabled

## Branch Protection Rules

### For `main` branch:
- [x] Require a pull request before merging
  - [x] Require approvals: 1
  - [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Status checks: `build-website`, `markdown-lint`
- [x] Require conversation resolution before merging
- [x] Include administrators
- [x] Allow force pushes: Disabled
- [x] Allow deletions: Disabled

### For `develop` branch:
- [x] Require a pull request before merging
  - [x] Require approvals: 1
- [x] Require status checks to pass before merging
- [ ] Include administrators
- [x] Allow force pushes: Disabled
- [x] Allow deletions: Disabled

## GitHub Pages Settings
- **Source**: Deploy from GitHub Actions (or `gh-pages` branch if using Docusaurus deploy)
- **Custom domain**: (optional)
- **Enforce HTTPS**: Enabled

## Repository Visibility
- **Visibility**: Public (ready for open source release)

## About Section
```markdown
Open protocol specification for autonomous AI context orchestration

🔗 Links:
- Documentation: https://turf-tech.github.io/lcp-spec
- Discussions: https://github.com/Turf-Tech/lcp-spec/discussions
- Roadmap: https://github.com/Turf-Tech/lcp-spec/blob/main/ROADMAP.md
```

---

**Note**: These settings should be configured in the GitHub repository settings by a repository administrator.
