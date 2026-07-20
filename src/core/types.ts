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
   * Accept header the endpoint requires, when it is not JSON. Sales and finance
   * reports only serve `application/a-gzip` and answer 406 to anything else.
   */
  accept?: string;
}
