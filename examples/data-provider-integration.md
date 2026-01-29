# Example: Data Provider Integration

This example demonstrates how a data provider implements LCP to offer services to AI agents.

## Scenario

**Provider**: SatelliteVision Corp
**Service**: Real-time satellite imagery with sub-1m resolution
**Business Model**: Pay-per-image with volume discounts
**Settlement**: Multi-chain (Ethereum, Polygon, Arbitrum)

## Implementation Architecture

```
┌─────────────────────────────────────────────┐
│         SatelliteVision LCP Service         │
├─────────────────────────────────────────────┤
│  API Layer (HTTP/WebSocket)                 │
│  ├─ Capability Advertisement                │
│  ├─ Negotiation Endpoint                    │
│  ├─ Context Delivery Endpoint               │
│  └─ Verification Proof Generation           │
├─────────────────────────────────────────────┤
│  Business Logic                             │
│  ├─ Dynamic Pricing Engine                  │
│  ├─ Quality Assurance                       │
│  ├─ Provenance Tracking                     │
│  └─ Reputation Management                   │
├─────────────────────────────────────────────┤
│  Settlement Layer                           │
│  ├─ Escrow Monitor (multi-chain)            │
│  ├─ Payment Verification                    │
│  └─ Receipt Generation                      │
├─────────────────────────────────────────────┤
│  Data Layer                                 │
│  ├─ Satellite Image Database                │
│  ├─ Metadata Index                          │
│  └─ Provenance Logs                         │
└─────────────────────────────────────────────┘
```

## Step 1: Provider Registration

Provider registers capabilities in multiple registries.

### DID Creation

```json
{
  "did": "did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "didDocument": {
    "@context": "https://w3id.org/did/v1",
    "id": "did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "authentication": [{
      "id": "did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb#controller",
      "type": "EcdsaSecp256k1VerificationKey2019",
      "controller": "did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "publicKeyHex": "0x0424a...f3c2"
    }],
    "service": [{
      "id": "did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb#lcp",
      "type": "LCPProvider",
      "serviceEndpoint": "https://api.satellitevision.example/lcp/v1"
    }]
  }
}
```

### Capability Descriptor

```json
{
  "provider": {
    "id": "did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "name": "SatelliteVision Corp",
    "endpoints": [
      {
        "protocol": "https",
        "url": "https://api.satellitevision.example/lcp/v1",
        "transport": ["http", "websocket"]
      }
    ],
    "reputation": {
      "registry": "ethereum:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "score": 9.1,
      "transactions": 4523,
      "uptime": 0.9995
    }
  },
  "capabilities": [
    {
      "id": "cap_satellite_imagery_hires",
      "type": "x_geospatial_imagery",
      "description": "Real-time satellite imagery with sub-1m resolution",
      "schema": {
        "format": "geotiff",
        "specification": "https://satellitevision.example/schemas/imagery_v3.json"
      },
      "coverage": {
        "global": true,
        "resolution_meters": 0.5,
        "spectral_bands": ["rgb", "nir", "swir"],
        "revisit_time_hours": 4
      },
      "guarantees": {
        "latency_ms": 5000,
        "availability": 0.9999,
        "freshness_max_age_hours": 6,
        "cloud_cover_max": 0.1
      },
      "pricing": {
        "model": "pay_per_query",
        "base_price": {
          "amount": 0.050,
          "currency": "USDC"
        },
        "volume_discounts": [
          {"threshold": 100, "discount_percent": 10},
          {"threshold": 500, "discount_percent": 20},
          {"threshold": 1000, "discount_percent": 30}
        ],
        "negotiable": true,
        "pricing_factors": [
          {"factor": "area_km2", "multiplier": 0.001},
          {"factor": "priority_processing", "multiplier": 2.0}
        ]
      },
      "verification": {
        "provenance_proof": "cryptographic_signature",
        "timestamp_source": "blockchain_anchor",
        "quality_attestation": "third_party_verifier_available",
        "metadata_hash": true
      }
    }
  ],
  "terms": {
    "min_commitment_period_days": 0,
    "cancellation_notice_hours": 0,
    "settlement": {
      "supported_chains": ["ethereum", "polygon", "arbitrum"],
      "settlement_delay_blocks": 0,
      "escrow_required": false,
      "payment_channels_supported": true
    },
    "data_retention": {
      "query_logs_days": 90,
      "imagery_cache_days": 30
    }
  },
  "metadata": {
    "published_at": "2026-01-15T00:00:00Z",
    "expires_at": "2026-02-15T00:00:00Z",
    "version": "3.1.0"
  }
}
```

### Registry Publication

Provider publishes to multiple registries for maximum discoverability.

**On-Chain Registry (Ethereum)**:
```solidity
// Provider stakes and registers
LCPProviderRegistry.register(
  capabilityHash: keccak256(capabilityDescriptor),
  ipfsUri: "ipfs://Qm...xyz",  // Full descriptor on IPFS
  stake: 50000 * 1e6  // $50,000 USDC stake
)
```

**DHT Registry (Kademlia)**:
```typescript
dht.put(
  key: sha256("x_geospatial_imagery"),
  value: JSON.stringify(capabilityDescriptor),
  signature: sign(capabilityDescriptor, providerPrivateKey)
)
```

**Federated Registry**:
```http
POST https://registry.lcp-federation.example/capabilities
Content-Type: application/json

{
  "descriptor": {...},
  "signature": "0x3045..."
}
```

## Step 2: Dynamic Pricing Implementation

Provider implements dynamic pricing based on demand and capacity.

### Pricing Engine

```typescript
class DynamicPricingEngine {
  private basePrice: number = 0.050  // USDC
  private currentLoad: number  // 0.0 to 1.0

  calculatePrice(request: ContextRequest): number {
    let price = this.basePrice

    // Factor 1: Current system load
    if (this.currentLoad > 0.8) {
      price *= 1.5  // 50% premium during high demand
    } else if (this.currentLoad < 0.3) {
      price *= 0.8  // 20% discount during low demand
    }

    // Factor 2: Area requested
    const areaKm2 = calculateArea(request.parameters.bounds)
    price += areaKm2 * 0.001  // $0.001 per km²

    // Factor 3: Priority processing
    if (request.parameters.priority === 'high') {
      price *= 2.0
    }

    // Factor 4: Volume discounts
    const consumerHistory = getConsumerHistory(request.consumer.id)
    if (consumerHistory.total_orders > 1000) {
      price *= 0.7  // 30% discount for high-volume customers
    } else if (consumerHistory.total_orders > 500) {
      price *= 0.8  // 20% discount
    } else if (consumerHistory.total_orders > 100) {
      price *= 0.9  // 10% discount
    }

    // Factor 5: Consumer reputation
    if (request.consumer.reputation.score > 9.0) {
      price *= 0.95  // 5% discount for highly reputable consumers
    }

    return Math.round(price * 1000000) / 1000000  // Round to 6 decimals
  }

  negotiatePrice(
    consumerOffer: number,
    minAcceptablePrice: number
  ): { accept: boolean, counterOffer?: number } {
    if (consumerOffer >= minAcceptablePrice * 1.1) {
      // Accept if offer is ≥10% above minimum
      return { accept: true }
    } else if (consumerOffer >= minAcceptablePrice) {
      // Accept marginally profitable offers during low load
      return { accept: this.currentLoad < 0.5 }
    } else {
      // Counter-propose at midpoint between offer and min
      const counterOffer = (consumerOffer + minAcceptablePrice) / 2
      return { accept: false, counterOffer }
    }
  }
}
```

## Step 3: Negotiation Endpoint

Provider handles incoming context requests and negotiation.

### Negotiation Handler

```typescript
async function handleNegotiation(request: ContextRequest): Promise<NegotiationResponse> {
  // 1. Validate request
  if (!validateSchema(request)) {
    return { status: 'rejected', reason: 'invalid_schema' }
  }

  // 2. Check if capability available
  const capability = capabilities.find(c => c.id === request.capability_id)
  if (!capability) {
    return { status: 'rejected', reason: 'capability_not_found' }
  }

  // 3. Validate parameters
  if (!validateCoverage(request.parameters.bounds, capability.coverage)) {
    return { status: 'rejected', reason: 'area_not_covered' }
  }

  // 4. Calculate cost
  const calculatedPrice = pricingEngine.calculatePrice(request)
  const minPrice = calculatedPrice * 0.9  // Accept up to 10% below calculated

  // 5. Evaluate consumer's offer
  const consumerOffer = request.terms.max_price.amount

  const negotiation = pricingEngine.negotiatePrice(consumerOffer, minPrice)

  if (negotiation.accept) {
    // Accept consumer's offer
    return {
      status: 'accepted',
      request_id: request.request_id,
      provider_id: PROVIDER_DID,
      accepted_terms: request.terms,
      signature: await signTerms(request.terms)
    }
  } else {
    // Counter-propose
    return {
      status: 'counter_proposal',
      request_id: request.request_id,
      provider_id: PROVIDER_DID,
      proposed_terms: {
        price: {
          amount: negotiation.counterOffer,
          currency: 'USDC'
        },
        guarantees: capability.guarantees,
        settlement: {
          chain: request.terms.settlement.chain,
          release_condition: 'on_verification'
        }
      },
      rationale: {
        reason: 'dynamic_pricing',
        details: `Current system load: ${pricingEngine.currentLoad.toFixed(2)}. Requested area: ${calculateArea(request.parameters.bounds).toFixed(2)} km²`
      },
      valid_until: new Date(Date.now() + 30000).toISOString(),  // 30s expiry
      signature: await signProposal(negotiation.counterOffer)
    }
  }
}
```

## Step 4: Context Delivery with Verification Proofs

Provider delivers imagery with comprehensive proofs.

### Delivery Handler

```typescript
async function deliverContext(agreementId: string): Promise<ContextResponse> {
  const agreement = await getAgreement(agreementId)
  const request = agreement.request

  // 1. Retrieve satellite imagery
  const imagery = await satelliteDB.query({
    bounds: request.parameters.bounds,
    max_cloud_cover: 0.1,
    max_age_hours: 6
  })

  // 2. Generate metadata
  const metadata = {
    capture_time: imagery.timestamp,
    satellite_id: imagery.satellite,
    resolution_meters: imagery.resolution,
    spectral_bands: imagery.bands,
    cloud_cover: imagery.cloud_cover,
    sun_angle: imagery.sun_angle
  }

  // 3. Create Merkle tree for integrity
  const merkleTree = createMerkleTree([
    hashObject(imagery.data),
    hashObject(metadata)
  ])

  // 4. Sign data
  const dataHash = merkleTree.root
  const signature = await sign(dataHash, providerPrivateKey)

  // 5. Blockchain anchor timestamp
  const timestampTx = await anchorToBlockchain(
    chain: 'ethereum',
    dataHash: dataHash
  )

  // 6. Generate provenance chain
  const provenance = {
    source: `SATELLITE_${imagery.satellite}`,
    chain_of_custody: [
      {
        entity: `SATELLITE_${imagery.satellite}`,
        role: 'original_source',
        timestamp: imagery.capture_time,
        data_hash: hashObject(imagery.raw_data),
        signature: imagery.satellite_signature
      },
      {
        entity: PROVIDER_DID,
        role: 'processor',
        timestamp: new Date().toISOString(),
        data_hash: dataHash,
        signature: signature,
        transformation: 'geotiff_conversion_and_calibration'
      }
    ]
  }

  // 7. Quality metrics
  const qualityMetrics = {
    completeness: 1.0,  // Full coverage
    freshness_ms: Date.now() - new Date(imagery.timestamp).getTime(),
    cloud_cover: imagery.cloud_cover,
    resolution_meters: imagery.resolution
  }

  // 8. Package response
  return {
    response_id: generateId('resp_context'),
    request_id: request.request_id,
    provider_id: PROVIDER_DID,
    data: {
      format: 'geotiff',
      schema: 'https://satellitevision.example/schemas/imagery_v3.json',
      content: {
        image_url: `https://cdn.satellitevision.example/images/${imagery.id}.tif`,
        metadata: metadata
      }
    },
    provenance: provenance,
    verification: {
      merkle_root: merkleTree.root,
      merkle_proof: merkleTree.getProof(0),
      timestamp_proof: {
        authority: 'ethereum',
        transaction_hash: timestampTx.hash,
        block_number: timestampTx.blockNumber,
        timestamp: timestampTx.timestamp
      },
      signature: {
        algorithm: 'ES256K',
        signer: PROVIDER_DID,
        public_key: PROVIDER_PUBLIC_KEY,
        signature_value: signature
      }
    },
    quality_metrics: qualityMetrics,
    settlement_reference: {
      chain: agreement.settlement.chain,
      escrow_address: agreement.settlement.escrow_address,
      amount: agreement.terms.price
    },
    metadata: {
      timestamp: new Date().toISOString()
    }
  }
}
```

## Step 5: Settlement Monitoring

Provider monitors escrow releases across multiple chains.

### Multi-Chain Settlement Monitor

```typescript
class SettlementMonitor {
  private chains = ['ethereum', 'polygon', 'arbitrum']
  private escrowContracts = {
    ethereum: '0x1234...eth',
    polygon: '0x1234...poly',
    arbitrum: '0x1234...arb'
  }

  async monitorSettlements(): Promise<void> {
    for (const chain of this.chains) {
      const contract = this.escrowContracts[chain]
      const web3 = getWeb3Provider(chain)

      // Listen for escrow release events
      web3.eth.subscribe('logs', {
        address: contract,
        topics: [web3.utils.sha3('EscrowReleased(bytes32,address,uint256)')]
      }, async (error, log) => {
        if (error) {
          console.error(`Error monitoring ${chain}:`, error)
          return
        }

        const agreementHash = log.topics[1]
        const amount = web3.utils.hexToNumber(log.data)

        // Process settlement
        await processSettlement({
          chain,
          agreement_hash: agreementHash,
          amount,
          transaction_hash: log.transactionHash,
          block_number: log.blockNumber
        })
      })
    }
  }

  async processSettlement(settlement: Settlement): Promise<void> {
    // 1. Generate receipt
    const receipt = {
      receipt_id: generateId('receipt'),
      agreement_hash: settlement.agreement_hash,
      settlement: {
        chain: settlement.chain,
        transaction_hash: settlement.transaction_hash,
        block_number: settlement.block_number,
        confirmations: await getConfirmations(settlement.chain, settlement.block_number)
      },
      amount: settlement.amount,
      settled_at: new Date().toISOString()
    }

    // 2. Store receipt
    await db.receipts.insert(receipt)

    // 3. Update provider revenue metrics
    await updateRevenueMetrics({
      chain: settlement.chain,
      amount: settlement.amount,
      timestamp: receipt.settled_at
    })

    // 4. Update consumer history (for future pricing)
    const agreement = await db.agreements.findOne({ hash: settlement.agreement_hash })
    await updateConsumerHistory(agreement.consumer_id, {
      transaction_count: +1,
      total_volume: +settlement.amount
    })

    console.log(`Settlement processed: ${receipt.receipt_id} (${settlement.amount} USDC on ${settlement.chain})`)
  }
}
```

## Step 6: Reputation Management

Provider actively manages reputation to maintain high discovery rank.

### Reputation Strategy

```typescript
class ReputationManager {
  async updateReputation(): Promise<void> {
    const metrics = await calculateMetrics()

    // Update on-chain reputation registry
    await reputationRegistry.update({
      provider: PROVIDER_ADDRESS,
      total_transactions: metrics.total_transactions,
      successful_transactions: metrics.successful_transactions,
      average_response_time_ms: metrics.avg_response_time,
      uptime_30d: metrics.uptime_30d
    })

    // Update capability descriptors with latest reputation
    const descriptor = getCapabilityDescriptor()
    descriptor.provider.reputation = {
      registry: REPUTATION_REGISTRY_ADDRESS,
      score: metrics.composite_score,
      transactions: metrics.total_transactions,
      uptime: metrics.uptime_30d
    }

    // Re-publish to registries
    await publishToRegistries(descriptor)
  }

  private async calculateMetrics(): Promise<Metrics> {
    const transactions = await db.transactions.find({
      timestamp: { $gte: Date.now() - 30 * 24 * 60 * 60 * 1000 }  // Last 30 days
    })

    const successful = transactions.filter(t => t.status === 'completed')
    const disputed = transactions.filter(t => t.status === 'disputed')

    const uptimeRecords = await db.uptime.find({
      timestamp: { $gte: Date.now() - 30 * 24 * 60 * 60 * 1000 }
    })

    const avgResponseTime = transactions.reduce((sum, t) => sum + t.response_time_ms, 0) / transactions.length

    const uptime = uptimeRecords.filter(r => r.status === 'up').length / uptimeRecords.length

    return {
      total_transactions: transactions.length,
      successful_transactions: successful.length,
      disputed_transactions: disputed.length,
      avg_response_time: avgResponseTime,
      uptime_30d: uptime,
      composite_score: this.calculateCompositeScore({
        success_rate: successful.length / transactions.length,
        response_time: avgResponseTime,
        uptime: uptime
      })
    }
  }

  private calculateCompositeScore(metrics: any): number {
    return (
      0.4 * metrics.success_rate * 10 +
      0.3 * (1 - metrics.response_time / 10000) * 10 +  // Normalize to 10s max
      0.3 * metrics.uptime * 10
    )
  }
}
```

## Step 7: Monitoring and Analytics

Provider monitors key metrics for business optimization.

### Analytics Dashboard Metrics

```typescript
interface ProviderMetrics {
  // Revenue metrics
  revenue_24h: number
  revenue_30d: number
  avg_transaction_value: number

  // Volume metrics
  requests_24h: number
  requests_30d: number
  acceptance_rate: number  // Accepted / total requests
  completion_rate: number  // Completed / accepted

  // Performance metrics
  avg_latency_ms: number
  p95_latency_ms: number
  uptime_percentage: number

  // Pricing metrics
  avg_negotiation_rounds: number
  price_discount_avg: number  // How much below base price
  dynamic_pricing_revenue_impact: number  // Extra revenue from dynamic pricing

  // Customer metrics
  unique_consumers: number
  repeat_customers: number
  top_customers: Array<{ did: string, volume: number }>

  // Settlement metrics
  settlement_latency_avg_ms: number
  escrow_release_rate: number
  dispute_rate: number
}
```

## Benefits of LCP Integration for Providers

1. **Automated Monetization**: Machine-to-machine transactions at scale without human sales cycles
2. **Dynamic Pricing**: Optimize revenue based on demand, load, and customer reputation
3. **Guaranteed Payment**: Atomic settlement eliminates non-payment risk
4. **Reputation Building**: Cryptographic proof of service quality builds verifiable track record
5. **Multi-Chain Support**: Flexibility to accept payment on multiple blockchains
6. **Competitive Discovery**: Permissionless listing in multiple registries increases visibility
7. **Trustless Operation**: No dependency on platform intermediaries (no marketplace fees)
8. **Global Reach**: AI agents worldwide can discover and transact autonomously

## Implementation Checklist

- [ ] Create DID and publish DID document
- [ ] Stake provider bond for slashing protection
- [ ] Implement capability descriptor with accurate guarantees
- [ ] Publish to multiple registries (on-chain, DHT, federated)
- [ ] Implement negotiation endpoint with dynamic pricing
- [ ] Implement context delivery with verification proofs (signatures, Merkle trees, timestamps)
- [ ] Implement multi-chain settlement monitoring
- [ ] Set up reputation tracking and updates
- [ ] Configure analytics and monitoring
- [ ] Test end-to-end flow with test agents
- [ ] Security audit (key management, smart contracts)
- [ ] Launch and monitor

---

SatelliteVision is now live on LCP, serving AI agents globally with trustless, verified satellite imagery.
