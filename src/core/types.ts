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
  }>;
  hasBody: boolean;
  bodyRef?: string;
}
