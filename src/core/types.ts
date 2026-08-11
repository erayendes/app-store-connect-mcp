import type { RiskLevel } from './risk.js';

/** Shape of a generated operation, emitted by scripts/generate.ts. */
export interface Operation {
  /** Dotted tool name, e.g. `apps.builds.list`. */
  name: string;
  domain: string;
  method: string;
  /** Templated path, e.g. `/v1/apps/{id}/builds`. */
  path: string;
  description: string;
  readOnly: boolean;
  deprecated: boolean;
  pathParams: string[];
  queryParams: Array<{
    name: string;
    type: string;
    description: string;
    enum?: string[];
    /** Apple rejects the call with 400 when this filter is missing. */
    required?: boolean;
  }>;
  hasBody: boolean;
  bodyRef?: string;
  /**
   * Risk classification for mutating operations (absent on reads). Assigned by
   * the generator from the hand-reviewed manifest in src/core/risk.ts, whose
   * union this borrows so a stray level fails the build instead of silently
   * falling through every `risk === '...'` comparison.
   */
  risk?: RiskLevel;
  /**
   * Accept header the endpoint requires, when it is not JSON. Sales and finance
   * reports only serve `application/a-gzip` and answer 406 to anything else.
   */
  accept?: string;
}
