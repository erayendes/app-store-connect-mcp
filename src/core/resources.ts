/**
 * Where an oversized tool result goes instead of the model's context.
 *
 * A response that exceeds the size cap is truncated before it is sent (see
 * `capResponseSize` / `truncateText` in `./shape.ts`), and until now the part
 * that did not fit was simply gone — the caller had to re-run with a narrower
 * query to see it, paying for the whole listing twice. Here the full text is
 * kept and the reply carries an `asc-response://` link to it, so the client
 * can fetch the rest over `resources/read` without any of it passing through
 * the model.
 *
 * In memory, not on disk. A temp file would need permissions, a retention
 * policy and a cleanup path for every way a process can die; a Map needs a
 * bound. The store is per server process, which is per client, so its
 * lifetime already matches the session that produced it.
 */

export interface StoredResource {
  uri: string;
  name: string;
  mimeType: string;
  text: string;
}

/** Bounds. Both are ceilings on what the process holds, not on one response. */
const MAX_ENTRIES = 20;
const MAX_BYTES = 32 * 1024 * 1024;

export class ResourceStore {
  private readonly items = new Map<string, StoredResource>();
  private bytes = 0;
  private seq = 0;

  constructor(
    private readonly maxEntries = MAX_ENTRIES,
    private readonly maxBytes = MAX_BYTES
  ) {}

  /** Keeps `text` and returns the resource that now stands for it. */
  store(toolName: string, text: string, mimeType = 'application/json'): StoredResource {
    const n = ++this.seq;
    const item: StoredResource = {
      uri: `asc-response://${n}/${toolName}.json`,
      name: `${toolName} (full response #${n})`,
      mimeType,
      text,
    };
    this.items.set(item.uri, item);
    this.bytes += text.length;

    // Oldest out first: Map preserves insertion order, so the first key is it.
    while (this.items.size > this.maxEntries || (this.bytes > this.maxBytes && this.items.size > 1)) {
      const oldest = this.items.keys().next().value as string;
      this.bytes -= this.items.get(oldest)!.text.length;
      this.items.delete(oldest);
    }
    return item;
  }

  /** Newest first — what a client lists is usually what it just called. */
  list(): StoredResource[] {
    return [...this.items.values()].reverse();
  }

  read(uri: string): StoredResource | undefined {
    return this.items.get(uri);
  }
}
