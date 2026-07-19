# Contributing

## Getting set up

```bash
npm install
npm run build
npm test
```

## The generated code is generated

Everything in `src/generated/` is produced by `scripts/generate.ts`. Edits there
will be overwritten. Change the generator instead, then run `npm run generate`
and commit the result — CI fails if the committed output doesn't match what the
generator produces.

## The most useful contribution

Apple's OpenAPI specification contains no summaries or descriptions, only tags.
Tool descriptions are therefore synthesised in `scripts/describe.ts` — and those
descriptions are what an LLM reads when choosing which of 1,263 tools to call.

A generated description like *"Update an app Store version phased release"* is
accurate but says nothing about when you'd want it. The curated version says
*"Pause, resume or complete a phased release. Set phasedReleaseState to PAUSE,
ACTIVE or COMPLETE."*

If you use an operation regularly and the generated description is vague, add
an entry to `CURATED` in `scripts/describe.ts`. Small change, real improvement.

## Adding a domain mapping

New Apple resources land in `scripts/domains.ts`. The test suite asserts that no
operation falls through to `misc`, so a new Apple spec with new resources will
fail CI until they're mapped — which is the intent.

## Pull requests

- One concern per PR.
- `npm test` and `npm run typecheck` must pass.
- If you change the generator, include the regenerated `src/generated/` output
  and mention how the tool count changed.
