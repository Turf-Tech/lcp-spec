# 1. Introduction

## 1.1 The Problem

AI systems today cannot autonomously discover, evaluate, negotiate for, 
or consume contextual data—they lack the meta layer that optimises how 
context flows to AI systems acting autonomously.

## 1.2 The Thesis

[The Liquid Context Thesis]

Contemporary AI systems lack a protocol-level mechanism for autonomously 
discovering, evaluating, negotiating, and consuming contextual data across 
untrusted, heterogeneous environments...

[Full thesis text here]

## 1.3 Design Principles

1. **Protocol-optimised coordination** — Not the pipes, but the layer that 
   optimises flow across them
2. **Trustless by design** — Guarantees enforced by protocol, not promised 
   by providers
3. **Permissionless discovery** — No gatekeepers deciding what's findable
4. **Atomic settlement** — Context delivered, payment cleared, no counterparty risk
5. **Verifiable provenance** — Cryptographic proof, not asserted claims

## 1.4 Scope

LCP specifies:
- How context providers advertise capabilities
- How agents discover and evaluate context sources
- How negotiation occurs between agents and providers
- Trust models governing the exchange
- How verification and settlement are executed

LCP does not specify:
- The underlying data transport layer
- Specific payment rails (chain-agnostic)
- Context content formats (schema-agnostic)