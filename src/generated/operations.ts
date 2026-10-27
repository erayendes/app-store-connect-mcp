// AUTO-GENERATED — do not edit by hand.
// Source: Apple App Store Connect OpenAPI specification v4.5.1
// Regenerate with: npm run generate

import type { Operation } from '../core/types.js';

export const SPEC_VERSION = "4.5.1";

export const OPERATIONS: Operation[] = [
  {
    "name": "accessibility_declarations.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/accessibilityDeclarations",
    "description": "Create an accessibility declaration.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AccessibilityDeclarationCreateRequest",
    "risk": "public"
  },
  {
    "name": "accessibility_declarations.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/accessibilityDeclarations/{id}",
    "description": "Delete an accessibility declaration.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "accessibility_declarations.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/accessibilityDeclarations/{id}",
    "description": "Read one accessibility declaration by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[accessibilityDeclarations]",
        "type": "array",
        "description": "the fields to include for returned resources of type accessibilityDeclarations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "deviceFamily",
          "state",
          "supportsAudioDescriptions",
          "supportsCaptions",
          "supportsDarkInterface",
          "supportsDifferentiateWithoutColorAlone",
          "supportsLargerText",
          "supportsReducedMotion",
          "supportsSufficientContrast",
          "supportsVoiceControl",
          "supportsVoiceover"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "accessibility_declarations.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/accessibilityDeclarations/{id}",
    "description": "Update an accessibility declaration.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AccessibilityDeclarationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "actors.get",
    "domain": "users",
    "method": "GET",
    "path": "/v1/actors/{id}",
    "description": "Read one actor by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[actors]",
        "type": "array",
        "description": "the fields to include for returned resources of type actors Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "actorType",
          "userFirstName",
          "userLastName",
          "userEmail",
          "apiKeyId"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "actors.list",
    "domain": "users",
    "method": "GET",
    "path": "/v1/actors",
    "description": "List actors.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)",
        "required": true
      },
      {
        "name": "fields[actors]",
        "type": "array",
        "description": "the fields to include for returned resources of type actors Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "actorType",
          "userFirstName",
          "userLastName",
          "userEmail",
          "apiKeyId"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "age_rating_declarations.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/ageRatingDeclarations/{id}",
    "description": "Answer Apple’s content questions to set the app’s age rating — violence, gambling, mature themes, unrestricted web access. The rating is derived from the answers rather than chosen.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AgeRatingDeclarationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "alternative_distribution_domains.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/alternativeDistributionDomains",
    "description": "Create an alternative distribution domain.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AlternativeDistributionDomainCreateRequest",
    "risk": "low"
  },
  {
    "name": "alternative_distribution_domains.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/alternativeDistributionDomains/{id}",
    "description": "Delete an alternative distribution domain.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "alternative_distribution_domains.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionDomains/{id}",
    "description": "Read one alternative distribution domain by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[alternativeDistributionDomains]",
        "type": "array",
        "description": "the fields to include for returned resources of type alternativeDistributionDomains Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "domain",
          "referenceName",
          "createdDate"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_domains.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionDomains",
    "description": "List the domains verified for EU alternative distribution, where an app reaches users through a marketplace rather than the App Store.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "fields[alternativeDistributionDomains]",
        "type": "array",
        "description": "the fields to include for returned resources of type alternativeDistributionDomains Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "domain",
          "referenceName",
          "createdDate"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_keys.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/alternativeDistributionKeys",
    "description": "Create an alternative distribution key.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AlternativeDistributionKeyCreateRequest",
    "risk": "low"
  },
  {
    "name": "alternative_distribution_keys.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/alternativeDistributionKeys/{id}",
    "description": "Delete an alternative distribution key.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "alternative_distribution_keys.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionKeys/{id}",
    "description": "Read one alternative distribution key by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[alternativeDistributionKeys]",
        "type": "array",
        "description": "the fields to include for returned resources of type alternativeDistributionKeys Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "publicKey"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_keys.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionKeys",
    "description": "List the public keys registered for EU alternative distribution, used to sign apps delivered outside the App Store. Use exists[app] to check whether an app has one at all.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "exists[app]",
        "type": "boolean",
        "description": "filter by existence or non-existence of related 'app'"
      },
      {
        "name": "fields[alternativeDistributionKeys]",
        "type": "array",
        "description": "the fields to include for returned resources of type alternativeDistributionKeys Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "publicKey"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_package_deltas.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackageDeltas/{id}",
    "description": "Read one alternative distribution package delta by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[alternativeDistributionPackageDeltas]",
        "type": "array",
        "description": "the fields to include for returned resources of type alternativeDistributionPackageDeltas Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "url",
          "urlExpirationDate",
          "alternativeDistributionKeyBlob",
          "fileChecksum"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_package_variants.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackageVariants/{id}",
    "description": "Read one alternative distribution package variant by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[alternativeDistributionPackageVariants]",
        "type": "array",
        "description": "the fields to include for returned resources of type alternativeDistributionPackageVariants Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "url",
          "urlExpirationDate",
          "alternativeDistributionKeyBlob",
          "fileChecksum"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_package_versions.deltas.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackageVersions/{id}/deltas",
    "description": "List the deltas belonging to an alternative distribution package version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_package_versions.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackageVersions/{id}",
    "description": "Read one alternative distribution package version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[alternativeDistributionPackageVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type alternativeDistributionPackageVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "url",
          "urlExpirationDate",
          "version",
          "fileChecksum",
          "state",
          "variants",
          "deltas",
          "alternativeDistributionPackage"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "variants",
          "deltas",
          "alternativeDistributionPackage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_package_versions.variants.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackageVersions/{id}/variants",
    "description": "List the variants belonging to an alternative distribution package version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_packages.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/alternativeDistributionPackages",
    "description": "Create an alternative distribution package.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AlternativeDistributionPackageCreateRequest",
    "risk": "low"
  },
  {
    "name": "alternative_distribution_packages.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackages/{id}",
    "description": "Read one alternative distribution package by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[alternativeDistributionPackages]",
        "type": "array",
        "description": "the fields to include for returned resources of type alternativeDistributionPackages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "sourceFileChecksum",
          "versions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_packages.versions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackages/{id}/versions",
    "description": "List the versions belonging to an alternative distribution package.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "COMPLETED",
          "REPLACED"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "variants",
          "deltas",
          "alternativeDistributionPackage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "analytics_report_instances.get",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportInstances/{id}",
    "description": "Read one analytics report instance by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[analyticsReportInstances]",
        "type": "array",
        "description": "the fields to include for returned resources of type analyticsReportInstances Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "granularity",
          "processingDate",
          "segments"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "analytics_report_instances.segments.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportInstances/{id}/segments",
    "description": "List the segments belonging to an analytics report instance.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "analytics_report_requests.create",
    "domain": "analytics",
    "method": "POST",
    "path": "/v1/analyticsReportRequests",
    "description": "Ask Apple to start producing analytics for an app — the product usage numbers behind downloads, sessions, retention and crashes. ONE_TIME_SNAPSHOT covers the past 365 days; ONGOING keeps going as new data arrives. Nothing is downloadable straight away: a fresh request has no instances for a day or more.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AnalyticsReportRequestCreateRequest",
    "risk": "low"
  },
  {
    "name": "analytics_report_requests.delete",
    "domain": "analytics",
    "method": "DELETE",
    "path": "/v1/analyticsReportRequests/{id}",
    "description": "Delete an analytics report request.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "analytics_report_requests.get",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportRequests/{id}",
    "description": "Read one analytics report request by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[analyticsReportRequests]",
        "type": "array",
        "description": "the fields to include for returned resources of type analyticsReportRequests Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "accessType",
          "stoppedDueToInactivity",
          "reports"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "reports"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "analytics_report_requests.reports.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportRequests/{id}/reports",
    "description": "List the reports belonging to an analytics report request.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[category]",
        "type": "array",
        "description": "filter by attribute 'category'",
        "enum": [
          "APP_USAGE",
          "APP_STORE_ENGAGEMENT",
          "COMMERCE",
          "FRAMEWORK_USAGE",
          "PERFORMANCE"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "analytics_report_segments.get",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportSegments/{id}",
    "description": "Read one segment: a short-lived signed URL plus its checksum and byte size. The rows are gzipped TSV at that URL — this response carries the link, not the data.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[analyticsReportSegments]",
        "type": "array",
        "description": "the fields to include for returned resources of type analyticsReportSegments Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "checksum",
          "sizeInBytes",
          "url"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "analytics_reports.get",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReports/{id}",
    "description": "Read one analytics report by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[analyticsReports]",
        "type": "array",
        "description": "the fields to include for returned resources of type analyticsReports Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "category",
          "instances"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "analytics_reports.instances.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReports/{id}/instances",
    "description": "List the instances belonging to an analytics report.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[granularity]",
        "type": "array",
        "description": "filter by attribute 'granularity'",
        "enum": [
          "DAILY",
          "WEEKLY",
          "MONTHLY"
        ]
      },
      {
        "name": "filter[processingDate]",
        "type": "array",
        "description": "filter by attribute 'processingDate'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "android_to_ios_app_mapping_details.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/androidToIosAppMappingDetails",
    "description": "Create an android to iOS app mapping detail.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AndroidToIosAppMappingDetailCreateRequest",
    "risk": "low"
  },
  {
    "name": "android_to_ios_app_mapping_details.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/androidToIosAppMappingDetails/{id}",
    "description": "Delete an android to iOS app mapping detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "android_to_ios_app_mapping_details.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/androidToIosAppMappingDetails/{id}",
    "description": "Read one android to iOS app mapping detail by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[androidToIosAppMappingDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type androidToIosAppMappingDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "packageName",
          "appSigningKeyPublicCertificateSha256Fingerprints"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "android_to_ios_app_mapping_details.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/androidToIosAppMappingDetails/{id}",
    "description": "Update an android to iOS app mapping detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AndroidToIosAppMappingDetailUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_asset_libraries.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraries/{id}",
    "description": "Read an asset library by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appAssetLibraries]",
        "type": "array",
        "description": "the fields to include for returned resources of type appAssetLibraries Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "images",
          "videos"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_libraries.images.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraries/{id}/images",
    "description": "List the images in an app's asset library, with their review state.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[category]",
        "type": "array",
        "description": "filter by attribute 'category'",
        "enum": [
          "CREATIVE_ASSETS",
          "APP_SCREENSHOTS_AND_PREVIEWS"
        ]
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "AWAITING_UPLOAD",
          "UPLOAD_COMPLETE",
          "FAILED",
          "COMPLETE",
          "PREPARE_FOR_SUBMISSION",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "ACCEPTED",
          "APPROVED",
          "REJECTED",
          "ARCHIVED"
        ]
      },
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[specId]",
        "type": "array",
        "description": "filter by attribute 'specId'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate",
          "lastModifiedDate",
          "-lastModifiedDate",
          "referenceName",
          "-referenceName"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_libraries.videos.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraries/{id}/videos",
    "description": "List the videos in an app's asset library, with their review state.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[category]",
        "type": "array",
        "description": "filter by attribute 'category'",
        "enum": [
          "CREATIVE_ASSETS",
          "APP_SCREENSHOTS_AND_PREVIEWS"
        ]
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "AWAITING_UPLOAD",
          "UPLOAD_COMPLETE",
          "FAILED",
          "COMPLETE",
          "PREPARE_FOR_SUBMISSION",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "ACCEPTED",
          "APPROVED",
          "REJECTED",
          "ARCHIVED"
        ]
      },
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[specId]",
        "type": "array",
        "description": "filter by attribute 'specId'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate",
          "lastModifiedDate",
          "-lastModifiedDate",
          "referenceName",
          "-referenceName"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_library_images.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appAssetLibraryImages",
    "description": "Reserve an image in the asset library: returns upload operations, moves no bytes. Commit by setting uploaded.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppAssetLibraryImageCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_asset_library_images.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appAssetLibraryImages/{id}",
    "description": "Delete an image from the asset library.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_asset_library_images.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraryImages/{id}",
    "description": "Read one asset library image: file, size and review state.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appAssetLibraryImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type appAssetLibraryImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "category",
          "createdDate",
          "lastModifiedDate",
          "fileName",
          "fileSize",
          "imageAsset",
          "referenceName",
          "specId",
          "state",
          "stateDetails",
          "uploadOperations",
          "placements"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_library_images.placements.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraryImages/{id}/placements",
    "description": "List the placements of an asset library image: which localizations it is on.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[placementType]",
        "type": "array",
        "description": "filter by attribute 'placementType'",
        "enum": [
          "APP_SCREENSHOT",
          "IMESSAGE_APP_SCREENSHOT",
          "APP_PREVIEW",
          "PRODUCT_PAGE_HEADER_ASSET",
          "APP_STORE_SEARCH_RESULTS_ASSET",
          "SEARCH_RESULTS_ADS_ASSET",
          "TODAY_TAB_ADS_ASSET",
          "EVENT_CARD_ASSET",
          "EVENT_DETAILS_PAGE_ASSET",
          "RETENTION_MESSAGE_ASSET"
        ]
      },
      {
        "name": "filter[placementGroup]",
        "type": "array",
        "description": "filter by attribute 'placementGroup'"
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "ASSET_PROCESSING",
          "FAILED",
          "PARENT_PREPARE_FOR_SUBMISSION",
          "PARENT_READY_FOR_REVIEW",
          "PARENT_WAITING_FOR_REVIEW",
          "PARENT_IN_REVIEW",
          "PARENT_APPROVED"
        ]
      },
      {
        "name": "filter[video]",
        "type": "array",
        "description": "filter by id(s) of related 'video' Takes a 'video' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appEventLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appEventLocalization' Takes a 'appEventLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionLocalization' Takes a 'appStoreVersionLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appCustomProductPageLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appCustomProductPageLocalization' Takes a 'appCustomProductPageLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionExperimentTreatmentLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionExperimentTreatmentLocalization' Takes a 'appStoreVersionExperimentTreatmentLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate",
          "lastModifiedDate",
          "-lastModifiedDate",
          "placementGroupPosition",
          "-placementGroupPosition"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "image",
          "video",
          "appEventLocalization",
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_library_images.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appAssetLibraryImages/{id}",
    "description": "Rename an asset library image, archive it, or mark its upload complete.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppAssetLibraryImageUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_asset_library_placement_ordering_requests.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appAssetLibraryPlacementOrderingRequests",
    "description": "Reorder the asset library placements of one group within a localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "orderedPlacements"
        ]
      },
      {
        "name": "fields[appAssetLibraryPlacementOrderingRequests]",
        "type": "array",
        "description": "the fields to include for returned resources of type appAssetLibraryPlacementOrderingRequests Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "orderedPlacements"
        ]
      }
    ],
    "hasBody": true,
    "bodyRef": "AppAssetLibraryPlacementOrderingRequestCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_asset_library_placements.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appAssetLibraryPlacements",
    "description": "Put an asset library image or video into one localization: version, custom product variant, treatment or event.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppAssetLibraryPlacementCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_asset_library_placements.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appAssetLibraryPlacements/{id}",
    "description": "Remove one asset library placement; the file stays in the library.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_asset_library_placements.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraryPlacements/{id}",
    "description": "Read one asset library placement and its state.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appAssetLibraryPlacements]",
        "type": "array",
        "description": "the fields to include for returned resources of type appAssetLibraryPlacements Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "mediaType",
          "placementType",
          "placementGroup",
          "createdDate",
          "lastModifiedDate",
          "state",
          "stateDetails",
          "image",
          "video",
          "appEventLocalization",
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "image",
          "video",
          "appEventLocalization",
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_library_ref_data.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraryRefData/{id}",
    "description": "Read one asset library reference entry by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appAssetLibraryRefData]",
        "type": "array",
        "description": "the fields to include for returned resources of type appAssetLibraryRefData Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "features",
          "placementProfileGroups",
          "imageSpecs",
          "videoSpecs",
          "placementTypes",
          "displayClasses"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_library_ref_data.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraryRefData",
    "description": "List which placement types, groups and limits the asset library allows.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[placementTypes]",
        "type": "array",
        "description": "filter by attribute 'placementTypes'"
      },
      {
        "name": "filter[placementProfileGroups]",
        "type": "array",
        "description": "filter by attribute 'placementProfileGroups'"
      },
      {
        "name": "filter[features]",
        "type": "array",
        "description": "filter by attribute 'features'"
      },
      {
        "name": "filter[specs]",
        "type": "array",
        "description": "filter by specs"
      },
      {
        "name": "fields[appAssetLibraryRefData]",
        "type": "array",
        "description": "the fields to include for returned resources of type appAssetLibraryRefData Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "features",
          "placementProfileGroups",
          "imageSpecs",
          "videoSpecs",
          "placementTypes",
          "displayClasses"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_library_videos.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appAssetLibraryVideos",
    "description": "Reserve one video in the asset library: returns upload operations, moves no bytes. Commit by setting uploaded.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppAssetLibraryVideoCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_asset_library_videos.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appAssetLibraryVideos/{id}",
    "description": "Delete a video from the asset library.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_asset_library_videos.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraryVideos/{id}",
    "description": "Read one asset library video: file, size, preview frame and review state.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appAssetLibraryVideos]",
        "type": "array",
        "description": "the fields to include for returned resources of type appAssetLibraryVideos Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "category",
          "createdDate",
          "lastModifiedDate",
          "fileName",
          "fileSize",
          "previewFrameImage",
          "previewFrameTimeCode",
          "referenceName",
          "specId",
          "state",
          "stateDetails",
          "uploadOperations",
          "videoAsset",
          "placements"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_library_videos.placements.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appAssetLibraryVideos/{id}/placements",
    "description": "List the placements of an asset library video: which localizations it is on.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[placementType]",
        "type": "array",
        "description": "filter by attribute 'placementType'",
        "enum": [
          "APP_SCREENSHOT",
          "IMESSAGE_APP_SCREENSHOT",
          "APP_PREVIEW",
          "PRODUCT_PAGE_HEADER_ASSET",
          "APP_STORE_SEARCH_RESULTS_ASSET",
          "SEARCH_RESULTS_ADS_ASSET",
          "TODAY_TAB_ADS_ASSET",
          "EVENT_CARD_ASSET",
          "EVENT_DETAILS_PAGE_ASSET",
          "RETENTION_MESSAGE_ASSET"
        ]
      },
      {
        "name": "filter[placementGroup]",
        "type": "array",
        "description": "filter by attribute 'placementGroup'"
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "ASSET_PROCESSING",
          "FAILED",
          "PARENT_PREPARE_FOR_SUBMISSION",
          "PARENT_READY_FOR_REVIEW",
          "PARENT_WAITING_FOR_REVIEW",
          "PARENT_IN_REVIEW",
          "PARENT_APPROVED"
        ]
      },
      {
        "name": "filter[image]",
        "type": "array",
        "description": "filter by id(s) of related 'image' Takes a 'image' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appEventLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appEventLocalization' Takes a 'appEventLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionLocalization' Takes a 'appStoreVersionLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appCustomProductPageLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appCustomProductPageLocalization' Takes a 'appCustomProductPageLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionExperimentTreatmentLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionExperimentTreatmentLocalization' Takes a 'appStoreVersionExperimentTreatmentLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate",
          "lastModifiedDate",
          "-lastModifiedDate",
          "placementGroupPosition",
          "-placementGroupPosition"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "image",
          "video",
          "appEventLocalization",
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_asset_library_videos.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appAssetLibraryVideos/{id}",
    "description": "Rename an asset library video, archive it, set its preview frame, or mark its upload complete.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppAssetLibraryVideoUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_availabilities_v2.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v2/appAvailabilities",
    "description": "Set an app’s availability — the countries it is sold in. Submitting an empty list removes the app from all territories; submitting some limits it to those.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppAvailabilityV2CreateRequest",
    "risk": "release"
  },
  {
    "name": "app_availabilities_v2.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v2/appAvailabilities/{id}",
    "description": "Read one app availabilities (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appAvailabilities]",
        "type": "array",
        "description": "the fields to include for returned resources of type appAvailabilities Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "availableInNewTerritories",
          "territoryAvailabilities"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territoryAvailabilities"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_availabilities_v2.territory_availabilities.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v2/appAvailabilities/{id}/territoryAvailabilities",
    "description": "List the territory availabilities belonging to an app availabilities (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[territoryAvailabilities]",
        "type": "array",
        "description": "the fields to include for returned resources of type territoryAvailabilities Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "available",
          "releaseDate",
          "preOrderEnabled",
          "preOrderPublishDate",
          "contentStatuses",
          "territory"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_categories.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appCategories/{id}",
    "description": "Read one app category by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appCategories]",
        "type": "array",
        "description": "the fields to include for returned resources of type appCategories Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "platforms",
          "subcategories",
          "parent"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_categories.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appCategories",
    "description": "List app categories.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[platforms]",
        "type": "array",
        "description": "filter by attribute 'platforms'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "exists[parent]",
        "type": "boolean",
        "description": "filter by existence or non-existence of related 'parent'"
      },
      {
        "name": "fields[appCategories]",
        "type": "array",
        "description": "the fields to include for returned resources of type appCategories Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "platforms",
          "subcategories",
          "parent"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_categories.parent.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appCategories/{id}/parent",
    "description": "Read the parent for an app category.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_categories.subcategories.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appCategories/{id}/subcategories",
    "description": "List the subcategories belonging to an app category.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_advanced_experience_images.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipAdvancedExperienceImages",
    "description": "Create an App Clip advanced experience image.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAdvancedExperienceImageCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_advanced_experience_images.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipAdvancedExperienceImages/{id}",
    "description": "Read one App Clip advanced experience image by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appClipAdvancedExperienceImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClipAdvancedExperienceImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "sourceFileChecksum",
          "imageAsset",
          "uploadOperations",
          "assetDeliveryState"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_advanced_experience_images.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipAdvancedExperienceImages/{id}",
    "description": "Update an App Clip advanced experience image.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAdvancedExperienceImageUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_advanced_experiences.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipAdvancedExperiences",
    "description": "Create an App Clip advanced experience.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAdvancedExperienceCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_advanced_experiences.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipAdvancedExperiences/{id}",
    "description": "Read one App Clip advanced experience by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appClipAdvancedExperiences]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClipAdvancedExperiences Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "link",
          "version",
          "status",
          "action",
          "isPoweredBy",
          "place",
          "placeStatus",
          "businessCategory",
          "defaultLanguage",
          "appClip",
          "headerImage",
          "localizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClip",
          "headerImage",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_advanced_experiences.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipAdvancedExperiences/{id}",
    "description": "Update an App Clip advanced experience.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAdvancedExperienceUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_app_store_review_details.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipAppStoreReviewDetails",
    "description": "Create an App Clip App Store review detail.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAppStoreReviewDetailCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_app_store_review_details.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipAppStoreReviewDetails/{id}",
    "description": "Read one App Clip App Store review detail by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appClipAppStoreReviewDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClipAppStoreReviewDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "invocationUrls",
          "appClipDefaultExperience"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClipDefaultExperience"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_app_store_review_details.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipAppStoreReviewDetails/{id}",
    "description": "Update an App Clip App Store review detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAppStoreReviewDetailUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_default_experience_localizations.app_clip_header_image.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperienceLocalizations/{id}/appClipHeaderImage",
    "description": "Read the App Clip header image for an App Clip default experience localization.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClipDefaultExperienceLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experience_localizations.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipDefaultExperienceLocalizations",
    "description": "Create an App Clip default experience localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_clip_default_experience_localizations.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appClipDefaultExperienceLocalizations/{id}",
    "description": "Delete an App Clip default experience localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_clip_default_experience_localizations.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperienceLocalizations/{id}",
    "description": "Read one App Clip default experience localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appClipDefaultExperienceLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClipDefaultExperienceLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "subtitle",
          "appClipDefaultExperience",
          "appClipHeaderImage"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClipDefaultExperience",
          "appClipHeaderImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experience_localizations.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipDefaultExperienceLocalizations/{id}",
    "description": "Update an App Clip default experience localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_clip_default_experiences.app_clip_app_store_review_detail.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}/appClipAppStoreReviewDetail",
    "description": "Read the App Clip App Store review detail for an App Clip default experience.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClipDefaultExperience"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experiences.app_clip_default_experience_localizations.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}/appClipDefaultExperienceLocalizations",
    "description": "List the App Clip default experience localizations belonging to an App Clip default experience.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by attribute 'locale'"
      },
      {
        "name": "fields[appClipDefaultExperienceLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClipDefaultExperienceLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "subtitle",
          "appClipDefaultExperience",
          "appClipHeaderImage"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClipDefaultExperience",
          "appClipHeaderImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experiences.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipDefaultExperiences",
    "description": "Create an App Clip default experience.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_default_experiences.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appClipDefaultExperiences/{id}",
    "description": "Delete an App Clip default experience.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_clip_default_experiences.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}",
    "description": "Read one App Clip default experience by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appClipDefaultExperiences]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClipDefaultExperiences Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "action",
          "appClip",
          "releaseWithAppStoreVersion",
          "appClipDefaultExperienceLocalizations",
          "appClipAppStoreReviewDetail"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClip",
          "releaseWithAppStoreVersion",
          "appClipDefaultExperienceLocalizations",
          "appClipAppStoreReviewDetail"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experiences.release_with_app_store_version.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}/releaseWithAppStoreVersion",
    "description": "Read the release with App Store version for an App Clip default experience.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appStoreVersionLocalizations",
          "build",
          "appStoreVersionPhasedRelease",
          "gameCenterAppVersion",
          "routingAppCoverage",
          "appStoreReviewDetail",
          "appStoreVersionSubmission",
          "appClipDefaultExperience",
          "appStoreVersionExperiments",
          "appStoreVersionExperimentsV2",
          "alternativeDistributionPackage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experiences.release_with_app_store_version.set",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipDefaultExperiences/{id}/relationships/releaseWithAppStoreVersion",
    "description": "Set the release with App Store version linked to an App Clip default experience.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceReleaseWithAppStoreVersionLinkageRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_default_experiences.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipDefaultExperiences/{id}",
    "description": "Update an App Clip default experience.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_header_images.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipHeaderImages",
    "description": "Create an App Clip header image.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipHeaderImageCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_clip_header_images.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appClipHeaderImages/{id}",
    "description": "Delete an App Clip header image.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_clip_header_images.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipHeaderImages/{id}",
    "description": "Read one App Clip header image by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appClipHeaderImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClipHeaderImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "sourceFileChecksum",
          "imageAsset",
          "uploadOperations",
          "assetDeliveryState",
          "appClipDefaultExperienceLocalization"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClipDefaultExperienceLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_header_images.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipHeaderImages/{id}",
    "description": "Update an App Clip header image.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipHeaderImageUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_clips.app_clip_advanced_experiences.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClips/{id}/appClipAdvancedExperiences",
    "description": "List the App Clip advanced experiences belonging to an App Clip.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[status]",
        "type": "array",
        "description": "filter by attribute 'status'",
        "enum": [
          "RECEIVED",
          "DEACTIVATED",
          "APP_TRANSFER_IN_PROGRESS"
        ]
      },
      {
        "name": "filter[placeStatus]",
        "type": "array",
        "description": "filter by attribute 'placeStatus'",
        "enum": [
          "PENDING",
          "MATCHED",
          "NO_MATCH"
        ]
      },
      {
        "name": "filter[action]",
        "type": "array",
        "description": "filter by attribute 'action'",
        "enum": [
          "OPEN",
          "VIEW",
          "PLAY"
        ]
      },
      {
        "name": "fields[appClipAdvancedExperiences]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClipAdvancedExperiences Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "link",
          "version",
          "status",
          "action",
          "isPoweredBy",
          "place",
          "placeStatus",
          "businessCategory",
          "defaultLanguage",
          "appClip",
          "headerImage",
          "localizations"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClip",
          "headerImage",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clips.app_clip_default_experiences.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClips/{id}/appClipDefaultExperiences",
    "description": "List the App Clip default experiences belonging to an App Clip.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "exists[releaseWithAppStoreVersion]",
        "type": "boolean",
        "description": "filter by existence or non-existence of related 'releaseWithAppStoreVersion'"
      },
      {
        "name": "fields[appClipDefaultExperiences]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClipDefaultExperiences Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "action",
          "appClip",
          "releaseWithAppStoreVersion",
          "appClipDefaultExperienceLocalizations",
          "appClipAppStoreReviewDetail"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClip",
          "releaseWithAppStoreVersion",
          "appClipDefaultExperienceLocalizations",
          "appClipAppStoreReviewDetail"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clips.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClips/{id}",
    "description": "Read one App Clip by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appClips]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClips Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "bundleId",
          "app",
          "appClipDefaultExperiences",
          "appClipAdvancedExperiences"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appClipDefaultExperiences"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_localizations.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appCustomProductPageLocalizations",
    "description": "Create an app custom product page localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_custom_product_page_localizations.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appCustomProductPageLocalizations/{id}",
    "description": "Delete an app custom product page localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_custom_product_page_localizations.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}",
    "description": "Read one app custom product page localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appCustomProductPageLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appCustomProductPageLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "promotionalText",
          "appCustomProductPageVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords",
          "placements"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appCustomProductPageVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords",
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_localizations.placements.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}/placements",
    "description": "List the placements belonging to an app custom product page localization.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[placementType]",
        "type": "array",
        "description": "filter by attribute 'placementType'",
        "enum": [
          "APP_SCREENSHOT",
          "IMESSAGE_APP_SCREENSHOT",
          "APP_PREVIEW",
          "PRODUCT_PAGE_HEADER_ASSET",
          "APP_STORE_SEARCH_RESULTS_ASSET",
          "SEARCH_RESULTS_ADS_ASSET",
          "TODAY_TAB_ADS_ASSET",
          "EVENT_CARD_ASSET",
          "EVENT_DETAILS_PAGE_ASSET",
          "RETENTION_MESSAGE_ASSET"
        ]
      },
      {
        "name": "filter[placementGroup]",
        "type": "array",
        "description": "filter by attribute 'placementGroup'"
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "ASSET_PROCESSING",
          "FAILED",
          "PARENT_PREPARE_FOR_SUBMISSION",
          "PARENT_READY_FOR_REVIEW",
          "PARENT_WAITING_FOR_REVIEW",
          "PARENT_IN_REVIEW",
          "PARENT_APPROVED"
        ]
      },
      {
        "name": "filter[image]",
        "type": "array",
        "description": "filter by id(s) of related 'image' Takes a 'image' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[video]",
        "type": "array",
        "description": "filter by id(s) of related 'video' Takes a 'video' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appEventLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appEventLocalization' Takes a 'appEventLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionLocalization' Takes a 'appStoreVersionLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionExperimentTreatmentLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionExperimentTreatmentLocalization' Takes a 'appStoreVersionExperimentTreatmentLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate",
          "lastModifiedDate",
          "-lastModifiedDate",
          "placementGroupPosition",
          "-placementGroupPosition"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "image",
          "video",
          "appEventLocalization",
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_localizations.search_keywords.add",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appCustomProductPageLocalizations/{id}/relationships/searchKeywords",
    "description": "Link search keywords to an app custom product page localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageLocalizationSearchKeywordsLinkagesRequest",
    "risk": "public"
  },
  {
    "name": "app_custom_product_page_localizations.search_keywords.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}/searchKeywords",
    "description": "List the search keywords belonging to an app custom product page localization.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by platform"
      },
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by locale"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_localizations.search_keywords.remove",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appCustomProductPageLocalizations/{id}/relationships/searchKeywords",
    "description": "Unlink search keywords from an app custom product page localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageLocalizationSearchKeywordsLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "app_custom_product_page_localizations.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appCustomProductPageLocalizations/{id}",
    "description": "Update an app custom product page localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_custom_product_page_versions.app_custom_product_page_localizations.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageVersions/{id}/appCustomProductPageLocalizations",
    "description": "List the app custom product page localizations belonging to an app custom product page version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by attribute 'locale'"
      },
      {
        "name": "fields[appCustomProductPageLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appCustomProductPageLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "promotionalText",
          "appCustomProductPageVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords",
          "placements"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appCustomProductPageVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords",
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_versions.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appCustomProductPageVersions",
    "description": "Create an app custom product page version.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageVersionCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_custom_product_page_versions.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageVersions/{id}",
    "description": "Read one app custom product page version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appCustomProductPageVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type appCustomProductPageVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "deepLink",
          "appCustomProductPage",
          "appCustomProductPageLocalizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appCustomProductPage",
          "appCustomProductPageLocalizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_versions.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appCustomProductPageVersions/{id}",
    "description": "Update an app custom product page version.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageVersionUpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_custom_product_pages.app_custom_product_page_versions.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPages/{id}/appCustomProductPageVersions",
    "description": "List the app custom product page versions belonging to an app custom product page.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "PREPARE_FOR_SUBMISSION",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "ACCEPTED",
          "APPROVED",
          "REPLACED_WITH_NEW_VERSION",
          "REJECTED"
        ]
      },
      {
        "name": "fields[appCustomProductPageVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type appCustomProductPageVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "deepLink",
          "appCustomProductPage",
          "appCustomProductPageLocalizations"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appCustomProductPage",
          "appCustomProductPageLocalizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_pages.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appCustomProductPages",
    "description": "Create a custom product page — an alternative store page with its own screenshots and text, reached by a campaign link, for testing a message with one audience.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_custom_product_pages.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appCustomProductPages/{id}",
    "description": "Delete an app custom product page.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_custom_product_pages.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPages/{id}",
    "description": "Read one app custom product page by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appCustomProductPages]",
        "type": "array",
        "description": "the fields to include for returned resources of type appCustomProductPages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "url",
          "visible",
          "app",
          "appCustomProductPageVersions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appCustomProductPageVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_pages.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appCustomProductPages/{id}",
    "description": "Update an app custom product page.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageUpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_encryption_declaration_documents.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/appEncryptionDeclarationDocuments",
    "description": "Create an app encryption declaration document.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEncryptionDeclarationDocumentCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_encryption_declaration_documents.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarationDocuments/{id}",
    "description": "Read one app encryption declaration document by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appEncryptionDeclarationDocuments]",
        "type": "array",
        "description": "the fields to include for returned resources of type appEncryptionDeclarationDocuments Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "assetToken",
          "downloadUrl",
          "sourceFileChecksum",
          "uploadOperations",
          "assetDeliveryState"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_encryption_declaration_documents.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/appEncryptionDeclarationDocuments/{id}",
    "description": "Update an app encryption declaration document.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEncryptionDeclarationDocumentUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_encryption_declarations.app_encryption_declaration_document.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarations/{id}/appEncryptionDeclarationDocument",
    "description": "Read the app encryption declaration document for an app encryption declaration.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_encryption_declarations.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/appEncryptionDeclarations",
    "description": "Create an app encryption declaration.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEncryptionDeclarationCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_encryption_declarations.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarations/{id}",
    "description": "Read one app encryption declaration by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appEncryptionDeclarations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appEncryptionDeclarations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "appDescription",
          "createdDate",
          "usesEncryption",
          "exempt",
          "containsProprietaryCryptography",
          "containsThirdPartyCryptography",
          "availableOnFrenchStore",
          "platform",
          "uploadedDate",
          "documentUrl",
          "documentName",
          "documentType",
          "appEncryptionDeclarationState",
          "codeValue",
          "app",
          "builds",
          "appEncryptionDeclarationDocument"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "builds",
          "appEncryptionDeclarationDocument"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_encryption_declarations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarations",
    "description": "List export-compliance declarations, which a build needs before it can ship in most territories. Filter by app or build to find whether one already covers the build you are releasing.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list."
      },
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds' Takes a 'builds' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "fields[appEncryptionDeclarations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appEncryptionDeclarations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "appDescription",
          "createdDate",
          "usesEncryption",
          "exempt",
          "containsProprietaryCryptography",
          "containsThirdPartyCryptography",
          "availableOnFrenchStore",
          "platform",
          "uploadedDate",
          "documentUrl",
          "documentName",
          "documentType",
          "appEncryptionDeclarationState",
          "codeValue",
          "app",
          "builds",
          "appEncryptionDeclarationDocument"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "builds",
          "appEncryptionDeclarationDocument"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_event_localizations.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appEventLocalizations",
    "description": "Create an app event localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_event_localizations.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appEventLocalizations/{id}",
    "description": "Delete an app event localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_event_localizations.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEventLocalizations/{id}",
    "description": "Read one app event localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appEventLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appEventLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "name",
          "shortDescription",
          "longDescription",
          "appEvent",
          "appEventScreenshots",
          "appEventVideoClips",
          "placements"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appEvent",
          "appEventScreenshots",
          "appEventVideoClips",
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_event_localizations.placements.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEventLocalizations/{id}/placements",
    "description": "List the asset library images and videos placed on an in-app event localization.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[placementType]",
        "type": "array",
        "description": "filter by attribute 'placementType'",
        "enum": [
          "APP_SCREENSHOT",
          "IMESSAGE_APP_SCREENSHOT",
          "APP_PREVIEW",
          "PRODUCT_PAGE_HEADER_ASSET",
          "APP_STORE_SEARCH_RESULTS_ASSET",
          "SEARCH_RESULTS_ADS_ASSET",
          "TODAY_TAB_ADS_ASSET",
          "EVENT_CARD_ASSET",
          "EVENT_DETAILS_PAGE_ASSET",
          "RETENTION_MESSAGE_ASSET"
        ]
      },
      {
        "name": "filter[placementGroup]",
        "type": "array",
        "description": "filter by attribute 'placementGroup'"
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "ASSET_PROCESSING",
          "FAILED",
          "PARENT_PREPARE_FOR_SUBMISSION",
          "PARENT_READY_FOR_REVIEW",
          "PARENT_WAITING_FOR_REVIEW",
          "PARENT_IN_REVIEW",
          "PARENT_APPROVED"
        ]
      },
      {
        "name": "filter[image]",
        "type": "array",
        "description": "filter by id(s) of related 'image' Takes a 'image' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[video]",
        "type": "array",
        "description": "filter by id(s) of related 'video' Takes a 'video' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionLocalization' Takes a 'appStoreVersionLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appCustomProductPageLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appCustomProductPageLocalization' Takes a 'appCustomProductPageLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionExperimentTreatmentLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionExperimentTreatmentLocalization' Takes a 'appStoreVersionExperimentTreatmentLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate",
          "lastModifiedDate",
          "-lastModifiedDate",
          "placementGroupPosition",
          "-placementGroupPosition"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "image",
          "video",
          "appEventLocalization",
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_event_localizations.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appEventLocalizations/{id}",
    "description": "Update an app event localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_events.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appEvents",
    "description": "Create an in-app event — a limited-time activity Apple features on your store page, such as a tournament, a live stream, a challenge or a premiere. Localize it and add artwork before submitting it for review.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_events.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appEvents/{id}",
    "description": "Delete an app event.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_events.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEvents/{id}",
    "description": "Read one app event by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appEvents]",
        "type": "array",
        "description": "the fields to include for returned resources of type appEvents Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "badge",
          "eventState",
          "deepLink",
          "purchaseRequirement",
          "primaryLocale",
          "priority",
          "purpose",
          "territorySchedules",
          "archivedTerritorySchedules",
          "localizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_events.localizations.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEvents/{id}/localizations",
    "description": "List the localizations belonging to an app event.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appEvent",
          "appEventScreenshots",
          "appEventVideoClips",
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_events.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appEvents/{id}",
    "description": "Update an app event.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventUpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_info_localizations.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/appInfoLocalizations",
    "description": "Add a new language for the app-level listing fields: name, subtitle, privacy policy.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppInfoLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_info_localizations.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/appInfoLocalizations/{id}",
    "description": "Delete an app info localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_info_localizations.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfoLocalizations/{id}",
    "description": "Read one app info localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appInfoLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appInfoLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "name",
          "subtitle",
          "privacyPolicyUrl",
          "privacyChoicesUrl",
          "privacyPolicyText",
          "appInfo"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appInfo"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_info_localizations.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/appInfoLocalizations/{id}",
    "description": "Update the listing title (Apple's field is called the name), subtitle or privacy policy text for one language. Name and subtitle are capped at 30 characters.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppInfoLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_infos.age_rating_declaration.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/ageRatingDeclaration",
    "description": "Read the age rating declaration for an app info.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_infos.app_info_localizations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/appInfoLocalizations",
    "description": "List the app info localizations belonging to an app info.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by attribute 'locale'"
      },
      {
        "name": "fields[appInfoLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appInfoLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "name",
          "subtitle",
          "privacyPolicyUrl",
          "privacyChoicesUrl",
          "privacyPolicyText",
          "appInfo"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appInfo"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}",
    "description": "Read one app info by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appInfos]",
        "type": "array",
        "description": "the fields to include for returned resources of type appInfos Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "appStoreState",
          "state",
          "appStoreAgeRating",
          "australiaAgeRating",
          "brazilAgeRating",
          "brazilAgeRatingV2",
          "franceAgeRating",
          "koreaAgeRating",
          "app",
          "ageRatingDeclaration",
          "appInfoLocalizations",
          "primaryCategory",
          "primarySubcategoryOne",
          "primarySubcategoryTwo",
          "secondaryCategory",
          "secondarySubcategoryOne",
          "secondarySubcategoryTwo",
          "territoryAgeRatings"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "ageRatingDeclaration",
          "appInfoLocalizations",
          "primaryCategory",
          "primarySubcategoryOne",
          "primarySubcategoryTwo",
          "secondaryCategory",
          "secondarySubcategoryOne",
          "secondarySubcategoryTwo"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.primary_category.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/primaryCategory",
    "description": "Read the primary category for an app info.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.primary_subcategory_one.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/primarySubcategoryOne",
    "description": "Read the primary subcategory one for an app info.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.primary_subcategory_two.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/primarySubcategoryTwo",
    "description": "Read the primary subcategory two for an app info.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.secondary_category.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/secondaryCategory",
    "description": "Read the secondary category for an app info.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.secondary_subcategory_one.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/secondarySubcategoryOne",
    "description": "Read the secondary subcategory one for an app info.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.secondary_subcategory_two.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/secondarySubcategoryTwo",
    "description": "Read the secondary subcategory two for an app info.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.territory_age_ratings.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/territoryAgeRatings",
    "description": "List the territory age ratings belonging to an app info.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[territoryAgeRatings]",
        "type": "array",
        "description": "the fields to include for returned resources of type territoryAgeRatings Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "appStoreAgeRating",
          "territory"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/appInfos/{id}",
    "description": "Change an app’s primary and secondary App Store category and its subcategories. These belong to the app rather than to a version, so changing them here changes them for every version.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppInfoUpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_price_points_v3.equalizations.list",
    "domain": "pricing",
    "method": "GET",
    "path": "/v3/appPricePoints/{id}/equalizations",
    "description": "List the equalizations belonging to an app price points v3.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_price_points_v3.get",
    "domain": "pricing",
    "method": "GET",
    "path": "/v3/appPricePoints/{id}",
    "description": "Read one app price points v3 by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appPricePoints]",
        "type": "array",
        "description": "the fields to include for returned resources of type appPricePoints Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "customerPrice",
          "proceeds",
          "app",
          "equalizations",
          "territory"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_price_schedules.automatic_prices.list",
    "domain": "pricing",
    "method": "GET",
    "path": "/v1/appPriceSchedules/{id}/automaticPrices",
    "description": "List the automatic prices belonging to an app price schedule.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[startDate]",
        "type": "array",
        "description": "filter by attribute 'startDate'"
      },
      {
        "name": "filter[endDate]",
        "type": "array",
        "description": "filter by attribute 'endDate'"
      },
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned. ALWAYS pass include=appPricePoint,territory — without it every row is an opaque id with no price and no currency, which reads as \"there is no price here\".",
        "enum": [
          "appPricePoint",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_price_schedules.base_territory.get",
    "domain": "pricing",
    "method": "GET",
    "path": "/v1/appPriceSchedules/{id}/baseTerritory",
    "description": "Read the base territory for an app price schedule.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_price_schedules.create",
    "domain": "pricing",
    "method": "POST",
    "path": "/v1/appPriceSchedules",
    "description": "Change or set an app's price: create a price schedule with base territory and manual prices. Find price point IDs with apps__app_price_points__list first.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppPriceScheduleCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "app_price_schedules.get",
    "domain": "pricing",
    "method": "GET",
    "path": "/v1/appPriceSchedules/{id}",
    "description": "Read one app price schedule by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appPriceSchedules]",
        "type": "array",
        "description": "the fields to include for returned resources of type appPriceSchedules Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "app",
          "baseTerritory",
          "manualPrices",
          "automaticPrices"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "baseTerritory",
          "manualPrices",
          "automaticPrices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_price_schedules.manual_prices.list",
    "domain": "pricing",
    "method": "GET",
    "path": "/v1/appPriceSchedules/{id}/manualPrices",
    "description": "List the manual prices belonging to an app price schedule.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[startDate]",
        "type": "array",
        "description": "filter by attribute 'startDate'"
      },
      {
        "name": "filter[endDate]",
        "type": "array",
        "description": "filter by attribute 'endDate'"
      },
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned. ALWAYS pass include=appPricePoint,territory — without it every row is an opaque id with no price and no currency, which reads as \"there is no price here\".",
        "enum": [
          "appPricePoint",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_review_attachments.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreReviewAttachments",
    "description": "Create an App Store review attachment.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreReviewAttachmentCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_store_review_attachments.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreReviewAttachments/{id}",
    "description": "Delete an App Store review attachment.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_store_review_attachments.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreReviewAttachments/{id}",
    "description": "Read one App Store review attachment by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appStoreReviewAttachments]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreReviewAttachments Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "sourceFileChecksum",
          "uploadOperations",
          "assetDeliveryState",
          "appStoreReviewDetail"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreReviewDetail"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_review_attachments.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreReviewAttachments/{id}",
    "description": "Update an App Store review attachment.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreReviewAttachmentUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_store_review_details.app_store_review_attachments.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreReviewDetails/{id}/appStoreReviewAttachments",
    "description": "List the App Store review attachments belonging to an App Store review detail.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appStoreReviewAttachments]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreReviewAttachments Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "sourceFileChecksum",
          "uploadOperations",
          "assetDeliveryState",
          "appStoreReviewDetail"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreReviewDetail"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_review_details.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreReviewDetails",
    "description": "Create an App Store review detail.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreReviewDetailCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_store_review_details.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreReviewDetails/{id}",
    "description": "Read one App Store review detail by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appStoreReviewDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreReviewDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "contactFirstName",
          "contactLastName",
          "contactPhone",
          "contactEmail",
          "demoAccountName",
          "demoAccountPassword",
          "demoAccountRequired",
          "notes",
          "appStoreVersion",
          "appStoreReviewAttachments"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersion",
          "appStoreReviewAttachments"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_review_details.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreReviewDetails/{id}",
    "description": "Update an App Store review detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreReviewDetailUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_store_version_experiment_treatment_localizations.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations",
    "description": "Create an App Store version experiment treatment localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentTreatmentLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_store_version_experiment_treatment_localizations.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations/{id}",
    "description": "Delete an App Store version experiment treatment localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_store_version_experiment_treatment_localizations.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations/{id}",
    "description": "Read one App Store version experiment treatment localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appStoreVersionExperimentTreatmentLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreVersionExperimentTreatmentLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "appStoreVersionExperimentTreatment",
          "appScreenshotSets",
          "appPreviewSets",
          "placements"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersionExperimentTreatment",
          "appScreenshotSets",
          "appPreviewSets",
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiment_treatment_localizations.placements.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations/{id}/placements",
    "description": "List the placements belonging to an App Store version experiment treatment localization.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[placementType]",
        "type": "array",
        "description": "filter by attribute 'placementType'",
        "enum": [
          "APP_SCREENSHOT",
          "IMESSAGE_APP_SCREENSHOT",
          "APP_PREVIEW",
          "PRODUCT_PAGE_HEADER_ASSET",
          "APP_STORE_SEARCH_RESULTS_ASSET",
          "SEARCH_RESULTS_ADS_ASSET",
          "TODAY_TAB_ADS_ASSET",
          "EVENT_CARD_ASSET",
          "EVENT_DETAILS_PAGE_ASSET",
          "RETENTION_MESSAGE_ASSET"
        ]
      },
      {
        "name": "filter[placementGroup]",
        "type": "array",
        "description": "filter by attribute 'placementGroup'"
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "ASSET_PROCESSING",
          "FAILED",
          "PARENT_PREPARE_FOR_SUBMISSION",
          "PARENT_READY_FOR_REVIEW",
          "PARENT_WAITING_FOR_REVIEW",
          "PARENT_IN_REVIEW",
          "PARENT_APPROVED"
        ]
      },
      {
        "name": "filter[image]",
        "type": "array",
        "description": "filter by id(s) of related 'image' Takes a 'image' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[video]",
        "type": "array",
        "description": "filter by id(s) of related 'video' Takes a 'video' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appEventLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appEventLocalization' Takes a 'appEventLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionLocalization' Takes a 'appStoreVersionLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appCustomProductPageLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appCustomProductPageLocalization' Takes a 'appCustomProductPageLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate",
          "lastModifiedDate",
          "-lastModifiedDate",
          "placementGroupPosition",
          "-placementGroupPosition"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "image",
          "video",
          "appEventLocalization",
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiment_treatments.app_store_version_experiment_treatment_localizations.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatments/{id}/appStoreVersionExperimentTreatmentLocalizations",
    "description": "List the App Store version experiment treatment localizations belonging to an App Store version experiment treatment.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by attribute 'locale'"
      },
      {
        "name": "fields[appStoreVersionExperimentTreatmentLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreVersionExperimentTreatmentLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "appStoreVersionExperimentTreatment",
          "appScreenshotSets",
          "appPreviewSets",
          "placements"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersionExperimentTreatment",
          "appScreenshotSets",
          "appPreviewSets",
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiment_treatments.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionExperimentTreatments",
    "description": "Create an App Store version experiment treatment.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentTreatmentCreateRequest",
    "risk": "low"
  },
  {
    "name": "app_store_version_experiment_treatments.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionExperimentTreatments/{id}",
    "description": "Delete an App Store version experiment treatment.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_store_version_experiment_treatments.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatments/{id}",
    "description": "Read one App Store version experiment treatment by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appStoreVersionExperimentTreatments]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreVersionExperimentTreatments Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "appIcon",
          "appIconName",
          "promotedDate",
          "appStoreVersionExperiment",
          "appStoreVersionExperimentV2",
          "appStoreVersionExperimentTreatmentLocalizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersionExperiment",
          "appStoreVersionExperimentV2",
          "appStoreVersionExperimentTreatmentLocalizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiment_treatments.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersionExperimentTreatments/{id}",
    "description": "Update an App Store version experiment treatment.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentTreatmentUpdateRequest",
    "risk": "low"
  },
  {
    "name": "app_store_version_experiments_v2.app_store_version_experiment_treatments.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v2/appStoreVersionExperiments/{id}/appStoreVersionExperimentTreatments",
    "description": "List the App Store version experiment treatments belonging to an App Store version experiments (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appStoreVersionExperimentTreatments]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreVersionExperimentTreatments Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "appIcon",
          "appIconName",
          "promotedDate",
          "appStoreVersionExperiment",
          "appStoreVersionExperimentV2",
          "appStoreVersionExperimentTreatmentLocalizations"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersionExperiment",
          "appStoreVersionExperimentV2",
          "appStoreVersionExperimentTreatmentLocalizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiments_v2.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v2/appStoreVersionExperiments",
    "description": "Start an A/B test on a version’s product page: up to three treatments against the live one, split by traffic share. Treatments and their assets are attached separately.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "app_store_version_experiments_v2.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v2/appStoreVersionExperiments/{id}",
    "description": "Delete a product page experiment and its results. Halt it with an update instead if you still want the numbers.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_store_version_experiments_v2.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v2/appStoreVersionExperiments/{id}",
    "description": "Read one App Store version experiments (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appStoreVersionExperiments]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreVersionExperiments Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "platform",
          "trafficProportion",
          "state",
          "reviewRequired",
          "startDate",
          "endDate",
          "app",
          "latestControlVersion",
          "controlVersions",
          "appStoreVersionExperimentTreatments"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "latestControlVersion",
          "controlVersions",
          "appStoreVersionExperimentTreatments"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiments_v2.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v2/appStoreVersionExperiments/{id}",
    "description": "Change a product page experiment — begin or halt it, or adjust its traffic split. Halting it keeps the results readable; deleting does not.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentV2UpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_store_version_localizations.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionLocalizations",
    "description": "Add a new language (locale) to an App Store version — description, keywords, what's new, promotional text for that language.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "app_store_version_localizations.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionLocalizations/{id}",
    "description": "Delete an App Store version localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_store_version_localizations.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}",
    "description": "Read one App Store version localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appStoreVersionLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreVersionLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "description",
          "locale",
          "keywords",
          "marketingUrl",
          "promotionalText",
          "supportUrl",
          "whatsNew",
          "appStoreVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords",
          "placements"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords",
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_localizations.placements.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}/placements",
    "description": "List the asset library images and videos placed on a version localization.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[placementType]",
        "type": "array",
        "description": "filter by attribute 'placementType'",
        "enum": [
          "APP_SCREENSHOT",
          "IMESSAGE_APP_SCREENSHOT",
          "APP_PREVIEW",
          "PRODUCT_PAGE_HEADER_ASSET",
          "APP_STORE_SEARCH_RESULTS_ASSET",
          "SEARCH_RESULTS_ADS_ASSET",
          "TODAY_TAB_ADS_ASSET",
          "EVENT_CARD_ASSET",
          "EVENT_DETAILS_PAGE_ASSET",
          "RETENTION_MESSAGE_ASSET"
        ]
      },
      {
        "name": "filter[placementGroup]",
        "type": "array",
        "description": "filter by attribute 'placementGroup'"
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "ASSET_PROCESSING",
          "FAILED",
          "PARENT_PREPARE_FOR_SUBMISSION",
          "PARENT_READY_FOR_REVIEW",
          "PARENT_WAITING_FOR_REVIEW",
          "PARENT_IN_REVIEW",
          "PARENT_APPROVED"
        ]
      },
      {
        "name": "filter[image]",
        "type": "array",
        "description": "filter by id(s) of related 'image' Takes a 'image' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[video]",
        "type": "array",
        "description": "filter by id(s) of related 'video' Takes a 'video' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appEventLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appEventLocalization' Takes a 'appEventLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appCustomProductPageLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appCustomProductPageLocalization' Takes a 'appCustomProductPageLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersionExperimentTreatmentLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionExperimentTreatmentLocalization' Takes a 'appStoreVersionExperimentTreatmentLocalization' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate",
          "lastModifiedDate",
          "-lastModifiedDate",
          "placementGroupPosition",
          "-placementGroupPosition"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "image",
          "video",
          "appEventLocalization",
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_localizations.search_keywords.add",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionLocalizations/{id}/relationships/searchKeywords",
    "description": "Add App Store search keywords to a version localization (ASO keyword optimization).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionLocalizationSearchKeywordsLinkagesRequest",
    "risk": "public"
  },
  {
    "name": "app_store_version_localizations.search_keywords.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}/searchKeywords",
    "description": "List the search keywords belonging to an App Store version localization.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by platform"
      },
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by locale"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_localizations.search_keywords.remove",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionLocalizations/{id}/relationships/searchKeywords",
    "description": "Unlink search keywords from an App Store version localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionLocalizationSearchKeywordsLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "app_store_version_localizations.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersionLocalizations/{id}",
    "description": "Update the store listing text for one language of a version: description, keywords, what's new (release notes), promotional text, support and marketing URLs.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "app_store_version_phased_releases.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionPhasedReleases",
    "description": "Start a phased (gradual) rollout for an approved version, releasing to a growing percentage of users over 7 days.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionPhasedReleaseCreateRequest",
    "risk": "release"
  },
  {
    "name": "app_store_version_phased_releases.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionPhasedReleases/{id}",
    "description": "Delete an App Store version phased release.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_store_version_phased_releases.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersionPhasedReleases/{id}",
    "description": "Pause, resume or complete a phased release. Set phasedReleaseState to PAUSE, ACTIVE or COMPLETE.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionPhasedReleaseUpdateRequest",
    "risk": "release"
  },
  {
    "name": "app_store_version_promotions.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionPromotions",
    "description": "Create an App Store version promotion.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionPromotionCreateRequest",
    "risk": "release"
  },
  {
    "name": "app_store_version_release_requests.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionReleaseRequests",
    "description": "Release the version immediately: publish an approved App Store version right now. Only for one Apple has already approved and that is waiting on you — the manual release button, not the submission.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionReleaseRequestCreateRequest",
    "risk": "release"
  },
  {
    "name": "app_store_versions.alternative_distribution_package.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/alternativeDistributionPackage",
    "description": "Read the alternative distribution package for an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_clip_default_experience.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appClipDefaultExperience",
    "description": "Read the App Clip default experience for an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appClip",
          "releaseWithAppStoreVersion",
          "appClipDefaultExperienceLocalizations",
          "appClipAppStoreReviewDetail"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_review_detail.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreReviewDetail",
    "description": "Read the App Store review detail for an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersion",
          "appStoreReviewAttachments"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_version_experiments_v2.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreVersionExperimentsV2",
    "description": "List the App Store version experiments (v2) belonging to an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "PREPARE_FOR_SUBMISSION",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "ACCEPTED",
          "APPROVED",
          "REJECTED",
          "COMPLETED",
          "STOPPED"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "latestControlVersion",
          "controlVersions",
          "appStoreVersionExperimentTreatments"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_version_localizations.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreVersionLocalizations",
    "description": "List the App Store version localizations belonging to an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by attribute 'locale'"
      },
      {
        "name": "fields[appStoreVersionLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreVersionLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "description",
          "locale",
          "keywords",
          "marketingUrl",
          "promotionalText",
          "supportUrl",
          "whatsNew",
          "appStoreVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords",
          "placements"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords",
          "placements"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_version_phased_release.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreVersionPhasedRelease",
    "description": "Read the App Store version phased release for an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.build.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/build",
    "description": "Read the build for an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.build.set",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersions/{id}/relationships/build",
    "description": "Set the build linked to an App Store version.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionBuildLinkageRequest",
    "risk": "release"
  },
  {
    "name": "app_store_versions.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersions",
    "description": "Start the next release: create a new App Store version to prepare. Do this before attaching a build and submitting for review.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionCreateRequest",
    "risk": "release"
  },
  {
    "name": "app_store_versions.customer_reviews.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/customerReviews",
    "description": "List the customer reviews belonging to an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by attribute 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list.",
        "enum": [
          "ABW",
          "AFG",
          "AGO",
          "AIA",
          "ALB",
          "AND",
          "ANT",
          "ARE",
          "ARG",
          "ARM",
          "ASM",
          "ATG",
          "AUS",
          "AUT",
          "AZE",
          "BDI",
          "BEL",
          "BEN",
          "BES",
          "BFA",
          "BGD",
          "BGR",
          "BHR",
          "BHS",
          "BIH",
          "BLR",
          "BLZ",
          "BMU",
          "BOL",
          "BRA",
          "BRB",
          "BRN",
          "BTN",
          "BWA",
          "CAF",
          "CAN",
          "CHE",
          "CHL",
          "CHN",
          "CIV"
        ]
      },
      {
        "name": "filter[rating]",
        "type": "array",
        "description": "filter by attribute 'rating'"
      },
      {
        "name": "filter[reviewTerritory]",
        "type": "array",
        "description": "filter by id(s) of related 'reviewTerritory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "exists[publishedResponse]",
        "type": "boolean",
        "description": "filter by publishedResponse"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "rating",
          "-rating",
          "createdDate",
          "-createdDate"
        ]
      },
      {
        "name": "fields[customerReviews]",
        "type": "array",
        "description": "the fields to include for returned resources of type customerReviews Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "rating",
          "title",
          "body",
          "reviewerNickname",
          "createdDate",
          "territory",
          "response",
          "reviewTerritory"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "response",
          "reviewTerritory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersions/{id}",
    "description": "Delete an App Store version.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "app_store_versions.game_center_app_version.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/gameCenterAppVersion",
    "description": "Read the Game Center app version for an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "compatibilityVersions",
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}",
    "description": "Read one App Store version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appStoreVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "platform",
          "versionString",
          "appStoreState",
          "appVersionState",
          "copyright",
          "reviewType",
          "releaseType",
          "earliestReleaseDate",
          "usesIdfa",
          "downloadable",
          "createdDate",
          "app",
          "appStoreVersionLocalizations",
          "build",
          "appStoreVersionPhasedRelease",
          "gameCenterAppVersion",
          "routingAppCoverage",
          "appStoreReviewDetail",
          "appStoreVersionSubmission",
          "appClipDefaultExperience",
          "appStoreVersionExperiments",
          "appStoreVersionExperimentsV2",
          "customerReviews",
          "alternativeDistributionPackage"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appStoreVersionLocalizations",
          "build",
          "appStoreVersionPhasedRelease",
          "gameCenterAppVersion",
          "routingAppCoverage",
          "appStoreReviewDetail",
          "appStoreVersionSubmission",
          "appClipDefaultExperience",
          "appStoreVersionExperiments",
          "appStoreVersionExperimentsV2",
          "alternativeDistributionPackage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.routing_app_coverage.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/routingAppCoverage",
    "description": "Read the routing app coverage for an App Store version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersions/{id}",
    "description": "Update an App Store version, including its release type and earliest release date.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionUpdateRequest",
    "risk": "release"
  },
  {
    "name": "app_tags.territories.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appTags/{id}/territories",
    "description": "List the territories belonging to an app tag.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[territories]",
        "type": "array",
        "description": "the fields to include for returned resources of type territories Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "currency"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_tags.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/appTags/{id}",
    "description": "Update an app tag.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppTagUpdateRequest",
    "risk": "low"
  },
  {
    "name": "apps.accessibility_declarations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/accessibilityDeclarations",
    "description": "List the accessibility declarations belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[deviceFamily]",
        "type": "array",
        "description": "filter by attribute 'deviceFamily'",
        "enum": [
          "IPHONE",
          "IPAD",
          "APPLE_TV",
          "APPLE_WATCH",
          "MAC",
          "VISION"
        ]
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "DRAFT",
          "PUBLISHED",
          "REPLACED"
        ]
      },
      {
        "name": "fields[accessibilityDeclarations]",
        "type": "array",
        "description": "the fields to include for returned resources of type accessibilityDeclarations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "deviceFamily",
          "state",
          "supportsAudioDescriptions",
          "supportsCaptions",
          "supportsDarkInterface",
          "supportsDifferentiateWithoutColorAlone",
          "supportsLargerText",
          "supportsReducedMotion",
          "supportsSufficientContrast",
          "supportsVoiceControl",
          "supportsVoiceover"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.alternative_distribution_key.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/alternativeDistributionKey",
    "description": "Read the alternative distribution key for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.analytics_report_requests.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/analyticsReportRequests",
    "description": "List the analytics report requests belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[accessType]",
        "type": "array",
        "description": "filter by attribute 'accessType'",
        "enum": [
          "ONE_TIME_SNAPSHOT",
          "ONGOING"
        ]
      },
      {
        "name": "fields[analyticsReportRequests]",
        "type": "array",
        "description": "the fields to include for returned resources of type analyticsReportRequests Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "accessType",
          "stoppedDueToInactivity",
          "reports"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "reports"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.android_to_ios_app_mapping_details.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/androidToIosAppMappingDetails",
    "description": "List the android to iOS app mapping details belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[androidToIosAppMappingDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type androidToIosAppMappingDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "packageName",
          "appSigningKeyPublicCertificateSha256Fingerprints"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_availability_v2.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appAvailabilityV2",
    "description": "Read the app availability (v2) for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territoryAvailabilities"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_clips.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appClips",
    "description": "List the App Clips belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[bundleId]",
        "type": "array",
        "description": "filter by attribute 'bundleId'"
      },
      {
        "name": "fields[appClips]",
        "type": "array",
        "description": "the fields to include for returned resources of type appClips Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "bundleId",
          "app",
          "appClipDefaultExperiences",
          "appClipAdvancedExperiences"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appClipDefaultExperiences"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_custom_product_pages.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appCustomProductPages",
    "description": "List the app custom product pages belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[visible]",
        "type": "array",
        "description": "filter by attribute 'visible'"
      },
      {
        "name": "fields[appCustomProductPages]",
        "type": "array",
        "description": "the fields to include for returned resources of type appCustomProductPages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "url",
          "visible",
          "app",
          "appCustomProductPageVersions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appCustomProductPageVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_encryption_declarations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appEncryptionDeclarations",
    "description": "List the app encryption declarations belonging to an app. Apple answers this path with 404; list the encryption declarations filtered by app instead.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds' Takes a 'builds' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "fields[appEncryptionDeclarations]",
        "type": "array",
        "description": "the fields to include for returned resources of type appEncryptionDeclarations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "appDescription",
          "createdDate",
          "usesEncryption",
          "exempt",
          "containsProprietaryCryptography",
          "containsThirdPartyCryptography",
          "availableOnFrenchStore",
          "platform",
          "uploadedDate",
          "documentUrl",
          "documentName",
          "documentType",
          "appEncryptionDeclarationState",
          "codeValue",
          "app",
          "builds",
          "appEncryptionDeclarationDocument"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "builds",
          "appEncryptionDeclarationDocument"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_events.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appEvents",
    "description": "List the app events belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[eventState]",
        "type": "array",
        "description": "filter by attribute 'eventState' An event that has ended is PAST, set by Apple on its own. ARCHIVED is only an event someone archived by hand. Filter on both to see every finished event.",
        "enum": [
          "DRAFT",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "REJECTED",
          "ACCEPTED",
          "APPROVED",
          "PUBLISHED",
          "PAST",
          "ARCHIVED"
        ]
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "fields[appEvents]",
        "type": "array",
        "description": "the fields to include for returned resources of type appEvents Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "badge",
          "eventState",
          "deepLink",
          "purchaseRequirement",
          "primaryLocale",
          "priority",
          "purpose",
          "territorySchedules",
          "archivedTerritorySchedules",
          "localizations"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_infos.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appInfos",
    "description": "List the app infos belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[appInfos]",
        "type": "array",
        "description": "the fields to include for returned resources of type appInfos Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "appStoreState",
          "state",
          "appStoreAgeRating",
          "australiaAgeRating",
          "brazilAgeRating",
          "brazilAgeRatingV2",
          "franceAgeRating",
          "koreaAgeRating",
          "app",
          "ageRatingDeclaration",
          "appInfoLocalizations",
          "primaryCategory",
          "primarySubcategoryOne",
          "primarySubcategoryTwo",
          "secondaryCategory",
          "secondarySubcategoryOne",
          "secondarySubcategoryTwo",
          "territoryAgeRatings"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "ageRatingDeclaration",
          "appInfoLocalizations",
          "primaryCategory",
          "primarySubcategoryOne",
          "primarySubcategoryTwo",
          "secondaryCategory",
          "secondarySubcategoryOne",
          "secondarySubcategoryTwo"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_price_points.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appPricePoints",
    "description": "List the allowed price points for an app's purchase price. Filter by territory (country) to find the price point ID matching the price you want to set.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "fields[appPricePoints]",
        "type": "array",
        "description": "the fields to include for returned resources of type appPricePoints Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "customerPrice",
          "proceeds",
          "app",
          "equalizations",
          "territory"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_price_schedule.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appPriceSchedule",
    "description": "Read the app price schedule for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "baseTerritory",
          "manualPrices",
          "automaticPrices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_store_version_experiments_v2.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appStoreVersionExperimentsV2",
    "description": "List the App Store version experiments (v2) belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "PREPARE_FOR_SUBMISSION",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "ACCEPTED",
          "APPROVED",
          "REJECTED",
          "COMPLETED",
          "STOPPED"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "latestControlVersion",
          "controlVersions",
          "appStoreVersionExperimentTreatments"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_store_versions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appStoreVersions",
    "description": "List App Store versions for an app, with their review state (e.g. PREPARE_FOR_SUBMISSION, WAITING_FOR_REVIEW, READY_FOR_SALE).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[versionString]",
        "type": "array",
        "description": "filter by attribute 'versionString'"
      },
      {
        "name": "filter[appStoreState]",
        "type": "array",
        "description": "filter by attribute 'appStoreState'",
        "enum": [
          "ACCEPTED",
          "DEVELOPER_REMOVED_FROM_SALE",
          "DEVELOPER_REJECTED",
          "IN_REVIEW",
          "INVALID_BINARY",
          "METADATA_REJECTED",
          "PENDING_APPLE_RELEASE",
          "PENDING_CONTRACT",
          "PENDING_DEVELOPER_RELEASE",
          "PREPARE_FOR_SUBMISSION",
          "PREORDER_READY_FOR_SALE",
          "PROCESSING_FOR_APP_STORE",
          "READY_FOR_REVIEW",
          "READY_FOR_SALE",
          "REJECTED",
          "REMOVED_FROM_SALE",
          "WAITING_FOR_EXPORT_COMPLIANCE",
          "WAITING_FOR_REVIEW",
          "REPLACED_WITH_NEW_VERSION",
          "NOT_APPLICABLE"
        ]
      },
      {
        "name": "filter[appVersionState]",
        "type": "array",
        "description": "filter by attribute 'appVersionState'",
        "enum": [
          "ACCEPTED",
          "DEVELOPER_REJECTED",
          "IN_REVIEW",
          "INVALID_BINARY",
          "METADATA_REJECTED",
          "PENDING_APPLE_RELEASE",
          "PENDING_DEVELOPER_RELEASE",
          "PREPARE_FOR_SUBMISSION",
          "PROCESSING_FOR_DISTRIBUTION",
          "READY_FOR_DISTRIBUTION",
          "READY_FOR_REVIEW",
          "REJECTED",
          "REPLACED_WITH_NEW_VERSION",
          "WAITING_FOR_EXPORT_COMPLIANCE",
          "WAITING_FOR_REVIEW"
        ]
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "fields[appStoreVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type appStoreVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "platform",
          "versionString",
          "appStoreState",
          "appVersionState",
          "copyright",
          "reviewType",
          "releaseType",
          "earliestReleaseDate",
          "usesIdfa",
          "downloadable",
          "createdDate",
          "app",
          "appStoreVersionLocalizations",
          "build",
          "appStoreVersionPhasedRelease",
          "gameCenterAppVersion",
          "routingAppCoverage",
          "appStoreReviewDetail",
          "appStoreVersionSubmission",
          "appClipDefaultExperience",
          "appStoreVersionExperiments",
          "appStoreVersionExperimentsV2",
          "customerReviews",
          "alternativeDistributionPackage"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appStoreVersionLocalizations",
          "build",
          "appStoreVersionPhasedRelease",
          "gameCenterAppVersion",
          "routingAppCoverage",
          "appStoreReviewDetail",
          "appStoreVersionSubmission",
          "appClipDefaultExperience",
          "appStoreVersionExperiments",
          "appStoreVersionExperimentsV2",
          "alternativeDistributionPackage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_tags.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appTags",
    "description": "List the app tags belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[visibleInAppStore]",
        "type": "array",
        "description": "filter by attribute 'visibleInAppStore'"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name"
        ]
      },
      {
        "name": "fields[appTags]",
        "type": "array",
        "description": "the fields to include for returned resources of type appTags Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "visibleInAppStore",
          "territories"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.asset_library.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/assetLibrary",
    "description": "Get an app's asset library, the media library its images and videos live in. Start here for its ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.background_assets.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/backgroundAssets",
    "description": "List the background assets belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[archived]",
        "type": "array",
        "description": "filter by attribute 'archived'"
      },
      {
        "name": "filter[assetPackIdentifier]",
        "type": "array",
        "description": "filter by attribute 'assetPackIdentifier'"
      },
      {
        "name": "filter[versions.locale]",
        "type": "array",
        "description": "filter by attribute 'versions.locale'"
      },
      {
        "name": "filter[versions.platforms]",
        "type": "array",
        "description": "filter by attribute 'versions.platforms'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "assetPackIdentifier",
          "-assetPackIdentifier",
          "createdDate",
          "-createdDate"
        ]
      },
      {
        "name": "fields[backgroundAssets]",
        "type": "array",
        "description": "the fields to include for returned resources of type backgroundAssets Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "archived",
          "assetPackIdentifier",
          "createdDate",
          "usedBytes",
          "app",
          "versions",
          "appStoreVersion",
          "internalBetaVersion",
          "externalBetaVersion"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appStoreVersion",
          "internalBetaVersion",
          "externalBetaVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.beta_app_localizations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaAppLocalizations",
    "description": "List the beta app localizations belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaAppLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaAppLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "feedbackEmail",
          "marketingUrl",
          "privacyPolicyUrl",
          "tvOsPrivacyPolicy",
          "description",
          "locale",
          "app"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.beta_app_review_detail.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaAppReviewDetail",
    "description": "Read the beta app review detail for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.beta_feedback_crash_submissions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaFeedbackCrashSubmissions",
    "description": "List the beta feedback crash submissions belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[deviceModel]",
        "type": "array",
        "description": "filter by attribute 'deviceModel'"
      },
      {
        "name": "filter[osVersion]",
        "type": "array",
        "description": "filter by attribute 'osVersion'"
      },
      {
        "name": "filter[appPlatform]",
        "type": "array",
        "description": "filter by attribute 'appPlatform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[devicePlatform]",
        "type": "array",
        "description": "filter by attribute 'devicePlatform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[build]",
        "type": "array",
        "description": "filter by id(s) of related 'build' Takes a 'build' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[build.preReleaseVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'build.preReleaseVersion' Takes a 'build.preReleaseVersion' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[tester]",
        "type": "array",
        "description": "filter by id(s) of related 'tester' Takes a 'tester' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate"
        ]
      },
      {
        "name": "fields[betaFeedbackCrashSubmissions]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaFeedbackCrashSubmissions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "createdDate",
          "comment",
          "email",
          "deviceModel",
          "osVersion",
          "locale",
          "timeZone",
          "architecture",
          "connectionType",
          "pairedAppleWatch",
          "appUptimeInMilliseconds",
          "diskBytesAvailable",
          "diskBytesTotal",
          "batteryPercentage",
          "screenWidthInPoints",
          "screenHeightInPoints",
          "appPlatform",
          "devicePlatform",
          "deviceFamily",
          "buildBundleId",
          "crashLog",
          "build",
          "tester"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build",
          "tester"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.beta_feedback_screenshot_submissions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaFeedbackScreenshotSubmissions",
    "description": "List the beta feedback screenshot submissions belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[deviceModel]",
        "type": "array",
        "description": "filter by attribute 'deviceModel'"
      },
      {
        "name": "filter[osVersion]",
        "type": "array",
        "description": "filter by attribute 'osVersion'"
      },
      {
        "name": "filter[appPlatform]",
        "type": "array",
        "description": "filter by attribute 'appPlatform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[devicePlatform]",
        "type": "array",
        "description": "filter by attribute 'devicePlatform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[build]",
        "type": "array",
        "description": "filter by id(s) of related 'build' Takes a 'build' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[build.preReleaseVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'build.preReleaseVersion' Takes a 'build.preReleaseVersion' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[tester]",
        "type": "array",
        "description": "filter by id(s) of related 'tester' Takes a 'tester' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "createdDate",
          "-createdDate"
        ]
      },
      {
        "name": "fields[betaFeedbackScreenshotSubmissions]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaFeedbackScreenshotSubmissions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "createdDate",
          "comment",
          "email",
          "deviceModel",
          "osVersion",
          "locale",
          "timeZone",
          "architecture",
          "connectionType",
          "pairedAppleWatch",
          "appUptimeInMilliseconds",
          "diskBytesAvailable",
          "diskBytesTotal",
          "batteryPercentage",
          "screenWidthInPoints",
          "screenHeightInPoints",
          "appPlatform",
          "devicePlatform",
          "deviceFamily",
          "buildBundleId",
          "screenshots",
          "build",
          "tester"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build",
          "tester"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.beta_groups.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaGroups",
    "description": "List the beta groups belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaGroups]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaGroups Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "createdDate",
          "isInternalGroup",
          "hasAccessToAllBuilds",
          "publicLinkEnabled",
          "publicLinkId",
          "publicLinkLimitEnabled",
          "publicLinkLimit",
          "publicLink",
          "feedbackEnabled",
          "iosBuildsAvailableForAppleSiliconMac",
          "iosBuildsAvailableForAppleVision",
          "app",
          "builds",
          "betaTesters",
          "betaRecruitmentCriteria",
          "betaRecruitmentCriterionCompatibleBuildCheck"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.beta_license_agreement.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaLicenseAgreement",
    "description": "Read the beta license agreement for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.beta_tester_usages.metrics",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/metrics/betaTesterUsages",
    "description": "Read beta tester usages metrics for an app. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "period",
        "type": "string",
        "description": "the duration of the reporting period",
        "enum": [
          "P7D",
          "P30D",
          "P90D",
          "P365D"
        ]
      },
      {
        "name": "groupBy",
        "type": "array",
        "description": "the dimension by which to group the results",
        "enum": [
          "betaTesters"
        ]
      },
      {
        "name": "filter[betaTesters]",
        "type": "string",
        "description": "filter by 'betaTesters' relationship dimension"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.beta_testers.remove",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/apps/{id}/relationships/betaTesters",
    "description": "Unlink beta testers from an app.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppBetaTestersLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "apps.build_uploads.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/buildUploads",
    "description": "List the build uploads belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[cfBundleShortVersionString]",
        "type": "array",
        "description": "filter by attribute 'cfBundleShortVersionString'"
      },
      {
        "name": "filter[cfBundleVersion]",
        "type": "array",
        "description": "filter by attribute 'cfBundleVersion'"
      },
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by state"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "cfBundleVersion",
          "-cfBundleVersion",
          "uploadedDate",
          "-uploadedDate"
        ]
      },
      {
        "name": "fields[buildUploads]",
        "type": "array",
        "description": "the fields to include for returned resources of type buildUploads Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "cfBundleShortVersionString",
          "cfBundleVersion",
          "createdDate",
          "state",
          "platform",
          "uploadedDate",
          "build",
          "assetFile",
          "assetDescriptionFile",
          "assetSpiFile",
          "buildUploadFiles"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build",
          "assetFile",
          "assetDescriptionFile",
          "assetSpiFile"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.builds.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/builds",
    "description": "List builds uploaded for an app, newest first when sorted by -uploadedDate.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[builds]",
        "type": "array",
        "description": "the fields to include for returned resources of type builds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "uploadedDate",
          "expirationDate",
          "expired",
          "minOsVersion",
          "lsMinimumSystemVersion",
          "computedMinMacOsVersion",
          "computedMinVisionOsVersion",
          "iconAssetToken",
          "processingState",
          "buildAudienceType",
          "usesNonExemptEncryption",
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload",
          "perfPowerMetrics",
          "diagnosticSignatures"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.ci_product.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/ciProduct",
    "description": "Read the Xcode Cloud product for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "bundleId",
          "primaryRepositories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.customer_review_summarizations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/customerReviewSummarizations",
    "description": "List the customer review summarizations belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ],
        "required": true
      },
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "fields[customerReviewSummarizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type customerReviewSummarizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "createdDate",
          "locale",
          "platform",
          "text",
          "territory"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.customer_reviews.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/customerReviews",
    "description": "List customer reviews for an app. Filter by rating or territory; sort by -createdDate for the newest.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by attribute 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list.",
        "enum": [
          "ABW",
          "AFG",
          "AGO",
          "AIA",
          "ALB",
          "AND",
          "ANT",
          "ARE",
          "ARG",
          "ARM",
          "ASM",
          "ATG",
          "AUS",
          "AUT",
          "AZE",
          "BDI",
          "BEL",
          "BEN",
          "BES",
          "BFA",
          "BGD",
          "BGR",
          "BHR",
          "BHS",
          "BIH",
          "BLR",
          "BLZ",
          "BMU",
          "BOL",
          "BRA",
          "BRB",
          "BRN",
          "BTN",
          "BWA",
          "CAF",
          "CAN",
          "CHE",
          "CHL",
          "CHN",
          "CIV"
        ]
      },
      {
        "name": "filter[rating]",
        "type": "array",
        "description": "filter by attribute 'rating'"
      },
      {
        "name": "filter[reviewTerritory]",
        "type": "array",
        "description": "filter by id(s) of related 'reviewTerritory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "exists[publishedResponse]",
        "type": "boolean",
        "description": "filter by publishedResponse"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "rating",
          "-rating",
          "createdDate",
          "-createdDate"
        ]
      },
      {
        "name": "fields[customerReviews]",
        "type": "array",
        "description": "the fields to include for returned resources of type customerReviews Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "rating",
          "title",
          "body",
          "reviewerNickname",
          "createdDate",
          "territory",
          "response",
          "reviewTerritory"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "response",
          "reviewTerritory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.end_user_license_agreement.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/endUserLicenseAgreement",
    "description": "Read the end user license agreement for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.game_center_detail.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/gameCenterDetail",
    "description": "Read the Game Center detail for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "gameCenterAppVersions",
          "gameCenterGroup",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges",
          "defaultLeaderboard",
          "defaultLeaderboardV2",
          "defaultGroupLeaderboard",
          "defaultGroupLeaderboardV2",
          "achievementReleases",
          "activityReleases",
          "challengeReleases",
          "leaderboardReleases",
          "leaderboardSetReleases",
          "challengesMinimumPlatformVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}",
    "description": "Read one app by ID, including bundle ID, SKU and primary locale.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[apps]",
        "type": "array",
        "description": "the fields to include for returned resources of type apps Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "accessibilityUrl",
          "name",
          "bundleId",
          "sku",
          "primaryLocale",
          "isOrEverWasMadeForKids",
          "subscriptionStatusUrl",
          "subscriptionStatusUrlVersion",
          "subscriptionStatusUrlForSandbox",
          "subscriptionStatusUrlVersionForSandbox",
          "contentRightsDeclaration",
          "streamlinedPurchasingEnabled",
          "accessibilityDeclarations",
          "appEncryptionDeclarations",
          "appStoreIcon",
          "ciProduct",
          "betaTesters",
          "betaGroups",
          "appStoreVersions",
          "appTags",
          "preReleaseVersions",
          "betaAppLocalizations",
          "builds",
          "betaLicenseAgreement",
          "betaAppReviewDetail",
          "appInfos",
          "appClips",
          "appPricePoints",
          "endUserLicenseAgreement",
          "appPriceSchedule",
          "appAvailabilityV2",
          "inAppPurchases",
          "subscriptionGroups",
          "gameCenterEnabledVersions",
          "performanceOverviews",
          "perfPowerMetrics",
          "appCustomProductPages",
          "inAppPurchasesV2",
          "promotedPurchases",
          "appEvents"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appEncryptionDeclarations",
          "appStoreIcon",
          "ciProduct",
          "betaGroups",
          "appStoreVersions",
          "preReleaseVersions",
          "betaAppLocalizations",
          "builds",
          "betaLicenseAgreement",
          "betaAppReviewDetail",
          "appInfos",
          "appClips",
          "endUserLicenseAgreement",
          "inAppPurchases",
          "subscriptionGroups",
          "gameCenterEnabledVersions",
          "appCustomProductPages",
          "inAppPurchasesV2",
          "promotedPurchases",
          "appEvents",
          "reviewSubmissions",
          "subscriptionGracePeriod",
          "gameCenterDetail",
          "appStoreVersionExperimentsV2",
          "androidToIosAppMappingDetails"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.in_app_purchases_v2.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/inAppPurchasesV2",
    "description": "List the in-app purchases (v2) belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[productId]",
        "type": "array",
        "description": "filter by attribute 'productId'"
      },
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "MISSING_METADATA",
          "WAITING_FOR_UPLOAD",
          "PROCESSING_CONTENT",
          "READY_TO_SUBMIT",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "DEVELOPER_ACTION_NEEDED",
          "PENDING_BINARY_APPROVAL",
          "APPROVED",
          "DEVELOPER_REMOVED_FROM_SALE",
          "REMOVED_FROM_SALE",
          "REJECTED"
        ]
      },
      {
        "name": "filter[inAppPurchaseType]",
        "type": "array",
        "description": "filter by attribute 'inAppPurchaseType'",
        "enum": [
          "CONSUMABLE",
          "NON_CONSUMABLE",
          "NON_RENEWING_SUBSCRIPTION"
        ]
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name",
          "inAppPurchaseType",
          "-inAppPurchaseType"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchaseLocalizations",
          "content",
          "appStoreReviewScreenshot",
          "promotedPurchase",
          "iapPriceSchedule",
          "inAppPurchaseAvailability",
          "images",
          "offerCodes",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps",
    "description": "List all apps in your App Store Connect account. Start here when you need an app ID.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[bundleId]",
        "type": "array",
        "description": "filter by attribute 'bundleId'"
      },
      {
        "name": "filter[sku]",
        "type": "array",
        "description": "filter by attribute 'sku'"
      },
      {
        "name": "filter[appStoreVersions.appStoreState]",
        "type": "array",
        "description": "filter by attribute 'appStoreVersions.appStoreState'",
        "enum": [
          "ACCEPTED",
          "DEVELOPER_REMOVED_FROM_SALE",
          "DEVELOPER_REJECTED",
          "IN_REVIEW",
          "INVALID_BINARY",
          "METADATA_REJECTED",
          "PENDING_APPLE_RELEASE",
          "PENDING_CONTRACT",
          "PENDING_DEVELOPER_RELEASE",
          "PREPARE_FOR_SUBMISSION",
          "PREORDER_READY_FOR_SALE",
          "PROCESSING_FOR_APP_STORE",
          "READY_FOR_REVIEW",
          "READY_FOR_SALE",
          "REJECTED",
          "REMOVED_FROM_SALE",
          "WAITING_FOR_EXPORT_COMPLIANCE",
          "WAITING_FOR_REVIEW",
          "REPLACED_WITH_NEW_VERSION",
          "NOT_APPLICABLE"
        ]
      },
      {
        "name": "filter[appStoreVersions.platform]",
        "type": "array",
        "description": "filter by attribute 'appStoreVersions.platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[appStoreVersions.appVersionState]",
        "type": "array",
        "description": "filter by attribute 'appStoreVersions.appVersionState'",
        "enum": [
          "ACCEPTED",
          "DEVELOPER_REJECTED",
          "IN_REVIEW",
          "INVALID_BINARY",
          "METADATA_REJECTED",
          "PENDING_APPLE_RELEASE",
          "PENDING_DEVELOPER_RELEASE",
          "PREPARE_FOR_SUBMISSION",
          "PROCESSING_FOR_DISTRIBUTION",
          "READY_FOR_DISTRIBUTION",
          "READY_FOR_REVIEW",
          "REJECTED",
          "REPLACED_WITH_NEW_VERSION",
          "WAITING_FOR_EXPORT_COMPLIANCE",
          "WAITING_FOR_REVIEW"
        ]
      },
      {
        "name": "filter[reviewSubmissions.state]",
        "type": "array",
        "description": "filter by attribute 'reviewSubmissions.state'",
        "enum": [
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "UNRESOLVED_ISSUES",
          "CANCELING",
          "COMPLETING",
          "COMPLETE"
        ]
      },
      {
        "name": "filter[reviewSubmissions.platform]",
        "type": "array",
        "description": "filter by attribute 'reviewSubmissions.platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[appStoreVersions]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersions' Takes a 'appStoreVersions' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "exists[gameCenterEnabledVersions]",
        "type": "boolean",
        "description": "filter by existence or non-existence of related 'gameCenterEnabledVersions'"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name",
          "bundleId",
          "-bundleId",
          "sku",
          "-sku"
        ]
      },
      {
        "name": "fields[apps]",
        "type": "array",
        "description": "the fields to include for returned resources of type apps Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "accessibilityUrl",
          "name",
          "bundleId",
          "sku",
          "primaryLocale",
          "isOrEverWasMadeForKids",
          "subscriptionStatusUrl",
          "subscriptionStatusUrlVersion",
          "subscriptionStatusUrlForSandbox",
          "subscriptionStatusUrlVersionForSandbox",
          "contentRightsDeclaration",
          "streamlinedPurchasingEnabled",
          "accessibilityDeclarations",
          "appEncryptionDeclarations",
          "appStoreIcon",
          "ciProduct",
          "betaTesters",
          "betaGroups",
          "appStoreVersions",
          "appTags",
          "preReleaseVersions",
          "betaAppLocalizations",
          "builds",
          "betaLicenseAgreement",
          "betaAppReviewDetail",
          "appInfos",
          "appClips",
          "appPricePoints",
          "endUserLicenseAgreement",
          "appPriceSchedule",
          "appAvailabilityV2",
          "inAppPurchases",
          "subscriptionGroups",
          "gameCenterEnabledVersions",
          "performanceOverviews",
          "perfPowerMetrics",
          "appCustomProductPages",
          "inAppPurchasesV2",
          "promotedPurchases",
          "appEvents"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appEncryptionDeclarations",
          "appStoreIcon",
          "ciProduct",
          "betaGroups",
          "appStoreVersions",
          "preReleaseVersions",
          "betaAppLocalizations",
          "builds",
          "betaLicenseAgreement",
          "betaAppReviewDetail",
          "appInfos",
          "appClips",
          "endUserLicenseAgreement",
          "inAppPurchases",
          "subscriptionGroups",
          "gameCenterEnabledVersions",
          "appCustomProductPages",
          "inAppPurchasesV2",
          "promotedPurchases",
          "appEvents",
          "reviewSubmissions",
          "subscriptionGracePeriod",
          "gameCenterDetail",
          "appStoreVersionExperimentsV2",
          "androidToIosAppMappingDetails"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.marketplace_search_detail.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/marketplaceSearchDetail",
    "description": "Read the marketplace search detail for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.perf_power_metrics.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/perfPowerMetrics",
    "description": "List the perf power metrics belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS"
        ]
      },
      {
        "name": "filter[metricType]",
        "type": "array",
        "description": "filter by attribute 'metricType'",
        "enum": [
          "DISK",
          "HANG",
          "BATTERY",
          "LAUNCH",
          "MEMORY",
          "ANIMATION",
          "TERMINATION",
          "STORAGE"
        ]
      },
      {
        "name": "filter[deviceType]",
        "type": "array",
        "description": "filter by attribute 'deviceType'"
      }
    ],
    "hasBody": false,
    "accept": "application/vnd.apple.xcode-metrics+json"
  },
  {
    "name": "apps.performance_overviews.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/performanceOverviews",
    "description": "List the performance overviews belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[deviceType]",
        "type": "array",
        "description": "filter by attribute 'deviceType'"
      }
    ],
    "hasBody": false,
    "accept": "application/vnd.apple.xcode-overview+json"
  },
  {
    "name": "apps.pre_release_versions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/preReleaseVersions",
    "description": "List the pre release versions belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[preReleaseVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type preReleaseVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "platform",
          "builds",
          "app"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.promoted_purchases.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/promotedPurchases",
    "description": "List the promoted purchases belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[promotedPurchases]",
        "type": "array",
        "description": "the fields to include for returned resources of type promotedPurchases Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "visibleForAllUsers",
          "enabled",
          "state",
          "inAppPurchaseV2",
          "subscription"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchaseV2",
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.promoted_purchases.replace",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/apps/{id}/relationships/promotedPurchases",
    "description": "Replace the full set of promoted purchases linked to an app.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppPromotedPurchasesLinkagesRequest",
    "risk": "revenue"
  },
  {
    "name": "apps.review_submissions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/reviewSubmissions",
    "description": "List the review submissions belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "UNRESOLVED_ISSUES",
          "CANCELING",
          "COMPLETING",
          "COMPLETE"
        ]
      },
      {
        "name": "fields[reviewSubmissions]",
        "type": "array",
        "description": "the fields to include for returned resources of type reviewSubmissions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "platform",
          "submittedDate",
          "state",
          "app",
          "items",
          "appStoreVersionForReview",
          "submittedByActor",
          "lastUpdatedByActor"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "items",
          "appStoreVersionForReview",
          "submittedByActor",
          "lastUpdatedByActor"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.search_keywords.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/searchKeywords",
    "description": "List the search keywords belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by platform"
      },
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by locale"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.subscription_grace_period.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/subscriptionGracePeriod",
    "description": "Read the subscription grace period for an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.subscription_groups.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/subscriptionGroups",
    "description": "List the subscription groups belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[subscriptions.state]",
        "type": "array",
        "description": "filter by attribute 'subscriptions.state'",
        "enum": [
          "MISSING_METADATA",
          "READY_TO_SUBMIT",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "DEVELOPER_ACTION_NEEDED",
          "PENDING_BINARY_APPROVAL",
          "APPROVED",
          "DEVELOPER_REMOVED_FROM_SALE",
          "REMOVED_FROM_SALE",
          "REJECTED"
        ]
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "referenceName",
          "-referenceName"
        ]
      },
      {
        "name": "fields[subscriptionGroups]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionGroups Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "subscriptions",
          "subscriptionGroupLocalizations",
          "versions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscriptions",
          "subscriptionGroupLocalizations",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/apps/{id}",
    "description": "Update an app.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppUpdateRequest",
    "risk": "public"
  },
  {
    "name": "apps.webhooks.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/webhooks",
    "description": "List the webhooks belonging to an app.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[webhooks]",
        "type": "array",
        "description": "the fields to include for returned resources of type webhooks Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "enabled",
          "eventTypes",
          "name",
          "url",
          "app",
          "deliveries"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "background_asset_upload_files.create",
    "domain": "background_assets",
    "method": "POST",
    "path": "/v1/backgroundAssetUploadFiles",
    "description": "Create a background asset upload file.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetUploadFileCreateRequest",
    "risk": "low"
  },
  {
    "name": "background_asset_upload_files.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetUploadFiles/{id}",
    "description": "Read one background asset upload file by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[backgroundAssetUploadFiles]",
        "type": "array",
        "description": "the fields to include for returned resources of type backgroundAssetUploadFiles Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "assetDeliveryState",
          "assetToken",
          "assetType",
          "fileName",
          "fileSize",
          "sourceFileChecksum",
          "sourceFileChecksums",
          "uploadOperations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "background_asset_upload_files.update",
    "domain": "background_assets",
    "method": "PATCH",
    "path": "/v1/backgroundAssetUploadFiles/{id}",
    "description": "Update a background asset upload file.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetUploadFileUpdateRequest",
    "risk": "low"
  },
  {
    "name": "background_asset_version_app_store_releases.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetVersionAppStoreReleases/{id}",
    "description": "Read one background asset version App Store release by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[backgroundAssetVersionAppStoreReleases]",
        "type": "array",
        "description": "the fields to include for returned resources of type backgroundAssetVersionAppStoreReleases Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "state",
          "backgroundAssetVersion"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "backgroundAssetVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "background_asset_version_external_beta_releases.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetVersionExternalBetaReleases/{id}",
    "description": "Read one background asset version external beta release by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[backgroundAssetVersionExternalBetaReleases]",
        "type": "array",
        "description": "the fields to include for returned resources of type backgroundAssetVersionExternalBetaReleases Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "state",
          "backgroundAssetVersion"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "backgroundAssetVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "background_asset_version_internal_beta_releases.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetVersionInternalBetaReleases/{id}",
    "description": "Read one background asset version internal beta release by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[backgroundAssetVersionInternalBetaReleases]",
        "type": "array",
        "description": "the fields to include for returned resources of type backgroundAssetVersionInternalBetaReleases Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "state",
          "backgroundAssetVersion"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "backgroundAssetVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "background_asset_versions.background_asset_upload_files.list",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetVersions/{id}/backgroundAssetUploadFiles",
    "description": "List the background asset upload files belonging to a background asset version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[backgroundAssetUploadFiles]",
        "type": "array",
        "description": "the fields to include for returned resources of type backgroundAssetUploadFiles Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "assetDeliveryState",
          "assetToken",
          "assetType",
          "fileName",
          "fileSize",
          "sourceFileChecksum",
          "sourceFileChecksums",
          "uploadOperations"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "background_asset_versions.create",
    "domain": "background_assets",
    "method": "POST",
    "path": "/v1/backgroundAssetVersions",
    "description": "Create a background asset version.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetVersionCreateRequest",
    "risk": "low"
  },
  {
    "name": "background_asset_versions.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetVersions/{id}",
    "description": "Read one background asset version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[backgroundAssetVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type backgroundAssetVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "createdDate",
          "platforms",
          "state",
          "stateDetails",
          "version",
          "locale",
          "backgroundAsset",
          "internalBetaRelease",
          "externalBetaRelease",
          "appStoreRelease",
          "assetFile",
          "manifestFile",
          "backgroundAssetUploadFiles"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "backgroundAsset",
          "internalBetaRelease",
          "externalBetaRelease",
          "appStoreRelease",
          "assetFile",
          "manifestFile"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "background_assets.create",
    "domain": "background_assets",
    "method": "POST",
    "path": "/v1/backgroundAssets",
    "description": "Add a downloadable resource pack — a Background Assets package holding large game or app content that iOS fetches separately, after install and outside the app bundle.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetCreateRequest",
    "risk": "low"
  },
  {
    "name": "background_assets.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssets/{id}",
    "description": "Read one background asset by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[backgroundAssets]",
        "type": "array",
        "description": "the fields to include for returned resources of type backgroundAssets Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "archived",
          "assetPackIdentifier",
          "createdDate",
          "usedBytes",
          "app",
          "versions",
          "appStoreVersion",
          "internalBetaVersion",
          "externalBetaVersion"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appStoreVersion",
          "internalBetaVersion",
          "externalBetaVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "background_assets.update",
    "domain": "background_assets",
    "method": "PATCH",
    "path": "/v1/backgroundAssets/{id}",
    "description": "Update a background asset.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetUpdateRequest",
    "risk": "low"
  },
  {
    "name": "background_assets.versions.list",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssets/{id}/versions",
    "description": "List the versions belonging to a background asset.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by attribute 'locale'"
      },
      {
        "name": "filter[platforms]",
        "type": "array",
        "description": "filter by attribute 'platforms'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "AWAITING_UPLOAD",
          "PROCESSING",
          "FAILED",
          "COMPLETE"
        ]
      },
      {
        "name": "filter[version]",
        "type": "array",
        "description": "filter by attribute 'version'"
      },
      {
        "name": "filter[internalBetaRelease.state]",
        "type": "array",
        "description": "filter by attribute 'internalBetaRelease.state'",
        "enum": [
          "READY_FOR_TESTING",
          "SUPERSEDED"
        ]
      },
      {
        "name": "filter[externalBetaRelease.state]",
        "type": "array",
        "description": "filter by attribute 'externalBetaRelease.state'",
        "enum": [
          "READY_FOR_BETA_SUBMISSION",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "REJECTED",
          "PROCESSING_FOR_TESTING",
          "READY_FOR_TESTING",
          "SUPERSEDED"
        ]
      },
      {
        "name": "filter[appStoreRelease.state]",
        "type": "array",
        "description": "filter by attribute 'appStoreRelease.state'",
        "enum": [
          "PREPARE_FOR_SUBMISSION",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "ACCEPTED",
          "REJECTED",
          "PROCESSING_FOR_DISTRIBUTION",
          "READY_FOR_DISTRIBUTION",
          "SUPERSEDED"
        ]
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "version",
          "-version"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "backgroundAsset",
          "internalBetaRelease",
          "externalBetaRelease",
          "appStoreRelease",
          "assetFile",
          "manifestFile"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_app_clip_invocation_localizations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaAppClipInvocationLocalizations",
    "description": "Create a beta App Clip invocation localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppClipInvocationLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "beta_app_clip_invocation_localizations.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaAppClipInvocationLocalizations/{id}",
    "description": "Delete a beta App Clip invocation localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "beta_app_clip_invocation_localizations.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaAppClipInvocationLocalizations/{id}",
    "description": "Update a beta App Clip invocation localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppClipInvocationLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "beta_app_clip_invocations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaAppClipInvocations",
    "description": "Create a beta App Clip invocation.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppClipInvocationCreateRequest",
    "risk": "low"
  },
  {
    "name": "beta_app_clip_invocations.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaAppClipInvocations/{id}",
    "description": "Delete a beta App Clip invocation.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "beta_app_clip_invocations.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppClipInvocations/{id}",
    "description": "Read one beta App Clip invocation by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaAppClipInvocations]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaAppClipInvocations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "url",
          "betaAppClipInvocationLocalizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "betaAppClipInvocationLocalizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_app_clip_invocations.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaAppClipInvocations/{id}",
    "description": "Update a beta App Clip invocation.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppClipInvocationUpdateRequest",
    "risk": "low"
  },
  {
    "name": "beta_app_localizations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaAppLocalizations",
    "description": "Create a beta app localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "beta_app_localizations.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaAppLocalizations/{id}",
    "description": "Delete a beta app localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "beta_app_localizations.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppLocalizations/{id}",
    "description": "Read one beta app localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaAppLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaAppLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "feedbackEmail",
          "marketingUrl",
          "privacyPolicyUrl",
          "tvOsPrivacyPolicy",
          "description",
          "locale",
          "app"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_app_localizations.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppLocalizations",
    "description": "List beta app localizations.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by attribute 'locale'"
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list."
      },
      {
        "name": "fields[betaAppLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaAppLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "feedbackEmail",
          "marketingUrl",
          "privacyPolicyUrl",
          "tvOsPrivacyPolicy",
          "description",
          "locale",
          "app"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_app_localizations.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaAppLocalizations/{id}",
    "description": "Update a beta app localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "beta_app_review_details.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewDetails/{id}",
    "description": "Read one beta app review detail by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaAppReviewDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaAppReviewDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "contactFirstName",
          "contactLastName",
          "contactPhone",
          "contactEmail",
          "demoAccountName",
          "demoAccountPassword",
          "demoAccountRequired",
          "notes",
          "app"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_app_review_details.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewDetails",
    "description": "List beta app review details.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list.",
        "required": true
      },
      {
        "name": "fields[betaAppReviewDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaAppReviewDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "contactFirstName",
          "contactLastName",
          "contactPhone",
          "contactEmail",
          "demoAccountName",
          "demoAccountPassword",
          "demoAccountRequired",
          "notes",
          "app"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_app_review_details.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaAppReviewDetails/{id}",
    "description": "Update a beta app review detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppReviewDetailUpdateRequest",
    "risk": "low"
  },
  {
    "name": "beta_app_review_submissions.build.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewSubmissions/{id}/build",
    "description": "Read the build for a beta app review submission.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_app_review_submissions.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaAppReviewSubmissions",
    "description": "Create a beta app review submission.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppReviewSubmissionCreateRequest",
    "risk": "release"
  },
  {
    "name": "beta_app_review_submissions.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewSubmissions/{id}",
    "description": "Read one beta app review submission by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaAppReviewSubmissions]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaAppReviewSubmissions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "betaReviewState",
          "submittedDate",
          "build"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_app_review_submissions.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewSubmissions",
    "description": "List beta app review submissions.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[betaReviewState]",
        "type": "array",
        "description": "filter by attribute 'betaReviewState'",
        "enum": [
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "REJECTED",
          "APPROVED"
        ]
      },
      {
        "name": "filter[build]",
        "type": "array",
        "description": "filter by id(s) of related 'build' Takes a 'build' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error.",
        "required": true
      },
      {
        "name": "fields[betaAppReviewSubmissions]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaAppReviewSubmissions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "betaReviewState",
          "submittedDate",
          "build"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_build_localizations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaBuildLocalizations",
    "description": "Create a beta build localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaBuildLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "beta_build_localizations.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaBuildLocalizations/{id}",
    "description": "Delete a beta build localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "beta_build_localizations.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaBuildLocalizations/{id}",
    "description": "Read one beta build localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaBuildLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaBuildLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "whatsNew",
          "locale",
          "build"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_build_localizations.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaBuildLocalizations",
    "description": "List beta build localizations.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[locale]",
        "type": "array",
        "description": "filter by attribute 'locale'"
      },
      {
        "name": "filter[build]",
        "type": "array",
        "description": "filter by id(s) of related 'build' Takes a 'build' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "fields[betaBuildLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaBuildLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "whatsNew",
          "locale",
          "build"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_build_localizations.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaBuildLocalizations/{id}",
    "description": "Set the tester-facing \"what to test\" notes for a TestFlight build in one language.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaBuildLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "beta_crash_logs.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaCrashLogs/{id}",
    "description": "Read one beta crash log by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaCrashLogs]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaCrashLogs Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "logText"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_feedback_crash_submissions.crash_log.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaFeedbackCrashSubmissions/{id}/crashLog",
    "description": "Read the crash log for a beta feedback crash submission.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_feedback_crash_submissions.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaFeedbackCrashSubmissions/{id}",
    "description": "Delete a beta feedback crash submission.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "beta_feedback_crash_submissions.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaFeedbackCrashSubmissions/{id}",
    "description": "Read one beta feedback crash submission by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaFeedbackCrashSubmissions]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaFeedbackCrashSubmissions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "createdDate",
          "comment",
          "email",
          "deviceModel",
          "osVersion",
          "locale",
          "timeZone",
          "architecture",
          "connectionType",
          "pairedAppleWatch",
          "appUptimeInMilliseconds",
          "diskBytesAvailable",
          "diskBytesTotal",
          "batteryPercentage",
          "screenWidthInPoints",
          "screenHeightInPoints",
          "appPlatform",
          "devicePlatform",
          "deviceFamily",
          "buildBundleId",
          "crashLog",
          "build",
          "tester"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build",
          "tester"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_feedback_screenshot_submissions.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaFeedbackScreenshotSubmissions/{id}",
    "description": "Delete a beta feedback screenshot submission.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "beta_feedback_screenshot_submissions.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaFeedbackScreenshotSubmissions/{id}",
    "description": "Read one beta feedback screenshot submission by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaFeedbackScreenshotSubmissions]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaFeedbackScreenshotSubmissions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "createdDate",
          "comment",
          "email",
          "deviceModel",
          "osVersion",
          "locale",
          "timeZone",
          "architecture",
          "connectionType",
          "pairedAppleWatch",
          "appUptimeInMilliseconds",
          "diskBytesAvailable",
          "diskBytesTotal",
          "batteryPercentage",
          "screenWidthInPoints",
          "screenHeightInPoints",
          "appPlatform",
          "devicePlatform",
          "deviceFamily",
          "buildBundleId",
          "screenshots",
          "build",
          "tester"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build",
          "tester"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_groups.beta_recruitment_criteria.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/betaRecruitmentCriteria",
    "description": "Read the beta recruitment criteria for a beta group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaRecruitmentCriteria]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaRecruitmentCriteria Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "lastModifiedDate",
          "deviceFamilyOsVersionFilters"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_groups.beta_recruitment_criterion_compatible_build_check.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/betaRecruitmentCriterionCompatibleBuildCheck",
    "description": "Read the beta recruitment criterion compatible build check for a beta group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_groups.beta_tester_usages.metrics",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/metrics/betaTesterUsages",
    "description": "Read beta tester usages metrics for a beta group. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "period",
        "type": "string",
        "description": "the duration of the reporting period",
        "enum": [
          "P7D",
          "P30D",
          "P90D",
          "P365D"
        ]
      },
      {
        "name": "groupBy",
        "type": "array",
        "description": "the dimension by which to group the results",
        "enum": [
          "betaTesters"
        ]
      },
      {
        "name": "filter[betaTesters]",
        "type": "string",
        "description": "filter by 'betaTesters' relationship dimension"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_groups.beta_testers.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/betaTesters",
    "description": "List the beta testers belonging to a beta group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaTesters]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaTesters Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "firstName",
          "lastName",
          "email",
          "inviteType",
          "state",
          "appDevices",
          "apps",
          "betaGroups",
          "builds"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_groups.builds.add",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaGroups/{id}/relationships/builds",
    "description": "Distribute a build to a TestFlight beta group so its testers can install it.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupBuildsLinkagesRequest",
    "risk": "low"
  },
  {
    "name": "beta_groups.builds.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/builds",
    "description": "List the builds belonging to a beta group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[builds]",
        "type": "array",
        "description": "the fields to include for returned resources of type builds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "uploadedDate",
          "expirationDate",
          "expired",
          "minOsVersion",
          "lsMinimumSystemVersion",
          "computedMinMacOsVersion",
          "computedMinVisionOsVersion",
          "iconAssetToken",
          "processingState",
          "buildAudienceType",
          "usesNonExemptEncryption",
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload",
          "perfPowerMetrics",
          "diagnosticSignatures"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_groups.builds.remove",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaGroups/{id}/relationships/builds",
    "description": "Unlink builds from a beta group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupBuildsLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "beta_groups.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaGroups",
    "description": "Make a TestFlight group to organise testers — an internal one for the team, or an external one Apple reviews before it can receive builds.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupCreateRequest",
    "risk": "low"
  },
  {
    "name": "beta_groups.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaGroups/{id}",
    "description": "Delete a beta group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "beta_groups.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}",
    "description": "Read one beta group by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaGroups]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaGroups Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "createdDate",
          "isInternalGroup",
          "hasAccessToAllBuilds",
          "publicLinkEnabled",
          "publicLinkId",
          "publicLinkLimitEnabled",
          "publicLinkLimit",
          "publicLink",
          "feedbackEnabled",
          "iosBuildsAvailableForAppleSiliconMac",
          "iosBuildsAvailableForAppleVision",
          "app",
          "builds",
          "betaTesters",
          "betaRecruitmentCriteria",
          "betaRecruitmentCriterionCompatibleBuildCheck"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "builds",
          "betaTesters",
          "betaRecruitmentCriteria"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_groups.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups",
    "description": "List beta groups.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[isInternalGroup]",
        "type": "array",
        "description": "filter by attribute 'isInternalGroup'"
      },
      {
        "name": "filter[publicLinkEnabled]",
        "type": "array",
        "description": "filter by attribute 'publicLinkEnabled'"
      },
      {
        "name": "filter[publicLinkLimitEnabled]",
        "type": "array",
        "description": "filter by attribute 'publicLinkLimitEnabled'"
      },
      {
        "name": "filter[publicLink]",
        "type": "array",
        "description": "filter by attribute 'publicLink'"
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list."
      },
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds' Takes a 'builds' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name",
          "createdDate",
          "-createdDate",
          "publicLinkEnabled",
          "-publicLinkEnabled",
          "publicLinkLimit",
          "-publicLinkLimit"
        ]
      },
      {
        "name": "fields[betaGroups]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaGroups Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "createdDate",
          "isInternalGroup",
          "hasAccessToAllBuilds",
          "publicLinkEnabled",
          "publicLinkId",
          "publicLinkLimitEnabled",
          "publicLinkLimit",
          "publicLink",
          "feedbackEnabled",
          "iosBuildsAvailableForAppleSiliconMac",
          "iosBuildsAvailableForAppleVision",
          "app",
          "builds",
          "betaTesters",
          "betaRecruitmentCriteria",
          "betaRecruitmentCriterionCompatibleBuildCheck"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "builds",
          "betaTesters",
          "betaRecruitmentCriteria"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_groups.public_link_usages.metrics",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/metrics/publicLinkUsages",
    "description": "Read public link usages metrics for a beta group. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_groups.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaGroups/{id}",
    "description": "Update a beta group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupUpdateRequest",
    "risk": "low"
  },
  {
    "name": "beta_license_agreements.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaLicenseAgreements/{id}",
    "description": "Read one beta license agreement by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaLicenseAgreements]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaLicenseAgreements Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "agreementText",
          "app"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_license_agreements.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaLicenseAgreements",
    "description": "List beta license agreements.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list."
      },
      {
        "name": "fields[betaLicenseAgreements]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaLicenseAgreements Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "agreementText",
          "app"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_license_agreements.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaLicenseAgreements/{id}",
    "description": "Update a beta license agreement.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaLicenseAgreementUpdateRequest",
    "risk": "low"
  },
  {
    "name": "beta_recruitment_criteria.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaRecruitmentCriteria",
    "description": "Create a beta recruitment criteria.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaRecruitmentCriterionCreateRequest",
    "risk": "low"
  },
  {
    "name": "beta_recruitment_criteria.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaRecruitmentCriteria/{id}",
    "description": "Delete a beta recruitment criteria.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "beta_recruitment_criteria.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaRecruitmentCriteria/{id}",
    "description": "Update a beta recruitment criteria.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaRecruitmentCriterionUpdateRequest",
    "risk": "low"
  },
  {
    "name": "beta_recruitment_criterion_options.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaRecruitmentCriterionOptions",
    "description": "List beta recruitment criterion options.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "fields[betaRecruitmentCriterionOptions]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaRecruitmentCriterionOptions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "deviceFamilyOsVersions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_tester_invitations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaTesterInvitations",
    "description": "Re-send a TestFlight invitation email to a tester who has not accepted yet.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterInvitationCreateRequest",
    "risk": "low"
  },
  {
    "name": "beta_testers.apps.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/apps",
    "description": "List the apps belonging to a beta tester.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[apps]",
        "type": "array",
        "description": "the fields to include for returned resources of type apps Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "accessibilityUrl",
          "name",
          "bundleId",
          "sku",
          "primaryLocale",
          "isOrEverWasMadeForKids",
          "subscriptionStatusUrl",
          "subscriptionStatusUrlVersion",
          "subscriptionStatusUrlForSandbox",
          "subscriptionStatusUrlVersionForSandbox",
          "contentRightsDeclaration",
          "streamlinedPurchasingEnabled",
          "accessibilityDeclarations",
          "appEncryptionDeclarations",
          "appStoreIcon",
          "ciProduct",
          "betaTesters",
          "betaGroups",
          "appStoreVersions",
          "appTags",
          "preReleaseVersions",
          "betaAppLocalizations",
          "builds",
          "betaLicenseAgreement",
          "betaAppReviewDetail",
          "appInfos",
          "appClips",
          "appPricePoints",
          "endUserLicenseAgreement",
          "appPriceSchedule",
          "appAvailabilityV2",
          "inAppPurchases",
          "subscriptionGroups",
          "gameCenterEnabledVersions",
          "performanceOverviews",
          "perfPowerMetrics",
          "appCustomProductPages",
          "inAppPurchasesV2",
          "promotedPurchases",
          "appEvents"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_testers.beta_groups.add",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaTesters/{id}/relationships/betaGroups",
    "description": "Link beta groups to a beta tester.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterBetaGroupsLinkagesRequest",
    "risk": "low"
  },
  {
    "name": "beta_testers.beta_groups.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/betaGroups",
    "description": "List the beta groups belonging to a beta tester.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaGroups]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaGroups Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "createdDate",
          "isInternalGroup",
          "hasAccessToAllBuilds",
          "publicLinkEnabled",
          "publicLinkId",
          "publicLinkLimitEnabled",
          "publicLinkLimit",
          "publicLink",
          "feedbackEnabled",
          "iosBuildsAvailableForAppleSiliconMac",
          "iosBuildsAvailableForAppleVision",
          "app",
          "builds",
          "betaTesters",
          "betaRecruitmentCriteria",
          "betaRecruitmentCriterionCompatibleBuildCheck"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_testers.beta_groups.remove",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaTesters/{id}/relationships/betaGroups",
    "description": "Unlink beta groups from a beta tester.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterBetaGroupsLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "beta_testers.beta_tester_usages.metrics",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/metrics/betaTesterUsages",
    "description": "Read beta tester usages metrics for a beta tester. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "period",
        "type": "string",
        "description": "the duration of the reporting period",
        "enum": [
          "P7D",
          "P30D",
          "P90D",
          "P365D"
        ]
      },
      {
        "name": "filter[apps]",
        "type": "string",
        "description": "filter by 'apps' relationship dimension",
        "required": true
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_testers.builds.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/builds",
    "description": "List the builds belonging to a beta tester.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[builds]",
        "type": "array",
        "description": "the fields to include for returned resources of type builds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "uploadedDate",
          "expirationDate",
          "expired",
          "minOsVersion",
          "lsMinimumSystemVersion",
          "computedMinMacOsVersion",
          "computedMinVisionOsVersion",
          "iconAssetToken",
          "processingState",
          "buildAudienceType",
          "usesNonExemptEncryption",
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload",
          "perfPowerMetrics",
          "diagnosticSignatures"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_testers.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaTesters",
    "description": "Invite a new TestFlight tester by email and add them to one or more beta groups.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterCreateRequest",
    "risk": "low"
  },
  {
    "name": "beta_testers.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaTesters/{id}",
    "description": "Remove a TestFlight tester from your account entirely, so they lose access to every build and group. Removing them from one group is a different call.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "beta_testers.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}",
    "description": "Read one beta tester by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaTesters]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaTesters Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "firstName",
          "lastName",
          "email",
          "inviteType",
          "state",
          "appDevices",
          "apps",
          "betaGroups",
          "builds"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "apps",
          "betaGroups",
          "builds"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_testers.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters",
    "description": "List beta testers.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[firstName]",
        "type": "array",
        "description": "filter by attribute 'firstName'"
      },
      {
        "name": "filter[lastName]",
        "type": "array",
        "description": "filter by attribute 'lastName'"
      },
      {
        "name": "filter[email]",
        "type": "array",
        "description": "filter by attribute 'email'"
      },
      {
        "name": "filter[inviteType]",
        "type": "array",
        "description": "filter by attribute 'inviteType'",
        "enum": [
          "EMAIL",
          "PUBLIC_LINK"
        ]
      },
      {
        "name": "filter[apps]",
        "type": "array",
        "description": "filter by id(s) of related 'apps' Takes a 'apps' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[betaGroups]",
        "type": "array",
        "description": "filter by id(s) of related 'betaGroups' Takes a 'betaGroups' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds' Takes a 'builds' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "firstName",
          "-firstName",
          "lastName",
          "-lastName",
          "email",
          "-email",
          "inviteType",
          "-inviteType",
          "state",
          "-state"
        ]
      },
      {
        "name": "fields[betaTesters]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaTesters Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "firstName",
          "lastName",
          "email",
          "inviteType",
          "state",
          "appDevices",
          "apps",
          "betaGroups",
          "builds"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "apps",
          "betaGroups",
          "builds"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "build_beta_details.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBetaDetails/{id}",
    "description": "Read one build beta detail by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[buildBetaDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type buildBetaDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "autoNotifyEnabled",
          "internalBuildState",
          "externalBuildState",
          "build"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "build_beta_details.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBetaDetails",
    "description": "List the TestFlight state of builds: whether external testing is available and how the build was distributed. This is the beta side of a build — build attributes themselves come from builds__list.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[build]",
        "type": "array",
        "description": "filter by id(s) of related 'build' Takes a 'build' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "fields[buildBetaDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type buildBetaDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "autoNotifyEnabled",
          "internalBuildState",
          "externalBuildState",
          "build"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "build_beta_details.update",
    "domain": "builds",
    "method": "PATCH",
    "path": "/v1/buildBetaDetails/{id}",
    "description": "Update a build beta detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildBetaDetailUpdateRequest",
    "risk": "low"
  },
  {
    "name": "build_beta_notifications.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/buildBetaNotifications",
    "description": "Create a build beta notification.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildBetaNotificationCreateRequest",
    "risk": "low"
  },
  {
    "name": "build_bundles.app_clip_domain_cache_status.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/appClipDomainCacheStatus",
    "description": "Read the App Clip domain cache statu for a build bundle.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "build_bundles.app_clip_domain_debug_status.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/appClipDomainDebugStatus",
    "description": "Read the App Clip domain debug statu for a build bundle.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "build_bundles.beta_app_clip_invocations.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/betaAppClipInvocations",
    "description": "List the beta App Clip invocations belonging to a build bundle.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaAppClipInvocations]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaAppClipInvocations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "url",
          "betaAppClipInvocationLocalizations"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "betaAppClipInvocationLocalizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "build_bundles.build_bundle_file_sizes.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/buildBundleFileSizes",
    "description": "List the build bundle file sizes belonging to a build bundle.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[buildBundleFileSizes]",
        "type": "array",
        "description": "the fields to include for returned resources of type buildBundleFileSizes Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "deviceModel",
          "osVersion",
          "downloadBytes",
          "installBytes"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "build_upload_files.create",
    "domain": "builds",
    "method": "POST",
    "path": "/v1/buildUploadFiles",
    "description": "Create a build upload file.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildUploadFileCreateRequest",
    "risk": "low"
  },
  {
    "name": "build_upload_files.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildUploadFiles/{id}",
    "description": "Read one build upload file by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[buildUploadFiles]",
        "type": "array",
        "description": "the fields to include for returned resources of type buildUploadFiles Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "assetDeliveryState",
          "assetToken",
          "assetType",
          "fileName",
          "fileSize",
          "sourceFileChecksums",
          "uploadOperations",
          "uti"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "build_upload_files.update",
    "domain": "builds",
    "method": "PATCH",
    "path": "/v1/buildUploadFiles/{id}",
    "description": "Update a build upload file.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildUploadFileUpdateRequest",
    "risk": "low"
  },
  {
    "name": "build_uploads.build_upload_files.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildUploads/{id}/buildUploadFiles",
    "description": "List the build upload files belonging to a build upload.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[buildUploadFiles]",
        "type": "array",
        "description": "the fields to include for returned resources of type buildUploadFiles Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "assetDeliveryState",
          "assetToken",
          "assetType",
          "fileName",
          "fileSize",
          "sourceFileChecksums",
          "uploadOperations",
          "uti"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "build_uploads.create",
    "domain": "builds",
    "method": "POST",
    "path": "/v1/buildUploads",
    "description": "Create a build upload.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildUploadCreateRequest",
    "risk": "release"
  },
  {
    "name": "build_uploads.delete",
    "domain": "builds",
    "method": "DELETE",
    "path": "/v1/buildUploads/{id}",
    "description": "Delete a build upload.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "build_uploads.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildUploads/{id}",
    "description": "Read one build upload by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[buildUploads]",
        "type": "array",
        "description": "the fields to include for returned resources of type buildUploads Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "cfBundleShortVersionString",
          "cfBundleVersion",
          "createdDate",
          "state",
          "platform",
          "uploadedDate",
          "build",
          "assetFile",
          "assetDescriptionFile",
          "assetSpiFile",
          "buildUploadFiles"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build",
          "assetFile",
          "assetDescriptionFile",
          "assetSpiFile"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.app_encryption_declaration.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/appEncryptionDeclaration",
    "description": "Read the app encryption declaration for a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.app_encryption_declaration.set",
    "domain": "builds",
    "method": "PATCH",
    "path": "/v1/builds/{id}/relationships/appEncryptionDeclaration",
    "description": "Set the app encryption declaration linked to a build.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildAppEncryptionDeclarationLinkageRequest",
    "risk": "low"
  },
  {
    "name": "builds.app_store_version.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/appStoreVersion",
    "description": "Read the App Store version for a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appStoreVersionLocalizations",
          "build",
          "appStoreVersionPhasedRelease",
          "gameCenterAppVersion",
          "routingAppCoverage",
          "appStoreReviewDetail",
          "appStoreVersionSubmission",
          "appClipDefaultExperience",
          "appStoreVersionExperiments",
          "appStoreVersionExperimentsV2",
          "alternativeDistributionPackage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.app.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/app",
    "description": "Read the app for a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.beta_app_review_submission.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/betaAppReviewSubmission",
    "description": "Read the beta app review submission for a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.beta_build_localizations.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/betaBuildLocalizations",
    "description": "List the beta build localizations belonging to a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[betaBuildLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type betaBuildLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "whatsNew",
          "locale",
          "build"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.beta_build_usages.metrics",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/metrics/betaBuildUsages",
    "description": "Read beta build usages metrics for a build. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.build_beta_detail.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/buildBetaDetail",
    "description": "Read the build beta detail for a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "build"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.diagnostic_signatures.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/diagnosticSignatures",
    "description": "List the diagnostic signatures belonging to a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[diagnosticType]",
        "type": "array",
        "description": "filter by attribute 'diagnosticType'",
        "enum": [
          "DISK_WRITES",
          "HANGS",
          "LAUNCHES"
        ]
      },
      {
        "name": "fields[diagnosticSignatures]",
        "type": "array",
        "description": "the fields to include for returned resources of type diagnosticSignatures Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "diagnosticType",
          "signature",
          "weight",
          "insight",
          "logs"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}",
    "description": "Read one build by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[builds]",
        "type": "array",
        "description": "the fields to include for returned resources of type builds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "uploadedDate",
          "expirationDate",
          "expired",
          "minOsVersion",
          "lsMinimumSystemVersion",
          "computedMinMacOsVersion",
          "computedMinVisionOsVersion",
          "iconAssetToken",
          "processingState",
          "buildAudienceType",
          "usesNonExemptEncryption",
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload",
          "perfPowerMetrics",
          "diagnosticSignatures"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.icons.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/icons",
    "description": "List the icons belonging to a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.individual_testers.add",
    "domain": "builds",
    "method": "POST",
    "path": "/v1/builds/{id}/relationships/individualTesters",
    "description": "Link individual testers to a build.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildIndividualTestersLinkagesRequest",
    "risk": "low"
  },
  {
    "name": "builds.individual_testers.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/individualTesters",
    "description": "List the individual testers belonging to a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.individual_testers.remove",
    "domain": "builds",
    "method": "DELETE",
    "path": "/v1/builds/{id}/relationships/individualTesters",
    "description": "Unlink individual testers from a build.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildIndividualTestersLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "builds.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds",
    "description": "List uploaded builds across all apps, newest first with sort=-uploadedDate. Filter by app, version or processing state. For one app's builds use apps__builds__list instead.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[version]",
        "type": "array",
        "description": "filter by attribute 'version'"
      },
      {
        "name": "filter[expired]",
        "type": "array",
        "description": "filter by attribute 'expired'"
      },
      {
        "name": "filter[processingState]",
        "type": "array",
        "description": "filter by attribute 'processingState'",
        "enum": [
          "PROCESSING",
          "FAILED",
          "INVALID",
          "VALID"
        ]
      },
      {
        "name": "filter[betaAppReviewSubmission.betaReviewState]",
        "type": "array",
        "description": "filter by attribute 'betaAppReviewSubmission.betaReviewState'",
        "enum": [
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "REJECTED",
          "APPROVED"
        ]
      },
      {
        "name": "filter[usesNonExemptEncryption]",
        "type": "array",
        "description": "filter by attribute 'usesNonExemptEncryption'"
      },
      {
        "name": "filter[preReleaseVersion.version]",
        "type": "array",
        "description": "filter by attribute 'preReleaseVersion.version'"
      },
      {
        "name": "filter[preReleaseVersion.platform]",
        "type": "array",
        "description": "filter by attribute 'preReleaseVersion.platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[buildAudienceType]",
        "type": "array",
        "description": "filter by attribute 'buildAudienceType'",
        "enum": [
          "INTERNAL_ONLY",
          "APP_STORE_ELIGIBLE"
        ]
      },
      {
        "name": "filter[preReleaseVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'preReleaseVersion' Takes a 'preReleaseVersion' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list."
      },
      {
        "name": "filter[betaGroups]",
        "type": "array",
        "description": "filter by id(s) of related 'betaGroups' Takes a 'betaGroups' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersion' Takes a 'appStoreVersion' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "exists[usesNonExemptEncryption]",
        "type": "boolean",
        "description": "filter by attribute 'usesNonExemptEncryption'"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "version",
          "-version",
          "uploadedDate",
          "-uploadedDate",
          "preReleaseVersion",
          "-preReleaseVersion"
        ]
      },
      {
        "name": "fields[builds]",
        "type": "array",
        "description": "the fields to include for returned resources of type builds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "uploadedDate",
          "expirationDate",
          "expired",
          "minOsVersion",
          "lsMinimumSystemVersion",
          "computedMinMacOsVersion",
          "computedMinVisionOsVersion",
          "iconAssetToken",
          "processingState",
          "buildAudienceType",
          "usesNonExemptEncryption",
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload",
          "perfPowerMetrics",
          "diagnosticSignatures"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.perf_power_metrics.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/perfPowerMetrics",
    "description": "List the perf power metrics belonging to a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS"
        ]
      },
      {
        "name": "filter[metricType]",
        "type": "array",
        "description": "filter by attribute 'metricType'",
        "enum": [
          "DISK",
          "HANG",
          "BATTERY",
          "LAUNCH",
          "MEMORY",
          "ANIMATION",
          "TERMINATION",
          "STORAGE"
        ]
      },
      {
        "name": "filter[deviceType]",
        "type": "array",
        "description": "filter by attribute 'deviceType'"
      }
    ],
    "hasBody": false,
    "accept": "application/vnd.apple.xcode-metrics+json"
  },
  {
    "name": "builds.pre_release_version.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/preReleaseVersion",
    "description": "Read the pre release version for a build.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.update",
    "domain": "builds",
    "method": "PATCH",
    "path": "/v1/builds/{id}",
    "description": "Update a build — most commonly to set usesNonExemptEncryption compliance so it can be distributed.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildUpdateRequest",
    "risk": "low"
  },
  {
    "name": "bundle_id_capabilities.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/bundleIdCapabilities",
    "description": "Create a bundle ID capability.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BundleIdCapabilityCreateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "bundle_id_capabilities.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/bundleIdCapabilities/{id}",
    "description": "Delete a bundle ID capability.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "bundle_id_capabilities.update",
    "domain": "provisioning",
    "method": "PATCH",
    "path": "/v1/bundleIdCapabilities/{id}",
    "description": "Update a bundle ID capability.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BundleIdCapabilityUpdateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "bundle_ids.app.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds/{id}/app",
    "description": "Read the app for a bundle ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "bundle_ids.bundle_id_capabilities.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds/{id}/bundleIdCapabilities",
    "description": "List the bundle ID capabilities belonging to a bundle ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[bundleIdCapabilities]",
        "type": "array",
        "description": "the fields to include for returned resources of type bundleIdCapabilities Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "capabilityType",
          "settings"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "bundle_ids.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/bundleIds",
    "description": "Register a new bundle identifier before creating provisioning profiles for it.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BundleIdCreateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "bundle_ids.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/bundleIds/{id}",
    "description": "Delete a bundle ID.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "bundle_ids.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds/{id}",
    "description": "Read one bundle ID by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[bundleIds]",
        "type": "array",
        "description": "the fields to include for returned resources of type bundleIds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "platform",
          "identifier",
          "seedId",
          "profiles",
          "bundleIdCapabilities",
          "app"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "profiles",
          "bundleIdCapabilities",
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "bundle_ids.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds",
    "description": "List bundle IDs.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "UNIVERSAL"
        ]
      },
      {
        "name": "filter[identifier]",
        "type": "array",
        "description": "filter by attribute 'identifier'"
      },
      {
        "name": "filter[seedId]",
        "type": "array",
        "description": "filter by attribute 'seedId'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name",
          "platform",
          "-platform",
          "identifier",
          "-identifier",
          "seedId",
          "-seedId",
          "id",
          "-id"
        ]
      },
      {
        "name": "fields[bundleIds]",
        "type": "array",
        "description": "the fields to include for returned resources of type bundleIds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "platform",
          "identifier",
          "seedId",
          "profiles",
          "bundleIdCapabilities",
          "app"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "profiles",
          "bundleIdCapabilities",
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "bundle_ids.profiles.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds/{id}/profiles",
    "description": "List the profiles belonging to a bundle ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[profiles]",
        "type": "array",
        "description": "the fields to include for returned resources of type profiles Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "platform",
          "profileType",
          "profileState",
          "profileContent",
          "uuid",
          "createdDate",
          "expirationDate",
          "bundleId",
          "devices",
          "certificates"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "bundle_ids.update",
    "domain": "provisioning",
    "method": "PATCH",
    "path": "/v1/bundleIds/{id}",
    "description": "Update a bundle ID.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BundleIdUpdateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "certificates.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/certificates",
    "description": "Create a certificate.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CertificateCreateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "certificates.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/certificates/{id}",
    "description": "Revoke a signing certificate. Any provisioning profile built on it stops working, so replace the profile before removing the certificate a build depends on.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "certificates.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/certificates/{id}",
    "description": "Read one certificate by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[certificates]",
        "type": "array",
        "description": "the fields to include for returned resources of type certificates Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "certificateType",
          "displayName",
          "serialNumber",
          "platform",
          "expirationDate",
          "certificateContent",
          "activated",
          "passTypeId"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "passTypeId"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "certificates.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/certificates",
    "description": "List certificates.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[displayName]",
        "type": "array",
        "description": "filter by attribute 'displayName'"
      },
      {
        "name": "filter[certificateType]",
        "type": "array",
        "description": "filter by attribute 'certificateType'",
        "enum": [
          "APPLE_PAY",
          "APPLE_PAY_MERCHANT_IDENTITY",
          "APPLE_PAY_PSP_IDENTITY",
          "APPLE_PAY_RSA",
          "DEVELOPER_ID_KEXT",
          "DEVELOPER_ID_KEXT_G2",
          "DEVELOPER_ID_APPLICATION",
          "DEVELOPER_ID_APPLICATION_G2",
          "DEVELOPMENT",
          "DISTRIBUTION",
          "IDENTITY_ACCESS",
          "IOS_DEVELOPMENT",
          "IOS_DISTRIBUTION",
          "MAC_APP_DISTRIBUTION",
          "MAC_INSTALLER_DISTRIBUTION",
          "MAC_APP_DEVELOPMENT",
          "PASS_TYPE_ID",
          "PASS_TYPE_ID_WITH_NFC"
        ]
      },
      {
        "name": "filter[serialNumber]",
        "type": "array",
        "description": "filter by attribute 'serialNumber'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "displayName",
          "-displayName",
          "certificateType",
          "-certificateType",
          "serialNumber",
          "-serialNumber",
          "id",
          "-id"
        ]
      },
      {
        "name": "fields[certificates]",
        "type": "array",
        "description": "the fields to include for returned resources of type certificates Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "certificateType",
          "displayName",
          "serialNumber",
          "platform",
          "expirationDate",
          "certificateContent",
          "activated",
          "passTypeId"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "passTypeId"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "certificates.pass_type_id.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/certificates/{id}/passTypeId",
    "description": "Read the pass type ID for a certificate.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "certificates"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "certificates.update",
    "domain": "provisioning",
    "method": "PATCH",
    "path": "/v1/certificates/{id}",
    "description": "Update a certificate.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CertificateUpdateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "ci_artifacts.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciArtifacts/{id}",
    "description": "Read one Xcode Cloud artifact by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[ciArtifacts]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciArtifacts Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileType",
          "fileName",
          "fileSize",
          "downloadUrl"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_build_actions.artifacts.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}/artifacts",
    "description": "List the artifacts belonging to an Xcode Cloud build action.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_build_actions.build_run.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}/buildRun",
    "description": "Read the build run for an Xcode Cloud build action.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "builds",
          "workflow",
          "product",
          "sourceBranchOrTag",
          "destinationBranch",
          "pullRequest"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_build_actions.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}",
    "description": "Read one Xcode Cloud build action by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[ciBuildActions]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciBuildActions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "actionType",
          "startedDate",
          "finishedDate",
          "issueCounts",
          "executionProgress",
          "completionStatus",
          "isRequiredToPass",
          "buildRun",
          "artifacts",
          "issues",
          "testResults"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "buildRun"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_build_actions.issues.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}/issues",
    "description": "List the issues belonging to an Xcode Cloud build action.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_build_actions.test_results.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}/testResults",
    "description": "List the test results belonging to an Xcode Cloud build action.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_build_runs.actions.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildRuns/{id}/actions",
    "description": "List the actions belonging to an Xcode Cloud build run.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "buildRun"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_build_runs.builds.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildRuns/{id}/builds",
    "description": "List the builds belonging to an Xcode Cloud build run.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[version]",
        "type": "array",
        "description": "filter by attribute 'version'"
      },
      {
        "name": "filter[expired]",
        "type": "array",
        "description": "filter by attribute 'expired'"
      },
      {
        "name": "filter[processingState]",
        "type": "array",
        "description": "filter by attribute 'processingState'",
        "enum": [
          "PROCESSING",
          "FAILED",
          "INVALID",
          "VALID"
        ]
      },
      {
        "name": "filter[betaAppReviewSubmission.betaReviewState]",
        "type": "array",
        "description": "filter by attribute 'betaAppReviewSubmission.betaReviewState'",
        "enum": [
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "REJECTED",
          "APPROVED"
        ]
      },
      {
        "name": "filter[usesNonExemptEncryption]",
        "type": "array",
        "description": "filter by attribute 'usesNonExemptEncryption'"
      },
      {
        "name": "filter[preReleaseVersion.version]",
        "type": "array",
        "description": "filter by attribute 'preReleaseVersion.version'"
      },
      {
        "name": "filter[preReleaseVersion.platform]",
        "type": "array",
        "description": "filter by attribute 'preReleaseVersion.platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[buildAudienceType]",
        "type": "array",
        "description": "filter by attribute 'buildAudienceType'",
        "enum": [
          "INTERNAL_ONLY",
          "APP_STORE_ELIGIBLE"
        ]
      },
      {
        "name": "filter[preReleaseVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'preReleaseVersion' Takes a 'preReleaseVersion' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list."
      },
      {
        "name": "filter[betaGroups]",
        "type": "array",
        "description": "filter by id(s) of related 'betaGroups' Takes a 'betaGroups' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[appStoreVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersion' Takes a 'appStoreVersion' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "exists[usesNonExemptEncryption]",
        "type": "boolean",
        "description": "filter by attribute 'usesNonExemptEncryption'"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "version",
          "-version",
          "uploadedDate",
          "-uploadedDate",
          "preReleaseVersion",
          "-preReleaseVersion"
        ]
      },
      {
        "name": "fields[builds]",
        "type": "array",
        "description": "the fields to include for returned resources of type builds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "uploadedDate",
          "expirationDate",
          "expired",
          "minOsVersion",
          "lsMinimumSystemVersion",
          "computedMinMacOsVersion",
          "computedMinVisionOsVersion",
          "iconAssetToken",
          "processingState",
          "buildAudienceType",
          "usesNonExemptEncryption",
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload",
          "perfPowerMetrics",
          "diagnosticSignatures"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_build_runs.create",
    "domain": "xcode_cloud",
    "method": "POST",
    "path": "/v1/ciBuildRuns",
    "description": "Start an Xcode Cloud build for a workflow, optionally targeting a specific branch, tag or pull request.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CiBuildRunCreateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "ci_build_runs.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildRuns/{id}",
    "description": "Read one Xcode Cloud build run by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[ciBuildRuns]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciBuildRuns Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "number",
          "createdDate",
          "startedDate",
          "finishedDate",
          "sourceCommit",
          "destinationCommit",
          "isPullRequestBuild",
          "issueCounts",
          "executionProgress",
          "completionStatus",
          "startReason",
          "cancelReason",
          "builds",
          "workflow",
          "product",
          "sourceBranchOrTag",
          "destinationBranch",
          "actions",
          "pullRequest"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "builds",
          "workflow",
          "product",
          "sourceBranchOrTag",
          "destinationBranch",
          "pullRequest"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_issues.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciIssues/{id}",
    "description": "Read one Xcode Cloud issue by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[ciIssues]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciIssues Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "issueType",
          "message",
          "fileSource",
          "category"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_mac_os_versions.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciMacOsVersions/{id}",
    "description": "Read one Xcode Cloud mac os version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[ciMacOsVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciMacOsVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "name",
          "xcodeVersions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "xcodeVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_mac_os_versions.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciMacOsVersions",
    "description": "List Xcode Cloud mac os versions.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "fields[ciMacOsVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciMacOsVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "name",
          "xcodeVersions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "xcodeVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_mac_os_versions.xcode_versions.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciMacOsVersions/{id}/xcodeVersions",
    "description": "List the Xcode versions belonging to an Xcode Cloud mac os version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "macOsVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_products.additional_repositories.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/additionalRepositories",
    "description": "List the additional repositories belonging to an Xcode Cloud product.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_products.app.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/app",
    "description": "Read the app for an Xcode Cloud product.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appEncryptionDeclarations",
          "appStoreIcon",
          "ciProduct",
          "betaGroups",
          "appStoreVersions",
          "preReleaseVersions",
          "betaAppLocalizations",
          "builds",
          "betaLicenseAgreement",
          "betaAppReviewDetail",
          "appInfos",
          "appClips",
          "endUserLicenseAgreement",
          "inAppPurchases",
          "subscriptionGroups",
          "gameCenterEnabledVersions",
          "appCustomProductPages",
          "inAppPurchasesV2",
          "promotedPurchases",
          "appEvents",
          "reviewSubmissions",
          "subscriptionGracePeriod",
          "gameCenterDetail",
          "appStoreVersionExperimentsV2",
          "androidToIosAppMappingDetails"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_products.build_runs.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/buildRuns",
    "description": "List the build runs belonging to an Xcode Cloud product.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds' Takes a 'builds' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "number",
          "-number"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "builds",
          "workflow",
          "product",
          "sourceBranchOrTag",
          "destinationBranch",
          "pullRequest"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_products.delete",
    "domain": "xcode_cloud",
    "method": "DELETE",
    "path": "/v1/ciProducts/{id}",
    "description": "Delete an Xcode Cloud product.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "ci_products.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}",
    "description": "Read one Xcode Cloud product by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[ciProducts]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciProducts Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "createdDate",
          "productType",
          "app",
          "bundleId",
          "workflows",
          "primaryRepositories",
          "additionalRepositories",
          "buildRuns"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "bundleId",
          "primaryRepositories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_products.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts",
    "description": "List Xcode Cloud products.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[productType]",
        "type": "array",
        "description": "filter by attribute 'productType'",
        "enum": [
          "APP",
          "FRAMEWORK"
        ]
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list."
      },
      {
        "name": "fields[ciProducts]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciProducts Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "createdDate",
          "productType",
          "app",
          "bundleId",
          "workflows",
          "primaryRepositories",
          "additionalRepositories",
          "buildRuns"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "bundleId",
          "primaryRepositories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_products.primary_repositories.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/primaryRepositories",
    "description": "List the primary repositories belonging to an Xcode Cloud product.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_products.workflows.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/workflows",
    "description": "List the workflows belonging to an Xcode Cloud product.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "product",
          "repository",
          "xcodeVersion",
          "macOsVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_test_results.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciTestResults/{id}",
    "description": "Read one Xcode Cloud test result by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[ciTestResults]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciTestResults Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "className",
          "name",
          "status",
          "fileSource",
          "message",
          "destinationTestResults"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_workflows.build_runs.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciWorkflows/{id}/buildRuns",
    "description": "List the Xcode Cloud builds a workflow has run, newest first, with how each one ended.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds' Takes a 'builds' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "number",
          "-number"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "builds",
          "workflow",
          "product",
          "sourceBranchOrTag",
          "destinationBranch",
          "pullRequest"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_workflows.create",
    "domain": "xcode_cloud",
    "method": "POST",
    "path": "/v1/ciWorkflows",
    "description": "Set up an Xcode Cloud workflow — what starts a build, which actions it runs (build, test, archive) and where it goes afterwards.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CiWorkflowCreateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "ci_workflows.delete",
    "domain": "xcode_cloud",
    "method": "DELETE",
    "path": "/v1/ciWorkflows/{id}",
    "description": "Delete an Xcode Cloud workflow.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "ci_workflows.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciWorkflows/{id}",
    "description": "Read one Xcode Cloud workflow by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[ciWorkflows]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciWorkflows Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "description",
          "branchStartCondition",
          "tagStartCondition",
          "pullRequestStartCondition",
          "scheduledStartCondition",
          "manualBranchStartCondition",
          "manualTagStartCondition",
          "manualPullRequestStartCondition",
          "actions",
          "isEnabled",
          "isLockedForEditing",
          "clean",
          "containerFilePath",
          "lastModifiedDate",
          "product",
          "repository",
          "xcodeVersion",
          "macOsVersion",
          "buildRuns"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "product",
          "repository",
          "xcodeVersion",
          "macOsVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_workflows.repository.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciWorkflows/{id}/repository",
    "description": "Read the repository for an Xcode Cloud workflow.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_workflows.update",
    "domain": "xcode_cloud",
    "method": "PATCH",
    "path": "/v1/ciWorkflows/{id}",
    "description": "Update an Xcode Cloud workflow.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CiWorkflowUpdateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "ci_xcode_versions.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciXcodeVersions/{id}",
    "description": "Read one Xcode Cloud Xcode version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[ciXcodeVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciXcodeVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "name",
          "testDestinations",
          "macOsVersions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "macOsVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_xcode_versions.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciXcodeVersions",
    "description": "List Xcode Cloud Xcode versions.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "fields[ciXcodeVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type ciXcodeVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "name",
          "testDestinations",
          "macOsVersions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "macOsVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_xcode_versions.mac_os_versions.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciXcodeVersions/{id}/macOsVersions",
    "description": "List the mac os versions belonging to an Xcode Cloud Xcode version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "xcodeVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "customer_review_responses.create",
    "domain": "reviews",
    "method": "POST",
    "path": "/v1/customerReviewResponses",
    "description": "Publish a developer response to a customer review. One response per review; use update to change it.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CustomerReviewResponseV1CreateRequest",
    "risk": "public"
  },
  {
    "name": "customer_review_responses.delete",
    "domain": "reviews",
    "method": "DELETE",
    "path": "/v1/customerReviewResponses/{id}",
    "description": "Delete your response to a customer review.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "customer_review_responses.get",
    "domain": "reviews",
    "method": "GET",
    "path": "/v1/customerReviewResponses/{id}",
    "description": "Read one customer review response by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[customerReviewResponses]",
        "type": "array",
        "description": "the fields to include for returned resources of type customerReviewResponses Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "responseBody",
          "lastModifiedDate",
          "state",
          "review"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "review"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "customer_reviews.get",
    "domain": "reviews",
    "method": "GET",
    "path": "/v1/customerReviews/{id}",
    "description": "Read one customer review by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[customerReviews]",
        "type": "array",
        "description": "the fields to include for returned resources of type customerReviews Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "rating",
          "title",
          "body",
          "reviewerNickname",
          "createdDate",
          "territory",
          "response",
          "reviewTerritory"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "response",
          "reviewTerritory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "customer_reviews.response.get",
    "domain": "reviews",
    "method": "GET",
    "path": "/v1/customerReviews/{id}/response",
    "description": "Read the response for a customer review.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "review"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "devices.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/devices",
    "description": "Register a device for development and ad-hoc provisioning by its UDID, so builds signed for it will install.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "DeviceCreateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "devices.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/devices/{id}",
    "description": "Read one device by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[devices]",
        "type": "array",
        "description": "the fields to include for returned resources of type devices Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "platform",
          "udid",
          "deviceClass",
          "status",
          "model",
          "addedDate"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "devices.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/devices",
    "description": "List devices.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "UNIVERSAL"
        ]
      },
      {
        "name": "filter[udid]",
        "type": "array",
        "description": "filter by attribute 'udid'"
      },
      {
        "name": "filter[status]",
        "type": "array",
        "description": "filter by attribute 'status'",
        "enum": [
          "ENABLED",
          "DISABLED"
        ]
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name",
          "platform",
          "-platform",
          "udid",
          "-udid",
          "status",
          "-status",
          "id",
          "-id"
        ]
      },
      {
        "name": "fields[devices]",
        "type": "array",
        "description": "the fields to include for returned resources of type devices Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "platform",
          "udid",
          "deviceClass",
          "status",
          "model",
          "addedDate"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "devices.update",
    "domain": "provisioning",
    "method": "PATCH",
    "path": "/v1/devices/{id}",
    "description": "Update a device.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "DeviceUpdateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "diagnostic_signatures.logs.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/diagnosticSignatures/{id}/logs",
    "description": "List the logs belonging to a diagnostic signature.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false,
    "accept": "application/vnd.apple.diagnostic-logs+json"
  },
  {
    "name": "end_app_availability_pre_orders.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/endAppAvailabilityPreOrders",
    "description": "Create an end app availability pre order.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "EndAppAvailabilityPreOrderCreateRequest",
    "risk": "release"
  },
  {
    "name": "end_user_license_agreements.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/endUserLicenseAgreements",
    "description": "Create an end user license agreement.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "EndUserLicenseAgreementCreateRequest",
    "risk": "public"
  },
  {
    "name": "end_user_license_agreements.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/endUserLicenseAgreements/{id}",
    "description": "Delete an end user license agreement.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "end_user_license_agreements.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/endUserLicenseAgreements/{id}",
    "description": "Read one end user license agreement by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[endUserLicenseAgreements]",
        "type": "array",
        "description": "the fields to include for returned resources of type endUserLicenseAgreements Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "agreementText",
          "app",
          "territories"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "territories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "end_user_license_agreements.territories.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/endUserLicenseAgreements/{id}/territories",
    "description": "List the territories belonging to an end user license agreement.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[territories]",
        "type": "array",
        "description": "the fields to include for returned resources of type territories Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "currency"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "end_user_license_agreements.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/endUserLicenseAgreements/{id}",
    "description": "Update an end user license agreement.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "EndUserLicenseAgreementUpdateRequest",
    "risk": "public"
  },
  {
    "name": "finance_reports.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/financeReports",
    "description": "Download the monthly financial report — what Apple actually paid, by region and currency, for a fiscal period. This is the money report, as opposed to units sold. Needs ASC_VENDOR_NUMBER and a Finance role on the API key.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[vendorNumber]",
        "type": "array",
        "description": "filter by attribute 'vendorNumber'",
        "required": true
      },
      {
        "name": "filter[reportType]",
        "type": "array",
        "description": "filter by attribute 'reportType'",
        "enum": [
          "FINANCIAL",
          "FINANCE_DETAIL"
        ],
        "required": true
      },
      {
        "name": "filter[regionCode]",
        "type": "array",
        "description": "filter by attribute 'regionCode'",
        "required": true
      },
      {
        "name": "filter[reportDate]",
        "type": "array",
        "description": "filter by attribute 'reportDate'",
        "required": true
      }
    ],
    "hasBody": false,
    "accept": "application/a-gzip"
  },
  {
    "name": "game_center_achievement_images_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterAchievementImages",
    "description": "Create a Game Center achievement images (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementImageV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_achievement_images_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterAchievementImages/{id}",
    "description": "Delete a Game Center achievement images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_achievement_images_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementImages/{id}",
    "description": "Read one Game Center achievement images (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterAchievementImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterAchievementImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "imageAsset",
          "uploadOperations",
          "assetDeliveryState",
          "localization"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "localization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_images_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterAchievementImages/{id}",
    "description": "Update a Game Center achievement images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementImageV2UpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_achievement_localizations_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterAchievementLocalizations",
    "description": "Create a Game Center achievement localizations (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementLocalizationV2CreateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_achievement_localizations_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterAchievementLocalizations/{id}",
    "description": "Delete a Game Center achievement localizations (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_achievement_localizations_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementLocalizations/{id}",
    "description": "Read one Game Center achievement localizations (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterAchievementLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterAchievementLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "name",
          "beforeEarnedDescription",
          "afterEarnedDescription",
          "version",
          "image"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations_v2.image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementLocalizations/{id}/image",
    "description": "Read the image for a Game Center achievement localizations (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "localization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterAchievementLocalizations/{id}",
    "description": "Update a Game Center achievement localizations (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementLocalizationV2UpdateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_achievement_versions_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterAchievementVersions",
    "description": "Create a Game Center achievement versions (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementVersionV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_achievement_versions_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementVersions/{id}",
    "description": "Read one Game Center achievement versions (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterAchievementVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterAchievementVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "achievement",
          "localizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "achievement",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_versions_v2.localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementVersions/{id}/localizations",
    "description": "List the localizations belonging to a Game Center achievement versions (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievements_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterAchievements",
    "description": "Create a Game Center achievement — a milestone a player unlocks once, worth a share of the 1000 achievement points a game has to spend.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_achievements_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterAchievements/{id}",
    "description": "Delete a Game Center achievements (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_achievements_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievements/{id}",
    "description": "Read one Game Center achievements (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterAchievements]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterAchievements Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "vendorIdentifier",
          "points",
          "showBeforeEarned",
          "repeatable",
          "archived",
          "activityProperties",
          "gameCenterDetail",
          "gameCenterGroup",
          "activity",
          "versions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "activity",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievements_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterAchievements/{id}",
    "description": "Update a Game Center achievements (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementV2UpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_achievements_v2.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievements/{id}/versions",
    "description": "List the versions belonging to a Game Center achievements (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "achievement",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_activities.achievements_v2.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivities/{id}/relationships/achievementsV2",
    "description": "Link achievements (v2) to a Game Center activity.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityAchievementsV2LinkagesRequest",
    "risk": "low"
  },
  {
    "name": "game_center_activities.achievements_v2.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivities/{id}/relationships/achievementsV2",
    "description": "Unlink achievements (v2) from a Game Center activity.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityAchievementsV2LinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_activities.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivities",
    "description": "Create a Game Center activity.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_activities.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivities/{id}",
    "description": "Delete a Game Center activity.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_activities.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivities/{id}",
    "description": "Read one Game Center activity by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterActivities]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterActivities Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "vendorIdentifier",
          "playStyle",
          "minimumPlayersCount",
          "maximumPlayersCount",
          "supportsPartyCode",
          "archived",
          "properties",
          "gameCenterDetail",
          "gameCenterGroup",
          "achievements",
          "achievementsV2",
          "leaderboards",
          "leaderboardsV2",
          "versions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "achievements",
          "achievementsV2",
          "leaderboards",
          "leaderboardsV2",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_activities.leaderboards_v2.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivities/{id}/relationships/leaderboardsV2",
    "description": "Link leaderboards (v2) to a Game Center activity.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLeaderboardsV2LinkagesRequest",
    "risk": "low"
  },
  {
    "name": "game_center_activities.leaderboards_v2.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivities/{id}/relationships/leaderboardsV2",
    "description": "Unlink leaderboards (v2) from a Game Center activity.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLeaderboardsV2LinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_activities.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterActivities/{id}",
    "description": "Update a Game Center activity.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_activities.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivities/{id}/versions",
    "description": "List the versions belonging to a Game Center activity.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "activity",
          "localizations",
          "defaultImage",
          "releases"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_activity_images.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivityImages",
    "description": "Create a Game Center activity image.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityImageCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_activity_images.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivityImages/{id}",
    "description": "Delete a Game Center activity image.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_activity_images.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityImages/{id}",
    "description": "Read one Game Center activity image by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterActivityImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterActivityImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "imageAsset",
          "uploadOperations",
          "assetDeliveryState"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_activity_images.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterActivityImages/{id}",
    "description": "Update a Game Center activity image.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityImageUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_activity_localizations.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivityLocalizations",
    "description": "Create a Game Center activity localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_activity_localizations.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivityLocalizations/{id}",
    "description": "Delete a Game Center activity localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_activity_localizations.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityLocalizations/{id}",
    "description": "Read one Game Center activity localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterActivityLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterActivityLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "name",
          "description",
          "version",
          "image"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_activity_localizations.image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityLocalizations/{id}/image",
    "description": "Read the image for a Game Center activity localization.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_activity_localizations.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterActivityLocalizations/{id}",
    "description": "Update a Game Center activity localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_activity_versions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivityVersions",
    "description": "Create a Game Center activity version.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityVersionCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_activity_versions.default_image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityVersions/{id}/defaultImage",
    "description": "Read the default image for a Game Center activity version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_activity_versions.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityVersions/{id}",
    "description": "Read one Game Center activity version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterActivityVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterActivityVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "fallbackUrl",
          "activity",
          "localizations",
          "defaultImage",
          "releases"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "activity",
          "localizations",
          "defaultImage",
          "releases"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_activity_versions.localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityVersions/{id}/localizations",
    "description": "List the localizations belonging to a Game Center activity version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_activity_versions.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterActivityVersions/{id}",
    "description": "Update a Game Center activity version.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityVersionUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_app_versions.app_store_version.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAppVersions/{id}/appStoreVersion",
    "description": "Read the App Store version for a Game Center app version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "appStoreVersionLocalizations",
          "build",
          "appStoreVersionPhasedRelease",
          "gameCenterAppVersion",
          "routingAppCoverage",
          "appStoreReviewDetail",
          "appStoreVersionSubmission",
          "appClipDefaultExperience",
          "appStoreVersionExperiments",
          "appStoreVersionExperimentsV2",
          "alternativeDistributionPackage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_app_versions.compatibility_versions.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterAppVersions/{id}/relationships/compatibilityVersions",
    "description": "Link compatibility versions to a Game Center app version.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAppVersionCompatibilityVersionsLinkagesRequest",
    "risk": "low"
  },
  {
    "name": "game_center_app_versions.compatibility_versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAppVersions/{id}/compatibilityVersions",
    "description": "List the compatibility versions belonging to a Game Center app version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[enabled]",
        "type": "array",
        "description": "filter by attribute 'enabled'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "compatibilityVersions",
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_app_versions.compatibility_versions.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterAppVersions/{id}/relationships/compatibilityVersions",
    "description": "Unlink compatibility versions from a Game Center app version.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAppVersionCompatibilityVersionsLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_app_versions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterAppVersions",
    "description": "Create a Game Center app version.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAppVersionCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_app_versions.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAppVersions/{id}",
    "description": "Read one Game Center app version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterAppVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterAppVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "enabled",
          "compatibilityVersions",
          "appStoreVersion"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "compatibilityVersions",
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_app_versions.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterAppVersions/{id}",
    "description": "Update a Game Center app version.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAppVersionUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_challenge_images.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterChallengeImages",
    "description": "Create a Game Center challenge image.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeImageCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_challenge_images.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterChallengeImages/{id}",
    "description": "Delete a Game Center challenge image.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_challenge_images.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeImages/{id}",
    "description": "Read one Game Center challenge image by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterChallengeImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterChallengeImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "imageAsset",
          "uploadOperations",
          "assetDeliveryState"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_images.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterChallengeImages/{id}",
    "description": "Update a Game Center challenge image.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeImageUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_challenge_localizations.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterChallengeLocalizations",
    "description": "Create a Game Center challenge localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_challenge_localizations.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterChallengeLocalizations/{id}",
    "description": "Delete a Game Center challenge localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_challenge_localizations.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeLocalizations/{id}",
    "description": "Read one Game Center challenge localization by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterChallengeLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterChallengeLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "name",
          "description",
          "version",
          "image"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_localizations.image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeLocalizations/{id}/image",
    "description": "Read the image for a Game Center challenge localization.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_localizations.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterChallengeLocalizations/{id}",
    "description": "Update a Game Center challenge localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_challenge_versions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterChallengeVersions",
    "description": "Create a Game Center challenge version.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeVersionCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_challenge_versions.default_image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeVersions/{id}/defaultImage",
    "description": "Read the default image for a Game Center challenge version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_versions.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeVersions/{id}",
    "description": "Read one Game Center challenge version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterChallengeVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterChallengeVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "challenge",
          "localizations",
          "releases",
          "defaultImage"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "challenge",
          "localizations",
          "releases",
          "defaultImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_versions.localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeVersions/{id}/localizations",
    "description": "List the localizations belonging to a Game Center challenge version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_challenges.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterChallenges",
    "description": "Create a Game Center challenge.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_challenges.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterChallenges/{id}",
    "description": "Delete a Game Center challenge.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_challenges.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallenges/{id}",
    "description": "Read one Game Center challenge by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterChallenges]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterChallenges Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "vendorIdentifier",
          "archived",
          "challengeType",
          "repeatable",
          "gameCenterDetail",
          "gameCenterGroup",
          "versions",
          "leaderboard",
          "leaderboardV2"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "versions",
          "leaderboard",
          "leaderboardV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_challenges.leaderboard_v2.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterChallenges/{id}/relationships/leaderboardV2",
    "description": "Set the leaderboard (v2) linked to a Game Center challenge.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeLeaderboardV2LinkageRequest",
    "risk": "low"
  },
  {
    "name": "game_center_challenges.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterChallenges/{id}",
    "description": "Update a Game Center challenge.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_challenges.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallenges/{id}/versions",
    "description": "List the versions belonging to a Game Center challenge.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "challenge",
          "localizations",
          "releases",
          "defaultImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_detail_players.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetailPlayers/{id}",
    "description": "Update a Game Center detail player.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailPlayerUpdateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_details.blocked_players.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/blockedPlayers",
    "description": "List the blocked players belonging to a Game Center detail.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.challenges_minimum_platform_versions.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/challengesMinimumPlatformVersions",
    "description": "Replace the full set of challenges minimum platform versions linked to a Game Center detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailChallengesMinimumPlatformVersionsLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_details.classic_matchmaking_requests.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/metrics/classicMatchmakingRequests",
    "description": "Read classic matchmaking requests metrics for a Game Center detail. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "groupBy",
        "type": "array",
        "description": "the dimension by which to group the results",
        "enum": [
          "result"
        ]
      },
      {
        "name": "filter[result]",
        "type": "string",
        "description": "filter by 'result' attribute dimension",
        "enum": [
          "MATCHED",
          "CANCELED",
          "EXPIRED"
        ]
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count",
          "averageSecondsInQueue",
          "-averageSecondsInQueue",
          "p50SecondsInQueue",
          "-p50SecondsInQueue",
          "p95SecondsInQueue",
          "-p95SecondsInQueue"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterDetails",
    "description": "Create a Game Center detail.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_details.game_center_achievements_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterAchievementsV2",
    "description": "List the Game Center achievements (v2) belonging to a Game Center detail.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[archived]",
        "type": "array",
        "description": "filter by attribute 'archived'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "activity",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_achievements_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterAchievementsV2",
    "description": "Replace the full set of Game Center achievements (v2) linked to a Game Center detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailGameCenterAchievementsV2LinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_details.game_center_activities.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterActivities",
    "description": "List the Game Center activities belonging to a Game Center detail.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterActivities]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterActivities Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "vendorIdentifier",
          "playStyle",
          "minimumPlayersCount",
          "maximumPlayersCount",
          "supportsPartyCode",
          "archived",
          "properties",
          "gameCenterDetail",
          "gameCenterGroup",
          "achievements",
          "achievementsV2",
          "leaderboards",
          "leaderboardsV2",
          "versions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "achievements",
          "achievementsV2",
          "leaderboards",
          "leaderboardsV2",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_app_versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterAppVersions",
    "description": "List the Game Center app versions belonging to a Game Center detail.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[enabled]",
        "type": "array",
        "description": "filter by attribute 'enabled'"
      },
      {
        "name": "fields[gameCenterAppVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterAppVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "enabled",
          "compatibilityVersions",
          "appStoreVersion"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "compatibilityVersions",
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_challenges.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterChallenges",
    "description": "List the Game Center challenges belonging to a Game Center detail.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[archived]",
        "type": "array",
        "description": "filter by attribute 'archived'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "fields[gameCenterChallenges]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterChallenges Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "vendorIdentifier",
          "archived",
          "challengeType",
          "repeatable",
          "gameCenterDetail",
          "gameCenterGroup",
          "versions",
          "leaderboard",
          "leaderboardV2"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "versions",
          "leaderboard",
          "leaderboardV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_group.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterGroup",
    "description": "Read the Game Center group for a Game Center detail.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetails",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_leaderboard_sets_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterLeaderboardSetsV2",
    "description": "List the Game Center leaderboard sets (v2) belonging to a Game Center detail.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboards",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_leaderboard_sets_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboardSetsV2",
    "description": "Replace the full set of Game Center leaderboard sets (v2) linked to a Game Center detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailGameCenterLeaderboardSetsV2LinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_details.game_center_leaderboards_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterLeaderboardsV2",
    "description": "List the Game Center leaderboards (v2) belonging to a Game Center detail.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[archived]",
        "type": "array",
        "description": "filter by attribute 'archived'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboardSets",
          "activity",
          "challenge",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_leaderboards_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboardsV2",
    "description": "Replace the full set of Game Center leaderboards (v2) linked to a Game Center detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailGameCenterLeaderboardsV2LinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_details.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}",
    "description": "Read one Game Center detail by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "arcadeEnabled",
          "challengeEnabled",
          "app",
          "gameCenterAppVersions",
          "gameCenterGroup",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges",
          "defaultLeaderboard",
          "defaultLeaderboardV2",
          "defaultGroupLeaderboard",
          "defaultGroupLeaderboardV2",
          "achievementReleases",
          "activityReleases",
          "challengeReleases",
          "leaderboardReleases",
          "leaderboardSetReleases",
          "blockedPlayers",
          "challengesMinimumPlatformVersions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "gameCenterAppVersions",
          "gameCenterGroup",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges",
          "defaultLeaderboard",
          "defaultLeaderboardV2",
          "defaultGroupLeaderboard",
          "defaultGroupLeaderboardV2",
          "achievementReleases",
          "activityReleases",
          "challengeReleases",
          "leaderboardReleases",
          "leaderboardSetReleases",
          "challengesMinimumPlatformVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.rule_based_matchmaking_requests.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/metrics/ruleBasedMatchmakingRequests",
    "description": "Read rule based matchmaking requests metrics for a Game Center detail. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "groupBy",
        "type": "array",
        "description": "the dimension by which to group the results",
        "enum": [
          "result"
        ]
      },
      {
        "name": "filter[result]",
        "type": "string",
        "description": "filter by 'result' attribute dimension",
        "enum": [
          "MATCHED",
          "CANCELED",
          "EXPIRED"
        ]
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count",
          "averageSecondsInQueue",
          "-averageSecondsInQueue",
          "p50SecondsInQueue",
          "-p50SecondsInQueue",
          "p95SecondsInQueue",
          "-p95SecondsInQueue"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}",
    "description": "Update a Game Center detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_groups.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterGroups",
    "description": "Create a Game Center group.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_groups.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterGroups/{id}",
    "description": "Delete a Game Center group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_groups.game_center_achievements_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterAchievementsV2",
    "description": "List the Game Center achievements (v2) belonging to a Game Center group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[archived]",
        "type": "array",
        "description": "filter by attribute 'archived'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "activity",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_achievements_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterAchievementsV2",
    "description": "Replace the full set of Game Center achievements (v2) linked to a Game Center group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupGameCenterAchievementsV2LinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_groups.game_center_activities.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterActivities",
    "description": "List the Game Center activities belonging to a Game Center group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterActivities]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterActivities Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "vendorIdentifier",
          "playStyle",
          "minimumPlayersCount",
          "maximumPlayersCount",
          "supportsPartyCode",
          "archived",
          "properties",
          "gameCenterDetail",
          "gameCenterGroup",
          "achievements",
          "achievementsV2",
          "leaderboards",
          "leaderboardsV2",
          "versions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "achievements",
          "achievementsV2",
          "leaderboards",
          "leaderboardsV2",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_challenges.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterChallenges",
    "description": "List the Game Center challenges belonging to a Game Center group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[archived]",
        "type": "array",
        "description": "filter by attribute 'archived'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "fields[gameCenterChallenges]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterChallenges Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "vendorIdentifier",
          "archived",
          "challengeType",
          "repeatable",
          "gameCenterDetail",
          "gameCenterGroup",
          "versions",
          "leaderboard",
          "leaderboardV2"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "versions",
          "leaderboard",
          "leaderboardV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_details.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterDetails",
    "description": "List the Game Center details belonging to a Game Center group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[gameCenterAppVersions.enabled]",
        "type": "array",
        "description": "filter by attribute 'gameCenterAppVersions.enabled'"
      },
      {
        "name": "fields[gameCenterDetails]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterDetails Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "arcadeEnabled",
          "challengeEnabled",
          "app",
          "gameCenterAppVersions",
          "gameCenterGroup",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges",
          "defaultLeaderboard",
          "defaultLeaderboardV2",
          "defaultGroupLeaderboard",
          "defaultGroupLeaderboardV2",
          "achievementReleases",
          "activityReleases",
          "challengeReleases",
          "leaderboardReleases",
          "leaderboardSetReleases",
          "blockedPlayers",
          "challengesMinimumPlatformVersions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "gameCenterAppVersions",
          "gameCenterGroup",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges",
          "defaultLeaderboard",
          "defaultLeaderboardV2",
          "defaultGroupLeaderboard",
          "defaultGroupLeaderboardV2",
          "achievementReleases",
          "activityReleases",
          "challengeReleases",
          "leaderboardReleases",
          "leaderboardSetReleases",
          "challengesMinimumPlatformVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_leaderboard_sets_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterLeaderboardSetsV2",
    "description": "List the Game Center leaderboard sets (v2) belonging to a Game Center group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboards",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_leaderboard_sets_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboardSetsV2",
    "description": "Replace the full set of Game Center leaderboard sets (v2) linked to a Game Center group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupGameCenterLeaderboardSetsV2LinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_groups.game_center_leaderboards_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterLeaderboardsV2",
    "description": "List the Game Center leaderboards (v2) belonging to a Game Center group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[archived]",
        "type": "array",
        "description": "filter by attribute 'archived'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboardSets",
          "activity",
          "challenge",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_leaderboards_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboardsV2",
    "description": "Replace the full set of Game Center leaderboards (v2) linked to a Game Center group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupGameCenterLeaderboardsV2LinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_groups.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}",
    "description": "Read one Game Center group by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterGroups]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterGroups Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "gameCenterDetails",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetails",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups",
    "description": "List Game Center groups.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[gameCenterDetails]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterDetails' Takes a 'gameCenterDetails' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "fields[gameCenterGroups]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterGroups Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "gameCenterDetails",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetails",
          "gameCenterLeaderboards",
          "gameCenterLeaderboardsV2",
          "gameCenterLeaderboardSets",
          "gameCenterLeaderboardSetsV2",
          "gameCenterAchievements",
          "gameCenterAchievementsV2",
          "gameCenterActivities",
          "gameCenterChallenges"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}",
    "description": "Update a Game Center group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_entry_submissions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardEntrySubmissions",
    "description": "Post a player’s score to a Game Center leaderboard. This is the write that submits a result; the leaderboard itself is created separately.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardEntrySubmissionCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_images_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardImages",
    "description": "Create a Game Center leaderboard images (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardImageV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_images_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardImages/{id}",
    "description": "Delete a Game Center leaderboard images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_leaderboard_images_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardImages/{id}",
    "description": "Read one Game Center leaderboard images (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterLeaderboardImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboardImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "imageAsset",
          "uploadOperations",
          "assetDeliveryState",
          "localization"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "localization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_images_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboardImages/{id}",
    "description": "Update a Game Center leaderboard images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardImageV2UpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_localizations_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardLocalizations",
    "description": "Create a Game Center leaderboard localizations (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardLocalizationV2CreateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_leaderboard_localizations_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardLocalizations/{id}",
    "description": "Delete a Game Center leaderboard localizations (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_leaderboard_localizations_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardLocalizations/{id}",
    "description": "Read one Game Center leaderboard localizations (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterLeaderboardLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboardLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "name",
          "formatterOverride",
          "formatterSuffix",
          "formatterSuffixSingular",
          "description",
          "version",
          "image"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_localizations_v2.image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardLocalizations/{id}/image",
    "description": "Read the image for a Game Center leaderboard localizations (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "localization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_localizations_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboardLocalizations/{id}",
    "description": "Update a Game Center leaderboard localizations (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardLocalizationV2UpdateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_leaderboard_set_images_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSetImages",
    "description": "Create a Game Center leaderboard set images (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetImageV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_set_images_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardSetImages/{id}",
    "description": "Delete a Game Center leaderboard set images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_leaderboard_set_images_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetImages/{id}",
    "description": "Read one Game Center leaderboard set images (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterLeaderboardSetImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboardSetImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "imageAsset",
          "uploadOperations",
          "assetDeliveryState",
          "localization"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "localization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_images_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboardSetImages/{id}",
    "description": "Update a Game Center leaderboard set images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetImageV2UpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSetLocalizations",
    "description": "Create a Game Center leaderboard set localizations (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetLocalizationV2CreateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardSetLocalizations/{id}",
    "description": "Delete a Game Center leaderboard set localizations (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetLocalizations/{id}",
    "description": "Read one Game Center leaderboard set localizations (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterLeaderboardSetLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboardSetLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "locale",
          "name",
          "version",
          "image"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetLocalizations/{id}/image",
    "description": "Read the image for a Game Center leaderboard set localizations (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "localization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboardSetLocalizations/{id}",
    "description": "Update a Game Center leaderboard set localizations (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetLocalizationV2UpdateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations",
    "description": "Create a Game Center leaderboard set member localization.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetMemberLocalizationCreateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations/{id}",
    "description": "Delete a Game Center leaderboard set member localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations",
    "description": "List Game Center leaderboard set member localizations.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[gameCenterLeaderboardSet]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterLeaderboardSet' Takes a 'gameCenterLeaderboardSet' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error.",
        "required": true
      },
      {
        "name": "filter[gameCenterLeaderboard]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterLeaderboard' Takes a 'gameCenterLeaderboard' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error.",
        "required": true
      },
      {
        "name": "fields[gameCenterLeaderboardSetMemberLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboardSetMemberLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "locale",
          "gameCenterLeaderboardSet",
          "gameCenterLeaderboard"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterLeaderboardSet",
          "gameCenterLeaderboard"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations/{id}",
    "description": "Update a Game Center leaderboard set member localization.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetMemberLocalizationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "game_center_leaderboard_set_versions_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSetVersions",
    "description": "Create a Game Center leaderboard set versions (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetVersionV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_set_versions_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetVersions/{id}",
    "description": "Read one Game Center leaderboard set versions (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterLeaderboardSetVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboardSetVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "leaderboardSet",
          "localizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "leaderboardSet",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_versions_v2.localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetVersions/{id}/localizations",
    "description": "List the localizations belonging to a Game Center leaderboard set versions (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSets",
    "description": "Create a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_sets_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardSets/{id}",
    "description": "Delete a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_leaderboard_sets_v2.game_center_leaderboards.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "Link Game Center leaderboards to a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2GameCenterLeaderboardsLinkagesRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_sets_v2.game_center_leaderboards.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSets/{id}/gameCenterLeaderboards",
    "description": "List the Game Center leaderboards belonging to a Game Center leaderboard sets (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[referenceName]",
        "type": "array",
        "description": "filter by attribute 'referenceName'"
      },
      {
        "name": "filter[archived]",
        "type": "array",
        "description": "filter by attribute 'archived'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "fields[gameCenterLeaderboards]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboards Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "defaultFormatter",
          "referenceName",
          "vendorIdentifier",
          "submissionType",
          "scoreSortType",
          "scoreRangeStart",
          "scoreRangeEnd",
          "recurrenceStartDate",
          "recurrenceDuration",
          "recurrenceRule",
          "archived",
          "activityProperties",
          "visibility",
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboardSets",
          "gameCenterScoreModerations",
          "activity",
          "challenge",
          "versions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboardSets",
          "activity",
          "challenge",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets_v2.game_center_leaderboards.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "Unlink Game Center leaderboards from a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2GameCenterLeaderboardsLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_leaderboard_sets_v2.game_center_leaderboards.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "Replace the full set of Game Center leaderboards linked to a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2GameCenterLeaderboardsLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "game_center_leaderboard_sets_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSets/{id}",
    "description": "Read one Game Center leaderboard sets (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterLeaderboardSets]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboardSets Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "vendorIdentifier",
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboards",
          "versions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboards",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboardSets/{id}",
    "description": "Update a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2UpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_sets_v2.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSets/{id}/versions",
    "description": "List the versions belonging to a Game Center leaderboard sets (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "leaderboardSet",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_versions_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardVersions",
    "description": "Create a Game Center leaderboard versions (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardVersionV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboard_versions_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardVersions/{id}",
    "description": "Read one Game Center leaderboard versions (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterLeaderboardVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboardVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "leaderboard",
          "localizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "leaderboard",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_versions_v2.localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardVersions/{id}/localizations",
    "description": "List the localizations belonging to a Game Center leaderboard versions (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboards",
    "description": "Create a Game Center leaderboard — a ranked score board players compete on, either classic (all-time) or recurring.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardV2CreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboards_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboards/{id}",
    "description": "Delete a Game Center leaderboards (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_leaderboards_v2.game_center_score_moderations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboards/{id}/gameCenterScoreModerations",
    "description": "List the Game Center score moderations belonging to a Game Center leaderboards (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "exists[blocked]",
        "type": "boolean",
        "description": "filter by attribute 'blocked'"
      },
      {
        "name": "fields[gameCenterScoreModerations]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterScoreModerations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "rank",
          "score",
          "submittedDate",
          "blocked",
          "preReleased",
          "context",
          "challengeIds",
          "player"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "player"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboards/{id}",
    "description": "Read one Game Center leaderboards (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterLeaderboards]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterLeaderboards Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "defaultFormatter",
          "referenceName",
          "vendorIdentifier",
          "submissionType",
          "scoreSortType",
          "scoreRangeStart",
          "scoreRangeEnd",
          "recurrenceStartDate",
          "recurrenceDuration",
          "recurrenceRule",
          "archived",
          "activityProperties",
          "visibility",
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboardSets",
          "gameCenterScoreModerations",
          "activity",
          "challenge",
          "versions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "gameCenterLeaderboardSets",
          "activity",
          "challenge",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboards/{id}",
    "description": "Update a Game Center leaderboards (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardV2UpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_leaderboards_v2.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboards/{id}/versions",
    "description": "List the versions belonging to a Game Center leaderboards (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "leaderboard",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_queues.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingQueues",
    "description": "Create a Game Center matchmaking queue.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingQueueCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_matchmaking_queues.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterMatchmakingQueues/{id}",
    "description": "Delete a Game Center matchmaking queue.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_matchmaking_queues.experiment_matchmaking_queue_sizes.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingQueues/{id}/metrics/experimentMatchmakingQueueSizes",
    "description": "Read experiment matchmaking queue sizes metrics for a Game Center matchmaking queue. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count",
          "averageNumberOfRequests",
          "-averageNumberOfRequests",
          "p50NumberOfRequests",
          "-p50NumberOfRequests",
          "p95NumberOfRequests",
          "-p95NumberOfRequests"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_queues.experiment_matchmaking_requests.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingQueues/{id}/metrics/experimentMatchmakingRequests",
    "description": "Read experiment matchmaking requests metrics for a Game Center matchmaking queue. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "groupBy",
        "type": "array",
        "description": "the dimension by which to group the results",
        "enum": [
          "result",
          "gameCenterDetail"
        ]
      },
      {
        "name": "filter[result]",
        "type": "string",
        "description": "filter by 'result' attribute dimension",
        "enum": [
          "MATCHED",
          "CANCELED",
          "EXPIRED"
        ]
      },
      {
        "name": "filter[gameCenterDetail]",
        "type": "string",
        "description": "filter by 'gameCenterDetail' relationship dimension"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count",
          "averageSecondsInQueue",
          "-averageSecondsInQueue",
          "p50SecondsInQueue",
          "-p50SecondsInQueue",
          "p95SecondsInQueue",
          "-p95SecondsInQueue"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_queues.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingQueues/{id}",
    "description": "Read one Game Center matchmaking queue by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterMatchmakingQueues]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterMatchmakingQueues Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "classicMatchmakingBundleIds",
          "ruleSet",
          "experimentRuleSet"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "ruleSet",
          "experimentRuleSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_queues.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingQueues",
    "description": "List Game Center matchmaking queues.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "fields[gameCenterMatchmakingQueues]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterMatchmakingQueues Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "classicMatchmakingBundleIds",
          "ruleSet",
          "experimentRuleSet"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "ruleSet",
          "experimentRuleSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_queues.matchmaking_queue_sizes.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingQueues/{id}/metrics/matchmakingQueueSizes",
    "description": "Read matchmaking queue sizes metrics for a Game Center matchmaking queue. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count",
          "averageNumberOfRequests",
          "-averageNumberOfRequests",
          "p50NumberOfRequests",
          "-p50NumberOfRequests",
          "p95NumberOfRequests",
          "-p95NumberOfRequests"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_queues.matchmaking_requests.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingQueues/{id}/metrics/matchmakingRequests",
    "description": "Read matchmaking requests metrics for a Game Center matchmaking queue. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "groupBy",
        "type": "array",
        "description": "the dimension by which to group the results",
        "enum": [
          "result",
          "gameCenterDetail"
        ]
      },
      {
        "name": "filter[result]",
        "type": "string",
        "description": "filter by 'result' attribute dimension",
        "enum": [
          "MATCHED",
          "CANCELED",
          "EXPIRED"
        ]
      },
      {
        "name": "filter[gameCenterDetail]",
        "type": "string",
        "description": "filter by 'gameCenterDetail' relationship dimension"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count",
          "averageSecondsInQueue",
          "-averageSecondsInQueue",
          "p50SecondsInQueue",
          "-p50SecondsInQueue",
          "p95SecondsInQueue",
          "-p95SecondsInQueue"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_queues.matchmaking_sessions.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingQueues/{id}/metrics/matchmakingSessions",
    "description": "Read matchmaking sessions metrics for a Game Center matchmaking queue. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count",
          "averagePlayerCount",
          "-averagePlayerCount",
          "p50PlayerCount",
          "-p50PlayerCount",
          "p95PlayerCount",
          "-p95PlayerCount"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_queues.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterMatchmakingQueues/{id}",
    "description": "Update a Game Center matchmaking queue.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingQueueUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_matchmaking_rule_set_tests.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingRuleSetTests",
    "description": "Create a Game Center matchmaking rule set test.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleSetTestCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_matchmaking_rule_sets.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingRuleSets",
    "description": "Create a Game Center matchmaking rule set.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleSetCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_matchmaking_rule_sets.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}",
    "description": "Delete a Game Center matchmaking rule set.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_matchmaking_rule_sets.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}",
    "description": "Read one Game Center matchmaking rule set by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[gameCenterMatchmakingRuleSets]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterMatchmakingRuleSets Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "ruleLanguageVersion",
          "minPlayers",
          "maxPlayers",
          "teams",
          "rules",
          "matchmakingQueues"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "teams",
          "rules",
          "matchmakingQueues"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rule_sets.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets",
    "description": "List Game Center matchmaking rule sets.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "fields[gameCenterMatchmakingRuleSets]",
        "type": "array",
        "description": "the fields to include for returned resources of type gameCenterMatchmakingRuleSets Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "ruleLanguageVersion",
          "minPlayers",
          "maxPlayers",
          "teams",
          "rules",
          "matchmakingQueues"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "teams",
          "rules",
          "matchmakingQueues"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rule_sets.matchmaking_queues.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}/matchmakingQueues",
    "description": "List the matchmaking queues belonging to a Game Center matchmaking rule set.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "ruleSet",
          "experimentRuleSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rule_sets.rules.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}/rules",
    "description": "List the rules belonging to a Game Center matchmaking rule set.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rule_sets.teams.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}/teams",
    "description": "List the teams belonging to a Game Center matchmaking rule set.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rule_sets.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}",
    "description": "Update a Game Center matchmaking rule set.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleSetUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_matchmaking_rules.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingRules",
    "description": "Create a Game Center matchmaking rule.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_matchmaking_rules.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterMatchmakingRules/{id}",
    "description": "Delete a Game Center matchmaking rule.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_matchmaking_rules.matchmaking_boolean_rule_results.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRules/{id}/metrics/matchmakingBooleanRuleResults",
    "description": "Read matchmaking boolean rule results metrics for a Game Center matchmaking rule. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "groupBy",
        "type": "array",
        "description": "the dimension by which to group the results",
        "enum": [
          "result",
          "gameCenterMatchmakingQueue"
        ]
      },
      {
        "name": "filter[result]",
        "type": "string",
        "description": "filter by 'result' attribute dimension"
      },
      {
        "name": "filter[gameCenterMatchmakingQueue]",
        "type": "string",
        "description": "filter by 'gameCenterMatchmakingQueue' relationship dimension"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rules.matchmaking_number_rule_results.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRules/{id}/metrics/matchmakingNumberRuleResults",
    "description": "Read matchmaking number rule results metrics for a Game Center matchmaking rule. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "groupBy",
        "type": "array",
        "description": "the dimension by which to group the results",
        "enum": [
          "gameCenterMatchmakingQueue"
        ]
      },
      {
        "name": "filter[gameCenterMatchmakingQueue]",
        "type": "string",
        "description": "filter by 'gameCenterMatchmakingQueue' relationship dimension"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count",
          "averageResult",
          "-averageResult",
          "p50Result",
          "-p50Result",
          "p95Result",
          "-p95Result"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rules.matchmaking_rule_errors.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRules/{id}/metrics/matchmakingRuleErrors",
    "description": "Read matchmaking rule errors metrics for a Game Center matchmaking rule. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "granularity",
        "type": "string",
        "description": "the granularity of the per-group dataset",
        "enum": [
          "P1D",
          "PT1H",
          "PT15M"
        ],
        "required": true
      },
      {
        "name": "groupBy",
        "type": "array",
        "description": "the dimension by which to group the results",
        "enum": [
          "gameCenterMatchmakingQueue"
        ]
      },
      {
        "name": "filter[gameCenterMatchmakingQueue]",
        "type": "string",
        "description": "filter by 'gameCenterMatchmakingQueue' relationship dimension"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; metrics will be sorted as specified",
        "enum": [
          "count",
          "-count"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum number of groups to return per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rules.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterMatchmakingRules/{id}",
    "description": "Update a Game Center matchmaking rule.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_matchmaking_teams.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingTeams",
    "description": "Create a Game Center matchmaking team.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingTeamCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_matchmaking_teams.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterMatchmakingTeams/{id}",
    "description": "Delete a Game Center matchmaking team.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "game_center_matchmaking_teams.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterMatchmakingTeams/{id}",
    "description": "Update a Game Center matchmaking team.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingTeamUpdateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_player_achievement_submissions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterPlayerAchievementSubmissions",
    "description": "Create a Game Center player achievement submission.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterPlayerAchievementSubmissionCreateRequest",
    "risk": "low"
  },
  {
    "name": "game_center_score_moderations.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterScoreModerations/{id}",
    "description": "Update a Game Center score moderation.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterScoreModerationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "in_app_purchase_app_store_review_screenshots.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseAppStoreReviewScreenshots",
    "description": "Upload the reviewer screenshot for an in-app purchase — the image App Review checks. Not related to store listing screenshots or pricing.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseAppStoreReviewScreenshotCreateRequest",
    "risk": "low"
  },
  {
    "name": "in_app_purchase_app_store_review_screenshots.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v1/inAppPurchaseAppStoreReviewScreenshots/{id}",
    "description": "Delete the reviewer screenshot attached to an in-app purchase.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "in_app_purchase_app_store_review_screenshots.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseAppStoreReviewScreenshots/{id}",
    "description": "Read the reviewer screenshot attached to an in-app purchase.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchaseAppStoreReviewScreenshots]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchaseAppStoreReviewScreenshots Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "sourceFileChecksum",
          "imageAsset",
          "assetToken",
          "assetType",
          "uploadOperations",
          "assetDeliveryState",
          "inAppPurchaseV2"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchaseV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_app_store_review_screenshots.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v1/inAppPurchaseAppStoreReviewScreenshots/{id}",
    "description": "Commit the uploaded reviewer screenshot for an in-app purchase after the file transfer.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseAppStoreReviewScreenshotUpdateRequest",
    "risk": "low"
  },
  {
    "name": "in_app_purchase_availabilities.available_territories.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseAvailabilities/{id}/availableTerritories",
    "description": "List the available territories belonging to an in-app purchase availability.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_availabilities.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseAvailabilities",
    "description": "Create an in-app purchase availability.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseAvailabilityCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchase_availabilities.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseAvailabilities/{id}",
    "description": "Read one in-app purchase availability by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchaseAvailabilities]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchaseAvailabilities Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "availableInNewTerritories",
          "availableTerritories"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "availableTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_images_v2.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v2/inAppPurchaseImages",
    "description": "Create an in-app purchase images (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseImageV2CreateRequest",
    "risk": "public"
  },
  {
    "name": "in_app_purchase_images_v2.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v2/inAppPurchaseImages/{id}",
    "description": "Delete an in-app purchase images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "in_app_purchase_images_v2.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchaseImages/{id}",
    "description": "Read one in-app purchase images (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchaseImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchaseImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "assetToken",
          "imageAsset",
          "uploadOperations",
          "assetDeliveryState"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_images_v2.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v2/inAppPurchaseImages/{id}",
    "description": "Update an in-app purchase images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseImageV2UpdateRequest",
    "risk": "public"
  },
  {
    "name": "in_app_purchase_localizations_v2.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v2/inAppPurchaseLocalizations",
    "description": "Create a in-app purchase localization on an existing editable version ID. List versions and reuse the open draft; after 409 ALREADY_EXISTS, list again to find its ID.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseLocalizationV2CreateRequest",
    "risk": "public"
  },
  {
    "name": "in_app_purchase_localizations_v2.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v2/inAppPurchaseLocalizations/{id}",
    "description": "Delete an in-app purchase localizations (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "in_app_purchase_localizations_v2.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchaseLocalizations/{id}",
    "description": "Read a in-app purchase localization by ID and see its version relationship.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchaseLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchaseLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "locale",
          "description",
          "version"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_localizations_v2.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v2/inAppPurchaseLocalizations/{id}",
    "description": "Update a in-app purchase localization by ID on its editable version draft.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseLocalizationV2UpdateRequest",
    "risk": "public"
  },
  {
    "name": "in_app_purchase_offer_code_custom_codes.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseOfferCodeCustomCodes",
    "description": "Create an in-app purchase offer code custom code.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeCustomCodeCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchase_offer_code_custom_codes.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodeCustomCodes/{id}",
    "description": "Read one in-app purchase offer code custom code by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchaseOfferCodeCustomCodes]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchaseOfferCodeCustomCodes Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "customCode",
          "numberOfCodes",
          "createdDate",
          "expirationDate",
          "active",
          "createdByActor",
          "deactivatedByActor"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "createdByActor",
          "deactivatedByActor"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_offer_code_custom_codes.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v1/inAppPurchaseOfferCodeCustomCodes/{id}",
    "description": "Update an in-app purchase offer code custom code.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeCustomCodeUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchase_offer_code_one_time_use_codes.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseOfferCodeOneTimeUseCodes",
    "description": "Create an in-app purchase offer code one time use code.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeOneTimeUseCodeCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchase_offer_code_one_time_use_codes.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodeOneTimeUseCodes/{id}",
    "description": "Read one in-app purchase offer code one time use code by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchaseOfferCodeOneTimeUseCodes]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchaseOfferCodeOneTimeUseCodes Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "numberOfCodes",
          "createdDate",
          "expirationDate",
          "active",
          "environment",
          "values",
          "createdByActor",
          "deactivatedByActor"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "createdByActor",
          "deactivatedByActor"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_offer_code_one_time_use_codes.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v1/inAppPurchaseOfferCodeOneTimeUseCodes/{id}",
    "description": "Update an in-app purchase offer code one time use code.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeOneTimeUseCodeUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchase_offer_code_one_time_use_codes.values.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodeOneTimeUseCodes/{id}/values",
    "description": "Read the value for an in-app purchase offer code one time use code.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "accept": "text/csv"
  },
  {
    "name": "in_app_purchase_offer_codes.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseOfferCodes",
    "description": "Create an in-app purchase offer code.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchase_offer_codes.custom_codes.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}/customCodes",
    "description": "List the custom codes belonging to an in-app purchase offer code.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "createdByActor",
          "deactivatedByActor"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_offer_codes.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}",
    "description": "Read one in-app purchase offer code by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchaseOfferCodes]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchaseOfferCodes Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "customerEligibilities",
          "productionCodeCount",
          "sandboxCodeCount",
          "active",
          "oneTimeUseCodes",
          "customCodes",
          "prices"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "oneTimeUseCodes",
          "customCodes",
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_offer_codes.one_time_use_codes.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}/oneTimeUseCodes",
    "description": "List the one time use codes belonging to an in-app purchase offer code.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "createdByActor",
          "deactivatedByActor"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_offer_codes.prices.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}/prices",
    "description": "List the prices belonging to an in-app purchase offer code.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory",
          "pricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_offer_codes.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v1/inAppPurchaseOfferCodes/{id}",
    "description": "Update an in-app purchase offer code.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchase_price_points.equalizations.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePricePoints/{id}/equalizations",
    "description": "List the equalizations belonging to an in-app purchase price point.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "filter[inAppPurchaseV2]",
        "type": "array",
        "description": "filter by id(s) of related 'inAppPurchaseV2' Takes a 'inAppPurchaseV2' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_price_schedules.automatic_prices.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}/automaticPrices",
    "description": "List the automatic prices belonging to an in-app purchase price schedule.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned. ALWAYS pass include=inAppPurchasePricePoint,territory — without it every row is an opaque id with no price and no currency, which reads as \"there is no price here\".",
        "enum": [
          "inAppPurchasePricePoint",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_price_schedules.base_territory.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}/baseTerritory",
    "description": "Read the base territory for an in-app purchase price schedule.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_price_schedules.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchasePriceSchedules",
    "description": "Change or set an in-app purchase (IAP) price: create a price schedule from price point IDs. Find them with in_app_purchases_v2__price_points__list, filtered by territory.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchasePriceScheduleCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchase_price_schedules.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}",
    "description": "Read one in-app purchase price schedule by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchasePriceSchedules]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchasePriceSchedules Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "baseTerritory",
          "manualPrices",
          "automaticPrices"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "baseTerritory",
          "manualPrices",
          "automaticPrices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_price_schedules.manual_prices.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}/manualPrices",
    "description": "List the manual prices belonging to an in-app purchase price schedule.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned. ALWAYS pass include=inAppPurchasePricePoint,territory — without it every row is an opaque id with no price and no currency, which reads as \"there is no price here\".",
        "enum": [
          "inAppPurchasePricePoint",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_versions.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseVersions",
    "description": "Create one editable in-app purchase review version. List versions first and reuse an existing PREPARE_FOR_SUBMISSION or DEVELOPER_REJECTED draft. Apple permits one open draft per product; if create returns 409 ALREADY_EXISTS, list again and use the draft ID in the error detail. Draft versions cannot be deleted.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseVersionCreateRequest",
    "risk": "release"
  },
  {
    "name": "in_app_purchase_versions.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseVersions/{id}",
    "description": "Read a in-app purchase review version by ID, including its version number and review state.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchaseVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchaseVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "inAppPurchase",
          "image",
          "images",
          "localizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchase",
          "image",
          "images",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_versions.image.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseVersions/{id}/image",
    "description": "Read the image for an in-app purchase version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_versions.images.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseVersions/{id}/images",
    "description": "List the images belonging to an in-app purchase version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_versions.localizations.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseVersions/{id}/localizations",
    "description": "List the localizations belonging to an in-app purchase version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.app_store_review_screenshot.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/appStoreReviewScreenshot",
    "description": "Read the reviewer screenshot attached to an in-app purchase.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchaseV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.content.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/content",
    "description": "Read the content for an in-app purchases (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchaseV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v2/inAppPurchases",
    "description": "Create an in-app purchase. Set the product ID, type (CONSUMABLE, NON_CONSUMABLE, NON_RENEWING_SUBSCRIPTION) and reference name.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseV2CreateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchases_v2.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v2/inAppPurchases/{id}",
    "description": "Delete an in-app purchases (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "revenue"
  },
  {
    "name": "in_app_purchases_v2.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}",
    "description": "Read one in-app purchases (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[inAppPurchases]",
        "type": "array",
        "description": "the fields to include for returned resources of type inAppPurchases Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "productId",
          "inAppPurchaseType",
          "state",
          "reviewNote",
          "familySharable",
          "contentHosting",
          "inAppPurchaseLocalizations",
          "pricePoints",
          "content",
          "appStoreReviewScreenshot",
          "promotedPurchase",
          "iapPriceSchedule",
          "inAppPurchaseAvailability",
          "images",
          "offerCodes",
          "versions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchaseLocalizations",
          "pricePoints",
          "content",
          "appStoreReviewScreenshot",
          "promotedPurchase",
          "iapPriceSchedule",
          "inAppPurchaseAvailability",
          "images",
          "offerCodes",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.iap_price_schedule.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/iapPriceSchedule",
    "description": "Read the IAP price schedule for an in-app purchases (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "baseTerritory",
          "manualPrices",
          "automaticPrices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.in_app_purchase_availability.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/inAppPurchaseAvailability",
    "description": "Read the in-app purchase availability for an in-app purchases (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "availableTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.offer_codes.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/offerCodes",
    "description": "List the offer codes belonging to an in-app purchases (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by territory Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "oneTimeUseCodes",
          "customCodes",
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.price_points.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/pricePoints",
    "description": "List the allowed price points for an in-app purchase. Filter by territory (country) to find the price point ID for a specific price before scheduling a price change.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.promoted_purchase.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/promotedPurchase",
    "description": "Read the promoted purchase for an in-app purchases (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchaseV2",
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v2/inAppPurchases/{id}",
    "description": "Update an in-app purchases (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseV2UpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "in_app_purchases_v2.versions.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/versions",
    "description": "List the versions belonging to an in-app purchases (v2).",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "PREPARE_FOR_SUBMISSION",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "ACCEPTED",
          "APPROVED",
          "REPLACED_WITH_NEW_VERSION",
          "REJECTED",
          "DEVELOPER_REJECTED"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchase",
          "image",
          "images",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "marketplace_search_details.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/marketplaceSearchDetails",
    "description": "Create a marketplace search detail.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MarketplaceSearchDetailCreateRequest",
    "risk": "low"
  },
  {
    "name": "marketplace_search_details.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/marketplaceSearchDetails/{id}",
    "description": "Delete a marketplace search detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "marketplace_search_details.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/marketplaceSearchDetails/{id}",
    "description": "Update a marketplace search detail.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MarketplaceSearchDetailUpdateRequest",
    "risk": "low"
  },
  {
    "name": "merchant_ids.certificates.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/merchantIds/{id}/certificates",
    "description": "List the certificates belonging to a merchant ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[displayName]",
        "type": "array",
        "description": "filter by attribute 'displayName'"
      },
      {
        "name": "filter[certificateType]",
        "type": "array",
        "description": "filter by attribute 'certificateType'",
        "enum": [
          "APPLE_PAY",
          "APPLE_PAY_MERCHANT_IDENTITY",
          "APPLE_PAY_PSP_IDENTITY",
          "APPLE_PAY_RSA",
          "DEVELOPER_ID_KEXT",
          "DEVELOPER_ID_KEXT_G2",
          "DEVELOPER_ID_APPLICATION",
          "DEVELOPER_ID_APPLICATION_G2",
          "DEVELOPMENT",
          "DISTRIBUTION",
          "IDENTITY_ACCESS",
          "IOS_DEVELOPMENT",
          "IOS_DISTRIBUTION",
          "MAC_APP_DISTRIBUTION",
          "MAC_INSTALLER_DISTRIBUTION",
          "MAC_APP_DEVELOPMENT",
          "PASS_TYPE_ID",
          "PASS_TYPE_ID_WITH_NFC"
        ]
      },
      {
        "name": "filter[serialNumber]",
        "type": "array",
        "description": "filter by attribute 'serialNumber'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "displayName",
          "-displayName",
          "certificateType",
          "-certificateType",
          "serialNumber",
          "-serialNumber",
          "id",
          "-id"
        ]
      },
      {
        "name": "fields[certificates]",
        "type": "array",
        "description": "the fields to include for returned resources of type certificates Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "certificateType",
          "displayName",
          "serialNumber",
          "platform",
          "expirationDate",
          "certificateContent",
          "activated",
          "passTypeId"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "passTypeId"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "merchant_ids.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/merchantIds",
    "description": "Create a merchant ID.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MerchantIdCreateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "merchant_ids.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/merchantIds/{id}",
    "description": "Delete a merchant ID.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "merchant_ids.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/merchantIds/{id}",
    "description": "Read one merchant ID by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[merchantIds]",
        "type": "array",
        "description": "the fields to include for returned resources of type merchantIds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "identifier",
          "certificates"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "certificates"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "merchant_ids.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/merchantIds",
    "description": "List merchant IDs.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[identifier]",
        "type": "array",
        "description": "filter by attribute 'identifier'"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name",
          "identifier",
          "-identifier"
        ]
      },
      {
        "name": "fields[merchantIds]",
        "type": "array",
        "description": "the fields to include for returned resources of type merchantIds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "identifier",
          "certificates"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "certificates"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "merchant_ids.update",
    "domain": "provisioning",
    "method": "PATCH",
    "path": "/v1/merchantIds/{id}",
    "description": "Update a merchant ID.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MerchantIdUpdateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "nominations.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/nominations",
    "description": "Create a nomination.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "NominationCreateRequest",
    "risk": "public"
  },
  {
    "name": "nominations.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/nominations/{id}",
    "description": "Delete a nomination.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "nominations.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/nominations/{id}",
    "description": "Read one nomination by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[nominations]",
        "type": "array",
        "description": "the fields to include for returned resources of type nominations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "type",
          "description",
          "createdDate",
          "lastModifiedDate",
          "submittedDate",
          "state",
          "publishStartDate",
          "publishEndDate",
          "deviceFamilies",
          "locales",
          "supplementalMaterialsUris",
          "hasInAppEvents",
          "launchInSelectMarketsFirst",
          "notes",
          "preOrderEnabled",
          "relatedApps",
          "createdByActor",
          "lastModifiedByActor",
          "submittedByActor",
          "inAppEvents",
          "supportedTerritories"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "relatedApps",
          "createdByActor",
          "lastModifiedByActor",
          "submittedByActor",
          "inAppEvents",
          "supportedTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "nominations.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/nominations",
    "description": "List nominations.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[type]",
        "type": "array",
        "description": "filter by attribute 'type'",
        "enum": [
          "APP_LAUNCH",
          "APP_ENHANCEMENTS",
          "NEW_CONTENT"
        ]
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "DRAFT",
          "SUBMITTED",
          "ARCHIVED"
        ],
        "required": true
      },
      {
        "name": "filter[hasInAppEvents]",
        "type": "array",
        "description": "filter by attribute 'hasInAppEvents'"
      },
      {
        "name": "filter[relatedApps]",
        "type": "array",
        "description": "filter by id(s) of related 'relatedApps' Takes a 'relatedApps' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "lastModifiedDate",
          "-lastModifiedDate",
          "publishStartDate",
          "-publishStartDate",
          "publishEndDate",
          "-publishEndDate",
          "name",
          "-name",
          "type",
          "-type"
        ]
      },
      {
        "name": "fields[nominations]",
        "type": "array",
        "description": "the fields to include for returned resources of type nominations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "type",
          "description",
          "createdDate",
          "lastModifiedDate",
          "submittedDate",
          "state",
          "publishStartDate",
          "publishEndDate",
          "deviceFamilies",
          "locales",
          "supplementalMaterialsUris",
          "hasInAppEvents",
          "launchInSelectMarketsFirst",
          "notes",
          "preOrderEnabled",
          "relatedApps",
          "createdByActor",
          "lastModifiedByActor",
          "submittedByActor",
          "inAppEvents",
          "supportedTerritories"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "relatedApps",
          "createdByActor",
          "lastModifiedByActor",
          "submittedByActor",
          "inAppEvents",
          "supportedTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "nominations.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/nominations/{id}",
    "description": "Update a nomination.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "NominationUpdateRequest",
    "risk": "public"
  },
  {
    "name": "pass_type_ids.certificates.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/passTypeIds/{id}/certificates",
    "description": "List the certificates belonging to a pass type ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[displayName]",
        "type": "array",
        "description": "filter by attribute 'displayName'"
      },
      {
        "name": "filter[certificateType]",
        "type": "array",
        "description": "filter by attribute 'certificateType'",
        "enum": [
          "APPLE_PAY",
          "APPLE_PAY_MERCHANT_IDENTITY",
          "APPLE_PAY_PSP_IDENTITY",
          "APPLE_PAY_RSA",
          "DEVELOPER_ID_KEXT",
          "DEVELOPER_ID_KEXT_G2",
          "DEVELOPER_ID_APPLICATION",
          "DEVELOPER_ID_APPLICATION_G2",
          "DEVELOPMENT",
          "DISTRIBUTION",
          "IDENTITY_ACCESS",
          "IOS_DEVELOPMENT",
          "IOS_DISTRIBUTION",
          "MAC_APP_DISTRIBUTION",
          "MAC_INSTALLER_DISTRIBUTION",
          "MAC_APP_DEVELOPMENT",
          "PASS_TYPE_ID",
          "PASS_TYPE_ID_WITH_NFC"
        ]
      },
      {
        "name": "filter[serialNumber]",
        "type": "array",
        "description": "filter by attribute 'serialNumber'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "displayName",
          "-displayName",
          "certificateType",
          "-certificateType",
          "serialNumber",
          "-serialNumber",
          "id",
          "-id"
        ]
      },
      {
        "name": "fields[certificates]",
        "type": "array",
        "description": "the fields to include for returned resources of type certificates Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "certificateType",
          "displayName",
          "serialNumber",
          "platform",
          "expirationDate",
          "certificateContent",
          "activated",
          "passTypeId"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "passTypeId"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "pass_type_ids.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/passTypeIds",
    "description": "Create a pass type ID.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "PassTypeIdCreateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "pass_type_ids.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/passTypeIds/{id}",
    "description": "Delete a pass type ID.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "pass_type_ids.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/passTypeIds/{id}",
    "description": "Read one pass type ID by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[passTypeIds]",
        "type": "array",
        "description": "the fields to include for returned resources of type passTypeIds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "identifier",
          "certificates"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "certificates"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "pass_type_ids.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/passTypeIds",
    "description": "List pass type IDs.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[identifier]",
        "type": "array",
        "description": "filter by attribute 'identifier'"
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name",
          "identifier",
          "-identifier",
          "id",
          "-id"
        ]
      },
      {
        "name": "fields[passTypeIds]",
        "type": "array",
        "description": "the fields to include for returned resources of type passTypeIds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "identifier",
          "certificates"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "certificates"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "pass_type_ids.update",
    "domain": "provisioning",
    "method": "PATCH",
    "path": "/v1/passTypeIds/{id}",
    "description": "Update a pass type ID.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "PassTypeIdUpdateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "pre_release_versions.builds.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/preReleaseVersions/{id}/builds",
    "description": "List the builds belonging to a pre release version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[builds]",
        "type": "array",
        "description": "the fields to include for returned resources of type builds Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "uploadedDate",
          "expirationDate",
          "expired",
          "minOsVersion",
          "lsMinimumSystemVersion",
          "computedMinMacOsVersion",
          "computedMinVisionOsVersion",
          "iconAssetToken",
          "processingState",
          "buildAudienceType",
          "usesNonExemptEncryption",
          "preReleaseVersion",
          "individualTesters",
          "betaGroups",
          "betaBuildLocalizations",
          "appEncryptionDeclaration",
          "betaAppReviewSubmission",
          "app",
          "buildBetaDetail",
          "appStoreVersion",
          "icons",
          "buildBundles",
          "buildUpload",
          "perfPowerMetrics",
          "diagnosticSignatures"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "pre_release_versions.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/preReleaseVersions/{id}",
    "description": "Read one pre release version by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[preReleaseVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type preReleaseVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "platform",
          "builds",
          "app"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "builds",
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "pre_release_versions.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/preReleaseVersions",
    "description": "List the version numbers builds were uploaded under (e.g. 2.4), across all apps. These are TestFlight train numbers, not App Store versions — for what customers see, use app_store_versions.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[builds.buildAudienceType]",
        "type": "array",
        "description": "filter by attribute 'builds.buildAudienceType'",
        "enum": [
          "INTERNAL_ONLY",
          "APP_STORE_ELIGIBLE"
        ]
      },
      {
        "name": "filter[builds.expired]",
        "type": "array",
        "description": "filter by attribute 'builds.expired'"
      },
      {
        "name": "filter[builds.processingState]",
        "type": "array",
        "description": "filter by attribute 'builds.processingState'",
        "enum": [
          "PROCESSING",
          "FAILED",
          "INVALID",
          "VALID"
        ]
      },
      {
        "name": "filter[builds.version]",
        "type": "array",
        "description": "filter by attribute 'builds.version'"
      },
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[version]",
        "type": "array",
        "description": "filter by attribute 'version'"
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list."
      },
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds' Takes a 'builds' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "version",
          "-version"
        ]
      },
      {
        "name": "fields[preReleaseVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type preReleaseVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "platform",
          "builds",
          "app"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "builds",
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "profiles.bundle_id.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles/{id}/bundleId",
    "description": "Read the bundle ID for a profile.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "profiles.certificates.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles/{id}/certificates",
    "description": "List the certificates belonging to a profile.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[certificates]",
        "type": "array",
        "description": "the fields to include for returned resources of type certificates Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "certificateType",
          "displayName",
          "serialNumber",
          "platform",
          "expirationDate",
          "certificateContent",
          "activated",
          "passTypeId"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "profiles.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/profiles",
    "description": "Prepare an app’s signing configuration: make a provisioning profile from a bundle ID, a certificate and (for development) a device list. This is the file Xcode signs a build with.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ProfileCreateRequest",
    "risk": "infrastructure"
  },
  {
    "name": "profiles.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/profiles/{id}",
    "description": "Delete a profile.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "profiles.devices.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles/{id}/devices",
    "description": "List the devices belonging to a profile.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[devices]",
        "type": "array",
        "description": "the fields to include for returned resources of type devices Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "platform",
          "udid",
          "deviceClass",
          "status",
          "model",
          "addedDate"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "profiles.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles/{id}",
    "description": "Read one profile by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[profiles]",
        "type": "array",
        "description": "the fields to include for returned resources of type profiles Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "platform",
          "profileType",
          "profileState",
          "profileContent",
          "uuid",
          "createdDate",
          "expirationDate",
          "bundleId",
          "devices",
          "certificates"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "bundleId",
          "devices",
          "certificates"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "profiles.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles",
    "description": "List profiles.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[profileType]",
        "type": "array",
        "description": "filter by attribute 'profileType'",
        "enum": [
          "IOS_APP_DEVELOPMENT",
          "IOS_APP_STORE",
          "IOS_APP_ADHOC",
          "IOS_APP_INHOUSE",
          "MAC_APP_DEVELOPMENT",
          "MAC_APP_STORE",
          "MAC_APP_DIRECT",
          "TVOS_APP_DEVELOPMENT",
          "TVOS_APP_STORE",
          "TVOS_APP_ADHOC",
          "TVOS_APP_INHOUSE",
          "MAC_CATALYST_APP_DEVELOPMENT",
          "MAC_CATALYST_APP_STORE",
          "MAC_CATALYST_APP_DIRECT"
        ]
      },
      {
        "name": "filter[profileState]",
        "type": "array",
        "description": "filter by attribute 'profileState'",
        "enum": [
          "ACTIVE",
          "INVALID"
        ]
      },
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name",
          "profileType",
          "-profileType",
          "profileState",
          "-profileState",
          "id",
          "-id"
        ]
      },
      {
        "name": "fields[profiles]",
        "type": "array",
        "description": "the fields to include for returned resources of type profiles Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "platform",
          "profileType",
          "profileState",
          "profileContent",
          "uuid",
          "createdDate",
          "expirationDate",
          "bundleId",
          "devices",
          "certificates"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "bundleId",
          "devices",
          "certificates"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "promoted_purchases.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/promotedPurchases",
    "description": "Create a promoted purchase.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "PromotedPurchaseCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "promoted_purchases.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v1/promotedPurchases/{id}",
    "description": "Delete a promoted purchase.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "revenue"
  },
  {
    "name": "promoted_purchases.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/promotedPurchases/{id}",
    "description": "Read one promoted purchase by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[promotedPurchases]",
        "type": "array",
        "description": "the fields to include for returned resources of type promotedPurchases Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "visibleForAllUsers",
          "enabled",
          "state",
          "inAppPurchaseV2",
          "subscription"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchaseV2",
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "promoted_purchases.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v1/promotedPurchases/{id}",
    "description": "Update a promoted purchase.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "PromotedPurchaseUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "review_submission_items.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/reviewSubmissionItems",
    "description": "Put one thing into an open review submission — a version, an event, or another releasable item. One per call, so repeat it for each thing Apple should look at.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ReviewSubmissionItemCreateRequest",
    "risk": "release"
  },
  {
    "name": "review_submission_items.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/reviewSubmissionItems/{id}",
    "description": "Take one item back out of a submission that has not been handed to Apple yet.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "review_submission_items.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/reviewSubmissionItems/{id}",
    "description": "Update a review submission item.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ReviewSubmissionItemUpdateRequest",
    "risk": "release"
  },
  {
    "name": "review_submissions.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/reviewSubmissions",
    "description": "Submit an App Store version for Apple review — step 1 of 3, and this call alone does not send anything. It opens an empty submission for an app; put the version in it with review_submission_items__create, then set submitted on it.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ReviewSubmissionCreateRequest",
    "risk": "release"
  },
  {
    "name": "review_submissions.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/reviewSubmissions/{id}",
    "description": "Read one review submission by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[reviewSubmissions]",
        "type": "array",
        "description": "the fields to include for returned resources of type reviewSubmissions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "platform",
          "submittedDate",
          "state",
          "app",
          "items",
          "appStoreVersionForReview",
          "submittedByActor",
          "lastUpdatedByActor"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "items",
          "appStoreVersionForReview",
          "submittedByActor",
          "lastUpdatedByActor"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "review_submissions.items.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/reviewSubmissions/{id}/items",
    "description": "List what is inside a review submission and the state of each item, so you can check what Apple will actually look at before handing it over.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersion",
          "appCustomProductPageVersion",
          "appStoreVersionExperiment",
          "appStoreVersionExperimentV2",
          "appEvent",
          "appAssetLibraryImage",
          "appAssetLibraryVideo",
          "backgroundAssetVersion",
          "gameCenterAchievementVersion",
          "gameCenterActivityVersion",
          "gameCenterChallengeVersion",
          "gameCenterLeaderboardSetVersion",
          "gameCenterLeaderboardVersion",
          "inAppPurchaseVersion",
          "subscriptionVersion",
          "subscriptionGroupVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "review_submissions.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/reviewSubmissions",
    "description": "List App Store review submissions and their state, so you can tell whether something is waiting on Apple or on you. Filter by app or state; the items inside a submission come from review_submissions__items__list.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[platform]",
        "type": "array",
        "description": "filter by attribute 'platform'",
        "enum": [
          "IOS",
          "MAC_OS",
          "TV_OS",
          "VISION_OS"
        ]
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "UNRESOLVED_ISSUES",
          "CANCELING",
          "COMPLETING",
          "COMPLETE"
        ]
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app' The numeric Apple ID from apps__list (ASC-Core), not the bundle ID. A bundle ID matches nothing and comes back as 200 with an empty list.",
        "required": true
      },
      {
        "name": "fields[reviewSubmissions]",
        "type": "array",
        "description": "the fields to include for returned resources of type reviewSubmissions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "platform",
          "submittedDate",
          "state",
          "app",
          "items",
          "appStoreVersionForReview",
          "submittedByActor",
          "lastUpdatedByActor"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app",
          "items",
          "appStoreVersionForReview",
          "submittedByActor",
          "lastUpdatedByActor"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "review_submissions.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/reviewSubmissions/{id}",
    "description": "Hand an open submission to Apple by setting submitted to true, or take it back with canceled. This is the step that starts the queue; opening the submission and filling it does not.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ReviewSubmissionUpdateRequest",
    "risk": "release"
  },
  {
    "name": "routing_app_coverages.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/routingAppCoverages",
    "description": "Create a routing app coverage.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "RoutingAppCoverageCreateRequest",
    "risk": "low"
  },
  {
    "name": "routing_app_coverages.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/routingAppCoverages/{id}",
    "description": "Delete a routing app coverage.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "routing_app_coverages.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/routingAppCoverages/{id}",
    "description": "Read one routing app coverage by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[routingAppCoverages]",
        "type": "array",
        "description": "the fields to include for returned resources of type routingAppCoverages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "sourceFileChecksum",
          "uploadOperations",
          "assetDeliveryState",
          "appStoreVersion"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "routing_app_coverages.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/routingAppCoverages/{id}",
    "description": "Update a routing app coverage.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "RoutingAppCoverageUpdateRequest",
    "risk": "low"
  },
  {
    "name": "sales_reports.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/salesReports",
    "description": "Download a sales or subscription report as gzipped TSV. Requires ASC_VENDOR_NUMBER and a Finance or Sales role on the API key.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[vendorNumber]",
        "type": "array",
        "description": "filter by attribute 'vendorNumber'",
        "required": true
      },
      {
        "name": "filter[reportType]",
        "type": "array",
        "description": "filter by attribute 'reportType'",
        "enum": [
          "SALES",
          "PRE_ORDER",
          "NEWSSTAND",
          "SUBSCRIPTION",
          "SUBSCRIPTION_EVENT",
          "SUBSCRIBER",
          "SUBSCRIPTION_OFFER_CODE_REDEMPTION",
          "INSTALLS",
          "FIRST_ANNUAL",
          "WIN_BACK_ELIGIBILITY"
        ],
        "required": true
      },
      {
        "name": "filter[reportSubType]",
        "type": "array",
        "description": "filter by attribute 'reportSubType'",
        "enum": [
          "SUMMARY",
          "DETAILED",
          "SUMMARY_INSTALL_TYPE",
          "SUMMARY_TERRITORY",
          "SUMMARY_CHANNEL"
        ],
        "required": true
      },
      {
        "name": "filter[frequency]",
        "type": "array",
        "description": "filter by attribute 'frequency'",
        "enum": [
          "DAILY",
          "WEEKLY",
          "MONTHLY",
          "YEARLY"
        ],
        "required": true
      },
      {
        "name": "filter[reportDate]",
        "type": "array",
        "description": "filter by attribute 'reportDate'"
      },
      {
        "name": "filter[version]",
        "type": "array",
        "description": "filter by attribute 'version'"
      }
    ],
    "hasBody": false,
    "accept": "application/a-gzip"
  },
  {
    "name": "sandbox_testers_clear_purchase_history_request_v2.create",
    "domain": "sandbox",
    "method": "POST",
    "path": "/v2/sandboxTestersClearPurchaseHistoryRequest",
    "description": "Create a sandbox testers clear purchase history request (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SandboxTestersClearPurchaseHistoryRequestV2CreateRequest",
    "risk": "access"
  },
  {
    "name": "sandbox_testers_v2.list",
    "domain": "sandbox",
    "method": "GET",
    "path": "/v2/sandboxTesters",
    "description": "List sandbox testers (v2).",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "fields[sandboxTesters]",
        "type": "array",
        "description": "the fields to include for returned resources of type sandboxTesters Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "firstName",
          "lastName",
          "acAccountName",
          "territory",
          "applePayCompatible",
          "interruptPurchases",
          "subscriptionRenewalRate"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "sandbox_testers_v2.update",
    "domain": "sandbox",
    "method": "PATCH",
    "path": "/v2/sandboxTesters/{id}",
    "description": "Update a sandbox testers (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SandboxTesterV2UpdateRequest",
    "risk": "access"
  },
  {
    "name": "scm_git_references.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmGitReferences/{id}",
    "description": "Read one SCM git reference by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[scmGitReferences]",
        "type": "array",
        "description": "the fields to include for returned resources of type scmGitReferences Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "canonicalName",
          "isDeleted",
          "kind",
          "repository"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "repository"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_providers.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmProviders/{id}",
    "description": "Read one SCM provider by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[scmProviders]",
        "type": "array",
        "description": "the fields to include for returned resources of type scmProviders Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "scmProviderType",
          "url",
          "repositories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_providers.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmProviders",
    "description": "List SCM providers.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "fields[scmProviders]",
        "type": "array",
        "description": "the fields to include for returned resources of type scmProviders Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "scmProviderType",
          "url",
          "repositories"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_providers.repositories.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmProviders/{id}/repositories",
    "description": "List the repositories belonging to an SCM provider.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_pull_requests.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmPullRequests/{id}",
    "description": "Read one SCM pull request by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[scmPullRequests]",
        "type": "array",
        "description": "the fields to include for returned resources of type scmPullRequests Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "title",
          "number",
          "webUrl",
          "sourceRepositoryOwner",
          "sourceRepositoryName",
          "sourceBranchName",
          "destinationRepositoryOwner",
          "destinationRepositoryName",
          "destinationBranchName",
          "isClosed",
          "isCrossRepository",
          "repository"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "repository"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_repositories.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmRepositories/{id}",
    "description": "Read one SCM repository by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[scmRepositories]",
        "type": "array",
        "description": "the fields to include for returned resources of type scmRepositories Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "lastAccessedDate",
          "httpCloneUrl",
          "sshCloneUrl",
          "ownerName",
          "repositoryName",
          "scmProvider",
          "defaultBranch",
          "gitReferences",
          "pullRequests"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_repositories.git_references.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmRepositories/{id}/gitReferences",
    "description": "List the git references belonging to an SCM repository.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "repository"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_repositories.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmRepositories",
    "description": "List SCM repositories.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "fields[scmRepositories]",
        "type": "array",
        "description": "the fields to include for returned resources of type scmRepositories Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "lastAccessedDate",
          "httpCloneUrl",
          "sshCloneUrl",
          "ownerName",
          "repositoryName",
          "scmProvider",
          "defaultBranch",
          "gitReferences",
          "pullRequests"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_repositories.pull_requests.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmRepositories/{id}/pullRequests",
    "description": "List the pull requests belonging to an SCM repository.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "repository"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_app_store_review_screenshots.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionAppStoreReviewScreenshots",
    "description": "Upload the reviewer screenshot for a subscription — the image App Review checks. Not related to store listing screenshots or pricing.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionAppStoreReviewScreenshotCreateRequest",
    "risk": "low"
  },
  {
    "name": "subscription_app_store_review_screenshots.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionAppStoreReviewScreenshots/{id}",
    "description": "Delete the reviewer screenshot attached to a subscription.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "subscription_app_store_review_screenshots.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionAppStoreReviewScreenshots/{id}",
    "description": "Read the reviewer screenshot attached to a subscription.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionAppStoreReviewScreenshots]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionAppStoreReviewScreenshots Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "sourceFileChecksum",
          "imageAsset",
          "assetToken",
          "assetType",
          "uploadOperations",
          "assetDeliveryState",
          "subscription"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_app_store_review_screenshots.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionAppStoreReviewScreenshots/{id}",
    "description": "Commit the uploaded reviewer screenshot for a subscription after the file transfer.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionAppStoreReviewScreenshotUpdateRequest",
    "risk": "low"
  },
  {
    "name": "subscription_grace_periods.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGracePeriods/{id}",
    "description": "Read one subscription grace period by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionGracePeriods]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionGracePeriods Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "optIn",
          "sandboxOptIn",
          "duration",
          "renewalType"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_grace_periods.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionGracePeriods/{id}",
    "description": "Update a subscription grace period.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGracePeriodUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_group_localizations_v2.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v2/subscriptionGroupLocalizations",
    "description": "Create a subscription group localization on an existing editable version ID. List versions and reuse the open draft; after 409 ALREADY_EXISTS, list again to find its ID.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupLocalizationV2CreateRequest",
    "risk": "public"
  },
  {
    "name": "subscription_group_localizations_v2.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v2/subscriptionGroupLocalizations/{id}",
    "description": "Delete a subscription group localizations (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "subscription_group_localizations_v2.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v2/subscriptionGroupLocalizations/{id}",
    "description": "Read a subscription group localization by ID and see its version relationship.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionGroupLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionGroupLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "customAppName",
          "locale",
          "version"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_group_localizations_v2.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v2/subscriptionGroupLocalizations/{id}",
    "description": "Update a subscription group localization by ID on its editable version draft.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupLocalizationV2UpdateRequest",
    "risk": "public"
  },
  {
    "name": "subscription_group_versions.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionGroupVersions",
    "description": "Create one editable subscription group review version. List versions first and reuse an existing PREPARE_FOR_SUBMISSION or DEVELOPER_REJECTED draft. Apple permits one open draft per product; if create returns 409 ALREADY_EXISTS, list again and use the draft ID in the error detail. Draft versions cannot be deleted.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupVersionCreateRequest",
    "risk": "release"
  },
  {
    "name": "subscription_group_versions.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroupVersions/{id}",
    "description": "Read a subscription group review version by ID, including its version number and review state.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionGroupVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionGroupVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "subscriptionGroup",
          "localizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscriptionGroup",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_group_versions.localizations.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroupVersions/{id}/localizations",
    "description": "List the localizations belonging to a subscription group version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_groups.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionGroups",
    "description": "Create a subscription group. Subscriptions in the same group are mutually exclusive upgrade/downgrade options.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_groups.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionGroups/{id}",
    "description": "Delete a subscription group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "revenue"
  },
  {
    "name": "subscription_groups.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}",
    "description": "Read one subscription group by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionGroups]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionGroups Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "subscriptions",
          "subscriptionGroupLocalizations",
          "versions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscriptions",
          "subscriptionGroupLocalizations",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_groups.subscriptions.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}/subscriptions",
    "description": "List the subscriptions belonging to a subscription group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[productId]",
        "type": "array",
        "description": "filter by attribute 'productId'"
      },
      {
        "name": "filter[name]",
        "type": "array",
        "description": "filter by attribute 'name'"
      },
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "MISSING_METADATA",
          "READY_TO_SUBMIT",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "DEVELOPER_ACTION_NEEDED",
          "PENDING_BINARY_APPROVAL",
          "APPROVED",
          "DEVELOPER_REMOVED_FROM_SALE",
          "REMOVED_FROM_SALE",
          "REJECTED"
        ]
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "name",
          "-name"
        ]
      },
      {
        "name": "fields[subscriptions]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "productId",
          "familySharable",
          "state",
          "subscriptionPeriod",
          "reviewNote",
          "groupLevel",
          "multiSeatStatus",
          "marketSettings",
          "subscriptionLocalizations",
          "appStoreReviewScreenshot",
          "group",
          "introductoryOffers",
          "promotionalOffers",
          "offerCodes",
          "prices",
          "pricePoints",
          "promotedPurchase",
          "subscriptionAvailability",
          "winBackOffers",
          "images",
          "planAvailabilities",
          "versions"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscriptionLocalizations",
          "appStoreReviewScreenshot",
          "group",
          "introductoryOffers",
          "promotionalOffers",
          "offerCodes",
          "prices",
          "promotedPurchase",
          "subscriptionAvailability",
          "winBackOffers",
          "images",
          "planAvailabilities",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_groups.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionGroups/{id}",
    "description": "Update a subscription group.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_groups.versions.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}/versions",
    "description": "List the versions belonging to a subscription group.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "PREPARE_FOR_SUBMISSION",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "ACCEPTED",
          "APPROVED",
          "REPLACED_WITH_NEW_VERSION",
          "REJECTED",
          "DEVELOPER_REJECTED"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscriptionGroup",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_images_v2.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v2/subscriptionImages",
    "description": "Create a subscription images (v2).",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionImageV2CreateRequest",
    "risk": "public"
  },
  {
    "name": "subscription_images_v2.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v2/subscriptionImages/{id}",
    "description": "Delete a subscription images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "subscription_images_v2.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v2/subscriptionImages/{id}",
    "description": "Read one subscription images (v2) by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionImages]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionImages Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "fileSize",
          "fileName",
          "assetToken",
          "imageAsset",
          "uploadOperations",
          "assetDeliveryState"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_images_v2.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v2/subscriptionImages/{id}",
    "description": "Update a subscription images (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionImageV2UpdateRequest",
    "risk": "public"
  },
  {
    "name": "subscription_introductory_offers.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionIntroductoryOffers",
    "description": "Create a subscription introductory offer.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionIntroductoryOfferCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_introductory_offers.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionIntroductoryOffers/{id}",
    "description": "Delete a subscription introductory offer.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "revenue"
  },
  {
    "name": "subscription_introductory_offers.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionIntroductoryOffers/{id}",
    "description": "Update a subscription introductory offer.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionIntroductoryOfferUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_localizations_v2.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v2/subscriptionLocalizations",
    "description": "Create a subscription localization on an existing editable version ID. List versions and reuse the open draft; after 409 ALREADY_EXISTS, list again to find its ID.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionLocalizationV2CreateRequest",
    "risk": "public"
  },
  {
    "name": "subscription_localizations_v2.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v2/subscriptionLocalizations/{id}",
    "description": "Delete a subscription localizations (v2).",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "subscription_localizations_v2.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v2/subscriptionLocalizations/{id}",
    "description": "Read a subscription localization by ID and see its version relationship.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionLocalizations]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionLocalizations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "locale",
          "description",
          "version"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_localizations_v2.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v2/subscriptionLocalizations/{id}",
    "description": "Update a subscription localization by ID on its editable version draft.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionLocalizationV2UpdateRequest",
    "risk": "public"
  },
  {
    "name": "subscription_offer_code_custom_codes.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionOfferCodeCustomCodes",
    "description": "Create a subscription offer code custom code.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeCustomCodeCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_offer_code_custom_codes.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodeCustomCodes/{id}",
    "description": "Read one subscription offer code custom code by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionOfferCodeCustomCodes]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionOfferCodeCustomCodes Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "customCode",
          "numberOfCodes",
          "createdDate",
          "expirationDate",
          "active",
          "offerCode"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "offerCode"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_offer_code_custom_codes.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionOfferCodeCustomCodes/{id}",
    "description": "Update a subscription offer code custom code.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeCustomCodeUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_offer_code_one_time_use_codes.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionOfferCodeOneTimeUseCodes",
    "description": "Create a subscription offer code one time use code.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeOneTimeUseCodeCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_offer_code_one_time_use_codes.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodeOneTimeUseCodes/{id}",
    "description": "Read one subscription offer code one time use code by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionOfferCodeOneTimeUseCodes]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionOfferCodeOneTimeUseCodes Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "numberOfCodes",
          "createdDate",
          "expirationDate",
          "active",
          "environment",
          "offerCode",
          "values"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "offerCode"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_offer_code_one_time_use_codes.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionOfferCodeOneTimeUseCodes/{id}",
    "description": "Update a subscription offer code one time use code.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeOneTimeUseCodeUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_offer_code_one_time_use_codes.values.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodeOneTimeUseCodes/{id}/values",
    "description": "Read the value for a subscription offer code one time use code.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "accept": "text/csv"
  },
  {
    "name": "subscription_offer_codes.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionOfferCodes",
    "description": "Create a redeemable offer code for a subscription — a code a customer types in to claim a free or discounted period, for a campaign or a support gesture.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_offer_codes.custom_codes.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}/customCodes",
    "description": "List the custom codes belonging to a subscription offer code.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "offerCode"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_offer_codes.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}",
    "description": "Read one subscription offer code by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionOfferCodes]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionOfferCodes Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "customerEligibilities",
          "offerEligibility",
          "duration",
          "offerMode",
          "numberOfPeriods",
          "totalNumberOfCodes",
          "productionCodeCount",
          "sandboxCodeCount",
          "active",
          "autoRenewEnabled",
          "targetSubscriptionPlanType",
          "subscription",
          "oneTimeUseCodes",
          "customCodes",
          "prices"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscription",
          "oneTimeUseCodes",
          "customCodes",
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_offer_codes.one_time_use_codes.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}/oneTimeUseCodes",
    "description": "List the one time use codes belonging to a subscription offer code.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "offerCode"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_offer_codes.prices.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}/prices",
    "description": "List the prices belonging to a subscription offer code.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned. ALWAYS pass include=subscriptionPricePoint,territory — without it every row is an opaque id with no price and no currency, which reads as \"there is no price here\".",
        "enum": [
          "territory",
          "subscriptionPricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_offer_codes.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionOfferCodes/{id}",
    "description": "Update a subscription offer code.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_plan_availabilities.available_territories.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPlanAvailabilities/{id}/availableTerritories",
    "description": "List the available territories belonging to a subscription plan availability.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_plan_availabilities.available_territories.replace",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionPlanAvailabilities/{id}/relationships/availableTerritories",
    "description": "Replace the full set of available territories linked to a subscription plan availability.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPlanAvailabilityAvailableTerritoriesLinkagesRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_plan_availabilities.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionPlanAvailabilities",
    "description": "Make a subscription available in a country, and set its territory availability overall — the list of countries it is sold in. Putting a country here is what puts the subscription on sale there; a price alone does not.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPlanAvailabilityCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_plan_availabilities.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPlanAvailabilities/{id}",
    "description": "Read one subscription plan availability by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionPlanAvailabilities]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionPlanAvailabilities Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "availableInNewTerritories",
          "planType",
          "availableTerritories"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "availableTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_plan_availabilities.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionPlanAvailabilities/{id}",
    "description": "Update a subscription plan availability.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPlanAvailabilityUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_price_points.adjusted_equalizations.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPricePoints/{id}/adjustedEqualizations",
    "description": "List the adjusted equalizations belonging to a subscription price point.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "filter[subscription]",
        "type": "array",
        "description": "filter by id(s) of related 'subscription' Takes a 'subscription' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[upfrontPricePointId]",
        "type": "array",
        "description": "filter by upfrontPricePointId"
      },
      {
        "name": "filter[planType]",
        "type": "array",
        "description": "filter by planType",
        "required": true
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_price_points.equalizations.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPricePoints/{id}/equalizations",
    "description": "Given one price point in a base country, list the equivalent (equalized) price points in every other territory — for per-country pricing aligned to one anchor price.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "filter[subscription]",
        "type": "array",
        "description": "filter by id(s) of related 'subscription' Takes a 'subscription' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[upfrontPricePointId]",
        "type": "array",
        "description": "filter by upfrontPricePointId"
      },
      {
        "name": "filter[planType]",
        "type": "array",
        "description": "filter by planType"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_price_points.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPricePoints/{id}",
    "description": "Read one subscription price point by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionPricePoints]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionPricePoints Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "customerPrice",
          "proceeds",
          "proceedsYear2",
          "territory",
          "equalizations",
          "adjustedEqualizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_prices.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionPrices",
    "description": "Change or set a subscription price in a specific territory (country). This is the write step for raising or lowering a subscription price: first find the price point ID with subscriptions__price_points__list (filtered by territory), then create the price with it. preserveCurrentPrice decides whether existing subscribers keep their old price or move to the new one.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPriceCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_prices.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionPrices/{id}",
    "description": "Cancel a scheduled subscription price change before it takes effect.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "revenue"
  },
  {
    "name": "subscription_promotional_offers.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionPromotionalOffers",
    "description": "Create a subscription promotional offer.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPromotionalOfferCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_promotional_offers.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionPromotionalOffers/{id}",
    "description": "Delete a subscription promotional offer.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "revenue"
  },
  {
    "name": "subscription_promotional_offers.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPromotionalOffers/{id}",
    "description": "Read one subscription promotional offer by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionPromotionalOffers]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionPromotionalOffers Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "duration",
          "name",
          "numberOfPeriods",
          "offerCode",
          "offerMode",
          "targetSubscriptionPlanType",
          "subscription",
          "prices"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscription",
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_promotional_offers.prices.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPromotionalOffers/{id}/prices",
    "description": "List the prices belonging to a subscription promotional offer.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned. ALWAYS pass include=subscriptionPricePoint,territory — without it every row is an opaque id with no price and no currency, which reads as \"there is no price here\".",
        "enum": [
          "territory",
          "subscriptionPricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_promotional_offers.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionPromotionalOffers/{id}",
    "description": "Update a subscription promotional offer.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPromotionalOfferUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscription_versions.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionVersions",
    "description": "Create one editable subscription review version. List versions first and reuse an existing PREPARE_FOR_SUBMISSION or DEVELOPER_REJECTED draft. Apple permits one open draft per product; if create returns 409 ALREADY_EXISTS, list again and use the draft ID in the error detail. Draft versions cannot be deleted.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionVersionCreateRequest",
    "risk": "release"
  },
  {
    "name": "subscription_versions.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionVersions/{id}",
    "description": "Read a subscription review version by ID, including its version number and review state.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptionVersions]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptionVersions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "version",
          "state",
          "subscription",
          "image",
          "images",
          "localizations"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscription",
          "image",
          "images",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_versions.image.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionVersions/{id}/image",
    "description": "Read the image for a subscription version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_versions.images.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionVersions/{id}/images",
    "description": "List the images belonging to a subscription version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_versions.localizations.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionVersions/{id}/localizations",
    "description": "List the localizations belonging to a subscription version.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.app_store_review_screenshot.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/appStoreReviewScreenshot",
    "description": "Read the reviewer screenshot attached to a subscription.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptions",
    "description": "Create an auto-renewable subscription inside a subscription group.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscriptions.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptions/{id}",
    "description": "Remove a recurring product entirely: delete a subscription from the catalogue. Possible only before Apple has ever approved it; anything that has been on sale is withdrawn by emptying the countries it sells in.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "revenue"
  },
  {
    "name": "subscriptions.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}",
    "description": "Read one subscription by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[subscriptions]",
        "type": "array",
        "description": "the fields to include for returned resources of type subscriptions Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "name",
          "productId",
          "familySharable",
          "state",
          "subscriptionPeriod",
          "reviewNote",
          "groupLevel",
          "multiSeatStatus",
          "marketSettings",
          "subscriptionLocalizations",
          "appStoreReviewScreenshot",
          "group",
          "introductoryOffers",
          "promotionalOffers",
          "offerCodes",
          "prices",
          "pricePoints",
          "promotedPurchase",
          "subscriptionAvailability",
          "winBackOffers",
          "images",
          "planAvailabilities",
          "versions"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscriptionLocalizations",
          "appStoreReviewScreenshot",
          "group",
          "introductoryOffers",
          "promotionalOffers",
          "offerCodes",
          "prices",
          "promotedPurchase",
          "subscriptionAvailability",
          "winBackOffers",
          "images",
          "planAvailabilities",
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.introductory_offers.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/introductoryOffers",
    "description": "List the introductory offers belonging to a subscription.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned. ALWAYS pass include=subscriptionPricePoint,territory — without it every row is an opaque id with no price and no currency, which reads as \"there is no price here\".",
        "enum": [
          "subscription",
          "territory",
          "subscriptionPricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.introductory_offers.remove",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptions/{id}/relationships/introductoryOffers",
    "description": "Unlink introductory offers from a subscription.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionIntroductoryOffersLinkagesRequest",
    "risk": "revenue"
  },
  {
    "name": "subscriptions.offer_codes.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/offerCodes",
    "description": "List the offer codes belonging to a subscription.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by territory Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscription",
          "oneTimeUseCodes",
          "customCodes",
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.plan_availabilities.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/planAvailabilities",
    "description": "List the plan availabilities belonging to a subscription.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "availableTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.price_points.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/pricePoints",
    "description": "List the allowed price points for a subscription — the first step when you want to change, set, raise or lower a subscription price. ALWAYS filter by territory (filter_territory, e.g. TUR, USA) — unfiltered, this returns thousands of rows. Find the price point whose customerPrice matches the price you want, then pass its ID to subscription_prices__create.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "filter[upfrontPricePointId]",
        "type": "array",
        "description": "filter by upfrontPricePointId"
      },
      {
        "name": "filter[planType]",
        "type": "array",
        "description": "filter by planType"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.prices.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/prices",
    "description": "List the current and scheduled prices of a subscription per territory (country) — what a subscription costs today in each storefront. Each row is a start date and a reference: the amount and the currency live in the price point, so a row read without include=subscriptionPricePoint,territory carries no price at all. pricing__get_subscription_price resolves that in one call, for one country or for every one.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[planType]",
        "type": "array",
        "description": "filter by attribute 'planType'",
        "enum": [
          "MONTHLY",
          "UPFRONT"
        ]
      },
      {
        "name": "filter[subscriptionPricePoint]",
        "type": "array",
        "description": "filter by id(s) of related 'subscriptionPricePoint' Takes a 'subscriptionPricePoint' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned. ALWAYS pass include=subscriptionPricePoint,territory — without it every row is an opaque id with no price and no currency, which reads as \"there is no price here\".",
        "enum": [
          "territory",
          "subscriptionPricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.prices.remove",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptions/{id}/relationships/prices",
    "description": "Unlink prices from a subscription.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPricesLinkagesRequest",
    "risk": "revenue"
  },
  {
    "name": "subscriptions.promoted_purchase.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/promotedPurchase",
    "description": "Read the promoted purchase for a subscription.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "inAppPurchaseV2",
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.promotional_offers.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/promotionalOffers",
    "description": "List the promotional offers belonging to a subscription.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by territory Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscription",
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptions/{id}",
    "description": "Update a subscription.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionUpdateRequest",
    "risk": "revenue"
  },
  {
    "name": "subscriptions.versions.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/versions",
    "description": "List the versions belonging to a subscription.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[state]",
        "type": "array",
        "description": "filter by attribute 'state'",
        "enum": [
          "PREPARE_FOR_SUBMISSION",
          "READY_FOR_REVIEW",
          "WAITING_FOR_REVIEW",
          "IN_REVIEW",
          "ACCEPTED",
          "APPROVED",
          "REPLACED_WITH_NEW_VERSION",
          "REJECTED",
          "DEVELOPER_REJECTED"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "subscription",
          "image",
          "images",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.win_back_offers.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/winBackOffers",
    "description": "List the win-back offers on a subscription — the discounts shown to lapsed subscribers who cancelled, to bring them back.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[winBackOffers]",
        "type": "array",
        "description": "the fields to include for returned resources of type winBackOffers Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "offerId",
          "duration",
          "offerMode",
          "periodCount",
          "customerEligibilityPaidSubscriptionDurationInMonths",
          "customerEligibilityTimeSinceLastSubscribedInMonths",
          "customerEligibilityWaitBetweenOffersInMonths",
          "startDate",
          "endDate",
          "priority",
          "promotionIntent",
          "targetSubscriptionPlanType",
          "prices"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "territories.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/territories",
    "description": "List territories.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "fields[territories]",
        "type": "array",
        "description": "the fields to include for returned resources of type territories Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "currency"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "territory_availabilities.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/territoryAvailabilities/{id}",
    "description": "Update a territory availability.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "TerritoryAvailabilityUpdateRequest",
    "risk": "release"
  },
  {
    "name": "user_invitations.create",
    "domain": "users",
    "method": "POST",
    "path": "/v1/userInvitations",
    "description": "Invite someone to your App Store Connect team by email, with the role they get on arrival. They are not a member until they accept.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserInvitationCreateRequest",
    "risk": "access"
  },
  {
    "name": "user_invitations.delete",
    "domain": "users",
    "method": "DELETE",
    "path": "/v1/userInvitations/{id}",
    "description": "Delete a user invitation.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "user_invitations.get",
    "domain": "users",
    "method": "GET",
    "path": "/v1/userInvitations/{id}",
    "description": "Read one user invitation by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[userInvitations]",
        "type": "array",
        "description": "the fields to include for returned resources of type userInvitations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "email",
          "firstName",
          "lastName",
          "expirationDate",
          "roles",
          "allAppsVisible",
          "provisioningAllowed",
          "visibleApps"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "visibleApps"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "user_invitations.list",
    "domain": "users",
    "method": "GET",
    "path": "/v1/userInvitations",
    "description": "List user invitations.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[email]",
        "type": "array",
        "description": "filter by attribute 'email'"
      },
      {
        "name": "filter[roles]",
        "type": "array",
        "description": "filter by attribute 'roles'",
        "enum": [
          "ADMIN",
          "FINANCE",
          "ACCOUNT_HOLDER",
          "SALES",
          "MARKETING",
          "APP_MANAGER",
          "DEVELOPER",
          "ACCESS_TO_REPORTS",
          "CUSTOMER_SUPPORT",
          "CREATE_APPS",
          "CLOUD_MANAGED_DEVELOPER_ID",
          "CLOUD_MANAGED_APP_DISTRIBUTION",
          "GENERATE_INDIVIDUAL_KEYS"
        ]
      },
      {
        "name": "filter[visibleApps]",
        "type": "array",
        "description": "filter by id(s) of related 'visibleApps' Takes a 'visibleApps' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "email",
          "-email",
          "lastName",
          "-lastName"
        ]
      },
      {
        "name": "fields[userInvitations]",
        "type": "array",
        "description": "the fields to include for returned resources of type userInvitations Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "email",
          "firstName",
          "lastName",
          "expirationDate",
          "roles",
          "allAppsVisible",
          "provisioningAllowed",
          "visibleApps"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "visibleApps"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "user_invitations.visible_apps.list",
    "domain": "users",
    "method": "GET",
    "path": "/v1/userInvitations/{id}/visibleApps",
    "description": "List the visible apps belonging to a user invitation.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "users.delete",
    "domain": "users",
    "method": "DELETE",
    "path": "/v1/users/{id}",
    "description": "Delete a user.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "users.get",
    "domain": "users",
    "method": "GET",
    "path": "/v1/users/{id}",
    "description": "Read one user by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[users]",
        "type": "array",
        "description": "the fields to include for returned resources of type users Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "username",
          "firstName",
          "lastName",
          "roles",
          "allAppsVisible",
          "provisioningAllowed",
          "visibleApps"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "visibleApps"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "users.list",
    "domain": "users",
    "method": "GET",
    "path": "/v1/users",
    "description": "List team members with access to your App Store Connect account.",
    "readOnly": true,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[username]",
        "type": "array",
        "description": "filter by attribute 'username'"
      },
      {
        "name": "filter[roles]",
        "type": "array",
        "description": "filter by attribute 'roles'",
        "enum": [
          "ADMIN",
          "FINANCE",
          "ACCOUNT_HOLDER",
          "SALES",
          "MARKETING",
          "APP_MANAGER",
          "DEVELOPER",
          "ACCESS_TO_REPORTS",
          "CUSTOMER_SUPPORT",
          "CREATE_APPS",
          "CLOUD_MANAGED_DEVELOPER_ID",
          "CLOUD_MANAGED_APP_DISTRIBUTION",
          "GENERATE_INDIVIDUAL_KEYS"
        ]
      },
      {
        "name": "filter[visibleApps]",
        "type": "array",
        "description": "filter by id(s) of related 'visibleApps' Takes a 'visibleApps' resource id, read from the call that lists them — not a name. A value that matches nothing returns 200 with an empty list rather than an error."
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "username",
          "-username",
          "lastName",
          "-lastName"
        ]
      },
      {
        "name": "fields[users]",
        "type": "array",
        "description": "the fields to include for returned resources of type users Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "username",
          "firstName",
          "lastName",
          "roles",
          "allAppsVisible",
          "provisioningAllowed",
          "visibleApps"
        ]
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "visibleApps"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "users.update",
    "domain": "users",
    "method": "PATCH",
    "path": "/v1/users/{id}",
    "description": "Change a team member’s role and which apps they can reach — Admin, App Manager, Developer, Marketing or Finance permissions. Edits an existing member; it does not invite anyone.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserUpdateRequest",
    "risk": "access"
  },
  {
    "name": "users.visible_apps.add",
    "domain": "users",
    "method": "POST",
    "path": "/v1/users/{id}/relationships/visibleApps",
    "description": "Link visible apps to a user.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserVisibleAppsLinkagesRequest",
    "risk": "access"
  },
  {
    "name": "users.visible_apps.list",
    "domain": "users",
    "method": "GET",
    "path": "/v1/users/{id}/visibleApps",
    "description": "List the visible apps belonging to a user.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "users.visible_apps.remove",
    "domain": "users",
    "method": "DELETE",
    "path": "/v1/users/{id}/relationships/visibleApps",
    "description": "Unlink visible apps from a user.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserVisibleAppsLinkagesRequest",
    "risk": "destructive"
  },
  {
    "name": "users.visible_apps.replace",
    "domain": "users",
    "method": "PATCH",
    "path": "/v1/users/{id}/relationships/visibleApps",
    "description": "Replace the full set of visible apps linked to a user.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserVisibleAppsLinkagesRequest",
    "risk": "access"
  },
  {
    "name": "webhook_deliveries.create",
    "domain": "webhooks",
    "method": "POST",
    "path": "/v1/webhookDeliveries",
    "description": "Create a webhook delivery.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WebhookDeliveryCreateRequest",
    "risk": "low"
  },
  {
    "name": "webhook_pings.create",
    "domain": "webhooks",
    "method": "POST",
    "path": "/v1/webhookPings",
    "description": "Ping a webhook to check your endpoint answers — Apple sends a test delivery to it and records the result. Nothing about the app changes.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WebhookPingCreateRequest",
    "risk": "low"
  },
  {
    "name": "webhooks.create",
    "domain": "webhooks",
    "method": "POST",
    "path": "/v1/webhooks",
    "description": "Create a webhook so Apple pushes App Store Connect events to your endpoint.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WebhookCreateRequest",
    "risk": "low"
  },
  {
    "name": "webhooks.delete",
    "domain": "webhooks",
    "method": "DELETE",
    "path": "/v1/webhooks/{id}",
    "description": "Delete a webhook.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "destructive"
  },
  {
    "name": "webhooks.deliveries.list",
    "domain": "webhooks",
    "method": "GET",
    "path": "/v1/webhooks/{id}/deliveries",
    "description": "List the deliveries belonging to a webhook.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[deliveryState]",
        "type": "array",
        "description": "filter by attribute 'deliveryState'",
        "enum": [
          "SUCCEEDED",
          "FAILED",
          "PENDING"
        ]
      },
      {
        "name": "filter[createdDateGreaterThanOrEqualTo]",
        "type": "array",
        "description": "filter by createdDateGreaterThanOrEqualTo"
      },
      {
        "name": "filter[createdDateLessThan]",
        "type": "array",
        "description": "filter by createdDateLessThan"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "event"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "webhooks.get",
    "domain": "webhooks",
    "method": "GET",
    "path": "/v1/webhooks/{id}",
    "description": "Read one webhook by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[webhooks]",
        "type": "array",
        "description": "the fields to include for returned resources of type webhooks Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "enabled",
          "eventTypes",
          "name",
          "url",
          "app",
          "deliveries"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "webhooks.update",
    "domain": "webhooks",
    "method": "PATCH",
    "path": "/v1/webhooks/{id}",
    "description": "Update a webhook.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WebhookUpdateRequest",
    "risk": "low"
  },
  {
    "name": "win_back_offers.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/winBackOffers",
    "description": "Create a win back offer.",
    "readOnly": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WinBackOfferCreateRequest",
    "risk": "revenue"
  },
  {
    "name": "win_back_offers.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/winBackOffers/{id}",
    "description": "Delete a win back offer.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false,
    "risk": "revenue"
  },
  {
    "name": "win_back_offers.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/winBackOffers/{id}",
    "description": "Read one win back offer by ID.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "fields[winBackOffers]",
        "type": "array",
        "description": "the fields to include for returned resources of type winBackOffers Return only these attributes. A full row set can exceed 200 KB.",
        "enum": [
          "referenceName",
          "offerId",
          "duration",
          "offerMode",
          "periodCount",
          "customerEligibilityPaidSubscriptionDurationInMonths",
          "customerEligibilityTimeSinceLastSubscribedInMonths",
          "customerEligibilityWaitBetweenOffersInMonths",
          "startDate",
          "endDate",
          "priority",
          "promotionIntent",
          "targetSubscriptionPlanType",
          "prices"
        ]
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned.",
        "enum": [
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "win_back_offers.prices.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/winBackOffers/{id}/prices",
    "description": "List the prices belonging to a win back offer.",
    "readOnly": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory' Three-letter ISO-3166 alpha-3 code — USA, TUR, DEU, GBR. Not the two-letter form: \"US\" is accepted and silently returns an empty list."
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include Pull related records in the same call. Without it, checking a relationship costs one extra call per row returned. ALWAYS pass include=subscriptionPricePoint,territory — without it every row is an opaque id with no price and no currency, which reads as \"there is no price here\".",
        "enum": [
          "territory",
          "subscriptionPricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "win_back_offers.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/winBackOffers/{id}",
    "description": "Update a win back offer.",
    "readOnly": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WinBackOfferUpdateRequest",
    "risk": "revenue"
  }
];
