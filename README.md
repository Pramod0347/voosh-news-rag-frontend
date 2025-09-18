### Caching & Performance
- **Session history TTL (Redis):** Each `sessionId` key has a TTL of 24h (configurable via `REDIS_TTL_SECS`). On each message write we refresh TTL, so active sessions persist longer.
- **Answer cache (optional):** A naive cache keyed by `hash(sessionId + query)` → full LLM answer for 10 min to smooth repeated requests.
- **Cache warming:** At server boot, we pre-run the top 5 onboarding queries against the vector store only (no LLM call) to hydrate I/O paths and JIT compile models.