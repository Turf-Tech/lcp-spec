# 3. Core Components

This section defines the fundamental data structures that LCP implementations MUST support.

## 3.1 Provider Capability Descriptor

A Provider Capability Descriptor advertises what context a provider can deliver, under what conditions, and with what guarantees.

### Structure

```json
{
  "provider": {
    "id": "did:example:provider123",
    "name": "FinancialDataCorp",
    "endpoints": [
      {
        "protocol": "https",
        "url": "https://api.financialdata.example/lcp/v1",
        "transport": ["http", "websocket"]
      }
    ],
    "reputation": {
      "registry": "ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "score": 8.7,
      "transactions": 15234,
      "uptime": 0.9987
    }
  },
  "capabilities": [
    {
      "id": "cap_realtime_stock_quotes",
      "type": "market_data",
      "description": "Real-time stock quotes with sub-100ms latency",
      "schema": {
        "format": "json",
        "specification": "https://financialdata.example/schemas/stock_quote_v2.json"
      },
      "coverage": {
        "markets": ["NYSE", "NASDAQ", "LSE"],
        "symbols": "all",
        "update_frequency": "realtime"
      },
      "guarantees": {
        "latency_ms": 100,
        "availability": 0.9999,
        "freshness_max_age_ms": 50
      },
      "pricing": {
        "model": "pay_per_query",
        "base_price": {
          "amount": 0.001,
          "currency": "USDC"
        },
        "volume_discounts": [
          {"threshold": 10000, "discount_percent": 10},
          {"threshold": 100000, "discount_percent": 25}
        ],
        "negotiable": true
      },
      "verification": {
        "provenance_proof": "cryptographic_signature",
        "timestamp_source": "trusted_timestamping_authority",
        "quality_attestation": "third_party_verifier_available"
      }
    }
  ],
  "terms": {
    "min_commitment_period_days": 0,
    "cancellation_notice_hours": 0,
    "settlement": {
      "supported_chains": ["ethereum", "polygon", "arbitrum"],
      "settlement_delay_blocks": 0,
      "escrow_required": false
    }
  },
  "metadata": {
    "published_at": "2026-01-29T10:00:00Z",
    "expires_at": "2026-02-29T10:00:00Z",
    "version": "2.1.0"
  }
}
```

### Required Fields

- **provider.id**: Decentralized identifier (DID) for the provider
- **provider.endpoints**: At least one accessible endpoint
- **capabilities**: Array of at least one capability
- **capabilities[].id**: Unique capability identifier
- **capabilities[].type**: Capability type (domain-specific)
- **capabilities[].schema**: Data format specification
- **capabilities[].pricing**: Pricing model and rates
- **metadata.published_at**: ISO 8601 timestamp

### Optional Fields

- **provider.reputation**: Reputation metrics (RECOMMENDED)
- **capabilities[].guarantees**: Performance and quality SLAs
- **capabilities[].verification**: Proof mechanisms available
- **terms.settlement**: Settlement preferences and requirements

## 3.2 Context Request

A Context Request specifies what context an agent needs and under what terms it is willing to transact.

### Structure

```json
{
  "request_id": "req_9f3e8d7c6b5a4321",
  "consumer": {
    "id": "did:example:agent456",
    "reputation": {
      "registry": "ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "score": 9.2
    }
  },
  "capability_id": "cap_realtime_stock_quotes",
  "parameters": {
    "symbols": ["AAPL", "GOOGL", "MSFT"],
    "fields": ["price", "volume", "bid", "ask"],
    "frequency": "realtime"
  },
  "requirements": {
    "max_latency_ms": 150,
    "min_freshness_ms": 100,
    "quality_threshold": 0.99
  },
  "terms": {
    "max_price": {
      "amount": 0.0015,
      "currency": "USDC"
    },
    "settlement": {
      "chain": "polygon",
      "escrow_address": "0x1234...5678",
      "release_condition": "on_verification"
    }
  },
  "verification_requirements": {
    "provenance_proof_required": true,
    "timestamp_verification": true,
    "quality_attestation": false
  },
  "metadata": {
    "timestamp": "2026-01-29T12:30:00Z",
    "expires_at": "2026-01-29T12:30:30Z",
    "nonce": "a8f7e6d5c4b3a291"
  }
}
```

### Required Fields

- **request_id**: Unique request identifier
- **consumer.id**: DID of the requesting agent
- **capability_id**: References provider's capability
- **parameters**: Capability-specific query parameters
- **terms**: Maximum acceptable price and settlement terms
- **metadata.timestamp**: Request creation time
- **metadata.nonce**: Replay attack prevention

### Optional Fields

- **requirements**: Performance constraints (RECOMMENDED)
- **verification_requirements**: Proof requirements

## 3.3 Negotiation Response

A provider's response to a context request, potentially with counter-terms.

### Structure

```json
{
  "response_id": "resp_8e2d7c6b5a4f3210",
  "request_id": "req_9f3e8d7c6b5a4321",
  "provider_id": "did:example:provider123",
  "status": "counter_proposal",
  "proposed_terms": {
    "price": {
      "amount": 0.0012,
      "currency": "USDC"
    },
    "guarantees": {
      "latency_ms": 120,
      "freshness_ms": 80,
      "quality": 0.995
    },
    "settlement": {
      "chain": "polygon",
      "escrow_address": "0x1234...5678",
      "release_condition": "on_verification"
    }
  },
  "valid_until": "2026-01-29T12:30:20Z",
  "signature": {
    "algorithm": "ES256K",
    "public_key": "0xabcd...ef01",
    "signature_value": "0x3045..."
  },
  "metadata": {
    "timestamp": "2026-01-29T12:30:05Z"
  }
}
```

### Status Values

- **accepted**: Provider accepts consumer's terms as-is
- **counter_proposal**: Provider proposes different terms
- **rejected**: Provider cannot fulfill request
- **requires_negotiation**: Multi-round negotiation required

## 3.4 Context Response

The actual context delivery with associated metadata and proofs.

### Structure

```json
{
  "response_id": "resp_context_7d6c5b4a3f2e1098",
  "request_id": "req_9f3e8d7c6b5a4321",
  "provider_id": "did:example:provider123",
  "data": {
    "format": "json",
    "schema": "https://financialdata.example/schemas/stock_quote_v2.json",
    "content": {
      "quotes": [
        {
          "symbol": "AAPL",
          "price": 178.42,
          "volume": 52341890,
          "bid": 178.40,
          "ask": 178.43,
          "timestamp": "2026-01-29T12:30:05.234Z"
        }
      ]
    }
  },
  "provenance": {
    "source": "NASDAQ_Direct_Feed",
    "chain_of_custody": [
      {
        "entity": "NASDAQ",
        "timestamp": "2026-01-29T12:30:05.200Z",
        "signature": "0x9876..."
      },
      {
        "entity": "did:example:provider123",
        "timestamp": "2026-01-29T12:30:05.250Z",
        "signature": "0x3045..."
      }
    ]
  },
  "verification": {
    "merkle_root": "0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    "merkle_proof": ["0xabcd...", "0xef01..."],
    "timestamp_proof": {
      "authority": "https://timestamp.example.com",
      "timestamp": "2026-01-29T12:30:05.250Z",
      "signature": "0x5432..."
    }
  },
  "quality_metrics": {
    "completeness": 1.0,
    "freshness_ms": 50,
    "latency_ms": 95
  },
  "settlement_reference": {
    "chain": "polygon",
    "transaction_hash": "0xabc123...",
    "escrow_address": "0x1234...5678",
    "amount": {
      "amount": 0.0012,
      "currency": "USDC"
    }
  },
  "metadata": {
    "timestamp": "2026-01-29T12:30:05.300Z"
  }
}
```

### Required Fields

- **response_id**: Unique response identifier
- **request_id**: References original request
- **provider_id**: DID of provider
- **data.content**: The actual context payload
- **provenance**: Origin and custody chain (MUST include at least source)
- **metadata.timestamp**: Response generation time

### Optional but Recommended

- **verification**: Cryptographic proofs for independent verification
- **quality_metrics**: Measurable quality indicators
- **settlement_reference**: Settlement transaction details

## 3.5 Verification Proof

A standalone verification proof that can be checked independently.

### Structure

```json
{
  "proof_id": "proof_6c5b4a3f2e1d0987",
  "response_id": "resp_context_7d6c5b4a3f2e1098",
  "proof_type": "merkle_tree_inclusion",
  "proof_data": {
    "merkle_root": "0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    "leaf_hash": "0x123abc...",
    "proof_path": ["0xabcd...", "0xef01..."],
    "leaf_index": 42
  },
  "signature": {
    "algorithm": "ES256K",
    "signer": "did:example:provider123",
    "public_key": "0xabcd...ef01",
    "signature_value": "0x3045..."
  },
  "timestamp": {
    "authority": "https://timestamp.example.com",
    "timestamp": "2026-01-29T12:30:05.250Z",
    "proof": "0x5432..."
  },
  "metadata": {
    "created_at": "2026-01-29T12:30:05.300Z"
  }
}
```

### Supported Proof Types

- **merkle_tree_inclusion**: Proves data is part of a committed Merkle tree
- **cryptographic_signature**: Provider signature over data hash
- **zero_knowledge_proof**: ZKP for privacy-preserving verification
- **threshold_signature**: Multi-party signature (for aggregated context)
- **tee_attestation**: Trusted Execution Environment attestation

## 3.6 Settlement Receipt

Confirmation of payment settlement, proving transaction completion.

### Structure

```json
{
  "receipt_id": "receipt_5b4a3f2e1d0c9876",
  "request_id": "req_9f3e8d7c6b5a4321",
  "response_id": "resp_context_7d6c5b4a3f2e1098",
  "settlement": {
    "chain": "polygon",
    "transaction_hash": "0xabc123def456...",
    "block_number": 52341890,
    "block_hash": "0x789xyz...",
    "confirmations": 12,
    "finality_status": "finalized"
  },
  "parties": {
    "payer": "did:example:agent456",
    "payer_address": "0x9876...5432",
    "payee": "did:example:provider123",
    "payee_address": "0x1234...5678"
  },
  "amount": {
    "amount": 0.0012,
    "currency": "USDC",
    "token_address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  },
  "settlement_type": "atomic_swap",
  "escrow_released": true,
  "verification_passed": true,
  "metadata": {
    "settled_at": "2026-01-29T12:30:10.500Z",
    "settlement_latency_ms": 5200
  }
}
```

### Required Fields

- **receipt_id**: Unique receipt identifier
- **request_id**: Links to original request
- **settlement.chain**: Settlement blockchain/network
- **settlement.transaction_hash**: On-chain transaction reference
- **parties**: Payer and payee identities and addresses
- **amount**: Settled amount with currency/token
- **metadata.settled_at**: Settlement timestamp

### Settlement Types

- **atomic_swap**: Cryptographic atomic swap between assets
- **escrow_release**: Conditional escrow with verification-based release
- **htlc**: Hash Time-Locked Contract settlement
- **direct_transfer**: Direct on-chain payment
- **lightning**: Layer-2 Lightning Network payment

## 3.7 Error Response

Standard error format for protocol-level failures.

### Structure

```json
{
  "error": {
    "code": "VERIFICATION_FAILED",
    "message": "Merkle proof verification failed",
    "details": {
      "expected_root": "0x2c26b46b...",
      "computed_root": "0x8a9b7c6d...",
      "proof_path_length": 8
    },
    "retry_after_ms": 0,
    "recoverable": false
  },
  "request_id": "req_9f3e8d7c6b5a4321",
  "timestamp": "2026-01-29T12:30:05.400Z"
}
```

### Standard Error Codes

- **PROVIDER_NOT_FOUND**: Capability or provider ID not in registry
- **NEGOTIATION_TIMEOUT**: Negotiation exceeded time limit
- **TERMS_REJECTED**: Proposed terms unacceptable
- **VERIFICATION_FAILED**: Cryptographic verification failed
- **SETTLEMENT_FAILED**: Payment settlement did not complete
- **INSUFFICIENT_REPUTATION**: Counterparty reputation below threshold
- **RATE_LIMIT_EXCEEDED**: Request rate exceeds provider limits
- **CAPABILITY_UNAVAILABLE**: Temporary inability to provide context
- **SCHEMA_MISMATCH**: Delivered data doesn't match agreed schema
- **FRESHNESS_VIOLATED**: Data staleness exceeds requirements

## 3.8 Schema Versioning

All core components follow semantic versioning (MAJOR.MINOR.PATCH). Implementations MUST:

- Accept any PATCH version increment (backward-compatible bug fixes)
- Accept any MINOR version increment (backward-compatible feature additions)
- Explicitly negotiate MAJOR version changes (breaking changes)

Current specification version: **0.1.0** (draft)

## 3.9 Extensibility

Components support extension through:

1. **Custom Fields**: Any field prefixed with `x_` is reserved for implementation-specific extensions
2. **Capability Types**: Implementations can define domain-specific capability types
3. **Proof Types**: New verification proof mechanisms can be registered
4. **Settlement Types**: Additional settlement mechanisms can be added

Extensions SHOULD NOT break compatibility with core required fields.
