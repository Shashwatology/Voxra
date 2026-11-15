"""
Guarded Enquiry Service - Operational Cost Estimation Model
Calculates and compares estimated costs per 1,000 parent enquiries across 3 architectural tiers:
1. Pure Local Deterministic Retrieval (Zero API cost)
2. Selective Gemini Classification (Hybrid: only ambiguous / borderline queries routed to LLM)
3. Full Gemini Classification (Every eligible query verified by Gemini)

Pricing Reference Date: November 2026
Model: Google Gemini 2.5 Flash
Official Google Cloud / Vertex AI Pricing:
- Input tokens:  $0.075 per 1,000,000 tokens ($0.000075 / 1k tokens)
- Output tokens: $0.30  per 1,000,000 tokens ($0.00030  / 1k tokens)
"""

import json
from pathlib import Path

def calculate_costs(total_queries: int = 1000):
    print("=" * 72)
    print("  VOXRA / ENQUIRY STUDIO — COST & RELIABILITY PROJECTION")
    print(f"  Volume Basis: {total_queries:,} Parent/Student Enquiries")
    print("  Model Benchmark: Gemini 2.5 Flash (Dated: November 2026)")
    print("=" * 72)

    # Architectural assumptions based on measured payloads
    AVG_QUERY_CHARS = 45
    AVG_INPUT_TOKENS_PER_CALL = 380  # Prompt system instructions + 3 candidates + query
    AVG_OUTPUT_TOKENS_PER_CALL = 45   # Pydantic JSON structure: decision, faq_id, ambiguity, reason
    RETRY_OVERHEAD_PCT = 0.03        # 3% expected transient network retry rate

    INPUT_RATE_PER_MILLION = 0.075   # $0.075 / 1M tokens
    OUTPUT_RATE_PER_MILLION = 0.30   # $0.30 / 1M tokens

    # Architecture 1: Pure Local Deterministic Retrieval (TF-IDF + Cosine Similarity)
    cost_tier_1 = {
        "tier": "Tier 1: Pure Local Retrieval (TF-IDF)",
        "api_calls": 0,
        "input_tokens": 0,
        "output_tokens": 0,
        "api_cost_usd": 0.00,
        "compute_cost_usd": 0.002, # Nominal CPU compute time (~1.5ms per query on shared VPS)
        "total_cost_usd": 0.002,
        "cost_per_query_usd": 0.000002,
        "mean_latency_ms": 1.6,
        "external_api_dependency": "None (100% air-gapped / offline capable)"
    }

    # Architecture 2: Selective Hybrid Gemini Routing (20% borderline/ambiguous queries escalated to Gemini)
    selective_routing_rate = 0.20
    calls_tier_2 = int(total_queries * selective_routing_rate * (1 + RETRY_OVERHEAD_PCT))
    in_tokens_tier_2 = calls_tier_2 * AVG_INPUT_TOKENS_PER_CALL
    out_tokens_tier_2 = calls_tier_2 * AVG_OUTPUT_TOKENS_PER_CALL
    api_cost_tier_2 = (
        (in_tokens_tier_2 / 1_000_000) * INPUT_RATE_PER_MILLION +
        (out_tokens_tier_2 / 1_000_000) * OUTPUT_RATE_PER_MILLION
    )
    cost_tier_2 = {
        "tier": "Tier 2: Selective Hybrid Routing (Recommended)",
        "routing_pct": "20% queries routed to Gemini for disambiguation",
        "api_calls": calls_tier_2,
        "input_tokens": in_tokens_tier_2,
        "output_tokens": out_tokens_tier_2,
        "api_cost_usd": round(api_cost_tier_2, 6),
        "compute_cost_usd": 0.004,
        "total_cost_usd": round(api_cost_tier_2 + 0.004, 5),
        "cost_per_query_usd": round((api_cost_tier_2 + 0.004) / total_queries, 7),
        "mean_latency_ms": 18.5,
        "external_api_dependency": "Selective (Resilient local fallback on API failure)"
    }

    # Architecture 3: Full Gemini Verification (100% queries pass through Gemini classifier)
    calls_tier_3 = int(total_queries * 1.0 * (1 + RETRY_OVERHEAD_PCT))
    in_tokens_tier_3 = calls_tier_3 * AVG_INPUT_TOKENS_PER_CALL
    out_tokens_tier_3 = calls_tier_3 * AVG_OUTPUT_TOKENS_PER_CALL
    api_cost_tier_3 = (
        (in_tokens_tier_3 / 1_000_000) * INPUT_RATE_PER_MILLION +
        (out_tokens_tier_3 / 1_000_000) * OUTPUT_RATE_PER_MILLION
    )
    cost_tier_3 = {
        "tier": "Tier 3: Full Gemini Classification",
        "routing_pct": "100% queries classified via Gemini",
        "api_calls": calls_tier_3,
        "input_tokens": in_tokens_tier_3,
        "output_tokens": out_tokens_tier_3,
        "api_cost_usd": round(api_cost_tier_3, 6),
        "compute_cost_usd": 0.008,
        "total_cost_usd": round(api_cost_tier_3 + 0.008, 5),
        "cost_per_query_usd": round((api_cost_tier_3 + 0.008) / total_queries, 7),
        "mean_latency_ms": 320.0,
        "external_api_dependency": "Full (High network coupling; requires bounded retries)"
    }

    projections = [cost_tier_1, cost_tier_2, cost_tier_3]

    for p in projections:
        print(f"\n{p['tier']}")
        print(f"  API Calls (incl. retries): {p['api_calls']:,}")
        print(f"  Input Tokens:              {p['input_tokens']:,}")
        print(f"  Output Tokens:             {p['output_tokens']:,}")
        print(f"  Direct API Cost (USD):     ${p['api_cost_usd']:.5f}")
        print(f"  Total Estimated Cost:      ${p['total_cost_usd']:.5f} / {total_queries:,} queries")
        print(f"  Cost Per Query:            ${p['cost_per_query_usd']:.7f}")
        print(f"  Estimated Mean Latency:    {p['mean_latency_ms']} ms")
        print(f"  Resilience Profile:        {p['external_api_dependency']}")

    print("\n" + "=" * 72)
    print("  ENGINEERING CONCLUSION:")
    print("  Tier 2 (Selective Hybrid Routing) achieves optimal trade-off:")
    print("  Sub-cent operating cost ($0.012 per 1,000 queries) with zero-cost")
    print("  local fallback, preserving low latency and safety invariants.")
    print("=" * 72)

    # Save to results/cost_projections.json
    results_dir = Path(__file__).resolve().parent.parent / "results"
    results_dir.mkdir(parents=True, exist_ok=True)
    with open(results_dir / "cost_projections.json", "w", encoding="utf-8") as f:
        json.dump(projections, f, indent=2)

if __name__ == "__main__":
    calculate_costs(1000)
