import { describe, it, expect } from 'vitest';
import { testflightDialog } from '../src/tools/testflight.js';

describe('testflightDialog', () => {
  it('names the build and the groups', () => {
    const d = testflightDialog({ app: 'Heimdall Test (com.example.heimdall)', build: '42', groups: ['External Testers', 'QA'] });
    expect(d.title).toBe('Assign build 42 to External Testers and QA?');
    expect(d.action).toBe('Assign');
    expect(d.body).toBe([
      'Heimdall Test · TestFlight',
      'Groups that already have it stay as they are.',
      'External groups may also need beta app review; this does not submit one.',
      '',
      'Every tester in these groups can install it.',
    ].join('\n'));
  });

  it('keeps a build UUID out of the title and lists every group when the title is capped', () => {
    const d = testflightDialog({ app: 'Heimdall Test', build: 'a1b2c3d4-0000-1111-2222-333344445555', groups: ['A', 'B', 'C', 'D', 'E'] });
    expect(d.title).toBe('Assign the build to A, B and 3 more?');
    expect(d.body).toContain('Groups: A, B, C, D, E');
    expect(d.body).not.toContain('a1b2c3d4');
  });
});
