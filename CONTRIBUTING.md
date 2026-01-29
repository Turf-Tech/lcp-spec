# Contributing to Liquid Context Protocol (LCP)

<div align="center">

![Contributing](https://em-content.zobj.net/source/apple/391/rocket_1f680.png)

**Thank you for your interest in contributing to LCP!**

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![First Timers Only](https://img.shields.io/badge/first--timers--only-friendly-blue.svg?style=flat-square)](https://www.firsttimersonly.com/)

</div>

This document provides guidelines and instructions for contributing to the protocol specification, reference implementations, and ecosystem tools.

## 📋 Table of Contents

- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [RFC Process for Protocol Changes](#rfc-process-for-protocol-changes)
- [Development Workflow](#development-workflow)
- [Documentation Guidelines](#documentation-guidelines)
- [Code Contributions](#code-contributions)
- [Community Guidelines](#community-guidelines)
- [Getting Help](#getting-help)

## 🎯 Ways to Contribute

### 📖 1. Protocol Specification

- **Propose Improvements**: Submit RFCs for new features or modifications
- **Fix Issues**: Clarify ambiguous sections, fix typos, improve examples
- **Add Examples**: Create real-world use case demonstrations
- **Write Extensions**: Propose new capability types or verification mechanisms

### 💻 2. Reference Implementations

- **Client Libraries**: Build LCP client libraries in various languages
- **Server Implementations**: Create provider-side LCP servers
- **Tools**: Develop registries, explorers, testing frameworks
- **Integrations**: Build bridges to other protocols (MCP, A2A, etc.)

### 📚 3. Documentation

- **Tutorials**: Write getting-started guides for developers
- **API Documentation**: Document reference implementations
- **Translation**: Translate documentation to other languages
- **Diagrams**: Create visual explanations of protocol flows

### 🔒 4. Testing and Security

- **Security Audits**: Review cryptographic implementations
- **Fuzzing**: Test implementations for edge cases
- **Test Vectors**: Create test cases for verification
- **Vulnerability Disclosure**: Report security issues responsibly

### 🌟 5. Community Building

- **Answer Questions**: Help others in discussions and issues
- **Write Blog Posts**: Share your LCP experiences
- **Present Talks**: Speak about LCP at conferences
- **Organize Events**: Host hackathons or workshops

## 🚀 Getting Started

### ✅ Prerequisites

- **For Spec Contributions**: Markdown editor, Git basics
- **For Implementations**: Language-specific toolchains (Node.js, Rust, Go, Python, etc.)
- **For Smart Contracts**: Solidity, Hardhat/Foundry, understanding of blockchain development

### Initial Setup

1. **Fork the Repository**
   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR_USERNAME/lcp-spec.git
   cd lcp-spec
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/turf_network/lcp-spec.git
   git fetch upstream
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # OR
   git checkout -b fix/issue-number-description
   ```

### Repository Structure

```
lcp-spec/
├── docs/               # Protocol specification documents
│   ├── 01-introduction.md
│   ├── 02-architecture.md
│   ├── ...
│   └── 09-extensions.md
├── examples/           # Example implementations and use cases
├── schemas/            # JSON schemas for data structures
├── rfcs/              # Request for Comments (protocol changes)
├── implementations/    # Reference implementations (future)
├── tests/             # Test vectors and compliance tests
└── tools/             # Development and testing tools
```

## RFC Process for Protocol Changes

LCP uses a Request for Comments (RFC) process for significant changes. This ensures community input and prevents breaking changes without consensus.

### When to Write an RFC

You SHOULD write an RFC if your proposal:

- Adds new required fields to core data structures
- Introduces new protocol phases or flows
- Modifies cryptographic verification mechanisms
- Changes settlement patterns or guarantees
- Adds new capability types to the core spec
- Impacts backward compatibility

You MAY skip the RFC for:

- Documentation improvements
- Typo fixes
- Example additions
- Optional extension proposals (x_ prefixed)

### RFC Template

1. **Copy the Template**
   ```bash
   cp rfcs/0001-template.md rfcs/XXXX-your-proposal-title.md
   ```
   Replace XXXX with the next available number.

2. **Fill Out the RFC**

   Required sections:
   - **Title**: Concise description (e.g., "Add Support for Streaming Context")
   - **Status**: Draft | Under Review | Accepted | Rejected | Implemented
   - **Authors**: Your name/handle and contact
   - **Created**: Date
   - **Summary**: 2-3 sentence overview
   - **Motivation**: Why is this needed? What problem does it solve?
   - **Specification**: Detailed technical design
   - **Backward Compatibility**: Impact on existing implementations
   - **Security Considerations**: New attack vectors or mitigations
   - **Open Questions**: Unresolved issues for discussion
   - **Alternatives Considered**: Other approaches you evaluated

3. **Submit as Pull Request**
   ```bash
   git add rfcs/XXXX-your-proposal-title.md
   git commit -m "RFC XXXX: Your Proposal Title"
   git push origin feature/rfc-XXXX
   ```

4. **Discussion Period**
   - Minimum 2 weeks for community feedback
   - Respond to comments and update RFC based on feedback
   - Major RFCs may require longer discussion (4-6 weeks)

5. **Approval Process**
   - Core maintainers review and vote
   - Requires 2/3 majority for acceptance
   - See [GOVERNANCE.md](./GOVERNANCE.md) for details

6. **Implementation**
   - Once accepted, RFC status changes to "Accepted"
   - Implementation may be done by RFC author or community
   - When merged into spec, status changes to "Implemented"

### RFC Review Criteria

Reviewers evaluate RFCs based on:

- **Necessity**: Does this solve a real problem?
- **Scope**: Is it appropriately sized (not too broad/narrow)?
- **Compatibility**: Impact on existing implementations?
- **Security**: Are there vulnerabilities or mitigations?
- **Clarity**: Is the specification clear and implementable?
- **Completeness**: Are all edge cases addressed?

## Development Workflow

### Branch Naming

- `feature/` - New features or capabilities
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `rfc/` - RFC proposals
- `test/` - Test additions or improvements

Examples:
- `feature/streaming-context`
- `fix/merkle-proof-validation`
- `docs/add-python-examples`
- `rfc/0042-multi-party-aggregation`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(negotiation): add multi-round negotiation support

Implements RFC 0042 for iterative negotiation with bounded rounds.

Closes #123
```

```
docs(examples): add Python client example

Shows basic discovery and request flow using Python SDK.
```

### Pull Request Process

1. **Ensure CI Passes**
   - All tests pass
   - Documentation builds successfully
   - Linting passes (if applicable)

2. **Update Documentation**
   - Add/update relevant docs
   - Update CHANGELOG.md if significant change
   - Add examples if introducing new features

3. **Request Review**
   - Tag relevant maintainers or working group members
   - Address review feedback promptly
   - Be open to suggestions and iteration

4. **Squash Commits** (if requested)
   - Maintain clean git history
   - One logical change per commit
   - Use interactive rebase if needed

5. **Merge Requirements**
   - At least 1 approval from core maintainer
   - All CI checks passing
   - No unresolved comments
   - Documentation updated

## Documentation Guidelines

### Style Guide

- **Markdown Format**: All docs in GitHub-flavored Markdown
- **Headings**: Use ATX-style (`#` for h1, `##` for h2, etc.)
- **Code Blocks**: Specify language for syntax highlighting
- **Links**: Use relative links for internal references
- **Terminology**: Be consistent (see [terminology.md](./docs/terminology.md) if available)

### Writing Technical Specifications

- **Be Precise**: Use MUST, SHOULD, MAY per [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt)
- **Provide Examples**: Include JSON/code examples for clarity
- **Show Flows**: Use sequence diagrams or ASCII art for complex interactions
- **Consider Edge Cases**: Document error conditions and failure modes
- **Link Related Sections**: Cross-reference relevant parts of the spec

Example:
```markdown
## Context Request

A Context Request MUST include the following fields:

- `request_id`: Unique identifier (string)
- `consumer.id`: DID of requesting agent (string matching `^did:`)
- `capability_id`: Target capability (string)

The request MAY include optional `negotiation_preferences`:

```json
{
  "negotiation_preferences": {
    "max_rounds": 3,
    "timeout_seconds": 30
  }
}
```
```

### Documentation Review Checklist

- [ ] Spelling and grammar checked
- [ ] Code examples tested and working
- [ ] Links verified (no broken links)
- [ ] Consistent terminology
- [ ] Clear and concise language
- [ ] Appropriate level of detail
- [ ] Examples for complex concepts

## Code Contributions

### Language-Specific Guidelines

#### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow [Airbnb Style Guide](https://github.com/airbnb/javascript)
- Use ESLint and Prettier
- Minimum Node.js version: 18+

#### Python
- Follow [PEP 8](https://peps.python.org/pep-0008/)
- Use type hints (Python 3.10+)
- Use Black for formatting
- Include docstrings for public APIs

#### Rust
- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use `cargo fmt` and `cargo clippy`
- Include comprehensive tests
- Document with `///` comments

#### Solidity
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Minimum version: 0.8.0
- Include NatSpec comments
- Comprehensive test coverage with Hardhat/Foundry
- Gas optimization where appropriate

### Testing Requirements

- **Unit Tests**: Test individual functions/modules
- **Integration Tests**: Test component interactions
- **Compliance Tests**: Verify spec conformance
- **Security Tests**: Test for known vulnerabilities

Minimum coverage expectations:
- Core libraries: 90%+
- Smart contracts: 100% (critical paths)
- Examples: Basic smoke tests

### Security Best Practices

- **Never Commit Secrets**: No private keys, API keys, passwords
- **Validate Input**: Sanitize all external inputs
- **Use Established Crypto**: Don't roll your own crypto
- **Review Dependencies**: Audit third-party libraries
- **Follow Least Privilege**: Minimal permissions required
- **Document Assumptions**: Clearly state security assumptions

### Code Review Focus Areas

Reviewers will check:

1. **Correctness**: Does it work as intended?
2. **Security**: Are there vulnerabilities?
3. **Performance**: Any obvious inefficiencies?
4. **Readability**: Is the code clear and maintainable?
5. **Tests**: Are tests comprehensive?
6. **Documentation**: Is it well-documented?

## Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, general discussion
- **Discord/Slack** (if available): Real-time chat
- **Mailing List** (if available): Announcements, RFCs

### Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

Key principles:
- Be respectful and professional
- Welcome newcomers
- Assume good intentions
- Disagree constructively
- Respect maintainer decisions

### Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- Annual contributor spotlights
- Conference acknowledgments (when applicable)

## Getting Help

### Before Asking

1. **Search Existing Issues**: Your question may already be answered
2. **Read the Documentation**: Check the full spec and examples
3. **Review RFCs**: See if there's ongoing discussion about your topic

### Where to Ask

- **Implementation Questions**: GitHub Discussions
- **Bug Reports**: GitHub Issues
- **Security Issues**: Email security@lcp.org (if available) or private disclosure
- **General Questions**: Community chat channels

### How to Ask Good Questions

- Provide context and background
- Include minimal reproducible examples
- Share what you've already tried
- Be specific about your environment (versions, OS, etc.)
- Follow up with solutions/outcomes

## License

By contributing to LCP, you agree that your contributions will be licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## Additional Resources

- [Governance Model](./GOVERNANCE.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Roadmap](./ROADMAP.md)
- [Changelog](./CHANGELOG.md)
- [Security Policy](./SECURITY.md) (if available)

---

Thank you for contributing to LCP! Your efforts help build a more open, trustless, and efficient context economy for AI agents.

**Questions?** Open a discussion or reach out to maintainers listed in [GOVERNANCE.md](./GOVERNANCE.md).
