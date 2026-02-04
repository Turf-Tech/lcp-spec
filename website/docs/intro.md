---
sidebar_position: 1
---

# Introduction to LCP

Welcome to the **Liquid Context Protocol (LCP)** specification documentation.

## What is LCP?

LCP (Liquid Context Protocol) is an open protocol specification that enables AI agents to autonomously discover, negotiate for, verify, and settle payments for contextual data—all without human intervention or trusted intermediaries.

While [MCP](https://modelcontextprotocol.io/) solves how AI systems connect to data sources and [A2A](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) handles agent-to-agent coordination, **LCP provides the missing orchestration layer**: how agents autonomously find unfamiliar providers, negotiate acceptable terms, verify cryptographic proofs, and settle payments atomically.

## The Problem

By 2026, AI agents are everywhere—40% of enterprise applications will include task-specific agents. Yet these agents cannot:
- Discover context providers they've never used before (no permissionless discovery)
- Negotiate pricing and quality guarantees autonomously (no machine-to-machine bargaining)
- Verify data provenance without trusting providers (no cryptographic guarantees)
- Settle payments trustlessly (counterparty risk persists)

## The Solution

LCP provides four core primitives:

1. **Discovery**: Permissionless registry for context providers with on-chain metadata
2. **Negotiation**: Machine-to-machine protocols for pricing, quality, and delivery terms
3. **Verification**: Cryptographic proofs of data provenance and quality
4. **Settlement**: Atomic payment protocols with fraud protection

## Getting Started

To learn more about LCP, explore the following sections:

- [Architecture](./02-architecture.md) - High-level architecture overview
- [Core Components](./03-core-components.md) - Detailed component specifications
- [Discovery Protocol](./04-discovery.md) - How agents find context providers
- [Negotiation Protocol](./05-negotiation.md) - Autonomous term negotiation
- [Verification Protocol](./06-verification.md) - Data provenance and quality proofs
- [Settlement Protocol](./07-settlement.md) - Payment and dispute resolution
- [Trust Model](./08-trust-model.md) - Security and trust assumptions
- [Extensions](./09-extensions.md) - Optional protocol extensions

## Quick Links

- [GitHub Repository](https://github.com/Turf-Tech/lcp-spec)
- [Roadmap](https://github.com/Turf-Tech/lcp-spec/blob/main/ROADMAP.md)
- [Contributing Guide](https://github.com/Turf-Tech/lcp-spec/blob/main/CONTRIBUTING.md)
- [Discussions](https://github.com/Turf-Tech/lcp-spec/discussions)
