"""
Guarded Enquiry Service - Official Benchmark Evaluation Script
Executes the fixed 20-question evaluation benchmark against the real engine,
calculates rigorous safety and performance metrics, and outputs reproducible JSON/CSV artifacts.
"""

import asyncio
import csv
from datetime import datetime, timezone
import json
from pathlib import Path
import sys
import numpy as np

# Ensure backend root is on sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.app.core.config import settings
from backend.app.models.request import AskRequest
from backend.app.services.answer_service import answer_service

async def run_evaluation():
    print("=" * 70)
    print("  VOXRA / ENQUIRY STUDIO — OFFICIAL BENCHMARK EVALUATION")
    print(f"  Timestamp: {datetime.now(timezone.utc).isoformat()}")
    print(f"  AI Mode:   {settings.AI_MODE}")
    print(f"  Model:     {settings.GEMINI_MODEL if settings.AI_MODE == 'hybrid' else 'Local Deterministic TF-IDF'}")
    print("=" * 70)

    eval_path = settings.EVALUATION_SET_PATH
    if not eval_path.exists():
        print(f"[!] Evaluation dataset missing: {eval_path}")
        sys.exit(1)

    with open(eval_path, "r", encoding="utf-8") as f:
        eval_data = json.load(f)

    questions = eval_data.get("questions", [])
    print(f"[*] Loaded {len(questions)} evaluation questions from {eval_path.name}\n")

    results = []
    latencies = []
    answerable_correct = 0
    answerable_total = 0
    escalation_correct = 0
    escalation_total = 0
    false_answers = 0

    category_stats = {}

    for idx, item in enumerate(questions, start=1):
        q_id = item["id"]
        query = item["question"]
        expected_action = item["expected_action"]
        expected_faq_id = item.get("expected_faq_id")
        category = item.get("category", "General")

        if category not in category_stats:
            category_stats[category] = {"total": 0, "correct": 0}
        category_stats[category]["total"] += 1

        if expected_action == "ANSWER":
            answerable_total += 1
        else:
            escalation_total += 1

        req = AskRequest(question=query)
        res = await answer_service.process_question(req)

        latencies.append(res.latency_ms)

        # Correctness evaluation
        is_passed = False
        if expected_action == "ANSWER":
            # Must be answered and match expected FAQ ID
            if res.status == "answered" and res.faq_id == expected_faq_id:
                is_passed = True
                answerable_correct += 1
                category_stats[category]["correct"] += 1
            else:
                is_passed = False
        elif expected_action == "ESCALATE":
            # Must be escalated and return no answer
            if res.status == "escalated" and res.answer is None and res.faq_id is None:
                is_passed = True
                escalation_correct += 1
                category_stats[category]["correct"] += 1
            else:
                is_passed = False
                false_answers += 1

        result_row = {
            "id": q_id,
            "question": query,
            "category": category,
            "test_type": item.get("test_type", "general"),
            "expected_action": expected_action,
            "expected_faq_id": expected_faq_id,
            "actual_status": res.status,
            "actual_faq_id": res.faq_id,
            "actual_reason": res.reason,
            "passed": is_passed,
            "latency_ms": res.latency_ms,
            "confidence": res.confidence
        }
        results.append(result_row)

        mark = "✓ PASS" if is_passed else "✗ FAIL"
        outcome_detail = f"FAQ={res.faq_id}" if res.status == "answered" else f"Reason={res.reason}"
        print(f"  [{q_id}] {mark:<6} | Expected: {expected_action:<8} | Actual: {res.status:<9} | {outcome_detail:<30} | {res.latency_ms:6.2f}ms")

    # Metrics computation
    ans_accuracy = (answerable_correct / answerable_total) if answerable_total > 0 else 0.0
    esc_accuracy = (escalation_correct / escalation_total) if escalation_total > 0 else 0.0
    false_ans_rate = (false_answers / escalation_total) if escalation_total > 0 else 0.0
    overall_accuracy = ((answerable_correct + escalation_correct) / len(questions)) if questions else 0.0

    mean_lat = float(np.mean(latencies))
    median_lat = float(np.median(latencies))
    p95_lat = float(np.percentile(latencies, 95))
    min_lat = float(np.min(latencies))
    max_lat = float(np.max(latencies))

    summary = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "ai_mode": settings.AI_MODE,
        "model": settings.GEMINI_MODEL if settings.AI_MODE == "hybrid" else "local_tfidf",
        "total_questions": len(questions),
        "answerable_count": answerable_total,
        "escalation_count": escalation_total,
        "overall_accuracy": round(overall_accuracy, 4),
        "overall_accuracy_pct": round(overall_accuracy * 100.0, 2),
        "answer_accuracy": round(ans_accuracy, 4),
        "answer_accuracy_pct": round(ans_accuracy * 100.0, 2),
        "escalation_accuracy": round(esc_accuracy, 4),
        "escalation_accuracy_pct": round(esc_accuracy * 100.0, 2),
        "false_answer_rate": round(false_ans_rate, 4),
        "false_answer_rate_pct": round(false_ans_rate * 100.0, 2),
        "latency_metrics": {
            "mean_ms": round(mean_lat, 2),
            "median_ms": round(median_lat, 2),
            "p95_ms": round(p95_lat, 2),
            "min_ms": round(min_lat, 2),
            "max_ms": round(max_lat, 2)
        },
        "category_breakdown": {
            cat: {
                "total": data["total"],
                "correct": data["correct"],
                "accuracy_pct": round((data["correct"] / data["total"] * 100.0), 1)
            }
            for cat, data in category_stats.items()
        }
    }

    print("\n" + "=" * 70)
    print("  BENCHMARK SUMMARY RESULTS")
    print("=" * 70)
    print(f"  Overall Accuracy:      {summary['overall_accuracy_pct']}% ({answerable_correct + escalation_correct}/{len(questions)})")
    print(f"  Answer Accuracy:       {summary['answer_accuracy_pct']}% ({answerable_correct}/{answerable_total})")
    print(f"  Escalation Accuracy:   {summary['escalation_accuracy_pct']}% ({escalation_correct}/{escalation_total})")
    print(f"  False Answer Rate:     {summary['false_answer_rate_pct']}% ({false_answers}/{escalation_total})")
    print(f"  Mean Latency:          {summary['latency_metrics']['mean_ms']} ms")
    print(f"  Median Latency:        {summary['latency_metrics']['median_ms']} ms")
    print(f"  P95 Latency:           {summary['latency_metrics']['p95_ms']} ms")
    print("=" * 70)

    # Save artifacts to results/ directory
    settings.RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. results/evaluation_results.json
    with open(settings.EVALUATION_RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    # 2. results/evaluation_summary.json
    with open(settings.EVALUATION_SUMMARY_PATH, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    # 3. results/evaluation_results.csv
    csv_path = settings.RESULTS_DIR / "evaluation_results.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "id", "question", "category", "test_type",
                "expected_action", "expected_faq_id",
                "actual_status", "actual_faq_id", "actual_reason",
                "passed", "latency_ms", "confidence"
            ]
        )
        writer.writeheader()
        writer.writerows(results)

    print(f"\n[+] Artifacts successfully written to:")
    print(f"    - {settings.EVALUATION_RESULTS_PATH}")
    print(f"    - {settings.EVALUATION_SUMMARY_PATH}")
    print(f"    - {csv_path}")

if __name__ == "__main__":
    asyncio.run(run_evaluation())
