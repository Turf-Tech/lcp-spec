---
sidebar_position: 3
sidebar_label: Architecture
---

# 2. Architecture

## 2.1 Architectural Position

LCP sits above context provisioning infrastructure and below agent 
application logic—the orchestration layer.
```
┌─────────────────────────────────────┐
│        Agent Application            │
├─────────────────────────────────────┤
│     LCP (Orchestration Layer)       │  ← This specification
├─────────────────────────────────────┤
│    Context Provisioning Infra       │
├─────────────────────────────────────┤
│    Transport / Settlement Layer     │
└─────────────────────────────────────┘
```

## 2.2 Core Actors

| Actor                | Role                                  |
|----------------------|---------------------------------------|
| **Context Provider** | Advertises and serves contextual data |
| **Context Consumer** | AI agent requesting context           |
| **Registry** | Discovery layer for capability advertisement  |
| **Verifier** | Validates provenance and quality claims       |
| **Settlement Layer** | Executes atomic payment settlement    |

## 2.3 Interaction Flow
```
Consumer            Registry            Provider            Settlement
    │                   │                   │                   │
    │──discover────────▶│                   │                   │
    │◀──capabilities────│                   │                   │
    │                   │                   │                   │
    │──negotiate───────────────────────────▶│                   │
    │◀──terms───────────────────────────────│                   │
    │                   │                   │                   │
    │──request─────────────────────────────▶│                   │
    │◀──context + proof─────────────────────│                   │
    │                   │                   │                   │
    │──settle──────────────────────────────────────────────────▶│
    │◀──receipt─────────────────────────────────────────────────│
```

## 2.4 Design Constraints

- **No trusted intermediaries** — All guarantees protocol-enforced
- **Chain-agnostic settlement** — Specify interface, not implementation
- **Transport-agnostic** — HTTP, WebSocket, P2P all supported
- **Schema-agnostic** — Context format defined by provider, not protocol