#!/usr/bin/env python3
"""Benchmark and smoke-test script for Workstation vLLM inference server.

Measures Time to First Token (TTFT), streaming decode throughput (tok/s),
and end-to-end latency for Qwen3.8-27B running on the AI Workstation.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from typing import Any, Dict, Generator


class WorkstationLLMTester:
    """Tester and benchmark client for the Workstation vLLM OpenAI-compatible server."""

    def __init__(self, host: str = "172.16.26.14", port: int = 8000, model: str = "/models/Qwen3.8-27B-INT4-AWQ-GPTQ") -> None:
        self.host: str = host
        self.port: int = port
        self.model: str = model
        self.base_url: str = f"http://{host}:{port}/v1"

    def check_health(self) -> bool:
        """Verify server connectivity and list available models."""
        url = f"{self.base_url}/models"
        print(f"[1/3] Probing endpoint health: {url}...")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "WorkstationTester/1.0"})
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    models = [m.get("id") for m in data.get("data", [])]
                    print(f"      [OK] Server is UP. Available models: {models}")
                    return True
        except urllib.error.URLError as exc:
            print(f"      [FAIL] Connection failed: {exc}", file=sys.stderr)
            return False
        return False

    def stream_completion(self, prompt: str, max_tokens: int = 256) -> Generator[str, None, None]:
        """Stream chat completions from the vLLM OpenAI API endpoint."""
        url = f"{self.base_url}/chat/completions"
        payload: Dict[str, Any] = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a senior robotics and autonomous driving engineer."},
                {"role": "user", "content": prompt},
            ],
            "max_tokens": max_tokens,
            "stream": True,
            "temperature": 0.2,
        }

        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=body,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "WorkstationTester/1.0",
            },
        )

        with urllib.request.urlopen(req, timeout=60.0) as resp:
            for line in resp:
                decoded_line = line.decode("utf-8").strip()
                if not decoded_line:
                    continue
                if decoded_line.startswith("data: "):
                    content = decoded_line[6:].strip()
                    if content == "[DONE]":
                        break
                    try:
                        chunk = json.loads(content)
                        delta = chunk.get("choices", [{}])[0].get("delta", {})
                        token = delta.get("content", "")
                        if token:
                            yield token
                    except json.JSONDecodeError:
                        continue

    def run_benchmark(self, prompt: str, max_tokens: int = 256) -> None:
        """Run an end-to-end streaming throughput benchmark."""
        if not self.check_health():
            print("[ABORT] Server health check failed. Ensure vLLM container is running.", file=sys.stderr)
            sys.exit(1)

        print(f"\n[2/3] Sending benchmark query (max_tokens={max_tokens}):")
        print(f"      Prompt: \"{prompt}\"")
        print("=" * 70)

        start_time = time.perf_counter()
        first_token_time: float | None = None
        generated_tokens: int = 0
        response_text = ""

        try:
            for token in self.stream_completion(prompt, max_tokens=max_tokens):
                now = time.perf_counter()
                if first_token_time is None:
                    first_token_time = now
                generated_tokens += 1
                response_text += token
                sys.stdout.write(token)
                sys.stdout.flush()
        except KeyboardInterrupt:
            print("\n[INTERRUPTED] Stream stopped by user.")
        except Exception as exc:
            print(f"\n[ERROR] Streaming failed: {exc}", file=sys.stderr)
            sys.exit(1)

        total_time = time.perf_counter() - start_time
        print("\n" + "=" * 70)

        if first_token_time is None:
            print("[WARN] No tokens generated.", file=sys.stderr)
            return

        ttft = (first_token_time - start_time) * 1000.0
        decode_time = total_time - (first_token_time - start_time)
        decode_tok_per_sec = (generated_tokens - 1) / decode_time if decode_time > 0 and generated_tokens > 1 else 0.0

        print("\n[3/3] Inference Performance Summary:")
        print(f"      - Time to First Token (TTFT) : {ttft:.1f} ms")
        print(f"      - Total Generated Tokens     : {generated_tokens} tokens")
        print(f"      - Decode Throughput          : {decode_tok_per_sec:.2f} tokens/second")
        print(f"      - Total Elapsed Time         : {total_time:.2f} s")
        print(f"      - Average Inter-Token Latency: {1000.0 / decode_tok_per_sec if decode_tok_per_sec > 0 else 0.0:.2f} ms")


def main() -> None:
    """Parse CLI arguments and execute the test."""
    parser = argparse.ArgumentParser(description="Workstation vLLM Benchmark & Test Client")
    parser.add_argument("--host", default="172.16.26.14", help="Workstation IP address")
    parser.add_argument("--port", type=int, default=8000, help="vLLM server port")
    parser.add_argument("--model", default="/models/Qwen3.8-27B-INT4-AWQ-GPTQ", help="Model path/identifier")
    parser.add_argument("--prompt", default="Explain how an Ackermann steering model calculates turn radius in ROS 2.", help="Benchmark prompt")
    parser.add_argument("--max-tokens", type=int, default=256, help="Maximum tokens to generate")

    args = parser.parse_args()
    tester = WorkstationLLMTester(host=args.host, port=args.port, model=args.model)
    tester.run_benchmark(prompt=args.prompt, max_tokens=args.max_tokens)


if __name__ == "__main__":
    main()
