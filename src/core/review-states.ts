/** Approved/live states in spec/openapi.json's reviewable version enums.
 * COMPLETE on BackgroundAssetVersion is upload processing, not approval;
 * its AppStoreRelease carries the review state instead. */
export const APPROVED_STATES = new Set([
  'APPROVED', 'ACCEPTED', 'REPLACED_WITH_NEW_VERSION',
  'PENDING_RELEASE', 'LIVE',
  'PROCESSING_FOR_DISTRIBUTION', 'READY_FOR_DISTRIBUTION', 'SUPERSEDED',
  'READY_FOR_SALE', 'REMOVED_FROM_SALE', 'DEVELOPER_REMOVED_FROM_SALE',
]);

export const PRODUCT_APPROVED_STATES = 'APPROVED,REMOVED_FROM_SALE,DEVELOPER_REMOVED_FROM_SALE';
