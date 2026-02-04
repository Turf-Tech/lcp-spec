---
sidebar_position: 5
sidebar_label: Discovery Protocol
---

# 4. Discovery Protocol

Discovery enables agents to find context providers they have never interacted with before, without gatekeepers or centralized control.

## 4.1 Design Goals

1. **Permissionless Participation**: Any provider can advertise capabilities; any consumer can query
2. **Censorship Resistance**: No single entity can prevent discovery of legitimate providers
3. **Efficient Querying**: Consumers can filter large provider sets without exhaustive search
4. **Reputation Integration**: Discovery results can be ranked by cryptographic reputation
5. **Freshness Guarantees**: Stale capability descriptors are automatically expired

## 4.2 Registry Architecture

LCP supports multiple registry implementations. Each provides the same logical interface but differs in trust assumptions and operational characteristics.

### Registry Types

#### 4.2.1 Decentralized Hash Table (DHT)

**Architecture**: Kademlia-style DHT where capability descriptors are stored at keys derived from capability type hashes.

**Properties**:
- Fully decentralized, no central coordination
- Censorship-resistant through redundancy
- Eventually consistent (stale data possible)
- Lower query latency for specific capability types
- NAT traversal complexity

**Use Cases**: Public, permissionless discovery with maximum censorship resistance

#### 4.2.2 On-Chain Registry

**Architecture**: Smart contract on public blockchain (e.g., Ethereum, Polygon) storing provider capability hashes with IPFS/Arweave pointers for full descriptors.

**Properties**:
- Cryptographic immutability and audit trail
- Integrated with on-chain reputation (ERC-8004)
- Higher query cost (blockchain RPC calls)
- Settlement-ready (provider addresses already on-chain)
- Global consistency

**Use Cases**: High-value transactions requiring strongest guarantees and settlement integration

#### 4.2.3 Federated Registry

**Architecture**: Multiple registry operators maintain synchronized indices, each with independent governance.

**Properties**:
- Balanced decentralization (multiple operators, not fully P2P)
- Lower query latency than blockchain
- Operators can implement custom filtering/curation
- Requires trust in at least one federation member
- Faster capability updates

**Use Cases**: Enterprise deployments, domain-specific ecosystems, latency-sensitive applications

### Registry Interface

All registries MUST implement this logical interface:

```typescript
interface Registry {
  // Publish a capability descriptor
  publish(descriptor: ProviderCapabilityDescriptor): Promise<PublishReceipt>

  // Query for capabilities matching filters
  query(filters: QueryFilters): Promise<CapabilityDescriptor[]>

  // Retrieve specific capability by ID
  get(capabilityId: string): Promise<CapabilityDescriptor | null>

  // Update existing capability
  update(capabilityId: string, descriptor: ProviderCapabilityDescriptor): Promise<UpdateReceipt>

  // Remove capability from registry
  remove(capabilityId: string): Promise<RemovalReceipt>
}
```

## 4.3 Publishing Capabilities

### Publication Flow

```
Provider                    Registry
    │                           │
    │──publish(descriptor)─────▶│
    │                           │
    │                           ├─ Validate descriptor schema
    │                           ├─ Verify provider signature
    │                           ├─ Check reputation (optional)
    │                           ├─ Store descriptor
    │                           ├─ Index by capability type
    │                           │
    │◀──PublishReceipt──────────│
    │  - descriptor_id          │
    │  - registry_location      │
    │  - expires_at             │
```

### Publication Request

```json
{
  "action": "publish",
  "descriptor": {
    // Full ProviderCapabilityDescriptor (see 3.1)
  },
  "signature": {
    "algorithm": "ES256K",
    "public_key": "0xabcd...ef01",
    "signature_value": "0x3045..."
  },
  "metadata": {
    "timestamp": "2026-01-29T12:00:00Z",
    "ttl_hours": 720  // 30 days
  }
}
```

### Validation Requirements

Registries MUST validate:

1. **Schema Compliance**: Descriptor matches required schema
2. **Signature Verification**: Descriptor signed by provider.id DID
3. **Uniqueness**: capability_id not already registered by different provider
4. **Expiry**: metadata.expires_at is in the future

Registries MAY validate:

1. **Reputation Threshold**: Provider meets minimum reputation score
2. **Stake Requirement**: Provider has bonded assets (slashable for fraud)
3. **Rate Limits**: Provider hasn't exceeded publication rate limits

### Publication Costs

- **DHT**: Negligible (network bandwidth only)
- **On-Chain**: Gas fees for smart contract storage (mitigated by storing hash + IPFS pointer)
- **Federated**: Operator-defined (possibly free for basic listings, fee for premium placement)

## 4.4 Querying Capabilities

### Query Structure

```json
{
  "filters": {
    "capability_type": "market_data",
    "coverage": {
      "markets": ["NYSE", "NASDAQ"]
    },
    "max_price": {
      "amount": 0.002,
      "currency": "USDC"
    },
    "min_guarantees": {
      "latency_ms": 200,
      "availability": 0.999
    },
    "min_reputation_score": 8.0,
    "settlement_chains": ["ethereum", "polygon"]
  },
  "sort": {
    "by": "reputation_score",
    "order": "descending"
  },
  "pagination": {
    "limit": 50,
    "offset": 0
  }
}
```

### Filter Types

**Exact Match Filters**:
- `capability_type`: Must exactly match
- `settlement_chains`: At least one chain must be supported

**Range Filters**:
- `max_price`: Provider price ≤ specified amount
- `min_guarantees`: Provider guarantees ≥ specified values
- `min_reputation_score`: Provider reputation ≥ threshold

**Set Filters**:
- `coverage.markets`: Provider covers at least one specified market
- `coverage.symbols`: Provider supports requested symbols

**Boolean Filters**:
- `negotiable_pricing`: Only show providers open to negotiation
- `escrow_supported`: Only show providers supporting escrow

### Query Optimization

#### Indexed Fields

Registries SHOULD index these fields for fast querying:

- `capability_type`
- `pricing.model`
- `provider.reputation.score`
- `terms.settlement.supported_chains`

#### Bloom Filters

For large-scale DHT implementations, use Bloom filters for approximate membership testing:

```
Query: "Does provider support symbol AAPL?"
→ Check Bloom filter before fetching full descriptor
→ Reduces network roundtrips by ~90% for negative results
```

#### Caching

Consumers SHOULD cache capability descriptors until `metadata.expires_at`:

```typescript
interface CapabilityCache {
  get(capabilityId: string): CapabilityDescriptor | null
  set(capabilityId: string, descriptor: CapabilityDescriptor, ttl: number): void
  invalidate(capabilityId: string): void
}
```

## 4.5 Ranking and Reputation

Discovery results SHOULD be ranked by composite scores combining multiple factors.

### Ranking Formula

```
score = w1 * reputation_score
      + w2 * (1 - normalized_price)
      + w3 * availability
      + w4 * recency_factor
      - w5 * latency_penalty
```

Where:
- `w1...w5`: Configurable weights (consumer preference)
- `reputation_score`: From reputation registry (0-10)
- `normalized_price`: Price relative to market average (0-1)
- `availability`: Provider uptime SLA (0-1)
- `recency_factor`: How recently descriptor was updated (0-1, decay function)
- `latency_penalty`: Expected query latency impact (0-1)

### Reputation Integration

LCP integrates with on-chain reputation systems (e.g., ERC-8004):

```json
{
  "provider": {
    "id": "did:example:provider123",
    "reputation": {
      "registry": "ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "score": 8.7,
      "transactions": 15234,
      "positive_feedback_ratio": 0.987,
      "uptime_30d": 0.9987,
      "last_updated": "2026-01-29T10:00:00Z"
    }
  }
}
```

Consumers can verify reputation claims by querying the registry contract directly:

```solidity
interface IReputationRegistry {
  function getProviderScore(address provider) external view returns (uint256);
  function getTransactionCount(address provider) external view returns (uint256);
  function getFeedbackRatio(address provider) external view returns (uint256);
}
```

## 4.6 Multi-Registry Discovery

Agents often query multiple registries simultaneously for maximum coverage.

### Parallel Query Strategy

```typescript
async function discoverCapabilities(filters: QueryFilters): Promise<CapabilityDescriptor[]> {
  const registries = [
    dhtRegistry,
    ethereumRegistry,
    polygonRegistry,
    federatedRegistry
  ]

  // Query all registries concurrently
  const results = await Promise.allSettled(
    registries.map(r => r.query(filters))
  )

  // Merge results, de-duplicate by capability_id
  const merged = deduplicateByCapabilityId(
    results.flatMap(r => r.status === 'fulfilled' ? r.value : [])
  )

  // Re-rank combined results
  return rankByScore(merged, filters.sort)
}
```

### Deduplication

When the same capability appears in multiple registries:

1. **Prefer on-chain**: On-chain registrations are authoritative (immutable, auditable)
2. **Check freshness**: Use descriptor with most recent `metadata.published_at`
3. **Verify consistency**: If descriptors differ significantly, flag as suspicious

## 4.7 Discovery Privacy

Some discovery queries reveal agent intent and can leak information.

### Privacy-Preserving Techniques

#### Private Information Retrieval (PIR)

Agent retrieves capability descriptors without revealing which ones it's interested in:

```
Agent wants capability X from registry with 1000 descriptors
→ Download all 1000 descriptors (or use PIR protocol)
→ Filter locally
→ No registry operator learns which capability was requested
```

**Trade-off**: Higher bandwidth (download all descriptors vs. targeted query)

#### Query Obfuscation

Add noise queries to hide true intent:

```typescript
function obfuscatedQuery(realFilters: QueryFilters): Promise<CapabilityDescriptor[]> {
  const noiseQueries = generatePlausibleNoiseQueries(3)
  const allQueries = [realFilters, ...noiseQueries]

  const results = await Promise.all(
    allQueries.map(q => registry.query(q))
  )

  return results[0]  // Return only real results
}
```

**Trade-off**: 4x query cost to hide intent

#### Tor/Mixnet Routing

Route discovery queries through anonymity networks:

- Prevents registry from associating queries with agent IP
- Adds latency (~2-5s for Tor)
- Suitable for non-latency-sensitive discovery

## 4.8 Discovery Anti-Patterns

### Sybil Attacks

**Attack**: Adversary creates many fake provider identities to dominate discovery results.

**Mitigation**:
- Reputation systems with verification history (can't be instantly fabricated)
- Staking requirements (economic cost to create identities)
- Social graph analysis (isolated identities are suspicious)
- Proof-of-work for registration (rate-limit identity creation)

### Eclipse Attacks

**Attack**: Adversary controls all registry nodes agent connects to, hiding legitimate providers.

**Mitigation**:
- Query multiple independent registries (on-chain + DHT + federated)
- Use trusted bootstrap nodes for DHT
- Cross-check results across registries

### Spam/DoS

**Attack**: Flood registry with fake capability descriptors.

**Mitigation**:
- Descriptor size limits (e.g., max 10KB)
- Publication rate limits per provider
- Stake forfeiture for spam (on-chain registries)
- Bloom filters to reject known spam patterns

## 4.9 Implementation Recommendations

### For Providers

1. **Publish to multiple registries**: On-chain (authoritative) + DHT (fast) + federated (enterprise)
2. **Keep descriptors fresh**: Update before expiry to maintain visibility
3. **Accurate guarantees**: Overpromising damages reputation more than conservative claims
4. **Competitive pricing**: Monitor market rates and adjust dynamically

### For Consumers

1. **Query multiple registries**: Don't rely on single source
2. **Cache aggressively**: Respect `expires_at` to reduce query overhead
3. **Verify reputation on-chain**: Don't trust self-reported scores
4. **Filter early**: Apply hard requirements (price, latency) before ranking

### For Registry Operators

1. **Schema validation**: Reject malformed descriptors immediately
2. **Expiry enforcement**: Automatically prune expired descriptors
3. **Rate limiting**: Prevent spam without blocking legitimate updates
4. **Monitoring**: Track query patterns for abuse detection
