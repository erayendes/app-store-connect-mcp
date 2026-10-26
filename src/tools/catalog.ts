/** Hand-written App Store Connect macros shared by registration and discovery. */
import { PRICING_TOOLS } from './pricing.js';
import { MEDIA_TOOLS } from './screenshots.js';
import { ANALYTICS_TOOLS } from './analytics.js';
import { CI_TOOLS } from './ci.js';
import { PREFLIGHT_TOOLS } from './preflight.js';
import { METADATA_TOOLS } from './metadata.js';
import { ACCOUNT_TOOLS } from './account.js';
import { METADATA_I18N_TOOLS } from './metadata-i18n.js';
import { RELEASE_TOOLS } from './release.js';
import { TESTFLIGHT_TOOLS } from './testflight.js';

export const MACRO_TOOLS = [
  ...PRICING_TOOLS,
  ...MEDIA_TOOLS,
  ...ANALYTICS_TOOLS,
  ...CI_TOOLS,
  ...PREFLIGHT_TOOLS,
  ...METADATA_TOOLS,
  ...ACCOUNT_TOOLS,
  ...METADATA_I18N_TOOLS,
  ...RELEASE_TOOLS,
  ...TESTFLIGHT_TOOLS,
];
