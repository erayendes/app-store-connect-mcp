# Media targets

🇬🇧 English · 🇹🇷 [Türkçe](MEDIA_TARGETS_tr.md)

Ask your AI to list, upload, arrange or delete images, videos and files. It
uses the four media tools on ASC-Core (`media__list`, `media__upload`,
`media__arrange`, `media__delete`) with one of the `target` values below.

## Store pages and the asset library

| Target | What it is | `page_id` | Arrange |
|:--|:--|:--|:--|
| `library` | The app's asset library: every image and video, placed or not | — | rename, archive, set a video's poster |
| `version` | The App Store version page | — (name the version and `locale`) | place, reorder, remove, poster |
| `cpp` | A custom product page | Its localization | place, reorder, remove, poster |
| `ppo` | A product page test treatment | Its localization | place, reorder, remove, poster |
| `event` | An in-app event's card and details images | Its localization | place, remove |

An upload to a page goes into the library and is placed in one step. Removing
from a page leaves the file in the library; deleting from the library removes
it everywhere it is placed.

## Image and file targets

`page_id` is the exact owning resource ID in the table; it is not the
image/file ID. `media__list` returns file IDs, names, processing states and
errors. Use `file_ids` to filter the list or select files to delete.

| Target | `page_id` owner | List | Upload | Delete | Upload risk | File check |
|:--|:--|:--:|:--:|:--:|:--|:--|
| `app_clip_header_image` | Default experience localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `app_clip_advanced_experience_image` | Advanced experience, or none | ✓ | ✓ | — | public; low without `page_id` | PNG/JPEG |
| `game_center_achievement_image` | v2 achievement localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_leaderboard_image` | v2 leaderboard localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_leaderboard_set_image` | v2 leaderboard set localization | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_activity_image` | Activity localization, or activity version | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `game_center_challenge_image` | Challenge localization, or challenge version | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `in_app_purchase_image` | In-app purchase version | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `in_app_purchase_review_screenshot` | In-app purchase | ✓ | ✓ | ✓ | low | PNG/JPEG |
| `subscription_image` | Subscription version | ✓ | ✓ | ✓ | public | PNG/JPEG |
| `subscription_review_screenshot` | Subscription | ✓ | ✓ | ✓ | low | PNG/JPEG |
| `encryption_document` | Encryption declaration | ✓ | ✓ | — | low | Opaque document bytes |
| `app_review_attachment` | App Store review detail | ✓ | ✓ | ✓ | low | Opaque attachment bytes |
| `routing_coverage` | App Store version | ✓ | ✓ | ✓ | low | Parsed GeoJSON structure, ≤4 MiB |
| `background_asset_file` | Background asset version | ✓ | ✓ | — | low | Opaque asset/manifest bytes |
| `build_upload_file` | Build upload, or none | ✓ | ✓ | Whole upload | release | UTI-specific signature |

**What the risk means for you.** `public`, `low` and `release` don't ask:
your AI app's own approval decides. Every delete, and an upload with
`replace: true`, is `destructive` and asks you to type CONFIRM.

All deletes are `destructive`. None of these targets supports
`media__arrange`: Apple has no placement ordering for them. A dash means the
spec has no DELETE operation. Build files can only be deleted by deleting
their entire build upload; omit `file_ids` for that action. Its preview names
every file in the upload, the upload's `cfBundleShortVersionString (cfBundleVersion)`
and whether a build is attached.

## One file per owner

Most image and file owners hold exactly one file: Apple models them as a to-one
relationship (`app_clip_header_image`, the five Game Center localization images,
both version default images, the in-app purchase and subscription images (one per version, although Apple lists them), both review screenshots, `encryption_document`,
`routing_coverage` and the advanced experience header). An empty to-one answers
404 or `data: null`; both read as "no file yet", so the first upload works.
Other read failures (403, 5xx) stay errors.

An upload onto an owner that already has its file is refused and names that
file. Pass `replace: true` to have Apple's replace done in order: the existing
file is deleted first, then the new one is reserved, sent and committed. The
delete is in the preview and the plan is `destructive`, so it asks for a typed
confirmation. `encryption_document` has no DELETE, so an occupied declaration
cannot be replaced here. The advanced experience header is the exception:
attaching a new image replaces it, and the preview says the old image is
detached, not deleted (Apple has no DELETE for it).

## Owners that are not the obvious parent

**Game Center activity and challenge versions.** Apple also creates these two
image families under `relationships.version`, as the version's default image.
`page_id` may be the localization or the version: Heimdall reads the
localization first, and on 404 reads the ID as the version (IDs are unique
across types). The preview labels it `version default image`.

**Shared Game Center groups.** An achievement, leaderboard, leaderboard set,
activity or challenge in a shared group has `gameCenterDetail: null` (or omits
that optional relationship entirely) and a `gameCenterGroup` instead. It
belongs to the named app when the app's own Game
Center detail (`/v1/apps/{id}/gameCenterDetail?include=gameCenterGroup`) is in
that group. When neither link proves the app, the call is refused.

**Advanced App Clip experiences.** Apple's create request for an advanced
experience requires `relationships.headerImage`, so the image must exist first.
Upload `app_clip_advanced_experience_image` without `page_id`: the app is still
named, the image is reserved, sent and committed with no owner, and the result
returns its `fileId` to pass as `headerImage` to the experience create. The
preview says it is not attached. With nothing customer-facing yet, it is `low`.
To check a standalone upload, call `media__list` with the named app, this target,
and `file_ids: [fileId]`, omitting `page_id`. Apple keeps no app link on this
resource, so its ownership by the named app cannot be proven. This path only
reports processing state and errors; it never writes.

**Build uploads.** A build upload has no app relationship. Ownership is proven
by the app's build upload list filtered by the upload's own
`cfBundleVersion`, `cfBundleShortVersionString` and `platform`, so apps with
thousands of uploads are not paged through. A new build upload (no `page_id`)
sends `build_uploads.create`, whose risk is `release`. Committing a file to an
existing build upload also starts build processing and is `release` level.

## For contributors

### File checks and memory

Every file must be nonempty and regular: 50 MiB for images, 4 MiB for routing
coverage GeoJSON, 500 MiB for other files. These are local safety limits, not
claims about Apple's acceptance limits. Reading uses stat, open and fstat, then
hashes the file in 1 MiB reads on that descriptor. The descriptor stays open:
each reserved byte range is read again from it and sent, one range in memory at
a time (a range over 64 MiB is refused before it is read). For a no-DELETE
single-file slot such as `encryption_document`, files above 64 MiB are refused
before reservation because Apple may return one range for the entire file.
If a reservation has already been made and upload or commit fails, the result
names its orphan reservation ID. The SHA-256 of what was sent must equal the
one that was checked and confirmed, and the file's
identity, size and times must not change, or nothing is committed. Only GeoJSON
is held whole, under its own limit, to be parsed.

PNG/JPEG checks use magic bytes. GeoJSON accepts a UTF-8 BOM and is checked for
geometry, coordinate and collection structure: closed polygon rings, non-empty
collections and coordinate lists, and a geometry on every feature
(`properties` may be absent). Apple's own coverage rules still apply when it
processes the file; neither the spec nor this repository documents a narrower
shape rule, so none is imposed. Build UTIs check ZIP/IPA (`PK` local header),
flat package (`xar!`), binary plist (`bplist00`) or XML plist framing (optional
BOM, declaration, comments and DOCTYPE, a `<plist>` root holding an element,
closed at the end; read from the first and last 64 KiB). These identify file
types; they do not validate signing or archive contents. The document, review
attachment and background file request schemas in `spec/openapi.json` declare
no MIME or extension restriction, so Heimdall does not impose PDF-only,
ZIP-only or JSON-only rules on those targets.

Target-specific arguments are checked before the file is opened or Apple is
called, and rejected where they mean nothing. Background files take
`asset_type: ASSET` or `MANIFEST`. Build files take `asset_type: ASSET`,
`ASSET_DESCRIPTION` or `ASSET_SPI`, plus `uti`. `build_version`,
`build_short_version` and `platform` create a new build upload when `page_id`
is omitted; subsequent files use the returned `ownerId` as `page_id`. `replace`
is only for one-file owners with a DELETE.

The build decision follows the checked-in spec: `BuildUploadFile.attributes`
contains `uploadOperations` (an array of `DeliveryFileUploadOperation`),
`BuildUploadFileCreateRequest` reserves a file under `buildUpload`, and
`BuildUploadFileUpdateRequest` accepts `uploaded` and `sourceFileChecksums`.
The flow is `POST /v1/buildUploads` when needed, then
`POST /v1/buildUploadFiles`, upload the returned byte ranges, and
`PATCH /v1/buildUploadFiles/{id}`. No file DELETE exists;
`DELETE /v1/buildUploads/{id}` deletes the owner instead.

### Ownership, previews and coverage

Ownership is checked from the exact parent through requested relationships to
the named app. IAPs and subscription groups use the app's paginated collection
where no reverse app relationship exists; build uploads use the filtered one
above. Build and background file collections use their relationship list
endpoints because they have links only, not includable linkage. Ambiguous
version/platform selectors and incomplete ownership data are refused.
Validation of every selected ID finishes before any write. Apple operations are
not transactional; if a later request fails, results identify completed and
failed items, including a replace whose delete went through.

Preview and execution use the same planner. Its fingerprint covers app,
owners, existing file IDs and sizes, proposed requests and the upload's digest;
processing state changes do not invalidate approval. A replace rechecks the
local file's stamp and SHA-256 immediately before deleting the old file.
Advanced App Clip uploads with `page_id` attach the new header only after commit. Commits
include MD5 `sourceFileChecksum` where that is the schema's field, or MD5
`sourceFileChecksums.file` for background and build files (the spec also offers
SHA-256, which Apple refused on a real build commit). The seven image
families whose update accepts only `uploaded` need no checksum field.

Of the 97 raw operations the media tools cover (`MACRO_COVERED`), 73 are these
file targets; the other 24 are store page and library media. The 73 are
17 creates (16 file families plus build uploads), 13 deletes (12 file families
plus build uploads), ten updates and 33 reads (16 file getters and 17 owner
relationship reads, including the two version default images). The updates
are the seven uploaded-only ones, the two customer-facing App Clip images
(their update is `uploaded` plus an MD5 checksum, which is exactly the commit
step) and routing coverage. The exact mapping is in
[`scripts/generate-profiles.ts`](../scripts/generate-profiles.ts), and each
covered target/action runs against the include-aware HTTP mock in
[`tests/media-coverage.test.ts`](../tests/media-coverage.test.ts).

The six remaining checksum-capable file updates (review screenshots, the
encryption document, review attachments, background and build files) stay in
their profiles for independent checksum repairs; all are private, low-risk
files. No raw update that commits a customer-facing image is left in a profile.
`app_clip_advanced_experiences.update` also remains: attaching a header covers
only one of its actions. Default-image reads for IAP/subscription versions
remain because selecting the default image is distinct from listing all files
of the chosen owner.

Local tests use fixtures. Real acceptance uploads for each target remain an
owner-run check against Apple.
