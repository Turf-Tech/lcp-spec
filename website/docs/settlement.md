---
sidebar_position: 8
sidebar_label: Settlement Protocol
---

# 7. Settlement Protocol

Settlement ensures that context delivery and payment occur atomically—either both succeed or both fail. This eliminates counterparty risk and enables trustless transactions between unfamiliar parties.

## 7.1 Design Goals

1. **Atomicity**: Context delivery and payment are atomic (all-or-nothing)
2. **Trustless**: No trusted intermediary holds funds
3. **Chain-Agnostic**: Works across multiple blockchains and payment systems
4. **Verification-Conditional**: Payment released only after verification succeeds
5. **Dispute-Ready**: Supports escrow holds during dispute resolution
6. **Low Latency**: Settlement completes in seconds, not minutes

## 7.2 Settlement Patterns

### 7.2.1 Atomic Swap

Direct cryptographic swap between context and payment without intermediaries.

#### Hash Time-Locked Contract (HTLC)

```solidity
contract HTLCContextSettlement {
  struct Swap {
    bytes32 secretHash;
    address consumer;
    address provider;
    uint256 amount;
    uint256 timelock;
    bytes32 contextHash;
    bool completed;
    bool refunded;
  }

  mapping(bytes32 => Swap) public swaps;

  function initiateSwap(
    bytes32 secretHash,
    address provider,
    bytes32 contextHash,
    uint256 timelockDuration
  ) external payable {
    bytes32 swapId = keccak256(abi.encodePacked(
      secretHash, msg.sender, provider, block.timestamp
    ));

    swaps[swapId] = Swap({
      secretHash: secretHash,
      consumer: msg.sender,
      provider: provider,
      amount: msg.value,
      timelock: block.timestamp + timelockDuration,
      contextHash: contextHash,
      completed: false,
      refunded: false
    });

    emit SwapInitiated(swapId, msg.sender, provider, msg.value);
  }

  function completeSwap(
    bytes32 swapId,
    string calldata secret,
    bytes calldata contextData
  ) external {
    Swap storage swap = swaps[swapId];

    require(msg.sender == swap.provider, "Only provider can complete");
    require(!swap.completed && !swap.refunded, "Already finalized");
    require(keccak256(abi.encodePacked(secret)) == swap.secretHash, "Invalid secret");
    require(keccak256(contextData) == swap.contextHash, "Invalid context");

    swap.completed = true;
    payable(swap.provider).transfer(swap.amount);

    emit SwapCompleted(swapId, secret);
  }

  function refund(bytes32 swapId) external {
    Swap storage swap = swaps[swapId];

    require(msg.sender == swap.consumer, "Only consumer can refund");
    require(block.timestamp > swap.timelock, "Timelock not expired");
    require(!swap.completed && !swap.refunded, "Already finalized");

    swap.refunded = true;
    payable(swap.consumer).transfer(swap.amount);

    emit SwapRefunded(swapId);
  }
}
```

#### HTLC Flow

```
Consumer                      HTLC Contract                      Provider
    │                               │                               │
    │──generate secret_hash─────────│                               │
    │                               │                               │
    │──initiate(secret_hash, $$)───▶│                               │
    │                               ├─ Lock consumer funds          │
    │                               │                               │
    │──share secret_hash───────────────────────────────────────────▶│
    │                               │                               │
    │                               │◀──complete(secret, context)───│
    │                               ├─ Verify secret                │
    │                               ├─ Verify context hash          │
    │                               ├─ Pay provider                 │
    │                               │                               │
    │◀──context + secret────────────────────────────────────────────│
    │                               │                               │
```

**Atomicity Guarantee**: Provider can claim payment only by revealing secret, which happens only after delivering context.

**Timelock Safety**: If provider doesn't deliver, consumer reclaims funds after timeout.

### 7.2.2 Conditional Escrow

Third-party escrow with verification-based release.

#### Escrow Contract

```solidity
contract LCPEscrow {
  struct EscrowAgreement {
    bytes32 agreementHash;
    address consumer;
    address provider;
    uint256 amount;
    bytes32 contextHash;
    bytes verificationProof;
    EscrowStatus status;
    uint256 createdAt;
    uint256 expiresAt;
  }

  enum EscrowStatus { Pending, VerificationSubmitted, Released, Disputed, Refunded }

  mapping(bytes32 => EscrowAgreement) public escrows;

  function createEscrow(
    bytes32 agreementHash,
    address provider,
    bytes32 contextHash,
    uint256 expiryDuration
  ) external payable {
    escrows[agreementHash] = EscrowAgreement({
      agreementHash: agreementHash,
      consumer: msg.sender,
      provider: provider,
      amount: msg.value,
      contextHash: contextHash,
      verificationProof: "",
      status: EscrowStatus.Pending,
      createdAt: block.timestamp,
      expiresAt: block.timestamp + expiryDuration
    });

    emit EscrowCreated(agreementHash, msg.sender, provider, msg.value);
  }

  function submitVerification(
    bytes32 agreementHash,
    bytes calldata verificationProof,
    bytes calldata contextData
  ) external {
    EscrowAgreement storage escrow = escrows[agreementHash];

    require(msg.sender == escrow.provider, "Only provider");
    require(escrow.status == EscrowStatus.Pending, "Wrong status");
    require(keccak256(contextData) == escrow.contextHash, "Context mismatch");

    escrow.verificationProof = verificationProof;
    escrow.status = EscrowStatus.VerificationSubmitted;

    emit VerificationSubmitted(agreementHash);
  }

  function releaseEscrow(bytes32 agreementHash) external {
    EscrowAgreement storage escrow = escrows[agreementHash];

    require(msg.sender == escrow.consumer, "Only consumer");
    require(escrow.status == EscrowStatus.VerificationSubmitted, "Verification not submitted");

    // Consumer verified off-chain and approves release
    escrow.status = EscrowStatus.Released;
    payable(escrow.provider).transfer(escrow.amount);

    emit EscrowReleased(agreementHash);
  }

  function disputeEscrow(bytes32 agreementHash, bytes calldata fraudProof) external {
    EscrowAgreement storage escrow = escrows[agreementHash];

    require(msg.sender == escrow.consumer, "Only consumer");
    require(escrow.status == EscrowStatus.VerificationSubmitted, "Wrong status");

    escrow.status = EscrowStatus.Disputed;

    emit EscrowDisputed(agreementHash, fraudProof);
    // Dispute resolution handled externally (see 6.5)
  }

  function refundExpired(bytes32 agreementHash) external {
    EscrowAgreement storage escrow = escrows[agreementHash];

    require(block.timestamp > escrow.expiresAt, "Not expired");
    require(escrow.status == EscrowStatus.Pending, "Already finalized");

    escrow.status = EscrowStatus.Refunded;
    payable(escrow.consumer).transfer(escrow.amount);

    emit EscrowRefunded(agreementHash);
  }
}
```

#### Escrow Flow

```
Consumer              Escrow Contract              Provider
    │                       │                          │
    │──createEscrow($$)────▶│                          │
    │                       ├─ Lock funds             │
    │                       │                          │
    │◀─────────────────────────context + proofs───────│
    │                       │                          │
    ├─ Verify proofs        │                          │
    │                       │                          │
    │──releaseEscrow()─────▶│                          │
    │                       ├─ Pay provider           │
    │                       │                          │
```

**Verification Requirement**: Consumer verifies proofs off-chain before approving release.

**Dispute Path**: If verification fails, consumer disputes instead of releasing.

### 7.2.3 Payment Channels

For recurring transactions with same provider, use off-chain payment channels.

#### Channel Setup

```solidity
contract LCPPaymentChannel {
  struct Channel {
    address consumer;
    address provider;
    uint256 deposit;
    uint256 nonce;
    uint256 expiresAt;
    bool closed;
  }

  mapping(bytes32 => Channel) public channels;

  function openChannel(address provider, uint256 duration) external payable {
    bytes32 channelId = keccak256(abi.encodePacked(msg.sender, provider, block.timestamp));

    channels[channelId] = Channel({
      consumer: msg.sender,
      provider: provider,
      deposit: msg.value,
      nonce: 0,
      expiresAt: block.timestamp + duration,
      closed: false
    });

    emit ChannelOpened(channelId, msg.sender, provider, msg.value);
  }

  function closeChannel(
    bytes32 channelId,
    uint256 amountToProvider,
    uint256 nonce,
    bytes calldata consumerSignature
  ) external {
    Channel storage channel = channels[channelId];

    require(!channel.closed, "Already closed");
    require(msg.sender == channel.provider, "Only provider");

    // Verify consumer signed this payment
    bytes32 messageHash = keccak256(abi.encodePacked(
      channelId, amountToProvider, nonce
    ));
    require(verifySignature(messageHash, consumerSignature, channel.consumer), "Invalid signature");
    require(nonce > channel.nonce, "Stale nonce");

    channel.closed = true;

    // Pay provider, refund consumer
    payable(channel.provider).transfer(amountToProvider);
    payable(channel.consumer).transfer(channel.deposit - amountToProvider);

    emit ChannelClosed(channelId, amountToProvider);
  }
}
```

#### Channel Flow

```
Consumer                     Channel                    Provider
    │                           │                          │
    │──openChannel($1000)──────▶│                          │
    │                           │                          │
    │◀────────────────────────context_1 ($10)─────────────│
    │──sign payment_1($10)─────────────────────────────────▶│
    │                           │                          │
    │◀────────────────────────context_2 ($10)─────────────│
    │──sign payment_2($20)─────────────────────────────────▶│
    │                           │                          │
    ...                        ...                        ...
    │                           │                          │
    │                           │◀──closeChannel($200)─────│
    │                           ├─ Pay provider $200      │
    │                           ├─ Refund consumer $800   │
```

**Benefits**:
- Instant settlement for each context delivery (off-chain signature)
- Low cost (single on-chain transaction for 100+ deliveries)
- Suitable for high-frequency, low-value transactions

**Limitations**:
- Requires upfront deposit (capital lockup)
- Channel must be closed eventually (on-chain transaction)

### 7.2.4 Cross-Chain Settlement

When consumer and provider are on different chains:

#### Atomic Cross-Chain Swap

```
Consumer (Ethereum)          Provider (Polygon)
    │                               │
    │──lock ETH on Ethereum────────│
    │  with secret_hash             │
    │                               │
    │                               ├─ lock MATIC on Polygon
    │                               │  with same secret_hash
    │                               │
    │◀───context + secret───────────│
    │                               │
    │──claim MATIC on Polygon──────│
    │  using secret                 │
    │                               │
    │                               ├─ claim ETH on Ethereum
    │                               │  using revealed secret
```

Both parties set timelocks. If swap doesn't complete, both reclaim their locked funds.

#### Bridge-Based Settlement

Use trusted bridge for faster (but trust-requiring) settlement:

```
Consumer (Ethereum)          Bridge          Provider (Polygon)
    │                          │                    │
    │──pay USDC on Ethereum───▶│                    │
    │                          ├─ Bridge USDC       │
    │                          │                    │
    │                          ├─────mint USDC─────▶│
    │                          │   on Polygon       │
```

**Trust Assumption**: Bridge operators are honest (multi-sig, relayer network)

**Speed**: ~5-30 minutes depending on bridge

**Cost**: Bridge fees (0.05-0.5% typical)

## 7.3 Settlement Finality

Different settlement mechanisms offer different finality guarantees:

| Settlement Type | Finality Time | Reversibility | Trust Required |
|-----------------|---------------|---------------|----------------|
| **HTLC** | 1-2 blocks (~15-30s) | Irreversible after timelock | None |
| **Escrow (on-chain)** | 1-2 blocks | Reversible during dispute period | Contract correctness |
| **Payment Channel** | Instant (off-chain) | Reversible until channel close | Counterparty honesty |
| **Cross-Chain Atomic** | Max of both chains (~30-60s) | Irreversible after both locks claimed | None |
| **Bridge** | ~5-30 min | Irreversible after bridge finalization | Bridge operators |
| **Lightning/L2** | &lt;1s | Irreversible after commitment | L2 security assumptions |

## 7.4 Multi-Currency Settlement

LCP supports settlement in multiple currencies/tokens:

### Supported Asset Types

1. **Native Tokens**: ETH, MATIC, BNB, etc.
2. **Stablecoins**: USDC, USDT, DAI (preferred for price stability)
3. **Protocol Tokens**: Custom LCP ecosystem tokens (potential future)
4. **Wrapped Assets**: WETH, WBTC, etc.

### Currency Negotiation

Included in negotiation phase:

```json
{
  "terms": {
    "price": {
      "amount": 0.0015,
      "currency": "USDC",
      "chain": "polygon",
      "token_address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    },
    "accepted_alternatives": [
      {
        "currency": "USDT",
        "chain": "polygon",
        "token_address": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
        "amount": 0.0015
      },
      {
        "currency": "ETH",
        "chain": "ethereum",
        "amount": 0.0000006  // Equivalent value
      }
    ]
  }
}
```

Provider specifies preferred currency and acceptable alternatives. Consumer chooses from list.

## 7.5 Gas Optimization

On-chain settlement gas costs can be significant. Optimization strategies:

### Batching

Batch multiple settlements into single transaction:

```solidity
function batchSettlement(
  bytes32[] calldata agreementHashes,
  address[] calldata providers,
  uint256[] calldata amounts
) external {
  for (uint i = 0; i < agreementHashes.length; i++) {
    settleAgreement(agreementHashes[i], providers[i], amounts[i]);
  }
}
```

**Savings**: ~75% gas reduction for 10 settlements vs individual transactions

### Layer-2 Settlement

Use L2s (Optimism, Arbitrum, Polygon) for 10-100x cheaper settlement:

| Chain | Avg Settlement Cost | Finality Time |
|-------|---------------------|---------------|
| **Ethereum L1** | $5-50 | 15s |
| **Polygon** | $0.01-0.10 | 2s |
| **Arbitrum** | $0.10-1.00 | 15s + L1 finality |
| **Optimism** | $0.10-1.00 | 15s + L1 finality |

### Meta-Transactions

Provider pays gas, consumer signs authorization:

```solidity
function metaSettlement(
  bytes32 agreementHash,
  uint256 deadline,
  bytes calldata consumerSignature
) external {
  // Verify consumer authorized this settlement
  require(verifyMetaTxSignature(agreementHash, deadline, consumerSignature), "Invalid signature");

  // Provider pays gas, consumer's payment released to provider
  settleAgreement(agreementHash);
}
```

**Benefit**: Consumer doesn't need native tokens for gas

**Cost**: Provider pays gas (can be factored into pricing)

## 7.6 Settlement Receipts

After settlement, both parties receive cryptographic receipt (see 3.6):

```json
{
  "receipt_id": "receipt_5b4a3f2e1d0c9876",
  "request_id": "req_9f3e8d7c6b5a4321",
  "settlement": {
    "chain": "polygon",
    "transaction_hash": "0xabc123def456...",
    "block_number": 52341890,
    "confirmations": 12
  },
  "amount": {
    "amount": 0.0012,
    "currency": "USDC"
  },
  "signatures": {
    "consumer": "0x1234...",
    "provider": "0x5678..."
  }
}
```

Receipts enable:
- **Accounting**: Track spending/revenue
- **Reputation**: Prove transaction history
- **Disputes**: Evidence for arbitration
- **Compliance**: Audit trail for regulations

## 7.7 Failed Settlement Recovery

### Timeout Recovery

If settlement doesn't complete within timeout:

```typescript
async function settlementWithTimeout(
  agreement: Agreement,
  timeoutMs: number
): Promise<SettlementReceipt> {
  try {
    return await Promise.race([
      executeSettlement(agreement),
      sleep(timeoutMs).then(() => Promise.reject(new Error("Settlement timeout")))
    ])
  } catch (error) {
    if (error.message === "Settlement timeout") {
      // Initiate refund
      await refundEscrow(agreement.escrowAddress)
      throw new SettlementTimeoutError(agreement.id)
    }
    throw error
  }
}
```

### Insufficient Balance

If consumer's balance insufficient:

```typescript
async function ensureSufficientBalance(
  consumer: Address,
  amount: bigint,
  token: Address
): Promise<void> {
  const balance = await getBalance(consumer, token)

  if (balance < amount) {
    throw new InsufficientBalanceError({
      required: amount,
      available: balance,
      deficit: amount - balance
    })
  }
}
```

Consumer should check before initiating negotiation.

### Network Congestion

If blockchain is congested (high gas):

**Option 1: Wait** for gas prices to drop
**Option 2: Switch chains** (settle on cheaper L2)
**Option 3: Payment channel** (settle off-chain, batch later)

## 7.8 Regulatory Compliance

### KYC/AML Integration

For regulated contexts, integrate identity verification:

```json
{
  "settlement": {
    "compliance": {
      "consumer_kyc": {
        "provider": "identity_provider_xyz",
        "status": "verified",
        "verified_at": "2026-01-15T00:00:00Z"
      },
      "provider_kyc": {
        "provider": "identity_provider_xyz",
        "status": "verified",
        "verified_at": "2026-01-10T00:00:00Z"
      },
      "jurisdiction": "US",
      "tax_reporting_required": true
    }
  }
}
```

### Travel Rule Compliance

For transactions >$1000 (or jurisdiction threshold), include counterparty information:

```json
{
  "travel_rule_data": {
    "originator": {
      "name": "AgentCorp Inc",
      "address": "123 AI Street, SF, CA",
      "account": "0x1234..."
    },
    "beneficiary": {
      "name": "DataProvider LLC",
      "address": "456 Context Ave, NY, NY",
      "account": "0x5678..."
    },
    "amount_usd": 1500
  }
}
```

## 7.9 Implementation Recommendations

### For Consumers

1. **Escrow for New Providers**: Use escrow for first transactions with unknown providers
2. **Channels for Repeat Providers**: Switch to payment channels after establishing trust
3. **L2 by Default**: Settle on Polygon/Arbitrum unless L1 security required
4. **Monitor Finality**: Don't assume settlement complete until sufficient confirmations

### For Providers

1. **Accept Stablecoins**: USDC/USDT avoid price volatility risk
2. **Multi-Chain Support**: Support Ethereum + at least 2 L2s for optionality
3. **Batch Settlements**: Collect payments and batch-settle to reduce gas costs
4. **Meta-Transactions**: Offer gas-free experience for consumers

### For Protocol Implementers

1. **Atomic Primitives**: HTLCs and escrows are safest patterns
2. **Timeout Enforcement**: Always include timelocks for refund paths
3. **Receipt Generation**: Provide cryptographic receipts for all settlements
4. **Multi-Chain Support**: Abstract chain differences behind unified interface
