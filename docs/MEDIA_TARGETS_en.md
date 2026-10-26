# Media file targets (3.0)

Use the existing `media__list`, `media__upload` and `media__delete` tools with
these `target` values. `page_id` is the exact owning resource ID in the table;
it is not the image/file ID. `media__list` returns file IDs, names, processing
states and errors. Use `file_ids` to filter the list or select files to delete.

| Target | `page_id` owner | List | Upload | Delete | Upload risk | File check |
|:--|:--|:--:|:--:|:--:|:--|:--|
| `app_clip_header_image` | Default experience localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `app_clip_advanced_experience_image` | Advanced experience | ✓ | ✓ | — | public | PNG/JPEG |
| `game_center_achievement_image` | v2 achievement localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_leaderboard_image` | v2 leaderboard localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_leaderboard_set_image` | v2 leaderboard set localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_activity_image` | Activity localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_challenge_image` | Challenge localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `in_app_purchase_image` | In-app purchase version | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `in_app_purchase_review_screenshot` | In-app purchase | ✓ | ✓ | ✓ | low | PNG/JPEG |
| `subscription_image` | Subscription version | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `subscription_review_screenshot` | Subscription | ✓ | ✓ | ✓ | low | PNG/JPEG |
| `encryption_document` | Encryption declaration | ✓ | ✓ | — | low | Opaque document bytes |
| `app_review_attachment` | App Store review detail | ✓ | ✓ | ✓ | low | Opaque attachment bytes |
| `routing_coverage` | App Store version | ✓ | ✓ | ✓ | low | Parsed GeoJSON structure |
| `background_asset_file` | Background asset version | ✓ | ✓ | — | low | Opaque asset/manifest bytes |
| `build_upload_file` | Build upload | ✓ | ✓ | Whole upload | low | UTI-specific signature |

All deletes are `destructive`. None of these targets supports
`media__arrange`: Apple has no placement ordering for them. A dash means the
spec has no DELETE operation. Build files can only be deleted by deleting
their entire build upload; omit `file_ids` for that action. Its preview names
every file in the upload.

Every file must be nonempty, regular, and within Heimdall's memory bound:
50 MiB for images, 500 MiB for other files. These are local safety limits, not
claims about Apple's acceptance limits. Reading uses stat, open, fstat and
bounded reads on the same descriptor, then checks for changes during reading.

PNG/JPEG checks use magic bytes. GeoJSON is parsed and checked for geometry,
coordinate and collection structure, including closed polygon rings; Apple's
geographic acceptance rules still apply. Build UTIs check ZIP/IPA (`PK` local
header), flat package (`xar!`), binary plist (`bplist00`) or XML plist framing.
These identify file types; they do not validate signing or archive contents.
The document, review attachment and background file request schemas in
`spec/openapi.json` declare no MIME or extension restriction, so Heimdall does
not impose PDF-only, ZIP-only or JSON-only rules on those targets.

Background files require `asset_type: ASSET` or `MANIFEST`. Build files require
`asset_type: ASSET`, `ASSET_DESCRIPTION` or `ASSET_SPI`, plus `uti`. To create a
new build upload, omit `page_id` and provide `build_version`,
`build_short_version` and `platform`. Subsequent files use the returned
`ownerId` as `page_id`.

The build decision follows the checked-in spec: `BuildUploadFile.attributes`
contains `uploadOperations` (an array of `DeliveryFileUploadOperation`),
`BuildUploadFileCreateRequest` reserves a file under `buildUpload`, and
`BuildUploadFileUpdateRequest` accepts `uploaded` and `sourceFileChecksums`.
The flow is `POST /v1/buildUploads` when needed, then
`POST /v1/buildUploadFiles`, upload the returned byte ranges, and
`PATCH /v1/buildUploadFiles/{id}`. No file DELETE exists;
`DELETE /v1/buildUploads/{id}` deletes the owner instead.

Ownership is checked from the exact parent through requested relationships to
the named app. IAPs, subscription groups and build uploads use the app's
paginated collection where no reverse app relationship exists. Build and
background file collections use their relationship list endpoints because
they have links only, not includable linkage. Ambiguous version/platform
selectors and incomplete ownership data are refused. Validation of every
selected ID finishes before any write. Apple operations are not transactional;
if a later request fails, results identify completed and failed items.

Preview and execution use the same planner. Its fingerprint covers app,
owners, existing files, proposed requests and upload bytes. Advanced App Clip
uploads attach the new header only after commit; other uploads do not silently
delete an existing image. Commits include MD5 `sourceFileChecksum` where that
is the schema's field, or SHA-256 `sourceFileChecksums.file` for background and
build files. The seven image families whose update accepts only `uploaded`
need no checksum field.

PR-D2 removes 68 raw profile operations and records them in `MACRO_COVERED`:
17 creates (16 file families plus build uploads), 13 deletes (12 file families
plus build uploads), seven uploaded-only updates, and 31 reads (16 file getters
and 15 owner relationship reads). The exact mapping is in
[`scripts/generate-profiles.ts`](../scripts/generate-profiles.ts), and each
covered target/action runs against the include-aware HTTP mock in
[`tests/media-coverage.test.ts`](../tests/media-coverage.test.ts).

The nine checksum-capable file updates remain in their profiles for independent
checksum repairs. `app_clip_advanced_experiences.update` also remains: attaching
a header covers only one of its actions. Default-image reads for IAP/subscription
versions and Game Center activity/challenge versions remain because selecting
the default image is distinct from listing all files of the chosen owner.

Local tests use fixtures. Real acceptance uploads for each target remain an
owner-run check against Apple.
