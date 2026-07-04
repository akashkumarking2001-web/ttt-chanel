import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // By not passing r2IncrementalCache, we disable R2 caching.
  // This bypasses the "Failed to send request to R2 worker: timeout" error.
});
