# Getting Started with LCP

Welcome to the Liquid Context Protocol! This guide helps you get oriented quickly.

## For First-Time Contributors

### 1. Understand LCP (15 minutes)

Start here to understand what LCP is and why it matters:

1. **Read**: [Introduction](./docs/01-introduction.md) - Problem statement and thesis
2. **Skim**: [Architecture](./docs/02-architecture.md) - High-level components
3. **Review**: [Basic Example](./examples/basic-context-request.md) - See it in action

**Key Takeaway**: LCP is the orchestration layer that enables AI agents to autonomously discover providers, negotiate terms, verify proofs, and settle payments trustlessly.

### 2. Choose Your Path

**Path A: I want to give feedback on the spec**
- Read the relevant spec sections in `docs/`
- Open an [issue](https://github.com/turf_network/lcp-spec/issues) with your feedback
- Or comment on existing issues/discussions

**Path B: I want to propose a feature**
- Check [ROADMAP.md](./ROADMAP.md) to see if it's planned
- Review [existing RFCs](./rfcs/) to avoid duplication
- Create a feature request issue or draft an RFC
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for RFC process

**Path C: I want to build an implementation**
- Review the [Core Components](./docs/03-core-components.md) specification
- Check [JSON Schemas](./schemas/) for data structures
- Study the [examples](./examples/)
- Announce your implementation in GitHub Discussions
- Join the Implementations Working Group (see [GOVERNANCE.md](./GOVERNANCE.md))

**Path D: I want to improve documentation**
- Look for issues labeled `documentation`
- Fix typos, clarify confusing sections, add examples
- Submit a PR with your improvements
- See [Documentation Guidelines](./CONTRIBUTING.md#documentation-guidelines)

### 3. Make Your First Contribution (30 minutes)

**Easy First Issues**:
- Fix typos or grammar
- Improve code examples
- Add clarifying comments to JSON schemas
- Answer questions in GitHub Discussions

**Steps**:
```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/lcp-spec.git
cd lcp-spec

# 3. Create a branch
git checkout -b docs/fix-typo-in-intro

# 4. Make your changes
# Edit the file(s)

# 5. Commit
git add .
git commit -m "docs: fix typo in introduction section"

# 6. Push
git push origin docs/fix-typo-in-intro

# 7. Open a Pull Request on GitHub
```

## For Agent Developers

You're building an AI agent and want to use LCP:

### What You Need to Know

1. **Discovery**: How to find context providers
   - Read: [Discovery Protocol](./docs/04-discovery.md)
   - Key concept: Query registries with filters to find providers

2. **Negotiation**: How to agree on terms
   - Read: [Negotiation Protocol](./docs/05-negotiation.md)
   - Key concept: Multi-round bargaining over price, quality, latency

3. **Verification**: How to verify context is legit
   - Read: [Verification Protocol](./docs/06-verification.md)
   - Key concept: Cryptographic proofs (signatures, Merkle trees, timestamps)

4. **Settlement**: How payment works
   - Read: [Settlement Protocol](./docs/07-settlement.md)
   - Key concept: Atomic settlement (escrow, HTLC) eliminates counterparty risk

### Next Steps

- **Wait for Reference SDK**: Q2 2026 (TypeScript, Python, Rust)
- **Or Build Early**: Use the spec to implement your own client
- **Join Discussions**: Share your use case and requirements

## For Data Providers

You want to offer contextual data to AI agents:

### What You Need to Know

1. **Capability Descriptors**: How to advertise what you offer
   - Read: [Core Components - Provider Capability](./docs/03-core-components.md#31-provider-capability-descriptor)
   - Schema: [provider-capability.json](./schemas/provider-capability.json)

2. **Registration**: How to list in registries
   - Read: [Discovery - Publishing](./docs/04-discovery.md#43-publishing-capabilities)
   - Key concept: Publish to multiple registries (on-chain, DHT, federated)

3. **Pricing**: How to price your services
   - Read: [Negotiation - Provider Strategies](./docs/05-negotiation.md#provider-strategies)
   - Example: [Dynamic Pricing Engine](./examples/data-provider-integration.md#step-2-dynamic-pricing-implementation)

4. **Proofs**: How to prove your data is legit
   - Read: [Verification - Provenance](./docs/06-verification.md#621-provenance-verification)
   - Key concept: Sign data, provide Merkle proofs, timestamp on blockchain

### Next Steps

- **Review Full Example**: [Data Provider Integration](./examples/data-provider-integration.md)
- **Wait for Reference SDK**: Q2 2026
- **Or Build Early**: Implement based on spec
- **Join Providers Discussion**: Share your use case

## For Researchers

You're interested in the protocol design and theory:

### Key Research Areas

1. **Autonomous Negotiation**
   - [Negotiation Protocol](./docs/05-negotiation.md)
   - Strategies: Tit-for-tat, utility maximization, Zeuthen
   - Open question: Optimal convergence in multi-dimensional negotiation

2. **Cryptographic Verification**
   - [Verification Protocol](./docs/06-verification.md)
   - Zero-knowledge proofs for privacy-preserving verification
   - TEE integration for sensitive contexts

3. **Trustless Settlement**
   - [Settlement Protocol](./docs/07-settlement.md)
   - Atomic swaps, HTLCs, cross-chain settlement
   - Open question: Minimizing settlement latency and costs

4. **Reputation Systems**
   - [Trust Model](./docs/08-trust-model.md)
   - Sybil resistance, reputation portability
   - Integration with ERC-8004

### How to Contribute

- Submit RFCs with formal analysis
- Propose security improvements
- Contribute to formal verification efforts
- Publish research papers (cite LCP!)

## Quick Reference

### Repository Structure

```
lcp-spec/
├── docs/                  # Full specification (9 sections)
│   ├── 01-introduction.md
│   ├── 02-architecture.md
│   ├── 03-core-components.md
│   ├── 04-discovery.md
│   ├── 05-negotiation.md
│   ├── 06-verification.md
│   ├── 07-settlement.md
│   ├── 08-trust-model.md
│   └── 09-extensions.md
├── examples/              # Practical examples
├── schemas/               # JSON schemas
├── rfcs/                  # Protocol change proposals
├── CONTRIBUTING.md        # How to contribute
├── GOVERNANCE.md          # How decisions are made
├── CODE_OF_CONDUCT.md     # Community standards
├── ROADMAP.md             # Development timeline
└── CHANGELOG.md           # Version history
```

### Key Concepts

- **Permissionless Discovery**: Find providers without gatekeepers
- **Autonomous Negotiation**: Agents bargain without humans
- **Cryptographic Verification**: Trust math, not promises
- **Atomic Settlement**: Context + payment happen together or not at all

### Common Questions

**Q: Is this production-ready?**
A: Not yet. We're at v0.1.0 (draft). Targeting v1.0 in Q4 2026.

**Q: How does this relate to MCP?**
A: MCP handles connections (AI ↔ data sources). LCP handles orchestration (which provider, what terms, payment).

**Q: Can I use LCP today?**
A: For research and prototyping, yes. For production, wait for v1.0 and audited implementations.

**Q: How can I help?**
A: Provide feedback, propose features, build implementations, improve docs. See [CONTRIBUTING.md](./CONTRIBUTING.md).

**Q: Who maintains this?**
A: Community-driven, governed by processes in [GOVERNANCE.md](./GOVERNANCE.md).

## Community Resources

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas, show-and-tell
- **RFCs**: Formal protocol change proposals
- **Working Groups**: Focused development teams (see [GOVERNANCE.md](./GOVERNANCE.md))

## Code of Conduct

We're committed to a welcoming, inclusive community. Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

Key points:
- Be respectful and professional
- Focus on technical merit
- Welcome newcomers
- Disagree constructively

## License

LCP is MIT licensed. By contributing, you agree your contributions will be MIT licensed too.

---

## Next Steps

1. **Learn More**: Read the [Introduction](./docs/01-introduction.md)
2. **Join Discussion**: Open a GitHub Discussion to introduce yourself
3. **Find Issues**: Look for `good first issue` labels
4. **Ask Questions**: We're here to help!

**Welcome to the LCP community!** 🚀
