# Example: Basic Context Request

This example demonstrates a complete end-to-end flow for a simple context request: an AI agent requesting real-time stock quotes from a financial data provider.

## Scenario

**Agent**: Investment analysis AI (`did:example:investment-agent-42`)
**Provider**: Financial Data Corp (`did:example:financial-data-corp`)
**Context Needed**: Real-time stock quotes for AAPL, GOOGL, MSFT
**Settlement**: Polygon (USDC payment)

## Step 1: Discovery

The agent queries a registry to find providers offering real-time stock quotes.

### Discovery Query

```json
{
  "filters": {
    "capability_type": "market_data",
    "coverage": {
      "markets": ["NASDAQ"]
    },
    "max_price": {
      "amount": 0.002,
      "currency": "USDC"
    },
    "min_guarantees": {
      "latency_ms": 200
    }
  },
  "sort": {
    "by": "reputation_score",
    "order": "descending"
  }
}
```

### Discovery Response

```json
{
  "results": [
    {
      "provider": {
        "id": "did:example:financial-data-corp",
        "name": "Financial Data Corp",
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
          "pricing": {
            "model": "pay_per_query",
            "base_price": {
              "amount": 0.001,
              "currency": "USDC"
            },
            "negotiable": true
          }
        }
      ]
    }
  ]
}
```

## Step 2: Negotiation

Agent sends initial request with desired terms.

### Initial Request

```json
{
  "request_id": "req_9f3e8d7c6b5a4321",
  "consumer": {
    "id": "did:example:investment-agent-42",
    "reputation": {
      "registry": "ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "score": 9.2
    }
  },
  "capability_id": "cap_realtime_stock_quotes",
  "parameters": {
    "symbols": ["AAPL", "GOOGL", "MSFT"],
    "fields": ["price", "volume", "bid", "ask"]
  },
  "requirements": {
    "max_latency_ms": 150,
    "min_freshness_ms": 100
  },
  "terms": {
    "max_price": {
      "amount": 0.0015,
      "currency": "USDC"
    },
    "settlement": {
      "chain": "polygon",
      "release_condition": "on_verification"
    }
  },
  "verification_requirements": {
    "provenance_proof_required": true,
    "timestamp_verification": true
  },
  "metadata": {
    "timestamp": "2026-01-29T12:30:00.000Z",
    "expires_at": "2026-01-29T12:30:30.000Z",
    "nonce": "a8f7e6d5c4b3a291"
  }
}
```

### Provider Counter-Proposal

Provider offers better guarantees for slightly higher price.

```json
{
  "response_id": "resp_8e2d7c6b5a4f3210",
  "request_id": "req_9f3e8d7c6b5a4321",
  "provider_id": "did:example:financial-data-corp",
  "status": "counter_proposal",
  "proposed_terms": {
    "price": {
      "amount": 0.0012,
      "currency": "USDC"
    },
    "guarantees": {
      "latency_ms": 95,
      "freshness_ms": 50,
      "quality": 0.9999
    },
    "settlement": {
      "chain": "polygon",
      "release_condition": "on_verification"
    }
  },
  "rationale": {
    "reason": "premium_guarantees",
    "details": "Sub-100ms latency and 50ms freshness exceed standard tier"
  },
  "valid_until": "2026-01-29T12:30:20.000Z",
  "signature": {
    "algorithm": "ES256K",
    "public_key": "0xabcd...ef01",
    "signature_value": "0x3045022100a7b2c3d4..."
  },
  "metadata": {
    "timestamp": "2026-01-29T12:30:02.100Z"
  }
}
```

### Agent Acceptance

Agent accepts provider's counter-proposal.

```json
{
  "request_id": "req_9f3e8d7c6b5a4321",
  "status": "accepted",
  "accepted_terms": {
    "price": {
      "amount": 0.0012,
      "currency": "USDC"
    },
    "guarantees": {
      "latency_ms": 95,
      "freshness_ms": 50
    }
  },
  "signature": {
    "algorithm": "ES256K",
    "public_key": "0x1234...5678",
    "signature_value": "0x3046022100b8c3d4e5..."
  },
  "metadata": {
    "timestamp": "2026-01-29T12:30:03.500Z"
  }
}
```

## Step 3: Escrow Setup

Agent creates escrow contract with payment.

### Escrow Transaction

```solidity
// Agent calls on Polygon
LCPEscrow.createEscrow(
  agreementHash: 0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae,
  provider: 0x9876...5432,  // Provider's Polygon address
  contextHash: 0x123abc...,  // Expected context hash (committed upfront)
  expiryDuration: 3600        // 1 hour
) payable { value: 0.0012 USDC }
```

**Transaction Hash**: `0xpolygon:abc123def456...`

## Step 4: Context Delivery

Provider delivers context with verification proofs.

### Context Response

```json
{
  "response_id": "resp_context_7d6c5b4a3f2e1098",
  "request_id": "req_9f3e8d7c6b5a4321",
  "provider_id": "did:example:financial-data-corp",
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
        },
        {
          "symbol": "GOOGL",
          "price": 142.67,
          "volume": 28934561,
          "bid": 142.65,
          "ask": 142.68,
          "timestamp": "2026-01-29T12:30:05.237Z"
        },
        {
          "symbol": "MSFT",
          "price": 412.89,
          "volume": 19283746,
          "bid": 412.87,
          "ask": 412.90,
          "timestamp": "2026-01-29T12:30:05.241Z"
        }
      ],
      "retrieved_at": "2026-01-29T12:30:05.250Z"
    }
  },
  "provenance": {
    "source": "NASDAQ_Direct_Feed",
    "chain_of_custody": [
      {
        "entity": "NASDAQ",
        "role": "original_source",
        "timestamp": "2026-01-29T12:30:05.200Z",
        "data_hash": "0x9876...",
        "signature": "0x5432..."
      },
      {
        "entity": "did:example:financial-data-corp",
        "role": "aggregator",
        "timestamp": "2026-01-29T12:30:05.250Z",
        "data_hash": "0x2c26...",
        "signature": "0x3045..."
      }
    ]
  },
  "verification": {
    "merkle_root": "0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    "merkle_proof": [
      "0xabcd1234...",
      "0xef015678..."
    ],
    "timestamp_proof": {
      "authority": "https://timestamp.example.com",
      "timestamp": "2026-01-29T12:30:05.250Z",
      "signature": "0x5432..."
    },
    "signature": {
      "algorithm": "ES256K",
      "signer": "did:example:financial-data-corp",
      "public_key": "0xabcd...ef01",
      "signature_value": "0x3045022100..."
    }
  },
  "quality_metrics": {
    "completeness": 1.0,
    "freshness_ms": 50,
    "latency_ms": 95
  },
  "settlement_reference": {
    "chain": "polygon",
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

## Step 5: Verification

Agent verifies all proofs before releasing payment.

### Verification Steps

```typescript
async function verifyContext(response: ContextResponse): Promise<boolean> {
  // 1. Verify provider signature
  const dataHash = sha256(JSON.stringify(response.data.content))
  const signatureValid = ecdsaVerify(
    dataHash,
    response.verification.signature.signature_value,
    response.verification.signature.public_key
  )
  console.log(`Signature valid: ${signatureValid}`)

  // 2. Verify Merkle proof
  const merkleValid = verifyMerkleProof(
    response.verification.merkle_root,
    dataHash,
    response.verification.merkle_proof
  )
  console.log(`Merkle proof valid: ${merkleValid}`)

  // 3. Verify timestamp
  const timestampValid = await verifyTimestamp(
    response.verification.timestamp_proof
  )
  console.log(`Timestamp valid: ${timestampValid}`)

  // 4. Verify freshness
  const age = Date.now() - new Date(response.data.content.retrieved_at).getTime()
  const freshnessValid = age <= 100  // 100ms requirement
  console.log(`Freshness valid: ${freshnessValid} (age: ${age}ms)`)

  // 5. Verify completeness
  const requestedSymbols = ["AAPL", "GOOGL", "MSFT"]
  const receivedSymbols = response.data.content.quotes.map(q => q.symbol)
  const completenessValid = requestedSymbols.every(s => receivedSymbols.includes(s))
  console.log(`Completeness valid: ${completenessValid}`)

  return signatureValid && merkleValid && timestampValid && freshnessValid && completenessValid
}
```

**Result**: All verifications pass ✓

## Step 6: Settlement

Agent releases escrow to provider.

### Release Transaction

```solidity
// Agent calls on Polygon
LCPEscrow.releaseEscrow(
  agreementHash: 0x2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae
)
```

**Transaction Hash**: `0xpolygon:def789abc012...`
**Block Number**: 52341890
**Confirmations**: 12
**Status**: Finalized

### Settlement Receipt

```json
{
  "receipt_id": "receipt_5b4a3f2e1d0c9876",
  "request_id": "req_9f3e8d7c6b5a4321",
  "response_id": "resp_context_7d6c5b4a3f2e1098",
  "settlement": {
    "chain": "polygon",
    "transaction_hash": "0xdef789abc012...",
    "block_number": 52341890,
    "block_hash": "0x789xyz...",
    "confirmations": 12,
    "finality_status": "finalized"
  },
  "parties": {
    "payer": "did:example:investment-agent-42",
    "payer_address": "0x1234...abcd",
    "payee": "did:example:financial-data-corp",
    "payee_address": "0x9876...5432"
  },
  "amount": {
    "amount": 0.0012,
    "currency": "USDC",
    "token_address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
  },
  "settlement_type": "escrow_release",
  "escrow_released": true,
  "verification_passed": true,
  "metadata": {
    "settled_at": "2026-01-29T12:30:10.500Z",
    "settlement_latency_ms": 5200
  }
}
```

## Summary

**Total Time**: 10.5 seconds (discovery → delivery → settlement)
**Cost**: 0.0012 USDC (~$0.0012)
**Verifications**: 5 (signature, Merkle, timestamp, freshness, completeness)
**Settlement**: Trustless escrow with atomic release

This example demonstrates the complete LCP flow for a simple, single-provider context request with cryptographic verification and on-chain settlement.
