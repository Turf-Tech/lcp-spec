# 5. Negotiation Protocol

Negotiation enables agents and providers to reach mutually acceptable terms without human intervention. Unlike fixed-price APIs, LCP negotiation allows dynamic pricing, quality trade-offs, and custom arrangements.

## 5.1 Design Goals

1. **Autonomous Convergence**: Agents reach agreement without human oversight
2. **Multi-Dimensional Terms**: Negotiate price, quality, latency, schema, settlement simultaneously
3. **Bounded Latency**: Negotiation completes within predictable timeframes
4. **Incentive Compatibility**: Both parties benefit from truthful preference revelation
5. **Composability**: Integration with A2A-style multi-agent coordination patterns

## 5.2 Negotiation Phases

```
Consumer                                    Provider
    │                                           │
    │─────(1) Initial Request─────────────────▶│
    │         (consumer's ideal terms)          │
    │                                           │
    │◀────(2) Response─────────────────────────│
    │         (accept | counter | reject)       │
    │                                           │
    │─────(3) Counter-Proposal (optional)─────▶│
    │                                           │
    │◀────(4) Final Response───────────────────│
    │         (accept | reject)                 │
    │                                           │
    │─────(5) Commitment───────────────────────│
    │         (both parties sign agreement)     │
    │                                           │
    ▼                                           ▼
   Execution                              Execution
```

### Phase 1: Initial Request

Consumer sends desired terms (see 3.2 Context Request):

```json
{
  "request_id": "req_9f3e8d7c6b5a4321",
  "consumer": {"id": "did:example:agent456"},
  "capability_id": "cap_realtime_stock_quotes",
  "parameters": {"symbols": ["AAPL", "GOOGL"]},
  "terms": {
    "max_price": {"amount": 0.0015, "currency": "USDC"},
    "min_guarantees": {
      "latency_ms": 150,
      "freshness_ms": 100
    }
  },
  "negotiation_preferences": {
    "max_rounds": 3,
    "timeout_seconds": 30,
    "priority": {
      "price": 0.6,
      "latency": 0.3,
      "freshness": 0.1
    }
  }
}
```

### Phase 2: Provider Response

Provider evaluates request and responds:

**Option A: Accept** (consumer's terms are acceptable)
```json
{
  "status": "accepted",
  "request_id": "req_9f3e8d7c6b5a4321",
  "accepted_terms": {
    // Echoes consumer's proposed terms
  },
  "signature": {...}
}
```

**Option B: Counter-Proposal** (different terms proposed)
```json
{
  "status": "counter_proposal",
  "request_id": "req_9f3e8d7c6b5a4321",
  "proposed_terms": {
    "price": {"amount": 0.0018, "currency": "USDC"},
    "guarantees": {
      "latency_ms": 130,  // Better than requested
      "freshness_ms": 90   // Better than requested
    }
  },
  "rationale": {
    "reason": "requested_price_below_cost",
    "cost_breakdown": {
      "data_acquisition": 0.0010,
      "infrastructure": 0.0005,
      "margin": 0.0003
    }
  },
  "valid_until": "2026-01-29T12:30:20Z",
  "signature": {...}
}
```

**Option C: Reject** (cannot fulfill)
```json
{
  "status": "rejected",
  "request_id": "req_9f3e8d7c6b5a4321",
  "reason": "capability_unavailable",
  "retry_after_seconds": 3600
}
```

### Phase 3: Consumer Counter-Proposal (Optional)

If provider counter-proposes and consumer wants to continue:

```json
{
  "request_id": "req_9f3e8d7c6b5a4321",
  "round": 2,
  "proposed_terms": {
    "price": {"amount": 0.00165, "currency": "USDC"},  // Split difference
    "guarantees": {
      "latency_ms": 130,    // Accept provider's better offer
      "freshness_ms": 90    // Accept provider's better offer
    }
  },
  "signature": {...}
}
```

### Phase 4: Final Response

Provider accepts or rejects final terms:

```json
{
  "status": "accepted",
  "request_id": "req_9f3e8d7c6b5a4321",
  "final_terms": {
    "price": {"amount": 0.00165, "currency": "USDC"},
    "guarantees": {...}
  },
  "signature": {...}
}
```

### Phase 5: Mutual Commitment

Both parties sign the agreed terms, creating a binding commitment:

```json
{
  "agreement_id": "agr_8d7c6b5a4f3e2d1c",
  "request_id": "req_9f3e8d7c6b5a4321",
  "final_terms": {...},
  "signatures": {
    "consumer": {
      "signer": "did:example:agent456",
      "signature": "0x1234..."
    },
    "provider": {
      "signer": "did:example:provider123",
      "signature": "0x5678..."
    }
  },
  "binding_at": "2026-01-29T12:30:25Z",
  "expires_at": "2026-01-29T13:30:25Z"  // Agreement valid for 1 hour
}
```

## 5.3 Negotiation Strategies

### Consumer Strategies

#### Anchoring Strategy
Start with aggressive terms to anchor negotiation:

```python
def anchor_strategy(market_price):
    return {
        "price": market_price * 0.7,  # 30% below market
        "latency": market_latency * 0.8  # 20% better latency
    }
```

**Risk**: Provider may reject immediately if too aggressive

#### Tit-for-Tat
Mirror provider's concession magnitude:

```python
def tit_for_tat(provider_offer, previous_consumer_offer):
    provider_concession = provider_offer.price - previous_provider_offer.price
    return {
        "price": previous_consumer_offer.price + provider_concession
    }
```

**Benefit**: Builds cooperative relationship, converges to fair split

#### Utility-Maximizing
Optimize across multiple dimensions based on preference weights:

```python
def utility_maximizing(provider_offer, preferences):
    utility = (
        preferences.price_weight * price_utility(provider_offer.price) +
        preferences.latency_weight * latency_utility(provider_offer.latency) +
        preferences.quality_weight * quality_utility(provider_offer.quality)
    )
    if utility >= preferences.min_acceptable_utility:
        return "accept"
    else:
        return generate_counter_offer(utility_gap)
```

### Provider Strategies

#### Cost-Plus Pricing
Never go below cost, apply standard margin:

```python
def cost_plus(consumer_request):
    cost = calculate_cost(consumer_request)
    if consumer_request.max_price >= cost * (1 + MIN_MARGIN):
        return "accept"
    else:
        return {"price": cost * (1 + STANDARD_MARGIN)}
```

#### Dynamic Pricing
Adjust price based on current demand and capacity:

```python
def dynamic_pricing(consumer_request, current_load):
    base_price = calculate_base_price(consumer_request)

    if current_load < 0.5:  # Low utilization
        return base_price * 0.9  # Discount to attract business
    elif current_load > 0.9:  # High utilization
        return base_price * 1.3  # Premium for scarce capacity
    else:
        return base_price
```

#### Reputation Building
Accept lower prices early to build transaction history:

```python
def reputation_building(consumer_request, provider_transaction_count):
    if provider_transaction_count < 100:  # New provider
        return min(consumer_request.max_price, cost * 1.05)  # Minimal margin
    else:
        return cost * (1 + STANDARD_MARGIN)
```

## 5.4 Multi-Round Negotiation

### Convergence Criteria

Negotiation terminates when:

1. **Agreement Reached**: Both parties accept terms
2. **Max Rounds Exceeded**: Iteration limit reached (typically 3-5 rounds)
3. **Timeout**: Time limit exceeded (typically 30-60 seconds)
4. **Utility Gap Too Large**: Parties' requirements don't overlap
5. **Explicit Rejection**: Either party terminates

### Concession Patterns

#### Monotonic Concessions
Each party makes smaller concessions over time:

```
Round 1: Consumer offers $0.001, Provider counters $0.002
Round 2: Consumer offers $0.0013, Provider counters $0.0018
Round 3: Consumer offers $0.0015, Provider accepts
```

Concession decay: `concession[n] = initial_gap * 0.4^n`

#### Alternating Dimensions
Trade off different terms across rounds:

```
Round 1: Negotiate price
Round 2: Given price agreement, negotiate latency
Round 3: Given price + latency, negotiate settlement terms
```

Reduces dimensionality, simplifies convergence.

#### Zeuthen Strategy
Party with lower "risk of conflict" (utility loss from non-agreement) concedes:

```python
def zeuthen_strategy(my_utility_current, my_utility_if_reject,
                      opponent_utility_current, opponent_utility_if_reject):
    my_risk = (my_utility_current - my_utility_if_reject) / my_utility_current
    opponent_risk = (opponent_utility_current - opponent_utility_if_reject) / opponent_utility_current

    if my_risk < opponent_risk:
        return "i_concede"
    else:
        return "wait_for_opponent"
```

Proven to converge to Nash bargaining solution.

## 5.5 Multi-Party Negotiation

Sometimes agents need context from multiple providers simultaneously (e.g., aggregating data sources).

### Parallel Negotiation

Negotiate with multiple providers independently, select best:

```typescript
async function parallelNegotiation(providers: Provider[], request: Request) {
  const negotiations = providers.map(p => negotiate(p, request))
  const results = await Promise.allSettled(negotiations)

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.status === 'accepted')
  return selectBest(successful, request.preferences)
}
```

**Use Case**: Single data source, multiple potential providers

### Combinatorial Negotiation

Negotiate terms where value depends on combination of providers:

```typescript
async function combinatorialNegotiation(providers: Provider[], request: Request) {
  // Request is only valuable if ALL providers agree
  const offers = await Promise.all(
    providers.map(p => p.requestOffer(request))
  )

  const totalCost = offers.reduce((sum, o) => sum + o.price, 0)

  if (totalCost <= request.max_budget) {
    return acceptAll(offers)
  } else {
    // Attempt to renegotiate with all providers
    const reducedOffers = await renegotiateGroup(providers, request.max_budget)
    return reducedOffers
  }
}
```

**Use Case**: Multi-source aggregation (e.g., merging datasets from 3 providers)

### Auction-Based Negotiation

Providers bid for consumer's business:

```typescript
async function auctionNegotiation(providers: Provider[], request: Request) {
  // Sealed-bid auction
  const bids = await Promise.all(
    providers.map(p => p.submitSealedBid(request))
  )

  // Second-price auction (Vickrey)
  const sortedBids = bids.sort((a, b) => a.price - b.price)
  const winner = sortedBids[0]
  const paymentPrice = sortedBids[1].price  // Pay second-lowest price

  return {
    provider: winner.provider,
    terms: {...winner.terms, price: paymentPrice}
  }
}
```

**Benefits**: Incentive-compatible (truthful bidding is optimal), efficient price discovery

## 5.6 Timeout and Failure Handling

### Timeout Configuration

```json
{
  "negotiation_timeouts": {
    "first_response_ms": 5000,      // Provider must respond within 5s
    "per_round_ms": 10000,           // Each subsequent round: 10s
    "total_negotiation_ms": 30000,   // Overall negotiation limit: 30s
    "commitment_window_ms": 5000     // Time to sign agreement: 5s
  }
}
```

### Timeout Behavior

**Provider Timeout**:
```json
{
  "error": {
    "code": "NEGOTIATION_TIMEOUT",
    "message": "Provider did not respond within 5000ms",
    "failed_at": "2026-01-29T12:30:10Z"
  }
}
```

Consumer moves to next provider in discovery results.

**Consumer Timeout**:
Provider's offer expires:
```json
{
  "status": "offer_expired",
  "reason": "Consumer did not respond before valid_until",
  "expired_at": "2026-01-29T12:30:20Z"
}
```

### Partial Failure Recovery

If negotiation fails partway through:

1. **Log Interaction**: Record negotiation attempt for reputation system
2. **Retry with Adjusted Terms**: Consumer may retry with less aggressive initial offer
3. **Move to Next Provider**: Try different provider from discovery results
4. **Escalate to Human**: If all automated attempts fail (optional)

## 5.7 Negotiation Privacy

Negotiation reveals information about preferences and constraints.

### Privacy-Preserving Techniques

#### Secure Multi-Party Computation (MPC)

Compute agreement zone without revealing exact preferences:

```
Consumer: "My max price is X" (secret)
Provider: "My min price is Y" (secret)

MPC Protocol: Compute whether X >= Y (reveals only yes/no)

If yes: Run secondary protocol to find fair price in [Y, X] without revealing bounds
```

**Benefit**: Parties learn only whether agreement is possible, not full preferences

#### Zero-Knowledge Range Proofs

Prove price is within acceptable range without revealing exact value:

```json
{
  "price_commitment": "0x2c26b46b...",
  "zk_proof": {
    "type": "range_proof",
    "claim": "committed_price >= 0.001 AND committed_price <= 0.002",
    "proof": "0x5f7a8e9c..."
  }
}
```

**Use Case**: Provider proves to consumer that offered price is within posted range without revealing exact price (useful for discriminatory pricing)

#### Homomorphic Encryption

Negotiate over encrypted terms:

```
Consumer encrypts max_price with provider's public key
Provider computes encrypted_comparison(encrypted_max_price, min_price)
Result reveals only whether negotiation can proceed
```

## 5.8 Commitment and Binding

Once terms are agreed, both parties must commit atomically.

### Commitment Protocol

```
1. Provider creates agreement document with final terms
2. Provider signs agreement → signature_p
3. Consumer receives signed agreement
4. Consumer verifies provider signature
5. Consumer signs agreement → signature_c
6. Consumer sends dual-signed agreement to provider
7. Provider verifies both signatures
8. Agreement is now binding on both parties
```

### On-Chain Commitment (Optional)

For high-value transactions, commit agreement hash on-chain:

```solidity
contract LCPAgreementRegistry {
  struct Agreement {
    bytes32 agreementHash;
    address consumer;
    address provider;
    uint256 commitmentTimestamp;
    uint256 expiryTimestamp;
  }

  mapping(bytes32 => Agreement) public agreements;

  function commitAgreement(
    bytes32 agreementHash,
    address provider,
    uint256 expiryTimestamp,
    bytes calldata consumerSignature,
    bytes calldata providerSignature
  ) external {
    // Verify signatures
    require(verifySignatures(...), "Invalid signatures");

    // Store commitment
    agreements[agreementHash] = Agreement({
      agreementHash: agreementHash,
      consumer: msg.sender,
      provider: provider,
      commitmentTimestamp: block.timestamp,
      expiryTimestamp: expiryTimestamp
    });

    emit AgreementCommitted(agreementHash, msg.sender, provider);
  }
}
```

**Benefits**:
- Immutable record of agreement
- Enables on-chain dispute resolution
- Integrates with settlement contracts

## 5.9 Implementation Recommendations

### For Consumers

1. **Set Realistic Timeouts**: Allow sufficient time for multi-round negotiation
2. **Parallel Negotiation**: Query multiple providers simultaneously to maximize options
3. **Preference Calibration**: Test utility functions against market outcomes to refine weights
4. **Graceful Degradation**: If ideal terms unreachable, accept suboptimal but acceptable terms

### For Providers

1. **Fast Initial Response**: Respond within 1-2 seconds to avoid timeout
2. **Transparent Rationale**: Include cost breakdown in counter-proposals to build trust
3. **Dynamic Pricing**: Adjust prices based on utilization and demand
4. **Commitment Honoring**: Never renege on signed agreements (reputation damage)

### For Protocol Implementers

1. **Timeout Enforcement**: Strictly enforce timeouts to prevent hanging negotiations
2. **Signature Verification**: Always verify signatures before treating agreements as binding
3. **Replay Protection**: Use nonces in all negotiation messages
4. **Audit Logging**: Record full negotiation history for dispute resolution and learning
