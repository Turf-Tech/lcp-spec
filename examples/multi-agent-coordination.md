# Example: Multi-Agent Coordination

This example demonstrates how multiple AI agents coordinate to aggregate context from different providers for a complex analysis task.

## Scenario

**Task**: Supply chain risk analysis requiring data from multiple sources
**Agents**:
- Lead Agent (Coordinator): `did:example:supply-chain-analyzer`
- Sub-Agent A (Logistics): `did:example:logistics-agent`
- Sub-Agent B (Finance): `did:example:finance-agent`

**Providers**:
- Shipping Data Corp: Real-time shipping and port data
- Financial Data Corp: Currency rates and commodity prices
- Weather Service: Weather forecasts affecting logistics

**Goal**: Aggregate data from all sources, perform analysis, produce risk report

## Architecture Pattern

```
Lead Agent (Coordinator)
    │
    ├─ Sub-Agent A (Logistics)
    │   ├─ Query Shipping Data Corp
    │   └─ Query Weather Service
    │
    └─ Sub-Agent B (Finance)
        └─ Query Financial Data Corp

All results flow back to Lead Agent for aggregation
```

## Step 1: Lead Agent Delegates Tasks

Lead agent uses A2A protocol to negotiate with sub-agents.

### Task Delegation (A2A)

```json
{
  "a2a_delegation": {
    "from": "did:example:supply-chain-analyzer",
    "to": ["did:example:logistics-agent", "did:example:finance-agent"],
    "task": {
      "type": "data_collection",
      "deadline": "2026-01-29T12:35:00Z",
      "budget": {
        "total": 0.010,
        "currency": "USDC",
        "allocation": {
          "logistics": 0.006,
          "finance": 0.004
        }
      }
    },
    "requirements": {
      "logistics": {
        "data_needed": ["shipping_delays", "port_congestion", "weather_forecasts"],
        "time_range": "next_7_days"
      },
      "finance": {
        "data_needed": ["usd_cny_rate", "steel_prices", "fuel_prices"],
        "freshness": "realtime"
      }
    }
  }
}
```

## Step 2: Sub-Agent A Discovers Logistics Providers

Sub-Agent A queries LCP registry for shipping and weather data.

### Discovery Query

```json
{
  "filters": {
    "capability_type": ["shipping_data", "weather_forecast"],
    "coverage": {
      "regions": ["pacific", "asia"]
    },
    "max_price": {
      "amount": 0.003,
      "currency": "USDC"
    }
  }
}
```

### Discovery Results

```json
{
  "results": [
    {
      "provider": {
        "id": "did:example:shipping-data-corp",
        "name": "Shipping Data Corp"
      },
      "capability_id": "cap_shipping_delays",
      "pricing": {"base_price": {"amount": 0.002, "currency": "USDC"}}
    },
    {
      "provider": {
        "id": "did:example:weather-service",
        "name": "Global Weather Service"
      },
      "capability_id": "cap_marine_weather",
      "pricing": {"base_price": {"amount": 0.001, "currency": "USDC"}}
    }
  ]
}
```

## Step 3: Parallel LCP Transactions

Sub-agents execute LCP transactions in parallel.

### Sub-Agent A: Transaction 1 (Shipping Data)

```json
{
  "request": {
    "request_id": "req_logistics_shipping_001",
    "consumer": {"id": "did:example:logistics-agent"},
    "capability_id": "cap_shipping_delays",
    "parameters": {
      "routes": ["shanghai_to_la", "shenzhen_to_rotterdam"],
      "forecast_days": 7
    },
    "terms": {
      "max_price": {"amount": 0.002, "currency": "USDC"}
    }
  },
  "response": {
    "data": {
      "content": {
        "routes": [
          {
            "route": "shanghai_to_la",
            "normal_duration_days": 14,
            "current_delay_days": 2,
            "congestion_level": "moderate",
            "causes": ["port_congestion_la", "weather_delay_pacific"]
          },
          {
            "route": "shenzhen_to_rotterdam",
            "normal_duration_days": 21,
            "current_delay_days": 0,
            "congestion_level": "low"
          }
        ]
      }
    },
    "settlement": {
      "chain": "polygon",
      "transaction_hash": "0xabc001...",
      "amount": 0.002
    }
  }
}
```

### Sub-Agent A: Transaction 2 (Weather Data)

```json
{
  "request": {
    "request_id": "req_logistics_weather_002",
    "consumer": {"id": "did:example:logistics-agent"},
    "capability_id": "cap_marine_weather",
    "parameters": {
      "regions": ["north_pacific", "indian_ocean"],
      "forecast_days": 7,
      "severity_threshold": "moderate"
    },
    "terms": {
      "max_price": {"amount": 0.001, "currency": "USDC"}
    }
  },
  "response": {
    "data": {
      "content": {
        "forecasts": [
          {
            "region": "north_pacific",
            "days": [
              {
                "date": "2026-01-30",
                "conditions": "storm",
                "severity": "high",
                "impact": "shipping_delays_likely"
              }
            ]
          }
        ]
      }
    },
    "settlement": {
      "chain": "polygon",
      "transaction_hash": "0xabc002...",
      "amount": 0.001
    }
  }
}
```

### Sub-Agent B: Transaction 3 (Financial Data)

```json
{
  "request": {
    "request_id": "req_finance_rates_003",
    "consumer": {"id": "did:example:finance-agent"},
    "capability_id": "cap_realtime_forex_commodities",
    "parameters": {
      "forex_pairs": ["USD/CNY"],
      "commodities": ["steel", "crude_oil"],
      "fields": ["current_price", "1d_change", "7d_trend"]
    },
    "terms": {
      "max_price": {"amount": 0.004, "currency": "USDC"}
    }
  },
  "response": {
    "data": {
      "content": {
        "forex": {
          "USD/CNY": {
            "rate": 7.24,
            "1d_change": +0.003,
            "7d_trend": "stable"
          }
        },
        "commodities": {
          "steel": {
            "price_per_ton": 850,
            "1d_change": +12,
            "7d_trend": "increasing"
          },
          "crude_oil": {
            "price_per_barrel": 78.50,
            "1d_change": -0.50,
            "7d_trend": "decreasing"
          }
        }
      }
    },
    "settlement": {
      "chain": "polygon",
      "transaction_hash": "0xabc003...",
      "amount": 0.0035  // Negotiated down
    }
  }
}
```

## Step 4: Sub-Agents Report Back

Sub-agents send aggregated results to lead agent via A2A.

### Logistics Report (Sub-Agent A → Lead Agent)

```json
{
  "a2a_response": {
    "from": "did:example:logistics-agent",
    "to": "did:example:supply-chain-analyzer",
    "task_id": "task_logistics",
    "status": "completed",
    "data": {
      "shipping_status": {
        "shanghai_to_la": {
          "delay_days": 2,
          "severity": "moderate",
          "causes": ["port_congestion", "weather"]
        },
        "shenzhen_to_rotterdam": {
          "delay_days": 0,
          "severity": "low"
        }
      },
      "weather_risks": {
        "north_pacific_storm": {
          "date": "2026-01-30",
          "severity": "high",
          "impact": "additional 1-2 day delays likely"
        }
      }
    },
    "cost_breakdown": {
      "shipping_data": 0.002,
      "weather_data": 0.001,
      "total": 0.003
    },
    "verification": {
      "all_proofs_verified": true,
      "lcp_receipts": ["receipt_001", "receipt_002"]
    }
  }
}
```

### Finance Report (Sub-Agent B → Lead Agent)

```json
{
  "a2a_response": {
    "from": "did:example:finance-agent",
    "to": "did:example:supply-chain-analyzer",
    "task_id": "task_finance",
    "status": "completed",
    "data": {
      "currency_risk": {
        "usd_cny_rate": 7.24,
        "trend": "stable",
        "risk_level": "low"
      },
      "commodity_prices": {
        "steel": {
          "price_trend": "increasing",
          "impact": "higher material costs expected"
        },
        "fuel": {
          "price_trend": "decreasing",
          "impact": "lower shipping costs expected"
        }
      }
    },
    "cost_breakdown": {
      "financial_data": 0.0035,
      "total": 0.0035
    },
    "verification": {
      "all_proofs_verified": true,
      "lcp_receipts": ["receipt_003"]
    }
  }
}
```

## Step 5: Lead Agent Aggregates and Analyzes

Lead agent combines all data to produce final analysis.

### Aggregated Analysis

```json
{
  "supply_chain_risk_report": {
    "report_id": "risk_report_29jan2026",
    "generated_at": "2026-01-29T12:32:45Z",
    "time_horizon": "next_7_days",
    "overall_risk_level": "moderate",
    "risk_factors": [
      {
        "factor": "shipping_delays",
        "severity": "moderate",
        "details": "Shanghai-LA route experiencing 2-day delays due to port congestion and weather. North Pacific storm on Jan 30 may add 1-2 additional days.",
        "financial_impact_usd": 50000,
        "mitigation": "Consider alternative routing via Shenzhen-Rotterdam (currently no delays)"
      },
      {
        "factor": "material_costs",
        "severity": "low-moderate",
        "details": "Steel prices increasing (+$12/ton), but fuel prices decreasing (-$0.50/barrel)",
        "financial_impact_usd": 15000,
        "mitigation": "Lock in steel contracts now; benefit from lower fuel costs"
      },
      {
        "factor": "currency_fluctuation",
        "severity": "low",
        "details": "USD/CNY stable at 7.24",
        "financial_impact_usd": 0,
        "mitigation": "No immediate action needed"
      }
    ],
    "recommended_actions": [
      "Reroute 30% of shipments to Shenzhen-Rotterdam to avoid Shanghai delays",
      "Accelerate steel procurement before prices rise further",
      "Monitor North Pacific storm progression for potential rerouting"
    ],
    "total_estimated_impact_usd": 65000,
    "confidence_level": 0.87,
    "data_sources": {
      "shipping": "Shipping Data Corp (verified)",
      "weather": "Global Weather Service (verified)",
      "financial": "Financial Data Corp (verified)"
    },
    "provenance": {
      "lead_agent": "did:example:supply-chain-analyzer",
      "sub_agents": [
        "did:example:logistics-agent",
        "did:example:finance-agent"
      ],
      "lcp_transactions": ["receipt_001", "receipt_002", "receipt_003"],
      "total_cost_usd": 0.0065,
      "all_verifications_passed": true
    }
  }
}
```

## Step 6: Settlement Summary

All LCP transactions are settled atomically on Polygon.

### Total Costs

| Transaction | Provider | Amount | Settlement Hash | Status |
|------------|----------|--------|-----------------|--------|
| Shipping Data | Shipping Data Corp | 0.002 USDC | 0xabc001... | Finalized |
| Weather Data | Weather Service | 0.001 USDC | 0xabc002... | Finalized |
| Financial Data | Financial Data Corp | 0.0035 USDC | 0xabc003... | Finalized |
| **Total** | | **0.0065 USDC** | | |

**Budget**: 0.010 USDC allocated
**Actual**: 0.0065 USDC spent
**Savings**: 0.0035 USDC (35%)

## Benefits of Multi-Agent LCP Coordination

1. **Parallel Execution**: Sub-agents query providers simultaneously, reducing total latency from ~30s (sequential) to ~10s (parallel)

2. **Cost Optimization**: Sub-agents negotiate independently, achieving 35% savings vs initial budget

3. **Distributed Verification**: Each sub-agent verifies their provider's data, distributing verification workload

4. **Composable Trust**: Lead agent trusts sub-agents' verification work (all cryptographic proofs are preserved and can be re-verified)

5. **Failure Isolation**: If one provider fails, other sub-agents continue, allowing partial analysis

6. **Atomic Settlement**: All payments settle on-chain with cryptographic receipts, enabling audit trail

## Integration with A2A

This example shows how LCP and A2A complement each other:

- **A2A**: Handles agent-to-agent coordination (task delegation, result aggregation)
- **LCP**: Handles agent-to-provider transactions (discovery, negotiation, verification, settlement)

The combination enables complex multi-agent workflows with trustless context provisioning.
