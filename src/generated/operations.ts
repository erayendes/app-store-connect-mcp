// AUTO-GENERATED — do not edit by hand.
// Source: Apple App Store Connect OpenAPI specification v4.4.1
// Regenerate with: npm run generate

import type { Operation } from '../core/types.js';

export const SPEC_VERSION = "4.4.1";

export const OPERATIONS: Operation[] = [
  {
    "name": "accessibility_declarations.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/accessibilityDeclarations",
    "description": "Create an accessibility declaration.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AccessibilityDeclarationCreateRequest"
  },
  {
    "name": "accessibility_declarations.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/accessibilityDeclarations/{id}",
    "description": "Delete an accessibility declaration.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "accessibility_declarations.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/accessibilityDeclarations/{id}",
    "description": "Read one accessibility declaration by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "accessibility_declarations.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/accessibilityDeclarations/{id}",
    "description": "Update an accessibility declaration.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AccessibilityDeclarationUpdateRequest"
  },
  {
    "name": "actors.get",
    "domain": "users",
    "method": "GET",
    "path": "/v1/actors/{id}",
    "description": "Read one actor by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "actors.list",
    "domain": "users",
    "method": "GET",
    "path": "/v1/actors",
    "description": "List actors.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)",
        "required": true
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
    "description": "Update an age rating declaration.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AgeRatingDeclarationUpdateRequest"
  },
  {
    "name": "alternative_distribution_domains.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/alternativeDistributionDomains",
    "description": "Create an alternative distribution domain.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AlternativeDistributionDomainCreateRequest"
  },
  {
    "name": "alternative_distribution_domains.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/alternativeDistributionDomains/{id}",
    "description": "Delete an alternative distribution domain.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_domains.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionDomains/{id}",
    "description": "Read one alternative distribution domain by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_domains.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionDomains",
    "description": "List alternative distribution domains.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
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
    "name": "alternative_distribution_keys.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/alternativeDistributionKeys",
    "description": "Create an alternative distribution key.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AlternativeDistributionKeyCreateRequest"
  },
  {
    "name": "alternative_distribution_keys.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/alternativeDistributionKeys/{id}",
    "description": "Delete an alternative distribution key.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_keys.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionKeys/{id}",
    "description": "Read one alternative distribution key by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_keys.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionKeys",
    "description": "List alternative distribution keys.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "exists[app]",
        "type": "boolean",
        "description": "filter by existence or non-existence of related 'app'"
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_package_variants.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackageVariants/{id}",
    "description": "Read one alternative distribution package variant by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "alternative_distribution_package_versions.deltas.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackageVersions/{id}/deltas",
    "description": "List the deltas belonging to an alternative distribution package version.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "alternative_distribution_package_versions.deltas.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackageVersions/{id}/relationships/deltas",
    "description": "List only the IDs of the deltas linked to an alternative distribution package version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "name": "alternative_distribution_package_versions.variants.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackageVersions/{id}/relationships/variants",
    "description": "List only the IDs of the variants linked to an alternative distribution package version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AlternativeDistributionPackageCreateRequest"
  },
  {
    "name": "alternative_distribution_packages.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackages/{id}",
    "description": "Read one alternative distribution package by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "alternative_distribution_packages.versions.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/alternativeDistributionPackages/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to an alternative distribution package. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "analytics_report_instances.get",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportInstances/{id}",
    "description": "Read one analytics report instance by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "analytics_report_instances.segments.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportInstances/{id}/segments",
    "description": "List the segments belonging to an analytics report instance.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "analytics_report_instances.segments.list_ids",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportInstances/{id}/relationships/segments",
    "description": "List only the IDs of the segments linked to an analytics report instance. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "description": "Create an analytics report request.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AnalyticsReportRequestCreateRequest"
  },
  {
    "name": "analytics_report_requests.delete",
    "domain": "analytics",
    "method": "DELETE",
    "path": "/v1/analyticsReportRequests/{id}",
    "description": "Delete an analytics report request.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "analytics_report_requests.get",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportRequests/{id}",
    "description": "Read one analytics report request by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "name": "analytics_report_requests.reports.list_ids",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportRequests/{id}/relationships/reports",
    "description": "List only the IDs of the reports linked to an analytics report request. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "analytics_report_segments.get",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReportSegments/{id}",
    "description": "Read one analytics report segment by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "analytics_reports.get",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReports/{id}",
    "description": "Read one analytics report by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "analytics_reports.instances.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReports/{id}/instances",
    "description": "List the instances belonging to an analytics report.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "analytics_reports.instances.list_ids",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/analyticsReports/{id}/relationships/instances",
    "description": "List only the IDs of the instances linked to an analytics report. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "android_to_ios_app_mapping_details.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/androidToIosAppMappingDetails",
    "description": "Create an android to iOS app mapping detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AndroidToIosAppMappingDetailCreateRequest"
  },
  {
    "name": "android_to_ios_app_mapping_details.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/androidToIosAppMappingDetails/{id}",
    "description": "Delete an android to iOS app mapping detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "android_to_ios_app_mapping_details.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/androidToIosAppMappingDetails/{id}",
    "description": "Read one android to iOS app mapping detail by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "android_to_ios_app_mapping_details.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/androidToIosAppMappingDetails/{id}",
    "description": "Update an android to iOS app mapping detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AndroidToIosAppMappingDetailUpdateRequest"
  },
  {
    "name": "app_availabilities_v2.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v2/appAvailabilities",
    "description": "Create an app availabilities (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppAvailabilityV2CreateRequest"
  },
  {
    "name": "app_availabilities_v2.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v2/appAvailabilities/{id}",
    "description": "Read one app availabilities (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_availabilities_v2.territory_availabilities.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v2/appAvailabilities/{id}/relationships/territoryAvailabilities",
    "description": "List only the IDs of the territory availabilities linked to an app availabilities (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_categories.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appCategories/{id}",
    "description": "Read one app category by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_categories.parent.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appCategories/{id}/relationships/parent",
    "description": "Read only the ID of the parent linked to an app category.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "name": "app_categories.subcategories.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appCategories/{id}/relationships/subcategories",
    "description": "List only the IDs of the subcategories linked to an app category. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAdvancedExperienceImageCreateRequest"
  },
  {
    "name": "app_clip_advanced_experience_images.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipAdvancedExperienceImages/{id}",
    "description": "Read one App Clip advanced experience image by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_clip_advanced_experience_images.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipAdvancedExperienceImages/{id}",
    "description": "Update an App Clip advanced experience image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAdvancedExperienceImageUpdateRequest"
  },
  {
    "name": "app_clip_advanced_experiences.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipAdvancedExperiences",
    "description": "Create an App Clip advanced experience.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAdvancedExperienceCreateRequest"
  },
  {
    "name": "app_clip_advanced_experiences.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipAdvancedExperiences/{id}",
    "description": "Read one App Clip advanced experience by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAdvancedExperienceUpdateRequest"
  },
  {
    "name": "app_clip_app_store_review_details.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipAppStoreReviewDetails",
    "description": "Create an App Clip App Store review detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAppStoreReviewDetailCreateRequest"
  },
  {
    "name": "app_clip_app_store_review_details.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipAppStoreReviewDetails/{id}",
    "description": "Read one App Clip App Store review detail by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipAppStoreReviewDetailUpdateRequest"
  },
  {
    "name": "app_clip_default_experience_localizations.app_clip_header_image.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperienceLocalizations/{id}/appClipHeaderImage",
    "description": "Read the App Clip header image for an App Clip default experience localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appClipDefaultExperienceLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experience_localizations.app_clip_header_image.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperienceLocalizations/{id}/relationships/appClipHeaderImage",
    "description": "Read only the ID of the App Clip header image linked to an App Clip default experience localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experience_localizations.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipDefaultExperienceLocalizations",
    "description": "Create an App Clip default experience localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceLocalizationCreateRequest"
  },
  {
    "name": "app_clip_default_experience_localizations.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appClipDefaultExperienceLocalizations/{id}",
    "description": "Delete an App Clip default experience localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experience_localizations.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperienceLocalizations/{id}",
    "description": "Read one App Clip default experience localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceLocalizationUpdateRequest"
  },
  {
    "name": "app_clip_default_experiences.app_clip_app_store_review_detail.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}/appClipAppStoreReviewDetail",
    "description": "Read the App Clip App Store review detail for an App Clip default experience.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appClipDefaultExperience"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experiences.app_clip_app_store_review_detail.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}/relationships/appClipAppStoreReviewDetail",
    "description": "Read only the ID of the App Clip App Store review detail linked to an App Clip default experience.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experiences.app_clip_default_experience_localizations.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}/appClipDefaultExperienceLocalizations",
    "description": "List the App Clip default experience localizations belonging to an App Clip default experience.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appClipDefaultExperience",
          "appClipHeaderImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experiences.app_clip_default_experience_localizations.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}/relationships/appClipDefaultExperienceLocalizations",
    "description": "List only the IDs of the App Clip default experience localizations linked to an App Clip default experience. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_clip_default_experiences.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipDefaultExperiences",
    "description": "Create an App Clip default experience.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceCreateRequest"
  },
  {
    "name": "app_clip_default_experiences.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appClipDefaultExperiences/{id}",
    "description": "Delete an App Clip default experience.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experiences.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}",
    "description": "Read one App Clip default experience by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "app_clip_default_experiences.release_with_app_store_version.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipDefaultExperiences/{id}/relationships/releaseWithAppStoreVersion",
    "description": "Read only the ID of the release with App Store version linked to an App Clip default experience.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_clip_default_experiences.release_with_app_store_version.set",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipDefaultExperiences/{id}/relationships/releaseWithAppStoreVersion",
    "description": "Set the release with App Store version linked to an App Clip default experience.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceReleaseWithAppStoreVersionLinkageRequest"
  },
  {
    "name": "app_clip_default_experiences.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appClipDefaultExperiences/{id}",
    "description": "Update an App Clip default experience.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipDefaultExperienceUpdateRequest"
  },
  {
    "name": "app_clip_header_images.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appClipHeaderImages",
    "description": "Create an App Clip header image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipHeaderImageCreateRequest"
  },
  {
    "name": "app_clip_header_images.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appClipHeaderImages/{id}",
    "description": "Delete an App Clip header image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_clip_header_images.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClipHeaderImages/{id}",
    "description": "Read one App Clip header image by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppClipHeaderImageUpdateRequest"
  },
  {
    "name": "app_clips.app_clip_advanced_experiences.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClips/{id}/appClipAdvancedExperiences",
    "description": "List the App Clip advanced experiences belonging to an App Clip.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "app_clips.app_clip_advanced_experiences.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClips/{id}/relationships/appClipAdvancedExperiences",
    "description": "List only the IDs of the App Clip advanced experiences linked to an App Clip. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_clips.app_clip_default_experiences.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClips/{id}/appClipDefaultExperiences",
    "description": "List the App Clip default experiences belonging to an App Clip.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "app_clips.app_clip_default_experiences.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClips/{id}/relationships/appClipDefaultExperiences",
    "description": "List only the IDs of the App Clip default experiences linked to an App Clip. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_clips.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appClips/{id}",
    "description": "Read one App Clip by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "app",
          "appClipDefaultExperiences"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_localizations.app_preview_sets.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}/appPreviewSets",
    "description": "List the app preview sets belonging to an app custom product page localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[previewType]",
        "type": "array",
        "description": "filter by attribute 'previewType'",
        "enum": [
          "IPHONE_67",
          "IPHONE_61",
          "IPHONE_65",
          "IPHONE_58",
          "IPHONE_55",
          "IPHONE_47",
          "IPHONE_40",
          "IPHONE_35",
          "IPAD_PRO_3GEN_129",
          "IPAD_PRO_3GEN_11",
          "IPAD_PRO_129",
          "IPAD_105",
          "IPAD_97",
          "DESKTOP",
          "APPLE_TV",
          "APPLE_VISION_PRO"
        ]
      },
      {
        "name": "filter[appStoreVersionLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionLocalization'"
      },
      {
        "name": "filter[appStoreVersionExperimentTreatmentLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionExperimentTreatmentLocalization'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization",
          "appPreviews"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_localizations.app_preview_sets.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}/relationships/appPreviewSets",
    "description": "List only the IDs of the app preview sets linked to an app custom product page localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_custom_product_page_localizations.app_screenshot_sets.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}/appScreenshotSets",
    "description": "List the app screenshot sets belonging to an app custom product page localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[screenshotDisplayType]",
        "type": "array",
        "description": "filter by attribute 'screenshotDisplayType'",
        "enum": [
          "APP_IPHONE_67",
          "APP_IPHONE_61",
          "APP_IPHONE_65",
          "APP_IPHONE_58",
          "APP_IPHONE_55",
          "APP_IPHONE_47",
          "APP_IPHONE_40",
          "APP_IPHONE_35",
          "APP_IPAD_PRO_3GEN_129",
          "APP_IPAD_PRO_3GEN_11",
          "APP_IPAD_PRO_129",
          "APP_IPAD_105",
          "APP_IPAD_97",
          "APP_DESKTOP",
          "APP_WATCH_ULTRA",
          "APP_WATCH_SERIES_10",
          "APP_WATCH_SERIES_7",
          "APP_WATCH_SERIES_4",
          "APP_WATCH_SERIES_3",
          "APP_APPLE_TV",
          "APP_APPLE_VISION_PRO",
          "IMESSAGE_APP_IPHONE_67",
          "IMESSAGE_APP_IPHONE_61",
          "IMESSAGE_APP_IPHONE_65",
          "IMESSAGE_APP_IPHONE_58",
          "IMESSAGE_APP_IPHONE_55",
          "IMESSAGE_APP_IPHONE_47",
          "IMESSAGE_APP_IPHONE_40",
          "IMESSAGE_APP_IPAD_PRO_3GEN_129",
          "IMESSAGE_APP_IPAD_PRO_3GEN_11",
          "IMESSAGE_APP_IPAD_PRO_129",
          "IMESSAGE_APP_IPAD_105",
          "IMESSAGE_APP_IPAD_97"
        ]
      },
      {
        "name": "filter[appStoreVersionLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionLocalization'"
      },
      {
        "name": "filter[appStoreVersionExperimentTreatmentLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionExperimentTreatmentLocalization'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization",
          "appScreenshots"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_localizations.app_screenshot_sets.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}/relationships/appScreenshotSets",
    "description": "List only the IDs of the app screenshot sets linked to an app custom product page localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_custom_product_page_localizations.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appCustomProductPageLocalizations",
    "description": "Create an app custom product page localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageLocalizationCreateRequest"
  },
  {
    "name": "app_custom_product_page_localizations.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appCustomProductPageLocalizations/{id}",
    "description": "Delete an app custom product page localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_localizations.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}",
    "description": "Read one app custom product page localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appCustomProductPageVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords"
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageLocalizationSearchKeywordsLinkagesRequest"
  },
  {
    "name": "app_custom_product_page_localizations.search_keywords.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}/searchKeywords",
    "description": "List the search keywords belonging to an app custom product page localization.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_custom_product_page_localizations.search_keywords.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageLocalizations/{id}/relationships/searchKeywords",
    "description": "List only the IDs of the search keywords linked to an app custom product page localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_custom_product_page_localizations.search_keywords.remove",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appCustomProductPageLocalizations/{id}/relationships/searchKeywords",
    "description": "Unlink search keywords from an app custom product page localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageLocalizationSearchKeywordsLinkagesRequest"
  },
  {
    "name": "app_custom_product_page_localizations.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appCustomProductPageLocalizations/{id}",
    "description": "Update an app custom product page localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageLocalizationUpdateRequest"
  },
  {
    "name": "app_custom_product_page_versions.app_custom_product_page_localizations.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageVersions/{id}/appCustomProductPageLocalizations",
    "description": "List the app custom product page localizations belonging to an app custom product page version.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appCustomProductPageVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_page_versions.app_custom_product_page_localizations.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageVersions/{id}/relationships/appCustomProductPageLocalizations",
    "description": "List only the IDs of the app custom product page localizations linked to an app custom product page version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_custom_product_page_versions.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appCustomProductPageVersions",
    "description": "Create an app custom product page version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageVersionCreateRequest"
  },
  {
    "name": "app_custom_product_page_versions.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPageVersions/{id}",
    "description": "Read one app custom product page version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageVersionUpdateRequest"
  },
  {
    "name": "app_custom_product_pages.app_custom_product_page_versions.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPages/{id}/appCustomProductPageVersions",
    "description": "List the app custom product page versions belonging to an app custom product page.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appCustomProductPage",
          "appCustomProductPageLocalizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_custom_product_pages.app_custom_product_page_versions.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPages/{id}/relationships/appCustomProductPageVersions",
    "description": "List only the IDs of the app custom product page versions linked to an app custom product page. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_custom_product_pages.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appCustomProductPages",
    "description": "Create an app custom product page.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageCreateRequest"
  },
  {
    "name": "app_custom_product_pages.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appCustomProductPages/{id}",
    "description": "Delete an app custom product page.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_custom_product_pages.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appCustomProductPages/{id}",
    "description": "Read one app custom product page by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppCustomProductPageUpdateRequest"
  },
  {
    "name": "app_encryption_declaration_documents.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/appEncryptionDeclarationDocuments",
    "description": "Create an app encryption declaration document.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEncryptionDeclarationDocumentCreateRequest"
  },
  {
    "name": "app_encryption_declaration_documents.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarationDocuments/{id}",
    "description": "Read one app encryption declaration document by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_encryption_declaration_documents.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/appEncryptionDeclarationDocuments/{id}",
    "description": "Update an app encryption declaration document.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEncryptionDeclarationDocumentUpdateRequest"
  },
  {
    "name": "app_encryption_declarations.app_encryption_declaration_document.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarations/{id}/appEncryptionDeclarationDocument",
    "description": "Read the app encryption declaration document for an app encryption declaration.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_encryption_declarations.app_encryption_declaration_document.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarations/{id}/relationships/appEncryptionDeclarationDocument",
    "description": "Read only the ID of the app encryption declaration document linked to an app encryption declaration.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_encryption_declarations.app.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarations/{id}/app",
    "description": "Read the app for an app encryption declaration. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_encryption_declarations.app.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarations/{id}/relationships/app",
    "description": "Read only the ID of the app linked to an app encryption declaration. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_encryption_declarations.builds.add",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/appEncryptionDeclarations/{id}/relationships/builds",
    "description": "Link builds to an app encryption declaration. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEncryptionDeclarationBuildsLinkagesRequest"
  },
  {
    "name": "app_encryption_declarations.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/appEncryptionDeclarations",
    "description": "Create an app encryption declaration.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEncryptionDeclarationCreateRequest"
  },
  {
    "name": "app_encryption_declarations.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appEncryptionDeclarations/{id}",
    "description": "Read one app encryption declaration by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "List app encryption declarations.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'app'"
      },
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "app_event_localizations.app_event_screenshots.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEventLocalizations/{id}/appEventScreenshots",
    "description": "List the app event screenshots belonging to an app event localization.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appEventLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_event_localizations.app_event_screenshots.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEventLocalizations/{id}/relationships/appEventScreenshots",
    "description": "List only the IDs of the app event screenshots linked to an app event localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_event_localizations.app_event_video_clips.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEventLocalizations/{id}/appEventVideoClips",
    "description": "List the app event video clips belonging to an app event localization.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appEventLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_event_localizations.app_event_video_clips.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEventLocalizations/{id}/relationships/appEventVideoClips",
    "description": "List only the IDs of the app event video clips linked to an app event localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_event_localizations.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appEventLocalizations",
    "description": "Create an app event localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventLocalizationCreateRequest"
  },
  {
    "name": "app_event_localizations.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appEventLocalizations/{id}",
    "description": "Delete an app event localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_event_localizations.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEventLocalizations/{id}",
    "description": "Read one app event localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appEvent",
          "appEventScreenshots",
          "appEventVideoClips"
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventLocalizationUpdateRequest"
  },
  {
    "name": "app_event_screenshots.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appEventScreenshots",
    "description": "Create an app event screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventScreenshotCreateRequest"
  },
  {
    "name": "app_event_screenshots.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appEventScreenshots/{id}",
    "description": "Delete an app event screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_event_screenshots.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEventScreenshots/{id}",
    "description": "Read one app event screenshot by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appEventLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_event_screenshots.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appEventScreenshots/{id}",
    "description": "Update an app event screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventScreenshotUpdateRequest"
  },
  {
    "name": "app_event_video_clips.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appEventVideoClips",
    "description": "Create an app event video clip.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventVideoClipCreateRequest"
  },
  {
    "name": "app_event_video_clips.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appEventVideoClips/{id}",
    "description": "Delete an app event video clip.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_event_video_clips.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEventVideoClips/{id}",
    "description": "Read one app event video clip by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appEventLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_event_video_clips.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appEventVideoClips/{id}",
    "description": "Update an app event video clip.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventVideoClipUpdateRequest"
  },
  {
    "name": "app_events.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appEvents",
    "description": "Create an app event.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventCreateRequest"
  },
  {
    "name": "app_events.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appEvents/{id}",
    "description": "Delete an app event.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_events.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEvents/{id}",
    "description": "Read one app event by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appEvent",
          "appEventScreenshots",
          "appEventVideoClips"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_events.localizations.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appEvents/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to an app event. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_events.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appEvents/{id}",
    "description": "Update an app event.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppEventUpdateRequest"
  },
  {
    "name": "app_info_localizations.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/appInfoLocalizations",
    "description": "Create an app info localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppInfoLocalizationCreateRequest"
  },
  {
    "name": "app_info_localizations.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/appInfoLocalizations/{id}",
    "description": "Delete an app info localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_info_localizations.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfoLocalizations/{id}",
    "description": "Read one app info localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Update an app info localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppInfoLocalizationUpdateRequest"
  },
  {
    "name": "app_infos.age_rating_declaration.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/ageRatingDeclaration",
    "description": "Read the age rating declaration for an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_infos.age_rating_declaration.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/relationships/ageRatingDeclaration",
    "description": "Read only the ID of the age rating declaration linked to an app info.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appInfo"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.app_info_localizations.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/relationships/appInfoLocalizations",
    "description": "List only the IDs of the app info localizations linked to an app info. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_infos.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}",
    "description": "Read one app info by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.primary_category.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/relationships/primaryCategory",
    "description": "Read only the ID of the primary category linked to an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_infos.primary_subcategory_one.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/primarySubcategoryOne",
    "description": "Read the primary subcategory one for an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.primary_subcategory_one.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/relationships/primarySubcategoryOne",
    "description": "Read only the ID of the primary subcategory one linked to an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_infos.primary_subcategory_two.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/primarySubcategoryTwo",
    "description": "Read the primary subcategory two for an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.primary_subcategory_two.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/relationships/primarySubcategoryTwo",
    "description": "Read only the ID of the primary subcategory two linked to an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_infos.secondary_category.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/secondaryCategory",
    "description": "Read the secondary category for an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.secondary_category.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/relationships/secondaryCategory",
    "description": "Read only the ID of the secondary category linked to an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_infos.secondary_subcategory_one.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/secondarySubcategoryOne",
    "description": "Read the secondary subcategory one for an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.secondary_subcategory_one.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/relationships/secondarySubcategoryOne",
    "description": "Read only the ID of the secondary subcategory one linked to an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_infos.secondary_subcategory_two.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/secondarySubcategoryTwo",
    "description": "Read the secondary subcategory two for an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subcategories",
          "parent"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.secondary_subcategory_two.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/relationships/secondarySubcategoryTwo",
    "description": "Read only the ID of the secondary subcategory two linked to an app info.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_infos.territory_age_ratings.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/territoryAgeRatings",
    "description": "List the territory age ratings belonging to an app info.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_infos.territory_age_ratings.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appInfos/{id}/relationships/territoryAgeRatings",
    "description": "List only the IDs of the territory age ratings linked to an app info. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_infos.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/appInfos/{id}",
    "description": "Update an app info.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppInfoUpdateRequest"
  },
  {
    "name": "app_preview_sets.app_previews.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appPreviewSets/{id}/appPreviews",
    "description": "List the app previews belonging to an app preview set.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appPreviewSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_preview_sets.app_previews.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appPreviewSets/{id}/relationships/appPreviews",
    "description": "List only the IDs of the app previews linked to an app preview set. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_preview_sets.app_previews.replace",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appPreviewSets/{id}/relationships/appPreviews",
    "description": "Replace the full set of app previews linked to an app preview set.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppPreviewSetAppPreviewsLinkagesRequest"
  },
  {
    "name": "app_preview_sets.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appPreviewSets",
    "description": "Create an app preview set.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppPreviewSetCreateRequest"
  },
  {
    "name": "app_preview_sets.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appPreviewSets/{id}",
    "description": "Delete an app preview set.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_preview_sets.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appPreviewSets/{id}",
    "description": "Read one app preview set by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization",
          "appPreviews"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_previews.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appPreviews",
    "description": "Create an app preview.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppPreviewCreateRequest"
  },
  {
    "name": "app_previews.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appPreviews/{id}",
    "description": "Delete an app preview.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_previews.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appPreviews/{id}",
    "description": "Read one app preview by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appPreviewSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_previews.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appPreviews/{id}",
    "description": "Update an app preview.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppPreviewUpdateRequest"
  },
  {
    "name": "app_price_points_v3.equalizations.list",
    "domain": "pricing",
    "method": "GET",
    "path": "/v3/appPricePoints/{id}/equalizations",
    "description": "List the equalizations belonging to an app price points v3.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "app",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_price_points_v3.equalizations.list_ids",
    "domain": "pricing",
    "method": "GET",
    "path": "/v3/appPricePoints/{id}/relationships/equalizations",
    "description": "List only the IDs of the equalizations linked to an app price points v3. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_price_points_v3.get",
    "domain": "pricing",
    "method": "GET",
    "path": "/v3/appPricePoints/{id}",
    "description": "Read one app price points v3 by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appPricePoint",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_price_schedules.automatic_prices.list_ids",
    "domain": "pricing",
    "method": "GET",
    "path": "/v1/appPriceSchedules/{id}/relationships/automaticPrices",
    "description": "List only the IDs of the automatic prices linked to an app price schedule. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_price_schedules.base_territory.get",
    "domain": "pricing",
    "method": "GET",
    "path": "/v1/appPriceSchedules/{id}/baseTerritory",
    "description": "Read the base territory for an app price schedule.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_price_schedules.base_territory.get_id",
    "domain": "pricing",
    "method": "GET",
    "path": "/v1/appPriceSchedules/{id}/relationships/baseTerritory",
    "description": "Read only the ID of the base territory linked to an app price schedule.",
    "readOnly": true,
    "deprecated": false,
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
    "description": "Create an app price schedule.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppPriceScheduleCreateRequest"
  },
  {
    "name": "app_price_schedules.get",
    "domain": "pricing",
    "method": "GET",
    "path": "/v1/appPriceSchedules/{id}",
    "description": "Read one app price schedule by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appPricePoint",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_price_schedules.manual_prices.list_ids",
    "domain": "pricing",
    "method": "GET",
    "path": "/v1/appPriceSchedules/{id}/relationships/manualPrices",
    "description": "List only the IDs of the manual prices linked to an app price schedule. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_screenshot_sets.app_screenshots.list",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appScreenshotSets/{id}/appScreenshots",
    "description": "List the app screenshots belonging to an app screenshot set.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appScreenshotSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_screenshot_sets.app_screenshots.list_ids",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appScreenshotSets/{id}/relationships/appScreenshots",
    "description": "List only the IDs of the app screenshots linked to an app screenshot set. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_screenshot_sets.app_screenshots.replace",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appScreenshotSets/{id}/relationships/appScreenshots",
    "description": "Replace the full set of app screenshots linked to an app screenshot set.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppScreenshotSetAppScreenshotsLinkagesRequest"
  },
  {
    "name": "app_screenshot_sets.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appScreenshotSets",
    "description": "Create an app screenshot set.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppScreenshotSetCreateRequest"
  },
  {
    "name": "app_screenshot_sets.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appScreenshotSets/{id}",
    "description": "Delete an app screenshot set.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_screenshot_sets.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appScreenshotSets/{id}",
    "description": "Read one app screenshot set by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization",
          "appScreenshots"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_screenshots.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/appScreenshots",
    "description": "Create an app screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppScreenshotCreateRequest"
  },
  {
    "name": "app_screenshots.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/appScreenshots/{id}",
    "description": "Delete an app screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_screenshots.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/appScreenshots/{id}",
    "description": "Read one app screenshot by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appScreenshotSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_screenshots.update",
    "domain": "marketing",
    "method": "PATCH",
    "path": "/v1/appScreenshots/{id}",
    "description": "Update an app screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppScreenshotUpdateRequest"
  },
  {
    "name": "app_store_review_attachments.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreReviewAttachments",
    "description": "Create an App Store review attachment.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreReviewAttachmentCreateRequest"
  },
  {
    "name": "app_store_review_attachments.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreReviewAttachments/{id}",
    "description": "Delete an App Store review attachment.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_review_attachments.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreReviewAttachments/{id}",
    "description": "Read one App Store review attachment by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreReviewAttachmentUpdateRequest"
  },
  {
    "name": "app_store_review_details.app_store_review_attachments.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreReviewDetails/{id}/appStoreReviewAttachments",
    "description": "List the App Store review attachments belonging to an App Store review detail.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreReviewDetail"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_review_details.app_store_review_attachments.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreReviewDetails/{id}/relationships/appStoreReviewAttachments",
    "description": "List only the IDs of the App Store review attachments linked to an App Store review detail. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_review_details.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreReviewDetails",
    "description": "Create an App Store review detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreReviewDetailCreateRequest"
  },
  {
    "name": "app_store_review_details.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreReviewDetails/{id}",
    "description": "Read one App Store review detail by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreReviewDetailUpdateRequest"
  },
  {
    "name": "app_store_version_experiment_treatment_localizations.app_preview_sets.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations/{id}/appPreviewSets",
    "description": "List the app preview sets belonging to an App Store version experiment treatment localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[previewType]",
        "type": "array",
        "description": "filter by attribute 'previewType'",
        "enum": [
          "IPHONE_67",
          "IPHONE_61",
          "IPHONE_65",
          "IPHONE_58",
          "IPHONE_55",
          "IPHONE_47",
          "IPHONE_40",
          "IPHONE_35",
          "IPAD_PRO_3GEN_129",
          "IPAD_PRO_3GEN_11",
          "IPAD_PRO_129",
          "IPAD_105",
          "IPAD_97",
          "DESKTOP",
          "APPLE_TV",
          "APPLE_VISION_PRO"
        ]
      },
      {
        "name": "filter[appStoreVersionLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionLocalization'"
      },
      {
        "name": "filter[appCustomProductPageLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appCustomProductPageLocalization'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization",
          "appPreviews"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiment_treatment_localizations.app_preview_sets.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations/{id}/relationships/appPreviewSets",
    "description": "List only the IDs of the app preview sets linked to an App Store version experiment treatment localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_version_experiment_treatment_localizations.app_screenshot_sets.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations/{id}/appScreenshotSets",
    "description": "List the app screenshot sets belonging to an App Store version experiment treatment localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[screenshotDisplayType]",
        "type": "array",
        "description": "filter by attribute 'screenshotDisplayType'",
        "enum": [
          "APP_IPHONE_67",
          "APP_IPHONE_61",
          "APP_IPHONE_65",
          "APP_IPHONE_58",
          "APP_IPHONE_55",
          "APP_IPHONE_47",
          "APP_IPHONE_40",
          "APP_IPHONE_35",
          "APP_IPAD_PRO_3GEN_129",
          "APP_IPAD_PRO_3GEN_11",
          "APP_IPAD_PRO_129",
          "APP_IPAD_105",
          "APP_IPAD_97",
          "APP_DESKTOP",
          "APP_WATCH_ULTRA",
          "APP_WATCH_SERIES_10",
          "APP_WATCH_SERIES_7",
          "APP_WATCH_SERIES_4",
          "APP_WATCH_SERIES_3",
          "APP_APPLE_TV",
          "APP_APPLE_VISION_PRO",
          "IMESSAGE_APP_IPHONE_67",
          "IMESSAGE_APP_IPHONE_61",
          "IMESSAGE_APP_IPHONE_65",
          "IMESSAGE_APP_IPHONE_58",
          "IMESSAGE_APP_IPHONE_55",
          "IMESSAGE_APP_IPHONE_47",
          "IMESSAGE_APP_IPHONE_40",
          "IMESSAGE_APP_IPAD_PRO_3GEN_129",
          "IMESSAGE_APP_IPAD_PRO_3GEN_11",
          "IMESSAGE_APP_IPAD_PRO_129",
          "IMESSAGE_APP_IPAD_105",
          "IMESSAGE_APP_IPAD_97"
        ]
      },
      {
        "name": "filter[appStoreVersionLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionLocalization'"
      },
      {
        "name": "filter[appCustomProductPageLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appCustomProductPageLocalization'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization",
          "appScreenshots"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiment_treatment_localizations.app_screenshot_sets.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations/{id}/relationships/appScreenshotSets",
    "description": "List only the IDs of the app screenshot sets linked to an App Store version experiment treatment localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_version_experiment_treatment_localizations.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations",
    "description": "Create an App Store version experiment treatment localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentTreatmentLocalizationCreateRequest"
  },
  {
    "name": "app_store_version_experiment_treatment_localizations.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations/{id}",
    "description": "Delete an App Store version experiment treatment localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiment_treatment_localizations.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatmentLocalizations/{id}",
    "description": "Read one App Store version experiment treatment localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionExperimentTreatment",
          "appScreenshotSets",
          "appPreviewSets"
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionExperimentTreatment",
          "appScreenshotSets",
          "appPreviewSets"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiment_treatments.app_store_version_experiment_treatment_localizations.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatments/{id}/relationships/appStoreVersionExperimentTreatmentLocalizations",
    "description": "List only the IDs of the App Store version experiment treatment localizations linked to an App Store version experiment treatment. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_version_experiment_treatments.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionExperimentTreatments",
    "description": "Create an App Store version experiment treatment.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentTreatmentCreateRequest"
  },
  {
    "name": "app_store_version_experiment_treatments.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionExperimentTreatments/{id}",
    "description": "Delete an App Store version experiment treatment.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiment_treatments.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperimentTreatments/{id}",
    "description": "Read one App Store version experiment treatment by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentTreatmentUpdateRequest"
  },
  {
    "name": "app_store_version_experiments_v2.app_store_version_experiment_treatments.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v2/appStoreVersionExperiments/{id}/appStoreVersionExperimentTreatments",
    "description": "List the App Store version experiment treatments belonging to an App Store version experiments (v2).",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "app_store_version_experiments_v2.app_store_version_experiment_treatments.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v2/appStoreVersionExperiments/{id}/relationships/appStoreVersionExperimentTreatments",
    "description": "List only the IDs of the App Store version experiment treatments linked to an App Store version experiments (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_version_experiments_v2.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v2/appStoreVersionExperiments",
    "description": "Create an App Store version experiments (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentV2CreateRequest"
  },
  {
    "name": "app_store_version_experiments_v2.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v2/appStoreVersionExperiments/{id}",
    "description": "Delete an App Store version experiments (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiments_v2.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v2/appStoreVersionExperiments/{id}",
    "description": "Read one App Store version experiments (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Update an App Store version experiments (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentV2UpdateRequest"
  },
  {
    "name": "app_store_version_experiments.app_store_version_experiment_treatments.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperiments/{id}/appStoreVersionExperimentTreatments",
    "description": "List the App Store version experiment treatments belonging to an App Store version experiment. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "app_store_version_experiments.app_store_version_experiment_treatments.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperiments/{id}/relationships/appStoreVersionExperimentTreatments",
    "description": "List only the IDs of the App Store version experiment treatments linked to an App Store version experiment. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "app_store_version_experiments.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionExperiments",
    "description": "Create an App Store version experiment. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentCreateRequest"
  },
  {
    "name": "app_store_version_experiments.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionExperiments/{id}",
    "description": "Delete an App Store version experiment. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiments.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionExperiments/{id}",
    "description": "Read one App Store version experiment by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersion",
          "appStoreVersionExperimentTreatments"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_experiments.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersionExperiments/{id}",
    "description": "Update an App Store version experiment. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionExperimentUpdateRequest"
  },
  {
    "name": "app_store_version_localizations.app_preview_sets.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}/appPreviewSets",
    "description": "List the app preview sets belonging to an App Store version localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[previewType]",
        "type": "array",
        "description": "filter by attribute 'previewType'",
        "enum": [
          "IPHONE_67",
          "IPHONE_61",
          "IPHONE_65",
          "IPHONE_58",
          "IPHONE_55",
          "IPHONE_47",
          "IPHONE_40",
          "IPHONE_35",
          "IPAD_PRO_3GEN_129",
          "IPAD_PRO_3GEN_11",
          "IPAD_PRO_129",
          "IPAD_105",
          "IPAD_97",
          "DESKTOP",
          "APPLE_TV",
          "APPLE_VISION_PRO"
        ]
      },
      {
        "name": "filter[appCustomProductPageLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appCustomProductPageLocalization'"
      },
      {
        "name": "filter[appStoreVersionExperimentTreatmentLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionExperimentTreatmentLocalization'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization",
          "appPreviews"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_localizations.app_preview_sets.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}/relationships/appPreviewSets",
    "description": "List only the IDs of the app preview sets linked to an App Store version localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_version_localizations.app_screenshot_sets.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}/appScreenshotSets",
    "description": "List the app screenshot sets belonging to an App Store version localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[screenshotDisplayType]",
        "type": "array",
        "description": "filter by attribute 'screenshotDisplayType'",
        "enum": [
          "APP_IPHONE_67",
          "APP_IPHONE_61",
          "APP_IPHONE_65",
          "APP_IPHONE_58",
          "APP_IPHONE_55",
          "APP_IPHONE_47",
          "APP_IPHONE_40",
          "APP_IPHONE_35",
          "APP_IPAD_PRO_3GEN_129",
          "APP_IPAD_PRO_3GEN_11",
          "APP_IPAD_PRO_129",
          "APP_IPAD_105",
          "APP_IPAD_97",
          "APP_DESKTOP",
          "APP_WATCH_ULTRA",
          "APP_WATCH_SERIES_10",
          "APP_WATCH_SERIES_7",
          "APP_WATCH_SERIES_4",
          "APP_WATCH_SERIES_3",
          "APP_APPLE_TV",
          "APP_APPLE_VISION_PRO",
          "IMESSAGE_APP_IPHONE_67",
          "IMESSAGE_APP_IPHONE_61",
          "IMESSAGE_APP_IPHONE_65",
          "IMESSAGE_APP_IPHONE_58",
          "IMESSAGE_APP_IPHONE_55",
          "IMESSAGE_APP_IPHONE_47",
          "IMESSAGE_APP_IPHONE_40",
          "IMESSAGE_APP_IPAD_PRO_3GEN_129",
          "IMESSAGE_APP_IPAD_PRO_3GEN_11",
          "IMESSAGE_APP_IPAD_PRO_129",
          "IMESSAGE_APP_IPAD_105",
          "IMESSAGE_APP_IPAD_97"
        ]
      },
      {
        "name": "filter[appCustomProductPageLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appCustomProductPageLocalization'"
      },
      {
        "name": "filter[appStoreVersionExperimentTreatmentLocalization]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersionExperimentTreatmentLocalization'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersionLocalization",
          "appCustomProductPageLocalization",
          "appStoreVersionExperimentTreatmentLocalization",
          "appScreenshots"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_version_localizations.app_screenshot_sets.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}/relationships/appScreenshotSets",
    "description": "List only the IDs of the app screenshot sets linked to an App Store version localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_version_localizations.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionLocalizations",
    "description": "Create an App Store version localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionLocalizationCreateRequest"
  },
  {
    "name": "app_store_version_localizations.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionLocalizations/{id}",
    "description": "Delete an App Store version localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_version_localizations.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}",
    "description": "Read one App Store version localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords"
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
    "description": "Link search keywords to an App Store version localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionLocalizationSearchKeywordsLinkagesRequest"
  },
  {
    "name": "app_store_version_localizations.search_keywords.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}/searchKeywords",
    "description": "List the search keywords belonging to an App Store version localization.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_version_localizations.search_keywords.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersionLocalizations/{id}/relationships/searchKeywords",
    "description": "List only the IDs of the search keywords linked to an App Store version localization. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_version_localizations.search_keywords.remove",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionLocalizations/{id}/relationships/searchKeywords",
    "description": "Unlink search keywords from an App Store version localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionLocalizationSearchKeywordsLinkagesRequest"
  },
  {
    "name": "app_store_version_localizations.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersionLocalizations/{id}",
    "description": "Update an App Store version localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionLocalizationUpdateRequest"
  },
  {
    "name": "app_store_version_phased_releases.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionPhasedReleases",
    "description": "Start a phased (gradual) rollout for an approved version, releasing to a growing percentage of users over 7 days.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionPhasedReleaseCreateRequest"
  },
  {
    "name": "app_store_version_phased_releases.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionPhasedReleases/{id}",
    "description": "Delete an App Store version phased release.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_version_phased_releases.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersionPhasedReleases/{id}",
    "description": "Pause, resume or complete a phased release. Set phasedReleaseState to PAUSE, ACTIVE or COMPLETE.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionPhasedReleaseUpdateRequest"
  },
  {
    "name": "app_store_version_promotions.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionPromotions",
    "description": "Create an App Store version promotion.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionPromotionCreateRequest"
  },
  {
    "name": "app_store_version_release_requests.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersionReleaseRequests",
    "description": "Manually release a version that was approved and is waiting for developer release.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionReleaseRequestCreateRequest"
  },
  {
    "name": "app_store_version_submissions.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersionSubmissions/{id}",
    "description": "Cancel a pending App Store review submission. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.alternative_distribution_package.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/alternativeDistributionPackage",
    "description": "Read the alternative distribution package for an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "versions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.alternative_distribution_package.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/alternativeDistributionPackage",
    "description": "Read only the ID of the alternative distribution package linked to an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_clip_default_experience.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appClipDefaultExperience",
    "description": "Read the App Clip default experience for an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "app_store_versions.app_clip_default_experience.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/appClipDefaultExperience",
    "description": "Read only the ID of the App Clip default experience linked to an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_clip_default_experience.set",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersions/{id}/relationships/appClipDefaultExperience",
    "description": "Set the App Clip default experience linked to an App Store version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionAppClipDefaultExperienceLinkageRequest"
  },
  {
    "name": "app_store_versions.app_store_review_detail.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreReviewDetail",
    "description": "Read the App Store review detail for an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersion",
          "appStoreReviewAttachments"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_review_detail.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/appStoreReviewDetail",
    "description": "Read only the ID of the App Store review detail linked to an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_version_experiments_v2.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreVersionExperimentsV2",
    "description": "List the App Store version experiments (v2) belonging to an App Store version.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "app_store_versions.app_store_version_experiments_v2.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/appStoreVersionExperimentsV2",
    "description": "List only the IDs of the App Store version experiments (v2) linked to an App Store version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_versions.app_store_version_experiments.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreVersionExperiments",
    "description": "List the App Store version experiments belonging to an App Store version. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersion",
          "appStoreVersionExperimentTreatments"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_version_experiments.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/appStoreVersionExperiments",
    "description": "List only the IDs of the App Store version experiments linked to an App Store version. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "app_store_versions.app_store_version_localizations.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreVersionLocalizations",
    "description": "List the App Store version localizations belonging to an App Store version.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersion",
          "appScreenshotSets",
          "appPreviewSets",
          "searchKeywords"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_version_localizations.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/appStoreVersionLocalizations",
    "description": "List only the IDs of the App Store version localizations linked to an App Store version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_versions.app_store_version_phased_release.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreVersionPhasedRelease",
    "description": "Read the App Store version phased release for an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_version_phased_release.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/appStoreVersionPhasedRelease",
    "description": "Read only the ID of the App Store version phased release linked to an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_version_submission.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/appStoreVersionSubmission",
    "description": "Read the App Store version submission for an App Store version. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.app_store_version_submission.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/appStoreVersionSubmission",
    "description": "Read only the ID of the App Store version submission linked to an App Store version. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.build.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/build",
    "description": "Read only the ID of the build linked to an App Store version.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionBuildLinkageRequest"
  },
  {
    "name": "app_store_versions.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/appStoreVersions",
    "description": "Create a new App Store version. Do this before attaching a build and submitting for review.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionCreateRequest"
  },
  {
    "name": "app_store_versions.customer_reviews.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/customerReviews",
    "description": "List the customer reviews belonging to an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by attribute 'territory'",
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
        "description": "filter by id(s) of related 'reviewTerritory'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "response",
          "reviewTerritory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.customer_reviews.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/customerReviews",
    "description": "List only the IDs of the customer reviews linked to an App Store version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_store_versions.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/appStoreVersions/{id}",
    "description": "Delete an App Store version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.game_center_app_version.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/gameCenterAppVersion",
    "description": "Read the Game Center app version for an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "compatibilityVersions",
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.game_center_app_version.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/gameCenterAppVersion",
    "description": "Read only the ID of the Game Center app version linked to an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}",
    "description": "Read one App Store version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "app_store_versions.routing_app_coverage.get_id",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/appStoreVersions/{id}/relationships/routingAppCoverage",
    "description": "Read only the ID of the routing app coverage linked to an App Store version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "app_store_versions.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/appStoreVersions/{id}",
    "description": "Update an App Store version, including its release type and earliest release date.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppStoreVersionUpdateRequest"
  },
  {
    "name": "app_tags.territories.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appTags/{id}/territories",
    "description": "List the territories belonging to an app tag.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_tags.territories.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/appTags/{id}/relationships/territories",
    "description": "List only the IDs of the territories linked to an app tag. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "app_tags.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/appTags/{id}",
    "description": "Update an app tag.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppTagUpdateRequest"
  },
  {
    "name": "apps.accessibility_declarations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/accessibilityDeclarations",
    "description": "List the accessibility declarations belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.accessibility_declarations.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/accessibilityDeclarations",
    "description": "List only the IDs of the accessibility declarations linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.alternative_distribution_key.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/alternativeDistributionKey",
    "description": "Read the alternative distribution key for an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.alternative_distribution_key.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/alternativeDistributionKey",
    "description": "Read only the ID of the alternative distribution key linked to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "reports"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.analytics_report_requests.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/analyticsReportRequests",
    "description": "List only the IDs of the analytics report requests linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.android_to_ios_app_mapping_details.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/androidToIosAppMappingDetails",
    "description": "List the android to iOS app mapping details belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.android_to_ios_app_mapping_details.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/androidToIosAppMappingDetails",
    "description": "List only the IDs of the android to iOS app mapping details linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.app_availability_v2.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appAvailabilityV2",
    "description": "Read the app availability (v2) for an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territoryAvailabilities"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_availability_v2.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appAvailabilityV2",
    "description": "Read only the ID of the app availability (v2) linked to an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.app_clips.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appClips",
    "description": "List the App Clips belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "app",
          "appClipDefaultExperiences"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_clips.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appClips",
    "description": "List only the IDs of the App Clips linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.app_custom_product_pages.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appCustomProductPages",
    "description": "List the app custom product pages belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "app",
          "appCustomProductPageVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_custom_product_pages.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appCustomProductPages",
    "description": "List only the IDs of the app custom product pages linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.app_encryption_declarations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appEncryptionDeclarations",
    "description": "List the app encryption declarations belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'builds'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.app_encryption_declarations.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appEncryptionDeclarations",
    "description": "List only the IDs of the app encryption declarations linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.app_events.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appEvents",
    "description": "List the app events belonging to an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[eventState]",
        "type": "array",
        "description": "filter by attribute 'eventState'",
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_events.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appEvents",
    "description": "List only the IDs of the app events linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.app_infos.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appInfos",
    "description": "List the app infos belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.app_infos.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appInfos",
    "description": "List only the IDs of the app infos linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.app_price_points.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appPricePoints",
    "description": "List the app price points belonging to an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "app",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_price_points.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appPricePoints",
    "description": "List only the IDs of the app price points linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.app_price_schedule.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appPriceSchedule",
    "description": "Read the app price schedule for an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.app_price_schedule.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appPriceSchedule",
    "description": "Read only the ID of the app price schedule linked to an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.app_store_version_experiments_v2.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appStoreVersionExperimentsV2",
    "description": "List the App Store version experiments (v2) belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.app_store_version_experiments_v2.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appStoreVersionExperimentsV2",
    "description": "List only the IDs of the App Store version experiments (v2) linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.app_store_versions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appStoreVersions",
    "description": "List App Store versions for an app, with their review state (e.g. PREPARE_FOR_SUBMISSION, WAITING_FOR_REVIEW, READY_FOR_SALE).",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.app_store_versions.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appStoreVersions",
    "description": "List only the IDs of the App Store versions linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.app_tags.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/appTags",
    "description": "List the app tags belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.app_tags.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/appTags",
    "description": "List only the IDs of the app tags linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.background_assets.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/backgroundAssets",
    "description": "List the background assets belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.background_assets.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/backgroundAssets",
    "description": "List only the IDs of the background assets linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.beta_app_localizations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaAppLocalizations",
    "description": "List the beta app localizations belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.beta_app_localizations.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/betaAppLocalizations",
    "description": "List only the IDs of the beta app localizations linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.beta_app_review_detail.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaAppReviewDetail",
    "description": "Read the beta app review detail for an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.beta_app_review_detail.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/betaAppReviewDetail",
    "description": "Read only the ID of the beta app review detail linked to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'build'"
      },
      {
        "name": "filter[build.preReleaseVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'build.preReleaseVersion'"
      },
      {
        "name": "filter[tester]",
        "type": "array",
        "description": "filter by id(s) of related 'tester'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "build",
          "tester"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.beta_feedback_crash_submissions.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/betaFeedbackCrashSubmissions",
    "description": "List only the IDs of the beta feedback crash submissions linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.beta_feedback_screenshot_submissions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaFeedbackScreenshotSubmissions",
    "description": "List the beta feedback screenshot submissions belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'build'"
      },
      {
        "name": "filter[build.preReleaseVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'build.preReleaseVersion'"
      },
      {
        "name": "filter[tester]",
        "type": "array",
        "description": "filter by id(s) of related 'tester'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "build",
          "tester"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.beta_feedback_screenshot_submissions.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/betaFeedbackScreenshotSubmissions",
    "description": "List only the IDs of the beta feedback screenshot submissions linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.beta_groups.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaGroups",
    "description": "List the beta groups belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.beta_groups.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/betaGroups",
    "description": "List only the IDs of the beta groups linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.beta_license_agreement.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/betaLicenseAgreement",
    "description": "Read the beta license agreement for an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.beta_license_agreement.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/betaLicenseAgreement",
    "description": "Read only the ID of the beta license agreement linked to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppBetaTestersLinkagesRequest"
  },
  {
    "name": "apps.build_uploads.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/buildUploads",
    "description": "List the build uploads belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.build_uploads.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/buildUploads",
    "description": "List only the IDs of the build uploads linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.builds.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/builds",
    "description": "List builds uploaded for an app, newest first when sorted by -uploadedDate.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.builds.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/builds",
    "description": "List only the IDs of the builds linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.ci_product.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/ciProduct",
    "description": "Read the Xcode Cloud product for an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.ci_product.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/ciProduct",
    "description": "Read only the ID of the Xcode Cloud product linked to an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.customer_review_summarizations.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/customerReviewSummarizations",
    "description": "List the customer review summarizations belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by attribute 'territory'",
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
        "description": "filter by id(s) of related 'reviewTerritory'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "response",
          "reviewTerritory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.customer_reviews.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/customerReviews",
    "description": "List only the IDs of the customer reviews linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.end_user_license_agreement.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/endUserLicenseAgreement",
    "description": "Read the end user license agreement for an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.end_user_license_agreement.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/endUserLicenseAgreement",
    "description": "Read only the ID of the end user license agreement linked to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.game_center_detail.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/gameCenterDetail",
    "description": "Read only the ID of the Game Center detail linked to an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.game_center_enabled_versions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/gameCenterEnabledVersions",
    "description": "List the Game Center enabled versions belonging to an app. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "name": "filter[id]",
        "type": "array",
        "description": "filter by id(s)"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "versionString",
          "-versionString"
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "compatibleVersions",
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.game_center_enabled_versions.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/gameCenterEnabledVersions",
    "description": "List only the IDs of the Game Center enabled versions linked to an app. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "apps.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}",
    "description": "Read one app by ID, including bundle ID, SKU and primary locale.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.in_app_purchases_v2.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/inAppPurchasesV2",
    "description": "List only the IDs of the in-app purchases (v2) linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.in_app_purchases.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/inAppPurchases",
    "description": "List the in-app purchases belonging to an app. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[inAppPurchaseType]",
        "type": "array",
        "description": "filter by attribute 'inAppPurchaseType'",
        "enum": [
          "AUTOMATICALLY_RENEWABLE_SUBSCRIPTION",
          "NON_CONSUMABLE",
          "CONSUMABLE",
          "NON_RENEWING_SUBSCRIPTION",
          "FREE_SUBSCRIPTION"
        ]
      },
      {
        "name": "filter[canBeSubmitted]",
        "type": "array",
        "description": "filter by canBeSubmitted"
      },
      {
        "name": "sort",
        "type": "array",
        "description": "comma-separated list of sort expressions; resources will be sorted as specified",
        "enum": [
          "referenceName",
          "-referenceName",
          "productId",
          "-productId",
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "apps"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.in_app_purchases.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/inAppPurchases",
    "description": "List only the IDs of the in-app purchases linked to an app. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "apps.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps",
    "description": "List all apps in your App Store Connect account. Start here when you need an app ID.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'appStoreVersions'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.marketplace_search_detail.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/marketplaceSearchDetail",
    "description": "Read only the ID of the marketplace search detail linked to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "hasBody": false
  },
  {
    "name": "apps.pre_release_versions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/preReleaseVersions",
    "description": "List the pre release versions belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.pre_release_versions.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/preReleaseVersions",
    "description": "List only the IDs of the pre release versions linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.promoted_purchases.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/promotedPurchases",
    "description": "List the promoted purchases belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchaseV2",
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.promoted_purchases.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/promotedPurchases",
    "description": "List only the IDs of the promoted purchases linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.promoted_purchases.replace",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/apps/{id}/relationships/promotedPurchases",
    "description": "Replace the full set of promoted purchases linked to an app.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppPromotedPurchasesLinkagesRequest"
  },
  {
    "name": "apps.review_submissions.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/reviewSubmissions",
    "description": "List the review submissions belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.review_submissions.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/reviewSubmissions",
    "description": "List only the IDs of the review submissions linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.search_keywords.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/searchKeywords",
    "description": "List the search keywords belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.search_keywords.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/searchKeywords",
    "description": "List only the IDs of the search keywords linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.subscription_grace_period.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/subscriptionGracePeriod",
    "description": "Read the subscription grace period for an app.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "apps.subscription_grace_period.get_id",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/subscriptionGracePeriod",
    "description": "Read only the ID of the subscription grace period linked to an app.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "apps.subscription_groups.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/subscriptionGroups",
    "description": "List only the IDs of the subscription groups linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "apps.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/apps/{id}",
    "description": "Update an app.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "AppUpdateRequest"
  },
  {
    "name": "apps.webhooks.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/webhooks",
    "description": "List the webhooks belonging to an app.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "apps.webhooks.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/apps/{id}/relationships/webhooks",
    "description": "List only the IDs of the webhooks linked to an app. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "background_asset_upload_files.create",
    "domain": "background_assets",
    "method": "POST",
    "path": "/v1/backgroundAssetUploadFiles",
    "description": "Create a background asset upload file.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetUploadFileCreateRequest"
  },
  {
    "name": "background_asset_upload_files.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetUploadFiles/{id}",
    "description": "Read one background asset upload file by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "background_asset_upload_files.update",
    "domain": "background_assets",
    "method": "PATCH",
    "path": "/v1/backgroundAssetUploadFiles/{id}",
    "description": "Update a background asset upload file.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetUploadFileUpdateRequest"
  },
  {
    "name": "background_asset_version_app_store_releases.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetVersionAppStoreReleases/{id}",
    "description": "Read one background asset version App Store release by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "name": "background_asset_versions.background_asset_upload_files.list_ids",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetVersions/{id}/relationships/backgroundAssetUploadFiles",
    "description": "List only the IDs of the background asset upload files linked to a background asset version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "background_asset_versions.create",
    "domain": "background_assets",
    "method": "POST",
    "path": "/v1/backgroundAssetVersions",
    "description": "Create a background asset version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetVersionCreateRequest"
  },
  {
    "name": "background_asset_versions.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssetVersions/{id}",
    "description": "Read one background asset version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Create a background asset.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetCreateRequest"
  },
  {
    "name": "background_assets.get",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssets/{id}",
    "description": "Read one background asset by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BackgroundAssetUpdateRequest"
  },
  {
    "name": "background_assets.versions.list",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssets/{id}/versions",
    "description": "List the versions belonging to a background asset.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "background_assets.versions.list_ids",
    "domain": "background_assets",
    "method": "GET",
    "path": "/v1/backgroundAssets/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to a background asset. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_app_clip_invocation_localizations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaAppClipInvocationLocalizations",
    "description": "Create a beta App Clip invocation localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppClipInvocationLocalizationCreateRequest"
  },
  {
    "name": "beta_app_clip_invocation_localizations.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaAppClipInvocationLocalizations/{id}",
    "description": "Delete a beta App Clip invocation localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_app_clip_invocation_localizations.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaAppClipInvocationLocalizations/{id}",
    "description": "Update a beta App Clip invocation localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppClipInvocationLocalizationUpdateRequest"
  },
  {
    "name": "beta_app_clip_invocations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaAppClipInvocations",
    "description": "Create a beta App Clip invocation.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppClipInvocationCreateRequest"
  },
  {
    "name": "beta_app_clip_invocations.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaAppClipInvocations/{id}",
    "description": "Delete a beta App Clip invocation.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_app_clip_invocations.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppClipInvocations/{id}",
    "description": "Read one beta App Clip invocation by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppClipInvocationUpdateRequest"
  },
  {
    "name": "beta_app_localizations.app.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppLocalizations/{id}/app",
    "description": "Read the app for a beta app localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_app_localizations.app.get_id",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppLocalizations/{id}/relationships/app",
    "description": "Read only the ID of the app linked to a beta app localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_app_localizations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaAppLocalizations",
    "description": "Create a beta app localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppLocalizationCreateRequest"
  },
  {
    "name": "beta_app_localizations.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaAppLocalizations/{id}",
    "description": "Delete a beta app localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_app_localizations.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppLocalizations/{id}",
    "description": "Read one beta app localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'app'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppLocalizationUpdateRequest"
  },
  {
    "name": "beta_app_review_details.app.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewDetails/{id}/app",
    "description": "Read the app for a beta app review detail.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_app_review_details.app.get_id",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewDetails/{id}/relationships/app",
    "description": "Read only the ID of the app linked to a beta app review detail.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_app_review_details.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewDetails/{id}",
    "description": "Read one beta app review detail by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app'",
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
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppReviewDetailUpdateRequest"
  },
  {
    "name": "beta_app_review_submissions.build.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewSubmissions/{id}/build",
    "description": "Read the build for a beta app review submission.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_app_review_submissions.build.get_id",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewSubmissions/{id}/relationships/build",
    "description": "Read only the ID of the build linked to a beta app review submission.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaAppReviewSubmissionCreateRequest"
  },
  {
    "name": "beta_app_review_submissions.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaAppReviewSubmissions/{id}",
    "description": "Read one beta app review submission by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'build'",
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "build"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_build_localizations.build.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaBuildLocalizations/{id}/build",
    "description": "Read the build for a beta build localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_build_localizations.build.get_id",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaBuildLocalizations/{id}/relationships/build",
    "description": "Read only the ID of the build linked to a beta build localization.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_build_localizations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaBuildLocalizations",
    "description": "Create a beta build localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaBuildLocalizationCreateRequest"
  },
  {
    "name": "beta_build_localizations.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaBuildLocalizations/{id}",
    "description": "Delete a beta build localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_build_localizations.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaBuildLocalizations/{id}",
    "description": "Read one beta build localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'build'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Update a beta build localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaBuildLocalizationUpdateRequest"
  },
  {
    "name": "beta_crash_logs.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaCrashLogs/{id}",
    "description": "Read one beta crash log by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_feedback_crash_submissions.crash_log.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaFeedbackCrashSubmissions/{id}/crashLog",
    "description": "Read the crash log for a beta feedback crash submission.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_feedback_crash_submissions.crash_log.get_id",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaFeedbackCrashSubmissions/{id}/relationships/crashLog",
    "description": "Read only the ID of the crash log linked to a beta feedback crash submission.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_feedback_crash_submissions.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaFeedbackCrashSubmissions/{id}",
    "description": "Read one beta feedback crash submission by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_feedback_screenshot_submissions.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaFeedbackScreenshotSubmissions/{id}",
    "description": "Read one beta feedback screenshot submission by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "build",
          "tester"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "beta_groups.app.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/app",
    "description": "Read the app for a beta group.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_groups.app.get_id",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/relationships/app",
    "description": "Read only the ID of the app linked to a beta group.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_groups.beta_recruitment_criteria.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/betaRecruitmentCriteria",
    "description": "Read the beta recruitment criteria for a beta group.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_groups.beta_recruitment_criteria.get_id",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/relationships/betaRecruitmentCriteria",
    "description": "Read only the ID of the beta recruitment criteria linked to a beta group.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_groups.beta_recruitment_criterion_compatible_build_check.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/betaRecruitmentCriterionCompatibleBuildCheck",
    "description": "Read the beta recruitment criterion compatible build check for a beta group.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_groups.beta_recruitment_criterion_compatible_build_check.get_id",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/relationships/betaRecruitmentCriterionCompatibleBuildCheck",
    "description": "Read only the ID of the beta recruitment criterion compatible build check linked to a beta group.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "name": "beta_groups.beta_testers.add",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaGroups/{id}/relationships/betaTesters",
    "description": "Link beta testers to a beta group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupBetaTestersLinkagesRequest"
  },
  {
    "name": "beta_groups.beta_testers.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/betaTesters",
    "description": "List the beta testers belonging to a beta group.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_groups.beta_testers.list_ids",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/relationships/betaTesters",
    "description": "List only the IDs of the beta testers linked to a beta group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_groups.beta_testers.remove",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaGroups/{id}/relationships/betaTesters",
    "description": "Unlink beta testers from a beta group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupBetaTestersLinkagesRequest"
  },
  {
    "name": "beta_groups.builds.add",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaGroups/{id}/relationships/builds",
    "description": "Link builds to a beta group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupBuildsLinkagesRequest"
  },
  {
    "name": "beta_groups.builds.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/builds",
    "description": "List the builds belonging to a beta group.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_groups.builds.list_ids",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}/relationships/builds",
    "description": "List only the IDs of the builds linked to a beta group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_groups.builds.remove",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaGroups/{id}/relationships/builds",
    "description": "Unlink builds from a beta group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupBuildsLinkagesRequest"
  },
  {
    "name": "beta_groups.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaGroups",
    "description": "Create a TestFlight beta group. Internal groups are limited to team members; external groups require beta review.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupCreateRequest"
  },
  {
    "name": "beta_groups.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaGroups/{id}",
    "description": "Delete a beta group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_groups.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaGroups/{id}",
    "description": "Read one beta group by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'app'"
      },
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaGroupUpdateRequest"
  },
  {
    "name": "beta_license_agreements.app.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaLicenseAgreements/{id}/app",
    "description": "Read the app for a beta license agreement.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_license_agreements.app.get_id",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaLicenseAgreements/{id}/relationships/app",
    "description": "Read only the ID of the app linked to a beta license agreement.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_license_agreements.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaLicenseAgreements/{id}",
    "description": "Read one beta license agreement by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaLicenseAgreementUpdateRequest"
  },
  {
    "name": "beta_recruitment_criteria.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaRecruitmentCriteria",
    "description": "Create a beta recruitment criteria.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaRecruitmentCriterionCreateRequest"
  },
  {
    "name": "beta_recruitment_criteria.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaRecruitmentCriteria/{id}",
    "description": "Delete a beta recruitment criteria.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_recruitment_criteria.update",
    "domain": "testflight",
    "method": "PATCH",
    "path": "/v1/betaRecruitmentCriteria/{id}",
    "description": "Update a beta recruitment criteria.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaRecruitmentCriterionUpdateRequest"
  },
  {
    "name": "beta_recruitment_criterion_options.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaRecruitmentCriterionOptions",
    "description": "List beta recruitment criterion options.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
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
    "name": "beta_tester_invitations.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaTesterInvitations",
    "description": "Create a beta tester invitation.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterInvitationCreateRequest"
  },
  {
    "name": "beta_testers.apps.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/apps",
    "description": "List the apps belonging to a beta tester.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_testers.apps.list_ids",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/relationships/apps",
    "description": "List only the IDs of the apps linked to a beta tester. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_testers.apps.remove",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaTesters/{id}/relationships/apps",
    "description": "Unlink apps from a beta tester.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterAppsLinkagesRequest"
  },
  {
    "name": "beta_testers.beta_groups.add",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaTesters/{id}/relationships/betaGroups",
    "description": "Link beta groups to a beta tester.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterBetaGroupsLinkagesRequest"
  },
  {
    "name": "beta_testers.beta_groups.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/betaGroups",
    "description": "List the beta groups belonging to a beta tester.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_testers.beta_groups.list_ids",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/relationships/betaGroups",
    "description": "List only the IDs of the beta groups linked to a beta tester. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_testers.beta_groups.remove",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaTesters/{id}/relationships/betaGroups",
    "description": "Unlink beta groups from a beta tester.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterBetaGroupsLinkagesRequest"
  },
  {
    "name": "beta_testers.beta_tester_usages.metrics",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/metrics/betaTesterUsages",
    "description": "Read beta tester usages metrics for a beta tester. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_testers.builds.add",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaTesters/{id}/relationships/builds",
    "description": "Link builds to a beta tester.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterBuildsLinkagesRequest"
  },
  {
    "name": "beta_testers.builds.list",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/builds",
    "description": "List the builds belonging to a beta tester.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_testers.builds.list_ids",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}/relationships/builds",
    "description": "List only the IDs of the builds linked to a beta tester. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "beta_testers.builds.remove",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaTesters/{id}/relationships/builds",
    "description": "Unlink builds from a beta tester.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterBuildsLinkagesRequest"
  },
  {
    "name": "beta_testers.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/betaTesters",
    "description": "Invite a new TestFlight tester by email and add them to one or more beta groups.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BetaTesterCreateRequest"
  },
  {
    "name": "beta_testers.delete",
    "domain": "testflight",
    "method": "DELETE",
    "path": "/v1/betaTesters/{id}",
    "description": "Delete a beta tester.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "beta_testers.get",
    "domain": "testflight",
    "method": "GET",
    "path": "/v1/betaTesters/{id}",
    "description": "Read one beta tester by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'apps'"
      },
      {
        "name": "filter[betaGroups]",
        "type": "array",
        "description": "filter by id(s) of related 'betaGroups'"
      },
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "build_beta_details.build.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBetaDetails/{id}/build",
    "description": "Read the build for a build beta detail.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "build_beta_details.build.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBetaDetails/{id}/relationships/build",
    "description": "Read only the ID of the build linked to a build beta detail.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "build_beta_details.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBetaDetails/{id}",
    "description": "Read one build beta detail by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "List build beta details.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[build]",
        "type": "array",
        "description": "filter by id(s) of related 'build'"
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
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildBetaDetailUpdateRequest"
  },
  {
    "name": "build_beta_notifications.create",
    "domain": "testflight",
    "method": "POST",
    "path": "/v1/buildBetaNotifications",
    "description": "Create a build beta notification.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildBetaNotificationCreateRequest"
  },
  {
    "name": "build_bundles.app_clip_domain_cache_status.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/appClipDomainCacheStatus",
    "description": "Read the App Clip domain cache statu for a build bundle.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "build_bundles.app_clip_domain_cache_status.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/relationships/appClipDomainCacheStatus",
    "description": "Read only the ID of the App Clip domain cache statu linked to a build bundle.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "build_bundles.app_clip_domain_debug_status.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/relationships/appClipDomainDebugStatus",
    "description": "Read only the ID of the App Clip domain debug statu linked to a build bundle.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "betaAppClipInvocationLocalizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "build_bundles.beta_app_clip_invocations.list_ids",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/relationships/betaAppClipInvocations",
    "description": "List only the IDs of the beta App Clip invocations linked to a build bundle. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "build_bundles.build_bundle_file_sizes.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/buildBundleFileSizes",
    "description": "List the build bundle file sizes belonging to a build bundle.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "build_bundles.build_bundle_file_sizes.list_ids",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildBundles/{id}/relationships/buildBundleFileSizes",
    "description": "List only the IDs of the build bundle file sizes linked to a build bundle. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "build_upload_files.create",
    "domain": "builds",
    "method": "POST",
    "path": "/v1/buildUploadFiles",
    "description": "Create a build upload file.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildUploadFileCreateRequest"
  },
  {
    "name": "build_upload_files.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildUploadFiles/{id}",
    "description": "Read one build upload file by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "build_upload_files.update",
    "domain": "builds",
    "method": "PATCH",
    "path": "/v1/buildUploadFiles/{id}",
    "description": "Update a build upload file.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildUploadFileUpdateRequest"
  },
  {
    "name": "build_uploads.build_upload_files.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildUploads/{id}/buildUploadFiles",
    "description": "List the build upload files belonging to a build upload.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "build_uploads.build_upload_files.list_ids",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildUploads/{id}/relationships/buildUploadFiles",
    "description": "List only the IDs of the build upload files linked to a build upload. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "build_uploads.create",
    "domain": "builds",
    "method": "POST",
    "path": "/v1/buildUploads",
    "description": "Create a build upload.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildUploadCreateRequest"
  },
  {
    "name": "build_uploads.delete",
    "domain": "builds",
    "method": "DELETE",
    "path": "/v1/buildUploads/{id}",
    "description": "Delete a build upload.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "build_uploads.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/buildUploads/{id}",
    "description": "Read one build upload by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.app_encryption_declaration.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/appEncryptionDeclaration",
    "description": "Read only the ID of the app encryption declaration linked to a build.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildAppEncryptionDeclarationLinkageRequest"
  },
  {
    "name": "builds.app_store_version.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/appStoreVersion",
    "description": "Read the App Store version for a build.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "builds.app_store_version.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/appStoreVersion",
    "description": "Read only the ID of the App Store version linked to a build.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.app.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/app",
    "description": "Read the app for a build.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.app.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/app",
    "description": "Read only the ID of the app linked to a build.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.beta_app_review_submission.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/betaAppReviewSubmission",
    "description": "Read only the ID of the beta app review submission linked to a build.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "name": "builds.beta_build_localizations.list_ids",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/betaBuildLocalizations",
    "description": "List only the IDs of the beta build localizations linked to a build. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "builds.beta_build_usages.metrics",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/metrics/betaBuildUsages",
    "description": "Read beta build usages metrics for a build. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "builds.beta_groups.add",
    "domain": "builds",
    "method": "POST",
    "path": "/v1/builds/{id}/relationships/betaGroups",
    "description": "Link beta groups to a build.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildBetaGroupsLinkagesRequest"
  },
  {
    "name": "builds.beta_groups.remove",
    "domain": "builds",
    "method": "DELETE",
    "path": "/v1/builds/{id}/relationships/betaGroups",
    "description": "Unlink beta groups from a build.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildBetaGroupsLinkagesRequest"
  },
  {
    "name": "builds.build_beta_detail.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/buildBetaDetail",
    "description": "Read the build beta detail for a build.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "build"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.build_beta_detail.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/buildBetaDetail",
    "description": "Read only the ID of the build beta detail linked to a build.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.diagnostic_signatures.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/diagnosticSignatures",
    "description": "List the diagnostic signatures belonging to a build.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      }
    ],
    "hasBody": false
  },
  {
    "name": "builds.diagnostic_signatures.list_ids",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/diagnosticSignatures",
    "description": "List only the IDs of the diagnostic signatures linked to a build. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "builds.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}",
    "description": "Read one build by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "name": "builds.icons.list_ids",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/icons",
    "description": "List only the IDs of the icons linked to a build. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildIndividualTestersLinkagesRequest"
  },
  {
    "name": "builds.individual_testers.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/individualTesters",
    "description": "List the individual testers belonging to a build.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "builds.individual_testers.list_ids",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/individualTesters",
    "description": "List only the IDs of the individual testers linked to a build. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildIndividualTestersLinkagesRequest"
  },
  {
    "name": "builds.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds",
    "description": "List builds.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'preReleaseVersion'"
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app'"
      },
      {
        "name": "filter[betaGroups]",
        "type": "array",
        "description": "filter by id(s) of related 'betaGroups'"
      },
      {
        "name": "filter[appStoreVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersion'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "hasBody": false
  },
  {
    "name": "builds.pre_release_version.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/preReleaseVersion",
    "description": "Read the pre release version for a build.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "builds.pre_release_version.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/builds/{id}/relationships/preReleaseVersion",
    "description": "Read only the ID of the pre release version linked to a build.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BuildUpdateRequest"
  },
  {
    "name": "bundle_id_capabilities.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/bundleIdCapabilities",
    "description": "Create a bundle ID capability.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BundleIdCapabilityCreateRequest"
  },
  {
    "name": "bundle_id_capabilities.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/bundleIdCapabilities/{id}",
    "description": "Delete a bundle ID capability.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "bundle_id_capabilities.update",
    "domain": "provisioning",
    "method": "PATCH",
    "path": "/v1/bundleIdCapabilities/{id}",
    "description": "Update a bundle ID capability.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BundleIdCapabilityUpdateRequest"
  },
  {
    "name": "bundle_ids.app.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds/{id}/app",
    "description": "Read the app for a bundle ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "bundle_ids.app.get_id",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds/{id}/relationships/app",
    "description": "Read only the ID of the app linked to a bundle ID.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "name": "bundle_ids.bundle_id_capabilities.list_ids",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds/{id}/relationships/bundleIdCapabilities",
    "description": "List only the IDs of the bundle ID capabilities linked to a bundle ID. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "bundle_ids.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/bundleIds",
    "description": "Register a new bundle identifier before creating provisioning profiles for it.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BundleIdCreateRequest"
  },
  {
    "name": "bundle_ids.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/bundleIds/{id}",
    "description": "Delete a bundle ID.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "bundle_ids.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds/{id}",
    "description": "Read one bundle ID by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "name": "bundle_ids.profiles.list_ids",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/bundleIds/{id}/relationships/profiles",
    "description": "List only the IDs of the profiles linked to a bundle ID. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "bundle_ids.update",
    "domain": "provisioning",
    "method": "PATCH",
    "path": "/v1/bundleIds/{id}",
    "description": "Update a bundle ID.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "BundleIdUpdateRequest"
  },
  {
    "name": "certificates.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/certificates",
    "description": "Create a certificate.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CertificateCreateRequest"
  },
  {
    "name": "certificates.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/certificates/{id}",
    "description": "Delete a certificate.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "certificates.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/certificates/{id}",
    "description": "Read one certificate by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "certificates"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "certificates.pass_type_id.get_id",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/certificates/{id}/relationships/passTypeId",
    "description": "Read only the ID of the pass type ID linked to a certificate.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "certificates.update",
    "domain": "provisioning",
    "method": "PATCH",
    "path": "/v1/certificates/{id}",
    "description": "Update a certificate.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CertificateUpdateRequest"
  },
  {
    "name": "ci_artifacts.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciArtifacts/{id}",
    "description": "Read one Xcode Cloud artifact by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "ci_build_actions.artifacts.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}/artifacts",
    "description": "List the artifacts belonging to an Xcode Cloud build action.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "ci_build_actions.artifacts.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}/relationships/artifacts",
    "description": "List only the IDs of the artifacts linked to an Xcode Cloud build action. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "ci_build_actions.build_run.get_id",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}/relationships/buildRun",
    "description": "Read only the ID of the build run linked to an Xcode Cloud build action.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "ci_build_actions.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}",
    "description": "Read one Xcode Cloud build action by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "name": "ci_build_actions.issues.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}/relationships/issues",
    "description": "List only the IDs of the issues linked to an Xcode Cloud build action. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "name": "ci_build_actions.test_results.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildActions/{id}/relationships/testResults",
    "description": "List only the IDs of the test results linked to an Xcode Cloud build action. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "buildRun"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_build_runs.actions.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildRuns/{id}/relationships/actions",
    "description": "List only the IDs of the actions linked to an Xcode Cloud build run. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "ci_build_runs.builds.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildRuns/{id}/builds",
    "description": "List the builds belonging to an Xcode Cloud build run.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'preReleaseVersion'"
      },
      {
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app'"
      },
      {
        "name": "filter[betaGroups]",
        "type": "array",
        "description": "filter by id(s) of related 'betaGroups'"
      },
      {
        "name": "filter[appStoreVersion]",
        "type": "array",
        "description": "filter by id(s) of related 'appStoreVersion'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "ci_build_runs.builds.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildRuns/{id}/relationships/builds",
    "description": "List only the IDs of the builds linked to an Xcode Cloud build run. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "ci_build_runs.create",
    "domain": "xcode_cloud",
    "method": "POST",
    "path": "/v1/ciBuildRuns",
    "description": "Start an Xcode Cloud build for a workflow, optionally targeting a specific branch, tag or pull request.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CiBuildRunCreateRequest"
  },
  {
    "name": "ci_build_runs.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciBuildRuns/{id}",
    "description": "Read one Xcode Cloud build run by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "ci_mac_os_versions.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciMacOsVersions/{id}",
    "description": "Read one Xcode Cloud mac os version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "macOsVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_mac_os_versions.xcode_versions.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciMacOsVersions/{id}/relationships/xcodeVersions",
    "description": "List only the IDs of the Xcode versions linked to an Xcode Cloud mac os version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "ci_products.additional_repositories.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/additionalRepositories",
    "description": "List the additional repositories belonging to an Xcode Cloud product.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_products.additional_repositories.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/relationships/additionalRepositories",
    "description": "List only the IDs of the additional repositories linked to an Xcode Cloud product. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "ci_products.app.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/app",
    "description": "Read the app for an Xcode Cloud product.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "ci_products.app.get_id",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/relationships/app",
    "description": "Read only the ID of the app linked to an Xcode Cloud product.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "ci_products.build_runs.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/buildRuns",
    "description": "List the build runs belonging to an Xcode Cloud product.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds'"
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
        "description": "comma-separated list of relationships to include",
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
    "name": "ci_products.build_runs.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/relationships/buildRuns",
    "description": "List only the IDs of the build runs linked to an Xcode Cloud product. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "ci_products.delete",
    "domain": "xcode_cloud",
    "method": "DELETE",
    "path": "/v1/ciProducts/{id}",
    "description": "Delete an Xcode Cloud product.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "ci_products.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}",
    "description": "Read one Xcode Cloud product by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'app'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_products.primary_repositories.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/relationships/primaryRepositories",
    "description": "List only the IDs of the primary repositories linked to an Xcode Cloud product. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "ci_products.workflows.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/workflows",
    "description": "List the workflows belonging to an Xcode Cloud product.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "ci_products.workflows.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciProducts/{id}/relationships/workflows",
    "description": "List only the IDs of the workflows linked to an Xcode Cloud product. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "ci_test_results.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciTestResults/{id}",
    "description": "Read one Xcode Cloud test result by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "ci_workflows.build_runs.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciWorkflows/{id}/buildRuns",
    "description": "List the build runs belonging to an Xcode Cloud workflow.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds'"
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
        "description": "comma-separated list of relationships to include",
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
    "name": "ci_workflows.build_runs.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciWorkflows/{id}/relationships/buildRuns",
    "description": "List only the IDs of the build runs linked to an Xcode Cloud workflow. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "ci_workflows.create",
    "domain": "xcode_cloud",
    "method": "POST",
    "path": "/v1/ciWorkflows",
    "description": "Create an Xcode Cloud workflow.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CiWorkflowCreateRequest"
  },
  {
    "name": "ci_workflows.delete",
    "domain": "xcode_cloud",
    "method": "DELETE",
    "path": "/v1/ciWorkflows/{id}",
    "description": "Delete an Xcode Cloud workflow.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "ci_workflows.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciWorkflows/{id}",
    "description": "Read one Xcode Cloud workflow by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_workflows.repository.get_id",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciWorkflows/{id}/relationships/repository",
    "description": "Read only the ID of the repository linked to an Xcode Cloud workflow.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "ci_workflows.update",
    "domain": "xcode_cloud",
    "method": "PATCH",
    "path": "/v1/ciWorkflows/{id}",
    "description": "Update an Xcode Cloud workflow.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CiWorkflowUpdateRequest"
  },
  {
    "name": "ci_xcode_versions.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciXcodeVersions/{id}",
    "description": "Read one Xcode Cloud Xcode version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "xcodeVersions"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "ci_xcode_versions.mac_os_versions.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/ciXcodeVersions/{id}/relationships/macOsVersions",
    "description": "List only the IDs of the mac os versions linked to an Xcode Cloud Xcode version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "customer_review_responses.create",
    "domain": "reviews",
    "method": "POST",
    "path": "/v1/customerReviewResponses",
    "description": "Publish a developer response to a customer review. One response per review; use update to change it.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "CustomerReviewResponseV1CreateRequest"
  },
  {
    "name": "customer_review_responses.delete",
    "domain": "reviews",
    "method": "DELETE",
    "path": "/v1/customerReviewResponses/{id}",
    "description": "Delete your response to a customer review.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "customer_review_responses.get",
    "domain": "reviews",
    "method": "GET",
    "path": "/v1/customerReviewResponses/{id}",
    "description": "Read one customer review response by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "review"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "customer_reviews.response.get_id",
    "domain": "reviews",
    "method": "GET",
    "path": "/v1/customerReviews/{id}/relationships/response",
    "description": "Read only the ID of the response linked to a customer review.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "devices.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/devices",
    "description": "Register a device UDID so it can be included in development provisioning profiles.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "DeviceCreateRequest"
  },
  {
    "name": "devices.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/devices/{id}",
    "description": "Read one device by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "devices.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/devices",
    "description": "List devices.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "DeviceUpdateRequest"
  },
  {
    "name": "diagnostic_signatures.logs.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/diagnosticSignatures/{id}/logs",
    "description": "List the logs belonging to a diagnostic signature.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "end_app_availability_pre_orders.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/endAppAvailabilityPreOrders",
    "description": "Create an end app availability pre order.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "EndAppAvailabilityPreOrderCreateRequest"
  },
  {
    "name": "end_user_license_agreements.create",
    "domain": "apps",
    "method": "POST",
    "path": "/v1/endUserLicenseAgreements",
    "description": "Create an end user license agreement.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "EndUserLicenseAgreementCreateRequest"
  },
  {
    "name": "end_user_license_agreements.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/endUserLicenseAgreements/{id}",
    "description": "Delete an end user license agreement.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "end_user_license_agreements.get",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/endUserLicenseAgreements/{id}",
    "description": "Read one end user license agreement by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "name": "end_user_license_agreements.territories.list_ids",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/endUserLicenseAgreements/{id}/relationships/territories",
    "description": "List only the IDs of the territories linked to an end user license agreement. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "end_user_license_agreements.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/endUserLicenseAgreements/{id}",
    "description": "Update an end user license agreement.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "EndUserLicenseAgreementUpdateRequest"
  },
  {
    "name": "finance_reports.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/financeReports",
    "description": "List finance reports.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementImageV2CreateRequest"
  },
  {
    "name": "game_center_achievement_images_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterAchievementImages/{id}",
    "description": "Delete a Game Center achievement images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_images_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementImages/{id}",
    "description": "Read one Game Center achievement images (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementImageV2UpdateRequest"
  },
  {
    "name": "game_center_achievement_images.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterAchievementImages",
    "description": "Create a Game Center achievement image. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementImageCreateRequest"
  },
  {
    "name": "game_center_achievement_images.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterAchievementImages/{id}",
    "description": "Delete a Game Center achievement image. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_images.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievementImages/{id}",
    "description": "Read one Game Center achievement image by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterAchievementLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_images.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterAchievementImages/{id}",
    "description": "Update a Game Center achievement image. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementImageUpdateRequest"
  },
  {
    "name": "game_center_achievement_localizations_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterAchievementLocalizations",
    "description": "Create a Game Center achievement localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementLocalizationV2CreateRequest"
  },
  {
    "name": "game_center_achievement_localizations_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterAchievementLocalizations/{id}",
    "description": "Delete a Game Center achievement localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementLocalizations/{id}",
    "description": "Read one Game Center achievement localizations (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "localization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations_v2.image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementLocalizations/{id}/relationships/image",
    "description": "Read only the ID of the image linked to a Game Center achievement localizations (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterAchievementLocalizations/{id}",
    "description": "Update a Game Center achievement localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementLocalizationV2UpdateRequest"
  },
  {
    "name": "game_center_achievement_localizations.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterAchievementLocalizations",
    "description": "Create a Game Center achievement localization. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementLocalizationCreateRequest"
  },
  {
    "name": "game_center_achievement_localizations.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterAchievementLocalizations/{id}",
    "description": "Delete a Game Center achievement localization. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations.game_center_achievement_image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievementLocalizations/{id}/gameCenterAchievementImage",
    "description": "Read the Game Center achievement image for a Game Center achievement localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterAchievementLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations.game_center_achievement_image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievementLocalizations/{id}/relationships/gameCenterAchievementImage",
    "description": "Read only the ID of the Game Center achievement image linked to a Game Center achievement localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations.game_center_achievement.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievementLocalizations/{id}/gameCenterAchievement",
    "description": "Read the Game Center achievement for a Game Center achievement localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupAchievement",
          "localizations",
          "releases",
          "activity"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations.game_center_achievement.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievementLocalizations/{id}/relationships/gameCenterAchievement",
    "description": "Read only the ID of the Game Center achievement linked to a Game Center achievement localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievementLocalizations/{id}",
    "description": "Read one Game Center achievement localization by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterAchievement",
          "gameCenterAchievementImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_localizations.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterAchievementLocalizations/{id}",
    "description": "Update a Game Center achievement localization. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementLocalizationUpdateRequest"
  },
  {
    "name": "game_center_achievement_releases.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterAchievementReleases",
    "description": "Create a Game Center achievement release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementReleaseCreateRequest"
  },
  {
    "name": "game_center_achievement_releases.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterAchievementReleases/{id}",
    "description": "Delete a Game Center achievement release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_releases.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievementReleases/{id}",
    "description": "Read one Game Center achievement release by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterAchievement"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_versions_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterAchievementVersions",
    "description": "Create a Game Center achievement versions (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementVersionV2CreateRequest"
  },
  {
    "name": "game_center_achievement_versions_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementVersions/{id}",
    "description": "Read one Game Center achievement versions (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievement_versions_v2.localizations.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievementVersions/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a Game Center achievement versions (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_achievements_v2.activity.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterAchievements/{id}/relationships/activity",
    "description": "Set the activity linked to a Game Center achievements (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementV2ActivityLinkageRequest"
  },
  {
    "name": "game_center_achievements_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterAchievements",
    "description": "Create a Game Center achievements (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementV2CreateRequest"
  },
  {
    "name": "game_center_achievements_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterAchievements/{id}",
    "description": "Delete a Game Center achievements (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievements_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievements/{id}",
    "description": "Read one Game Center achievements (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementV2UpdateRequest"
  },
  {
    "name": "game_center_achievements_v2.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievements/{id}/versions",
    "description": "List the versions belonging to a Game Center achievements (v2).",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "achievement",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievements_v2.versions.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterAchievements/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to a Game Center achievements (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_achievements.activity.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterAchievements/{id}/relationships/activity",
    "description": "Set the activity linked to a Game Center achievement. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementActivityLinkageRequest"
  },
  {
    "name": "game_center_achievements.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterAchievements",
    "description": "Create a Game Center achievement. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementCreateRequest"
  },
  {
    "name": "game_center_achievements.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterAchievements/{id}",
    "description": "Delete a Game Center achievement. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievements.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievements/{id}",
    "description": "Read one Game Center achievement by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupAchievement",
          "localizations",
          "releases",
          "activity"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievements.group_achievement.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievements/{id}/groupAchievement",
    "description": "Read the group achievement for a Game Center achievement. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupAchievement",
          "localizations",
          "releases",
          "activity"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievements.group_achievement.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievements/{id}/relationships/groupAchievement",
    "description": "Read only the ID of the group achievement linked to a Game Center achievement. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_achievements.group_achievement.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterAchievements/{id}/relationships/groupAchievement",
    "description": "Set the group achievement linked to a Game Center achievement. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementGroupAchievementLinkageRequest"
  },
  {
    "name": "game_center_achievements.localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievements/{id}/localizations",
    "description": "List the localizations belonging to a Game Center achievement. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterAchievement",
          "gameCenterAchievementImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievements.localizations.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievements/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a Game Center achievement. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_achievements.releases.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievements/{id}/releases",
    "description": "List the releases belonging to a Game Center achievement. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[live]",
        "type": "array",
        "description": "filter by attribute 'live'"
      },
      {
        "name": "filter[gameCenterDetail]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterDetail'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterAchievement"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_achievements.releases.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAchievements/{id}/relationships/releases",
    "description": "List only the IDs of the releases linked to a Game Center achievement. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_achievements.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterAchievements/{id}",
    "description": "Update a Game Center achievement. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAchievementUpdateRequest"
  },
  {
    "name": "game_center_activities.achievements_v2.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivities/{id}/relationships/achievementsV2",
    "description": "Link achievements (v2) to a Game Center activity.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityAchievementsV2LinkagesRequest"
  },
  {
    "name": "game_center_activities.achievements_v2.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivities/{id}/relationships/achievementsV2",
    "description": "Unlink achievements (v2) from a Game Center activity.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityAchievementsV2LinkagesRequest"
  },
  {
    "name": "game_center_activities.achievements.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivities/{id}/relationships/achievements",
    "description": "Link achievements to a Game Center activity. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityAchievementsLinkagesRequest"
  },
  {
    "name": "game_center_activities.achievements.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivities/{id}/relationships/achievements",
    "description": "Unlink achievements from a Game Center activity. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityAchievementsLinkagesRequest"
  },
  {
    "name": "game_center_activities.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivities",
    "description": "Create a Game Center activity.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityCreateRequest"
  },
  {
    "name": "game_center_activities.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivities/{id}",
    "description": "Delete a Game Center activity.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_activities.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivities/{id}",
    "description": "Read one Game Center activity by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLeaderboardsV2LinkagesRequest"
  },
  {
    "name": "game_center_activities.leaderboards_v2.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivities/{id}/relationships/leaderboardsV2",
    "description": "Unlink leaderboards (v2) from a Game Center activity.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLeaderboardsV2LinkagesRequest"
  },
  {
    "name": "game_center_activities.leaderboards.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivities/{id}/relationships/leaderboards",
    "description": "Link leaderboards to a Game Center activity. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_activities.leaderboards.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivities/{id}/relationships/leaderboards",
    "description": "Unlink leaderboards from a Game Center activity. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_activities.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterActivities/{id}",
    "description": "Update a Game Center activity.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityUpdateRequest"
  },
  {
    "name": "game_center_activities.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivities/{id}/versions",
    "description": "List the versions belonging to a Game Center activity.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_activities.versions.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivities/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to a Game Center activity. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_activity_images.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivityImages",
    "description": "Create a Game Center activity image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityImageCreateRequest"
  },
  {
    "name": "game_center_activity_images.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivityImages/{id}",
    "description": "Delete a Game Center activity image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_activity_images.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityImages/{id}",
    "description": "Read one Game Center activity image by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_activity_images.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterActivityImages/{id}",
    "description": "Update a Game Center activity image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityImageUpdateRequest"
  },
  {
    "name": "game_center_activity_localizations.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivityLocalizations",
    "description": "Create a Game Center activity localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLocalizationCreateRequest"
  },
  {
    "name": "game_center_activity_localizations.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivityLocalizations/{id}",
    "description": "Delete a Game Center activity localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_activity_localizations.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityLocalizations/{id}",
    "description": "Read one Game Center activity localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_activity_localizations.image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityLocalizations/{id}/relationships/image",
    "description": "Read only the ID of the image linked to a Game Center activity localization.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityLocalizationUpdateRequest"
  },
  {
    "name": "game_center_activity_version_releases.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivityVersionReleases",
    "description": "Create a Game Center activity version release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityVersionReleaseCreateRequest"
  },
  {
    "name": "game_center_activity_version_releases.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterActivityVersionReleases/{id}",
    "description": "Delete a Game Center activity version release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_activity_version_releases.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityVersionReleases/{id}",
    "description": "Read one Game Center activity version release by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_activity_versions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterActivityVersions",
    "description": "Create a Game Center activity version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityVersionCreateRequest"
  },
  {
    "name": "game_center_activity_versions.default_image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityVersions/{id}/defaultImage",
    "description": "Read the default image for a Game Center activity version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_activity_versions.default_image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityVersions/{id}/relationships/defaultImage",
    "description": "Read only the ID of the default image linked to a Game Center activity version.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_activity_versions.localizations.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterActivityVersions/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a Game Center activity version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_activity_versions.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterActivityVersions/{id}",
    "description": "Update a Game Center activity version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterActivityVersionUpdateRequest"
  },
  {
    "name": "game_center_app_versions.app_store_version.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAppVersions/{id}/appStoreVersion",
    "description": "Read the App Store version for a Game Center app version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_app_versions.app_store_version.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAppVersions/{id}/relationships/appStoreVersion",
    "description": "Read only the ID of the App Store version linked to a Game Center app version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_app_versions.compatibility_versions.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterAppVersions/{id}/relationships/compatibilityVersions",
    "description": "Link compatibility versions to a Game Center app version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAppVersionCompatibilityVersionsLinkagesRequest"
  },
  {
    "name": "game_center_app_versions.compatibility_versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAppVersions/{id}/compatibilityVersions",
    "description": "List the compatibility versions belonging to a Game Center app version.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "compatibilityVersions",
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_app_versions.compatibility_versions.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAppVersions/{id}/relationships/compatibilityVersions",
    "description": "List only the IDs of the compatibility versions linked to a Game Center app version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_app_versions.compatibility_versions.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterAppVersions/{id}/relationships/compatibilityVersions",
    "description": "Unlink compatibility versions from a Game Center app version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAppVersionCompatibilityVersionsLinkagesRequest"
  },
  {
    "name": "game_center_app_versions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterAppVersions",
    "description": "Create a Game Center app version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAppVersionCreateRequest"
  },
  {
    "name": "game_center_app_versions.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterAppVersions/{id}",
    "description": "Read one Game Center app version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterAppVersionUpdateRequest"
  },
  {
    "name": "game_center_challenge_images.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterChallengeImages",
    "description": "Create a Game Center challenge image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeImageCreateRequest"
  },
  {
    "name": "game_center_challenge_images.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterChallengeImages/{id}",
    "description": "Delete a Game Center challenge image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_images.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeImages/{id}",
    "description": "Read one Game Center challenge image by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_images.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterChallengeImages/{id}",
    "description": "Update a Game Center challenge image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeImageUpdateRequest"
  },
  {
    "name": "game_center_challenge_localizations.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterChallengeLocalizations",
    "description": "Create a Game Center challenge localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeLocalizationCreateRequest"
  },
  {
    "name": "game_center_challenge_localizations.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterChallengeLocalizations/{id}",
    "description": "Delete a Game Center challenge localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_localizations.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeLocalizations/{id}",
    "description": "Read one Game Center challenge localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_localizations.image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeLocalizations/{id}/relationships/image",
    "description": "Read only the ID of the image linked to a Game Center challenge localization.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeLocalizationUpdateRequest"
  },
  {
    "name": "game_center_challenge_version_releases.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterChallengeVersionReleases",
    "description": "Create a Game Center challenge version release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeVersionReleaseCreateRequest"
  },
  {
    "name": "game_center_challenge_version_releases.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterChallengeVersionReleases/{id}",
    "description": "Delete a Game Center challenge version release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_version_releases.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeVersionReleases/{id}",
    "description": "Read one Game Center challenge version release by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_versions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterChallengeVersions",
    "description": "Create a Game Center challenge version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeVersionCreateRequest"
  },
  {
    "name": "game_center_challenge_versions.default_image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeVersions/{id}/defaultImage",
    "description": "Read the default image for a Game Center challenge version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_versions.default_image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeVersions/{id}/relationships/defaultImage",
    "description": "Read only the ID of the default image linked to a Game Center challenge version.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_challenge_versions.localizations.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallengeVersions/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a Game Center challenge version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_challenges.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterChallenges",
    "description": "Create a Game Center challenge.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeCreateRequest"
  },
  {
    "name": "game_center_challenges.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterChallenges/{id}",
    "description": "Delete a Game Center challenge.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_challenges.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallenges/{id}",
    "description": "Read one Game Center challenge by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeLeaderboardV2LinkageRequest"
  },
  {
    "name": "game_center_challenges.leaderboard.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterChallenges/{id}/relationships/leaderboard",
    "description": "Set the leaderboard linked to a Game Center challenge. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeLeaderboardLinkageRequest"
  },
  {
    "name": "game_center_challenges.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterChallenges/{id}",
    "description": "Update a Game Center challenge.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterChallengeUpdateRequest"
  },
  {
    "name": "game_center_challenges.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallenges/{id}/versions",
    "description": "List the versions belonging to a Game Center challenge.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_challenges.versions.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterChallenges/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to a Game Center challenge. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_details.achievement_releases.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/achievementReleases",
    "description": "List the achievement releases belonging to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[live]",
        "type": "array",
        "description": "filter by attribute 'live'"
      },
      {
        "name": "filter[gameCenterAchievement]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterAchievement'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterAchievement"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.achievement_releases.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/achievementReleases",
    "description": "List only the IDs of the achievement releases linked to a Game Center detail. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_details.activity_releases.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/activityReleases",
    "description": "List the activity releases belonging to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.activity_releases.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/activityReleases",
    "description": "List only the IDs of the activity releases linked to a Game Center detail. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_details.challenge_releases.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/challengeReleases",
    "description": "List the challenge releases belonging to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.challenge_releases.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/challengeReleases",
    "description": "List only the IDs of the challenge releases linked to a Game Center detail. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailChallengesMinimumPlatformVersionsLinkagesRequest"
  },
  {
    "name": "game_center_details.classic_matchmaking_requests.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/metrics/classicMatchmakingRequests",
    "description": "Read classic matchmaking requests metrics for a Game Center detail. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailCreateRequest"
  },
  {
    "name": "game_center_details.game_center_achievements_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterAchievementsV2",
    "description": "List the Game Center achievements (v2) belonging to a Game Center detail.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_details.game_center_achievements_v2.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterAchievementsV2",
    "description": "List only the IDs of the Game Center achievements (v2) linked to a Game Center detail. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_details.game_center_achievements_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterAchievementsV2",
    "description": "Replace the full set of Game Center achievements (v2) linked to a Game Center detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailGameCenterAchievementsV2LinkagesRequest"
  },
  {
    "name": "game_center_details.game_center_achievements.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterAchievements",
    "description": "List the Game Center achievements belonging to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupAchievement",
          "localizations",
          "releases",
          "activity"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_achievements.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterAchievements",
    "description": "List only the IDs of the Game Center achievements linked to a Game Center detail. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_details.game_center_achievements.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterAchievements",
    "description": "Replace the full set of Game Center achievements linked to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailGameCenterAchievementsLinkagesRequest"
  },
  {
    "name": "game_center_details.game_center_activities.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterActivities",
    "description": "List the Game Center activities belonging to a Game Center detail.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_details.game_center_activities.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterActivities",
    "description": "List only the IDs of the Game Center activities linked to a Game Center detail. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_details.game_center_app_versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterAppVersions",
    "description": "List the Game Center app versions belonging to a Game Center detail.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "compatibilityVersions",
          "appStoreVersion"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_app_versions.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterAppVersions",
    "description": "List only the IDs of the Game Center app versions linked to a Game Center detail. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_details.game_center_challenges.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterChallenges",
    "description": "List the Game Center challenges belonging to a Game Center detail.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_details.game_center_challenges.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterChallenges",
    "description": "List only the IDs of the Game Center challenges linked to a Game Center detail. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_details.game_center_group.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterGroup",
    "description": "Read the Game Center group for a Game Center detail.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_details.game_center_group.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterGroup",
    "description": "Read only the ID of the Game Center group linked to a Game Center detail.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_leaderboard_sets_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterLeaderboardSetsV2",
    "description": "List the Game Center leaderboard sets (v2) belonging to a Game Center detail.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_details.game_center_leaderboard_sets_v2.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboardSetsV2",
    "description": "List only the IDs of the Game Center leaderboard sets (v2) linked to a Game Center detail. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_details.game_center_leaderboard_sets_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboardSetsV2",
    "description": "Replace the full set of Game Center leaderboard sets (v2) linked to a Game Center detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailGameCenterLeaderboardSetsV2LinkagesRequest"
  },
  {
    "name": "game_center_details.game_center_leaderboard_sets.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterLeaderboardSets",
    "description": "List the Game Center leaderboard sets belonging to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboardSet",
          "localizations",
          "gameCenterLeaderboards",
          "releases"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_leaderboard_sets.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboardSets",
    "description": "List only the IDs of the Game Center leaderboard sets linked to a Game Center detail. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_details.game_center_leaderboard_sets.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboardSets",
    "description": "Replace the full set of Game Center leaderboard sets linked to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailGameCenterLeaderboardSetsLinkagesRequest"
  },
  {
    "name": "game_center_details.game_center_leaderboards_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterLeaderboardsV2",
    "description": "List the Game Center leaderboards (v2) belonging to a Game Center detail.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_details.game_center_leaderboards_v2.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboardsV2",
    "description": "List only the IDs of the Game Center leaderboards (v2) linked to a Game Center detail. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_details.game_center_leaderboards_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboardsV2",
    "description": "Replace the full set of Game Center leaderboards (v2) linked to a Game Center detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailGameCenterLeaderboardsV2LinkagesRequest"
  },
  {
    "name": "game_center_details.game_center_leaderboards.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/gameCenterLeaderboards",
    "description": "List the Game Center leaderboards belonging to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboard",
          "gameCenterLeaderboardSets",
          "localizations",
          "releases",
          "activity",
          "challenge"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.game_center_leaderboards.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboards",
    "description": "List only the IDs of the Game Center leaderboards linked to a Game Center detail. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_details.game_center_leaderboards.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterDetails/{id}/relationships/gameCenterLeaderboards",
    "description": "Replace the full set of Game Center leaderboards linked to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailGameCenterLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_details.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}",
    "description": "Read one Game Center detail by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_details.leaderboard_releases.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/leaderboardReleases",
    "description": "List the leaderboard releases belonging to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[live]",
        "type": "array",
        "description": "filter by attribute 'live'"
      },
      {
        "name": "filter[gameCenterLeaderboard]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterLeaderboard'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterLeaderboard"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.leaderboard_releases.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/leaderboardReleases",
    "description": "List only the IDs of the leaderboard releases linked to a Game Center detail. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_details.leaderboard_set_releases.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/leaderboardSetReleases",
    "description": "List the leaderboard set releases belonging to a Game Center detail. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[live]",
        "type": "array",
        "description": "filter by attribute 'live'"
      },
      {
        "name": "filter[gameCenterLeaderboardSet]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterLeaderboardSet'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterLeaderboardSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_details.leaderboard_set_releases.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/relationships/leaderboardSetReleases",
    "description": "List only the IDs of the leaderboard set releases linked to a Game Center detail. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_details.rule_based_matchmaking_requests.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterDetails/{id}/metrics/ruleBasedMatchmakingRequests",
    "description": "Read rule based matchmaking requests metrics for a Game Center detail. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterDetailUpdateRequest"
  },
  {
    "name": "game_center_enabled_versions.compatible_versions.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterEnabledVersions/{id}/relationships/compatibleVersions",
    "description": "Link compatible versions to a Game Center enabled version. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterEnabledVersionCompatibleVersionsLinkagesRequest"
  },
  {
    "name": "game_center_enabled_versions.compatible_versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterEnabledVersions/{id}/compatibleVersions",
    "description": "List the compatible versions belonging to a Game Center enabled version. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "name": "filter[app]",
        "type": "array",
        "description": "filter by id(s) of related 'app'"
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
          "versionString",
          "-versionString"
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "compatibleVersions",
          "app"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_enabled_versions.compatible_versions.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterEnabledVersions/{id}/relationships/compatibleVersions",
    "description": "List only the IDs of the compatible versions linked to a Game Center enabled version. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_enabled_versions.compatible_versions.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterEnabledVersions/{id}/relationships/compatibleVersions",
    "description": "Unlink compatible versions from a Game Center enabled version. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterEnabledVersionCompatibleVersionsLinkagesRequest"
  },
  {
    "name": "game_center_enabled_versions.compatible_versions.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterEnabledVersions/{id}/relationships/compatibleVersions",
    "description": "Replace the full set of compatible versions linked to a Game Center enabled version. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterEnabledVersionCompatibleVersionsLinkagesRequest"
  },
  {
    "name": "game_center_groups.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterGroups",
    "description": "Create a Game Center group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupCreateRequest"
  },
  {
    "name": "game_center_groups.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterGroups/{id}",
    "description": "Delete a Game Center group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_achievements_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterAchievementsV2",
    "description": "List the Game Center achievements (v2) belonging to a Game Center group.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_groups.game_center_achievements_v2.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterAchievementsV2",
    "description": "List only the IDs of the Game Center achievements (v2) linked to a Game Center group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_groups.game_center_achievements_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterAchievementsV2",
    "description": "Replace the full set of Game Center achievements (v2) linked to a Game Center group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupGameCenterAchievementsV2LinkagesRequest"
  },
  {
    "name": "game_center_groups.game_center_achievements.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterAchievements",
    "description": "List the Game Center achievements belonging to a Game Center group. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupAchievement",
          "localizations",
          "releases",
          "activity"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_achievements.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterAchievements",
    "description": "List only the IDs of the Game Center achievements linked to a Game Center group. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_groups.game_center_achievements.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterAchievements",
    "description": "Replace the full set of Game Center achievements linked to a Game Center group. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupGameCenterAchievementsLinkagesRequest"
  },
  {
    "name": "game_center_groups.game_center_activities.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterActivities",
    "description": "List the Game Center activities belonging to a Game Center group.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_groups.game_center_activities.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterActivities",
    "description": "List only the IDs of the Game Center activities linked to a Game Center group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_groups.game_center_challenges.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterChallenges",
    "description": "List the Game Center challenges belonging to a Game Center group.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_groups.game_center_challenges.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterChallenges",
    "description": "List only the IDs of the Game Center challenges linked to a Game Center group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_groups.game_center_details.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterDetails",
    "description": "List the Game Center details belonging to a Game Center group.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_groups.game_center_details.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterDetails",
    "description": "List only the IDs of the Game Center details linked to a Game Center group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_groups.game_center_leaderboard_sets_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterLeaderboardSetsV2",
    "description": "List the Game Center leaderboard sets (v2) belonging to a Game Center group.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_groups.game_center_leaderboard_sets_v2.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboardSetsV2",
    "description": "List only the IDs of the Game Center leaderboard sets (v2) linked to a Game Center group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_groups.game_center_leaderboard_sets_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboardSetsV2",
    "description": "Replace the full set of Game Center leaderboard sets (v2) linked to a Game Center group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupGameCenterLeaderboardSetsV2LinkagesRequest"
  },
  {
    "name": "game_center_groups.game_center_leaderboard_sets.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterLeaderboardSets",
    "description": "List the Game Center leaderboard sets belonging to a Game Center group. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboardSet",
          "localizations",
          "gameCenterLeaderboards",
          "releases"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_leaderboard_sets.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboardSets",
    "description": "List only the IDs of the Game Center leaderboard sets linked to a Game Center group. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_groups.game_center_leaderboard_sets.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboardSets",
    "description": "Replace the full set of Game Center leaderboard sets linked to a Game Center group. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupGameCenterLeaderboardSetsLinkagesRequest"
  },
  {
    "name": "game_center_groups.game_center_leaderboards_v2.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterLeaderboardsV2",
    "description": "List the Game Center leaderboards (v2) belonging to a Game Center group.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_groups.game_center_leaderboards_v2.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboardsV2",
    "description": "List only the IDs of the Game Center leaderboards (v2) linked to a Game Center group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_groups.game_center_leaderboards_v2.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboardsV2",
    "description": "Replace the full set of Game Center leaderboards (v2) linked to a Game Center group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupGameCenterLeaderboardsV2LinkagesRequest"
  },
  {
    "name": "game_center_groups.game_center_leaderboards.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/gameCenterLeaderboards",
    "description": "List the Game Center leaderboards belonging to a Game Center group. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboard",
          "gameCenterLeaderboardSets",
          "localizations",
          "releases",
          "activity",
          "challenge"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_groups.game_center_leaderboards.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboards",
    "description": "List only the IDs of the Game Center leaderboards linked to a Game Center group. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_groups.game_center_leaderboards.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterGroups/{id}/relationships/gameCenterLeaderboards",
    "description": "Replace the full set of Game Center leaderboards linked to a Game Center group. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupGameCenterLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_groups.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterGroups/{id}",
    "description": "Read one Game Center group by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[gameCenterDetails]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterDetails'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterGroupUpdateRequest"
  },
  {
    "name": "game_center_leaderboard_entry_submissions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardEntrySubmissions",
    "description": "Create a Game Center leaderboard entry submission.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardEntrySubmissionCreateRequest"
  },
  {
    "name": "game_center_leaderboard_images_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardImages",
    "description": "Create a Game Center leaderboard images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardImageV2CreateRequest"
  },
  {
    "name": "game_center_leaderboard_images_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardImages/{id}",
    "description": "Delete a Game Center leaderboard images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_images_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardImages/{id}",
    "description": "Read one Game Center leaderboard images (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardImageV2UpdateRequest"
  },
  {
    "name": "game_center_leaderboard_images.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardImages",
    "description": "Create a Game Center leaderboard image. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardImageCreateRequest"
  },
  {
    "name": "game_center_leaderboard_images.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardImages/{id}",
    "description": "Delete a Game Center leaderboard image. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_images.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardImages/{id}",
    "description": "Read one Game Center leaderboard image by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterLeaderboardLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_images.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboardImages/{id}",
    "description": "Update a Game Center leaderboard image. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardImageUpdateRequest"
  },
  {
    "name": "game_center_leaderboard_localizations_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardLocalizations",
    "description": "Create a Game Center leaderboard localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardLocalizationV2CreateRequest"
  },
  {
    "name": "game_center_leaderboard_localizations_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardLocalizations/{id}",
    "description": "Delete a Game Center leaderboard localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_localizations_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardLocalizations/{id}",
    "description": "Read one Game Center leaderboard localizations (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "localization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_localizations_v2.image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardLocalizations/{id}/relationships/image",
    "description": "Read only the ID of the image linked to a Game Center leaderboard localizations (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_localizations_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboardLocalizations/{id}",
    "description": "Update a Game Center leaderboard localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardLocalizationV2UpdateRequest"
  },
  {
    "name": "game_center_leaderboard_localizations.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardLocalizations",
    "description": "Create a Game Center leaderboard localization. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardLocalizationCreateRequest"
  },
  {
    "name": "game_center_leaderboard_localizations.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardLocalizations/{id}",
    "description": "Delete a Game Center leaderboard localization. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_localizations.game_center_leaderboard_image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardLocalizations/{id}/gameCenterLeaderboardImage",
    "description": "Read the Game Center leaderboard image for a Game Center leaderboard localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterLeaderboardLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_localizations.game_center_leaderboard_image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardLocalizations/{id}/relationships/gameCenterLeaderboardImage",
    "description": "Read only the ID of the Game Center leaderboard image linked to a Game Center leaderboard localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_localizations.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardLocalizations/{id}",
    "description": "Read one Game Center leaderboard localization by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterLeaderboard",
          "gameCenterLeaderboardImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_localizations.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboardLocalizations/{id}",
    "description": "Update a Game Center leaderboard localization. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardLocalizationUpdateRequest"
  },
  {
    "name": "game_center_leaderboard_releases.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardReleases",
    "description": "Create a Game Center leaderboard release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardReleaseCreateRequest"
  },
  {
    "name": "game_center_leaderboard_releases.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardReleases/{id}",
    "description": "Delete a Game Center leaderboard release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_releases.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardReleases/{id}",
    "description": "Read one Game Center leaderboard release by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterLeaderboard"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_images_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSetImages",
    "description": "Create a Game Center leaderboard set images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetImageV2CreateRequest"
  },
  {
    "name": "game_center_leaderboard_set_images_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardSetImages/{id}",
    "description": "Delete a Game Center leaderboard set images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_images_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetImages/{id}",
    "description": "Read one Game Center leaderboard set images (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetImageV2UpdateRequest"
  },
  {
    "name": "game_center_leaderboard_set_images.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardSetImages",
    "description": "Create a Game Center leaderboard set image. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetImageCreateRequest"
  },
  {
    "name": "game_center_leaderboard_set_images.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardSetImages/{id}",
    "description": "Delete a Game Center leaderboard set image. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_images.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetImages/{id}",
    "description": "Read one Game Center leaderboard set image by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterLeaderboardSetLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_images.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboardSetImages/{id}",
    "description": "Update a Game Center leaderboard set image. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetImageUpdateRequest"
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSetLocalizations",
    "description": "Create a Game Center leaderboard set localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetLocalizationV2CreateRequest"
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardSetLocalizations/{id}",
    "description": "Delete a Game Center leaderboard set localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetLocalizations/{id}",
    "description": "Read one Game Center leaderboard set localizations (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "localization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetLocalizations/{id}/relationships/image",
    "description": "Read only the ID of the image linked to a Game Center leaderboard set localizations (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_localizations_v2.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboardSetLocalizations/{id}",
    "description": "Update a Game Center leaderboard set localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetLocalizationV2UpdateRequest"
  },
  {
    "name": "game_center_leaderboard_set_localizations.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardSetLocalizations",
    "description": "Create a Game Center leaderboard set localization. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetLocalizationCreateRequest"
  },
  {
    "name": "game_center_leaderboard_set_localizations.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardSetLocalizations/{id}",
    "description": "Delete a Game Center leaderboard set localization. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_localizations.game_center_leaderboard_set_image.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetLocalizations/{id}/gameCenterLeaderboardSetImage",
    "description": "Read the Game Center leaderboard set image for a Game Center leaderboard set localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterLeaderboardSetLocalization"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_localizations.game_center_leaderboard_set_image.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetLocalizations/{id}/relationships/gameCenterLeaderboardSetImage",
    "description": "Read only the ID of the Game Center leaderboard set image linked to a Game Center leaderboard set localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_localizations.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetLocalizations/{id}",
    "description": "Read one Game Center leaderboard set localization by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterLeaderboardSet",
          "gameCenterLeaderboardSetImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_localizations.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboardSetLocalizations/{id}",
    "description": "Update a Game Center leaderboard set localization. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetLocalizationUpdateRequest"
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations",
    "description": "Create a Game Center leaderboard set member localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetMemberLocalizationCreateRequest"
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations/{id}",
    "description": "Delete a Game Center leaderboard set member localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.game_center_leaderboard_set.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations/{id}/gameCenterLeaderboardSet",
    "description": "Read the Game Center leaderboard set for a Game Center leaderboard set member localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboardSet",
          "localizations",
          "gameCenterLeaderboards",
          "releases"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.game_center_leaderboard_set.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations/{id}/relationships/gameCenterLeaderboardSet",
    "description": "Read only the ID of the Game Center leaderboard set linked to a Game Center leaderboard set member localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.game_center_leaderboard.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations/{id}/gameCenterLeaderboard",
    "description": "Read the Game Center leaderboard for a Game Center leaderboard set member localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboard",
          "gameCenterLeaderboardSets",
          "localizations",
          "releases",
          "activity",
          "challenge"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.game_center_leaderboard.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations/{id}/relationships/gameCenterLeaderboard",
    "description": "Read only the ID of the Game Center leaderboard linked to a Game Center leaderboard set member localization. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_member_localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetMemberLocalizations",
    "description": "List Game Center leaderboard set member localizations.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "filter[gameCenterLeaderboardSet]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterLeaderboardSet'",
        "required": true
      },
      {
        "name": "filter[gameCenterLeaderboard]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterLeaderboard'",
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
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetMemberLocalizationUpdateRequest"
  },
  {
    "name": "game_center_leaderboard_set_releases.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardSetReleases",
    "description": "Create a Game Center leaderboard set release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetReleaseCreateRequest"
  },
  {
    "name": "game_center_leaderboard_set_releases.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardSetReleases/{id}",
    "description": "Delete a Game Center leaderboard set release. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_releases.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSetReleases/{id}",
    "description": "Read one Game Center leaderboard set release by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterLeaderboardSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_versions_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSetVersions",
    "description": "Create a Game Center leaderboard set versions (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetVersionV2CreateRequest"
  },
  {
    "name": "game_center_leaderboard_set_versions_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetVersions/{id}",
    "description": "Read one Game Center leaderboard set versions (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_set_versions_v2.localizations.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSetVersions/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a Game Center leaderboard set versions (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_leaderboard_sets_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSets",
    "description": "Create a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2CreateRequest"
  },
  {
    "name": "game_center_leaderboard_sets_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardSets/{id}",
    "description": "Delete a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets_v2.game_center_leaderboards.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "Link Game Center leaderboards to a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2GameCenterLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_leaderboard_sets_v2.game_center_leaderboards.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSets/{id}/gameCenterLeaderboards",
    "description": "List the Game Center leaderboards belonging to a Game Center leaderboard sets (v2).",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "game_center_leaderboard_sets_v2.game_center_leaderboards.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "List only the IDs of the Game Center leaderboards linked to a Game Center leaderboard sets (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_leaderboard_sets_v2.game_center_leaderboards.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "Unlink Game Center leaderboards from a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2GameCenterLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_leaderboard_sets_v2.game_center_leaderboards.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "Replace the full set of Game Center leaderboards linked to a Game Center leaderboard sets (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2GameCenterLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_leaderboard_sets_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSets/{id}",
    "description": "Read one Game Center leaderboard sets (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetV2UpdateRequest"
  },
  {
    "name": "game_center_leaderboard_sets_v2.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSets/{id}/versions",
    "description": "List the versions belonging to a Game Center leaderboard sets (v2).",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "leaderboardSet",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets_v2.versions.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardSets/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to a Game Center leaderboard sets (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_leaderboard_sets.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardSets",
    "description": "Create a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetCreateRequest"
  },
  {
    "name": "game_center_leaderboard_sets.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardSets/{id}",
    "description": "Delete a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets.game_center_leaderboards.add",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "Link Game Center leaderboards to a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetGameCenterLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_leaderboard_sets.game_center_leaderboards.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSets/{id}/gameCenterLeaderboards",
    "description": "List the Game Center leaderboards belonging to a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboard",
          "gameCenterLeaderboardSets",
          "localizations",
          "releases",
          "activity",
          "challenge"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets.game_center_leaderboards.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "List only the IDs of the Game Center leaderboards linked to a Game Center leaderboard set. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_leaderboard_sets.game_center_leaderboards.remove",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "Unlink Game Center leaderboards from a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetGameCenterLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_leaderboard_sets.game_center_leaderboards.replace",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboardSets/{id}/relationships/gameCenterLeaderboards",
    "description": "Replace the full set of Game Center leaderboards linked to a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetGameCenterLeaderboardsLinkagesRequest"
  },
  {
    "name": "game_center_leaderboard_sets.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSets/{id}",
    "description": "Read one Game Center leaderboard set by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboardSet",
          "localizations",
          "gameCenterLeaderboards",
          "releases"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets.group_leaderboard_set.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSets/{id}/groupLeaderboardSet",
    "description": "Read the group leaderboard set for a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboardSet",
          "localizations",
          "gameCenterLeaderboards",
          "releases"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets.group_leaderboard_set.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSets/{id}/relationships/groupLeaderboardSet",
    "description": "Read only the ID of the group leaderboard set linked to a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets.group_leaderboard_set.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboardSets/{id}/relationships/groupLeaderboardSet",
    "description": "Set the group leaderboard set linked to a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetGroupLeaderboardSetLinkageRequest"
  },
  {
    "name": "game_center_leaderboard_sets.localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSets/{id}/localizations",
    "description": "List the localizations belonging to a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterLeaderboardSet",
          "gameCenterLeaderboardSetImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets.localizations.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSets/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a Game Center leaderboard set. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_leaderboard_sets.releases.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSets/{id}/releases",
    "description": "List the releases belonging to a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[live]",
        "type": "array",
        "description": "filter by attribute 'live'"
      },
      {
        "name": "filter[gameCenterDetail]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterDetail'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterLeaderboardSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_sets.releases.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboardSets/{id}/relationships/releases",
    "description": "List only the IDs of the releases linked to a Game Center leaderboard set. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_leaderboard_sets.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboardSets/{id}",
    "description": "Update a Game Center leaderboard set. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardSetUpdateRequest"
  },
  {
    "name": "game_center_leaderboard_versions_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboardVersions",
    "description": "Create a Game Center leaderboard versions (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardVersionV2CreateRequest"
  },
  {
    "name": "game_center_leaderboard_versions_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardVersions/{id}",
    "description": "Read one Game Center leaderboard versions (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version",
          "image"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboard_versions_v2.localizations.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboardVersions/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a Game Center leaderboard versions (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_leaderboards_v2.activity.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboards/{id}/relationships/activity",
    "description": "Set the activity linked to a Game Center leaderboards (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardV2ActivityLinkageRequest"
  },
  {
    "name": "game_center_leaderboards_v2.challenge.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v2/gameCenterLeaderboards/{id}/relationships/challenge",
    "description": "Set the challenge linked to a Game Center leaderboards (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardV2ChallengeLinkageRequest"
  },
  {
    "name": "game_center_leaderboards_v2.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v2/gameCenterLeaderboards",
    "description": "Create a Game Center leaderboards (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardV2CreateRequest"
  },
  {
    "name": "game_center_leaderboards_v2.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v2/gameCenterLeaderboards/{id}",
    "description": "Delete a Game Center leaderboards (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards_v2.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboards/{id}",
    "description": "Read one Game Center leaderboards (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardV2UpdateRequest"
  },
  {
    "name": "game_center_leaderboards_v2.versions.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboards/{id}/versions",
    "description": "List the versions belonging to a Game Center leaderboards (v2).",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "leaderboard",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards_v2.versions.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v2/gameCenterLeaderboards/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to a Game Center leaderboards (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_leaderboards.activity.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboards/{id}/relationships/activity",
    "description": "Set the activity linked to a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardActivityLinkageRequest"
  },
  {
    "name": "game_center_leaderboards.challenge.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboards/{id}/relationships/challenge",
    "description": "Set the challenge linked to a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardChallengeLinkageRequest"
  },
  {
    "name": "game_center_leaderboards.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterLeaderboards",
    "description": "Create a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardCreateRequest"
  },
  {
    "name": "game_center_leaderboards.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterLeaderboards/{id}",
    "description": "Delete a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboards/{id}",
    "description": "Read one Game Center leaderboard by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboard",
          "gameCenterLeaderboardSets",
          "localizations",
          "releases",
          "activity",
          "challenge"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards.group_leaderboard.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboards/{id}/groupLeaderboard",
    "description": "Read the group leaderboard for a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterGroup",
          "groupLeaderboard",
          "gameCenterLeaderboardSets",
          "localizations",
          "releases",
          "activity",
          "challenge"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards.group_leaderboard.get_id",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboards/{id}/relationships/groupLeaderboard",
    "description": "Read only the ID of the group leaderboard linked to a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards.group_leaderboard.set",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboards/{id}/relationships/groupLeaderboard",
    "description": "Set the group leaderboard linked to a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardGroupLeaderboardLinkageRequest"
  },
  {
    "name": "game_center_leaderboards.localizations.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboards/{id}/localizations",
    "description": "List the localizations belonging to a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterLeaderboard",
          "gameCenterLeaderboardImage"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards.localizations.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboards/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a Game Center leaderboard. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_leaderboards.releases.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboards/{id}/releases",
    "description": "List the releases belonging to a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[live]",
        "type": "array",
        "description": "filter by attribute 'live'"
      },
      {
        "name": "filter[gameCenterDetail]",
        "type": "array",
        "description": "filter by id(s) of related 'gameCenterDetail'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "gameCenterDetail",
          "gameCenterLeaderboard"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_leaderboards.releases.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterLeaderboards/{id}/relationships/releases",
    "description": "List only the IDs of the releases linked to a Game Center leaderboard. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "game_center_leaderboards.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterLeaderboards/{id}",
    "description": "Update a Game Center leaderboard. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterLeaderboardUpdateRequest"
  },
  {
    "name": "game_center_matchmaking_queues.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingQueues",
    "description": "Create a Game Center matchmaking queue.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingQueueCreateRequest"
  },
  {
    "name": "game_center_matchmaking_queues.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterMatchmakingQueues/{id}",
    "description": "Delete a Game Center matchmaking queue.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_queues.experiment_matchmaking_queue_sizes.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingQueues/{id}/metrics/experimentMatchmakingQueueSizes",
    "description": "Read experiment matchmaking queue sizes metrics for a Game Center matchmaking queue. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "deprecated": false,
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
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingQueueUpdateRequest"
  },
  {
    "name": "game_center_matchmaking_rule_set_tests.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingRuleSetTests",
    "description": "Create a Game Center matchmaking rule set test.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleSetTestCreateRequest"
  },
  {
    "name": "game_center_matchmaking_rule_sets.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingRuleSets",
    "description": "Create a Game Center matchmaking rule set.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleSetCreateRequest"
  },
  {
    "name": "game_center_matchmaking_rule_sets.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}",
    "description": "Delete a Game Center matchmaking rule set.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rule_sets.get",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}",
    "description": "Read one Game Center matchmaking rule set by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "ruleSet",
          "experimentRuleSet"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rule_sets.matchmaking_queues.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}/relationships/matchmakingQueues",
    "description": "List only the IDs of the matchmaking queues linked to a Game Center matchmaking rule set. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_matchmaking_rule_sets.rules.list",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}/rules",
    "description": "List the rules belonging to a Game Center matchmaking rule set.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "game_center_matchmaking_rule_sets.rules.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}/relationships/rules",
    "description": "List only the IDs of the rules linked to a Game Center matchmaking rule set. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "name": "game_center_matchmaking_rule_sets.teams.list_ids",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRuleSets/{id}/relationships/teams",
    "description": "List only the IDs of the teams linked to a Game Center matchmaking rule set. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleSetUpdateRequest"
  },
  {
    "name": "game_center_matchmaking_rules.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingRules",
    "description": "Create a Game Center matchmaking rule.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleCreateRequest"
  },
  {
    "name": "game_center_matchmaking_rules.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterMatchmakingRules/{id}",
    "description": "Delete a Game Center matchmaking rule.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_rules.matchmaking_boolean_rule_results.metrics",
    "domain": "game_center",
    "method": "GET",
    "path": "/v1/gameCenterMatchmakingRules/{id}/metrics/matchmakingBooleanRuleResults",
    "description": "Read matchmaking boolean rule results metrics for a Game Center matchmaking rule. Returns aggregated time-series data, not individual records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingRuleUpdateRequest"
  },
  {
    "name": "game_center_matchmaking_teams.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterMatchmakingTeams",
    "description": "Create a Game Center matchmaking team.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingTeamCreateRequest"
  },
  {
    "name": "game_center_matchmaking_teams.delete",
    "domain": "game_center",
    "method": "DELETE",
    "path": "/v1/gameCenterMatchmakingTeams/{id}",
    "description": "Delete a Game Center matchmaking team.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "game_center_matchmaking_teams.update",
    "domain": "game_center",
    "method": "PATCH",
    "path": "/v1/gameCenterMatchmakingTeams/{id}",
    "description": "Update a Game Center matchmaking team.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterMatchmakingTeamUpdateRequest"
  },
  {
    "name": "game_center_player_achievement_submissions.create",
    "domain": "game_center",
    "method": "POST",
    "path": "/v1/gameCenterPlayerAchievementSubmissions",
    "description": "Create a Game Center player achievement submission.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "GameCenterPlayerAchievementSubmissionCreateRequest"
  },
  {
    "name": "in_app_purchase_app_store_review_screenshots.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseAppStoreReviewScreenshots",
    "description": "Create an in-app purchase App Store review screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseAppStoreReviewScreenshotCreateRequest"
  },
  {
    "name": "in_app_purchase_app_store_review_screenshots.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v1/inAppPurchaseAppStoreReviewScreenshots/{id}",
    "description": "Delete an in-app purchase App Store review screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_app_store_review_screenshots.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseAppStoreReviewScreenshots/{id}",
    "description": "Read one in-app purchase App Store review screenshot by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Update an in-app purchase App Store review screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseAppStoreReviewScreenshotUpdateRequest"
  },
  {
    "name": "in_app_purchase_availabilities.available_territories.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseAvailabilities/{id}/availableTerritories",
    "description": "List the available territories belonging to an in-app purchase availability.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchase_availabilities.available_territories.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseAvailabilities/{id}/relationships/availableTerritories",
    "description": "List only the IDs of the available territories linked to an in-app purchase availability. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseAvailabilityCreateRequest"
  },
  {
    "name": "in_app_purchase_availabilities.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseAvailabilities/{id}",
    "description": "Read one in-app purchase availability by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "availableTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_contents.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseContents/{id}",
    "description": "Read one in-app purchase content by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchaseV2"
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseImageV2CreateRequest"
  },
  {
    "name": "in_app_purchase_images_v2.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v2/inAppPurchaseImages/{id}",
    "description": "Delete an in-app purchase images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_images_v2.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchaseImages/{id}",
    "description": "Read one in-app purchase images (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_images_v2.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v2/inAppPurchaseImages/{id}",
    "description": "Update an in-app purchase images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseImageV2UpdateRequest"
  },
  {
    "name": "in_app_purchase_images.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseImages",
    "description": "Create an in-app purchase image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseImageCreateRequest"
  },
  {
    "name": "in_app_purchase_images.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v1/inAppPurchaseImages/{id}",
    "description": "Delete an in-app purchase image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_images.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseImages/{id}",
    "description": "Read one in-app purchase image by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchase"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_images.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v1/inAppPurchaseImages/{id}",
    "description": "Update an in-app purchase image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseImageUpdateRequest"
  },
  {
    "name": "in_app_purchase_localizations_v2.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v2/inAppPurchaseLocalizations",
    "description": "Create an in-app purchase localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseLocalizationV2CreateRequest"
  },
  {
    "name": "in_app_purchase_localizations_v2.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v2/inAppPurchaseLocalizations/{id}",
    "description": "Delete an in-app purchase localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_localizations_v2.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchaseLocalizations/{id}",
    "description": "Read one in-app purchase localizations (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Update an in-app purchase localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseLocalizationV2UpdateRequest"
  },
  {
    "name": "in_app_purchase_localizations.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseLocalizations",
    "description": "Create an in-app purchase localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseLocalizationCreateRequest"
  },
  {
    "name": "in_app_purchase_localizations.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v1/inAppPurchaseLocalizations/{id}",
    "description": "Delete an in-app purchase localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_localizations.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseLocalizations/{id}",
    "description": "Read one in-app purchase localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchaseV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_localizations.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v1/inAppPurchaseLocalizations/{id}",
    "description": "Update an in-app purchase localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseLocalizationUpdateRequest"
  },
  {
    "name": "in_app_purchase_offer_code_custom_codes.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseOfferCodeCustomCodes",
    "description": "Create an in-app purchase offer code custom code.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeCustomCodeCreateRequest"
  },
  {
    "name": "in_app_purchase_offer_code_custom_codes.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodeCustomCodes/{id}",
    "description": "Read one in-app purchase offer code custom code by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeCustomCodeUpdateRequest"
  },
  {
    "name": "in_app_purchase_offer_code_one_time_use_codes.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseOfferCodeOneTimeUseCodes",
    "description": "Create an in-app purchase offer code one time use code.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeOneTimeUseCodeCreateRequest"
  },
  {
    "name": "in_app_purchase_offer_code_one_time_use_codes.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodeOneTimeUseCodes/{id}",
    "description": "Read one in-app purchase offer code one time use code by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeOneTimeUseCodeUpdateRequest"
  },
  {
    "name": "in_app_purchase_offer_code_one_time_use_codes.values.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodeOneTimeUseCodes/{id}/values",
    "description": "Read the value for an in-app purchase offer code one time use code.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeCreateRequest"
  },
  {
    "name": "in_app_purchase_offer_codes.custom_codes.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}/customCodes",
    "description": "List the custom codes belonging to an in-app purchase offer code.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "createdByActor",
          "deactivatedByActor"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_offer_codes.custom_codes.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}/relationships/customCodes",
    "description": "List only the IDs of the custom codes linked to an in-app purchase offer code. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchase_offer_codes.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}",
    "description": "Read one in-app purchase offer code by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "createdByActor",
          "deactivatedByActor"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_offer_codes.one_time_use_codes.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}/relationships/oneTimeUseCodes",
    "description": "List only the IDs of the one time use codes linked to an in-app purchase offer code. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchase_offer_codes.prices.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}/prices",
    "description": "List the prices belonging to an in-app purchase offer code.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory",
          "pricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_offer_codes.prices.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseOfferCodes/{id}/relationships/prices",
    "description": "List only the IDs of the prices linked to an in-app purchase offer code. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchase_offer_codes.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v1/inAppPurchaseOfferCodes/{id}",
    "description": "Update an in-app purchase offer code.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseOfferCodeUpdateRequest"
  },
  {
    "name": "in_app_purchase_price_points.equalizations.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePricePoints/{id}/equalizations",
    "description": "List the equalizations belonging to an in-app purchase price point.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "filter[inAppPurchaseV2]",
        "type": "array",
        "description": "filter by id(s) of related 'inAppPurchaseV2'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_price_points.equalizations.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePricePoints/{id}/relationships/equalizations",
    "description": "List only the IDs of the equalizations linked to an in-app purchase price point. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchase_price_schedules.automatic_prices.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}/automaticPrices",
    "description": "List the automatic prices belonging to an in-app purchase price schedule.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchasePricePoint",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_price_schedules.automatic_prices.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}/relationships/automaticPrices",
    "description": "List only the IDs of the automatic prices linked to an in-app purchase price schedule. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchase_price_schedules.base_territory.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}/baseTerritory",
    "description": "Read the base territory for an in-app purchase price schedule.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_price_schedules.base_territory.get_id",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}/relationships/baseTerritory",
    "description": "Read only the ID of the base territory linked to an in-app purchase price schedule.",
    "readOnly": true,
    "deprecated": false,
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
    "description": "Create an in-app purchase price schedule.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchasePriceScheduleCreateRequest"
  },
  {
    "name": "in_app_purchase_price_schedules.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}",
    "description": "Read one in-app purchase price schedule by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchasePricePoint",
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_price_schedules.manual_prices.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchasePriceSchedules/{id}/relationships/manualPrices",
    "description": "List only the IDs of the manual prices linked to an in-app purchase price schedule. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchase_submissions.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseSubmissions",
    "description": "Create an in-app purchase submission.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseSubmissionCreateRequest"
  },
  {
    "name": "in_app_purchase_versions.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v1/inAppPurchaseVersions",
    "description": "Create an in-app purchase version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseVersionCreateRequest"
  },
  {
    "name": "in_app_purchase_versions.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseVersions/{id}",
    "description": "Read one in-app purchase version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_versions.image.get_id",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseVersions/{id}/relationships/image",
    "description": "Read only the ID of the image linked to an in-app purchase version.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "name": "in_app_purchase_versions.images.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseVersions/{id}/relationships/images",
    "description": "List only the IDs of the images linked to an in-app purchase version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchase_versions.localizations.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchaseVersions/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to an in-app purchase version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchases_v2.app_store_review_screenshot.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/appStoreReviewScreenshot",
    "description": "Read the App Store review screenshot for an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchaseV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.app_store_review_screenshot.get_id",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/appStoreReviewScreenshot",
    "description": "Read only the ID of the App Store review screenshot linked to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.content.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/content",
    "description": "Read the content for an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchaseV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.content.get_id",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/content",
    "description": "Read only the ID of the content linked to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.create",
    "domain": "iap",
    "method": "POST",
    "path": "/v2/inAppPurchases",
    "description": "Create an in-app purchase. Set the product ID, type (CONSUMABLE, NON_CONSUMABLE, NON_RENEWING_SUBSCRIPTION) and reference name.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseV2CreateRequest"
  },
  {
    "name": "in_app_purchases_v2.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v2/inAppPurchases/{id}",
    "description": "Delete an in-app purchases (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}",
    "description": "Read one in-app purchases (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "in_app_purchases_v2.iap_price_schedule.get_id",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/iapPriceSchedule",
    "description": "Read only the ID of the IAP price schedule linked to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.images.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/images",
    "description": "List the images belonging to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchase"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.images.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/images",
    "description": "List only the IDs of the images linked to an in-app purchases (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchases_v2.in_app_purchase_availability.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/inAppPurchaseAvailability",
    "description": "Read the in-app purchase availability for an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "availableTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.in_app_purchase_availability.get_id",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/inAppPurchaseAvailability",
    "description": "Read only the ID of the in-app purchase availability linked to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.in_app_purchase_localizations.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/inAppPurchaseLocalizations",
    "description": "List the in-app purchase localizations belonging to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchaseV2"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.in_app_purchase_localizations.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/inAppPurchaseLocalizations",
    "description": "List only the IDs of the in-app purchase localizations linked to an in-app purchases (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchases_v2.offer_codes.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/offerCodes",
    "description": "List the offer codes belonging to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by territory"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "in_app_purchases_v2.offer_codes.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/offerCodes",
    "description": "List only the IDs of the offer codes linked to an in-app purchases (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchases_v2.price_points.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/pricePoints",
    "description": "List the price points belonging to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.price_points.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/pricePoints",
    "description": "List only the IDs of the price points linked to an in-app purchases (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchases_v2.promoted_purchase.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/promotedPurchase",
    "description": "Read the promoted purchase for an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchaseV2",
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.promoted_purchase.get_id",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/promotedPurchase",
    "description": "Read only the ID of the promoted purchase linked to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "in_app_purchases_v2.update",
    "domain": "iap",
    "method": "PATCH",
    "path": "/v2/inAppPurchases/{id}",
    "description": "Update an in-app purchases (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "InAppPurchaseV2UpdateRequest"
  },
  {
    "name": "in_app_purchases_v2.versions.list",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/versions",
    "description": "List the versions belonging to an in-app purchases (v2).",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "in_app_purchases_v2.versions.list_ids",
    "domain": "iap",
    "method": "GET",
    "path": "/v2/inAppPurchases/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to an in-app purchases (v2). Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "in_app_purchases.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/inAppPurchases/{id}",
    "description": "Read one in-app purchase by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "apps"
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MarketplaceSearchDetailCreateRequest"
  },
  {
    "name": "marketplace_search_details.delete",
    "domain": "apps",
    "method": "DELETE",
    "path": "/v1/marketplaceSearchDetails/{id}",
    "description": "Delete a marketplace search detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "marketplace_search_details.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/marketplaceSearchDetails/{id}",
    "description": "Update a marketplace search detail.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MarketplaceSearchDetailUpdateRequest"
  },
  {
    "name": "marketplace_webhooks.create",
    "domain": "webhooks",
    "method": "POST",
    "path": "/v1/marketplaceWebhooks",
    "description": "Create a marketplace webhook. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MarketplaceWebhookCreateRequest"
  },
  {
    "name": "marketplace_webhooks.delete",
    "domain": "webhooks",
    "method": "DELETE",
    "path": "/v1/marketplaceWebhooks/{id}",
    "description": "Delete a marketplace webhook. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "marketplace_webhooks.list",
    "domain": "webhooks",
    "method": "GET",
    "path": "/v1/marketplaceWebhooks",
    "description": "List marketplace webhooks. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [],
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
    "name": "marketplace_webhooks.update",
    "domain": "webhooks",
    "method": "PATCH",
    "path": "/v1/marketplaceWebhooks/{id}",
    "description": "Update a marketplace webhook. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MarketplaceWebhookUpdateRequest"
  },
  {
    "name": "merchant_ids.certificates.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/merchantIds/{id}/certificates",
    "description": "List the certificates belonging to a merchant ID.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "passTypeId"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "merchant_ids.certificates.list_ids",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/merchantIds/{id}/relationships/certificates",
    "description": "List only the IDs of the certificates linked to a merchant ID. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "merchant_ids.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/merchantIds",
    "description": "Create a merchant ID.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MerchantIdCreateRequest"
  },
  {
    "name": "merchant_ids.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/merchantIds/{id}",
    "description": "Delete a merchant ID.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "merchant_ids.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/merchantIds/{id}",
    "description": "Read one merchant ID by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "MerchantIdUpdateRequest"
  },
  {
    "name": "nominations.create",
    "domain": "marketing",
    "method": "POST",
    "path": "/v1/nominations",
    "description": "Create a nomination.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "NominationCreateRequest"
  },
  {
    "name": "nominations.delete",
    "domain": "marketing",
    "method": "DELETE",
    "path": "/v1/nominations/{id}",
    "description": "Delete a nomination.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "nominations.get",
    "domain": "marketing",
    "method": "GET",
    "path": "/v1/nominations/{id}",
    "description": "Read one nomination by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'relatedApps'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "NominationUpdateRequest"
  },
  {
    "name": "pass_type_ids.certificates.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/passTypeIds/{id}/certificates",
    "description": "List the certificates belonging to a pass type ID.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "passTypeId"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "pass_type_ids.certificates.list_ids",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/passTypeIds/{id}/relationships/certificates",
    "description": "List only the IDs of the certificates linked to a pass type ID. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "pass_type_ids.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/passTypeIds",
    "description": "Create a pass type ID.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "PassTypeIdCreateRequest"
  },
  {
    "name": "pass_type_ids.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/passTypeIds/{id}",
    "description": "Delete a pass type ID.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "pass_type_ids.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/passTypeIds/{id}",
    "description": "Read one pass type ID by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "PassTypeIdUpdateRequest"
  },
  {
    "name": "pre_release_versions.app.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/preReleaseVersions/{id}/app",
    "description": "Read the app for a pre release version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "pre_release_versions.app.get_id",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/preReleaseVersions/{id}/relationships/app",
    "description": "Read only the ID of the app linked to a pre release version.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "pre_release_versions.builds.list",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/preReleaseVersions/{id}/builds",
    "description": "List the builds belonging to a pre release version.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "pre_release_versions.builds.list_ids",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/preReleaseVersions/{id}/relationships/builds",
    "description": "List only the IDs of the builds linked to a pre release version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "pre_release_versions.get",
    "domain": "builds",
    "method": "GET",
    "path": "/v1/preReleaseVersions/{id}",
    "description": "Read one pre release version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "List pre release versions.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'app'"
      },
      {
        "name": "filter[builds]",
        "type": "array",
        "description": "filter by id(s) of related 'builds'"
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
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "profiles.bundle_id.get_id",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles/{id}/relationships/bundleId",
    "description": "Read only the ID of the bundle ID linked to a profile.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "name": "profiles.certificates.list_ids",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles/{id}/relationships/certificates",
    "description": "List only the IDs of the certificates linked to a profile. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "profiles.create",
    "domain": "provisioning",
    "method": "POST",
    "path": "/v1/profiles",
    "description": "Create a provisioning profile from a bundle ID, certificate and (for development) device list.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ProfileCreateRequest"
  },
  {
    "name": "profiles.delete",
    "domain": "provisioning",
    "method": "DELETE",
    "path": "/v1/profiles/{id}",
    "description": "Delete a profile.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "profiles.devices.list",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles/{id}/devices",
    "description": "List the devices belonging to a profile.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "profiles.devices.list_ids",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles/{id}/relationships/devices",
    "description": "List only the IDs of the devices linked to a profile. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "profiles.get",
    "domain": "provisioning",
    "method": "GET",
    "path": "/v1/profiles/{id}",
    "description": "Read one profile by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "PromotedPurchaseCreateRequest"
  },
  {
    "name": "promoted_purchases.delete",
    "domain": "iap",
    "method": "DELETE",
    "path": "/v1/promotedPurchases/{id}",
    "description": "Delete a promoted purchase.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "promoted_purchases.get",
    "domain": "iap",
    "method": "GET",
    "path": "/v1/promotedPurchases/{id}",
    "description": "Read one promoted purchase by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "PromotedPurchaseUpdateRequest"
  },
  {
    "name": "review_submission_items.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/reviewSubmissionItems",
    "description": "Create a review submission item.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ReviewSubmissionItemCreateRequest"
  },
  {
    "name": "review_submission_items.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/reviewSubmissionItems/{id}",
    "description": "Delete a review submission item.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "review_submission_items.update",
    "domain": "versions",
    "method": "PATCH",
    "path": "/v1/reviewSubmissionItems/{id}",
    "description": "Update a review submission item.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ReviewSubmissionItemUpdateRequest"
  },
  {
    "name": "review_submissions.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/reviewSubmissions",
    "description": "Create a review submission.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ReviewSubmissionCreateRequest"
  },
  {
    "name": "review_submissions.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/reviewSubmissions/{id}",
    "description": "Read one review submission by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "List the items belonging to a review submission.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "appStoreVersion",
          "appCustomProductPageVersion",
          "appStoreVersionExperiment",
          "appStoreVersionExperimentV2",
          "appEvent",
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
    "name": "review_submissions.items.list_ids",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/reviewSubmissions/{id}/relationships/items",
    "description": "List only the IDs of the items linked to a review submission. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "review_submissions.list",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/reviewSubmissions",
    "description": "List review submissions.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'app'",
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
        "description": "comma-separated list of relationships to include",
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
    "description": "Update a review submission.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "ReviewSubmissionUpdateRequest"
  },
  {
    "name": "routing_app_coverages.create",
    "domain": "versions",
    "method": "POST",
    "path": "/v1/routingAppCoverages",
    "description": "Create a routing app coverage.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "RoutingAppCoverageCreateRequest"
  },
  {
    "name": "routing_app_coverages.delete",
    "domain": "versions",
    "method": "DELETE",
    "path": "/v1/routingAppCoverages/{id}",
    "description": "Delete a routing app coverage.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "routing_app_coverages.get",
    "domain": "versions",
    "method": "GET",
    "path": "/v1/routingAppCoverages/{id}",
    "description": "Read one routing app coverage by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "RoutingAppCoverageUpdateRequest"
  },
  {
    "name": "sales_reports.list",
    "domain": "analytics",
    "method": "GET",
    "path": "/v1/salesReports",
    "description": "List sales reports.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SandboxTestersClearPurchaseHistoryRequestV2CreateRequest"
  },
  {
    "name": "sandbox_testers_v2.list",
    "domain": "sandbox",
    "method": "GET",
    "path": "/v2/sandboxTesters",
    "description": "List sandbox testers (v2).",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
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
    "name": "sandbox_testers_v2.update",
    "domain": "sandbox",
    "method": "PATCH",
    "path": "/v2/sandboxTesters/{id}",
    "description": "Update a sandbox testers (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SandboxTesterV2UpdateRequest"
  },
  {
    "name": "scm_git_references.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmGitReferences/{id}",
    "description": "Read one SCM git reference by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "scm_providers.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmProviders",
    "description": "List SCM providers.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
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
    "name": "scm_providers.repositories.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmProviders/{id}/repositories",
    "description": "List the repositories belonging to an SCM provider.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "scmProvider",
          "defaultBranch"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_providers.repositories.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmProviders/{id}/relationships/repositories",
    "description": "List only the IDs of the repositories linked to an SCM provider. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "scm_pull_requests.get",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmPullRequests/{id}",
    "description": "Read one SCM pull request by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "repository"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_repositories.git_references.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmRepositories/{id}/relationships/gitReferences",
    "description": "List only the IDs of the git references linked to an SCM repository. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "scm_repositories.list",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmRepositories",
    "description": "List SCM repositories.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
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
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "repository"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "scm_repositories.pull_requests.list_ids",
    "domain": "xcode_cloud",
    "method": "GET",
    "path": "/v1/scmRepositories/{id}/relationships/pullRequests",
    "description": "List only the IDs of the pull requests linked to an SCM repository. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_app_store_review_screenshots.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionAppStoreReviewScreenshots",
    "description": "Create a subscription App Store review screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionAppStoreReviewScreenshotCreateRequest"
  },
  {
    "name": "subscription_app_store_review_screenshots.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionAppStoreReviewScreenshots/{id}",
    "description": "Delete a subscription App Store review screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_app_store_review_screenshots.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionAppStoreReviewScreenshots/{id}",
    "description": "Read one subscription App Store review screenshot by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Update a subscription App Store review screenshot.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionAppStoreReviewScreenshotUpdateRequest"
  },
  {
    "name": "subscription_availabilities.available_territories.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionAvailabilities/{id}/availableTerritories",
    "description": "List the available territories belonging to a subscription availability. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "subscription_availabilities.available_territories.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionAvailabilities/{id}/relationships/availableTerritories",
    "description": "List only the IDs of the available territories linked to a subscription availability. Use the related-resource tool instead if you need full records. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
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
    "name": "subscription_availabilities.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionAvailabilities",
    "description": "Create a subscription availability. DEPRECATED by Apple.",
    "readOnly": false,
    "deprecated": true,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionAvailabilityCreateRequest"
  },
  {
    "name": "subscription_availabilities.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionAvailabilities/{id}",
    "description": "Read one subscription availability by ID. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "availableTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_grace_periods.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGracePeriods/{id}",
    "description": "Read one subscription grace period by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_grace_periods.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionGracePeriods/{id}",
    "description": "Update a subscription grace period.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGracePeriodUpdateRequest"
  },
  {
    "name": "subscription_group_localizations_v2.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v2/subscriptionGroupLocalizations",
    "description": "Create a subscription group localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupLocalizationV2CreateRequest"
  },
  {
    "name": "subscription_group_localizations_v2.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v2/subscriptionGroupLocalizations/{id}",
    "description": "Delete a subscription group localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_group_localizations_v2.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v2/subscriptionGroupLocalizations/{id}",
    "description": "Read one subscription group localizations (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Update a subscription group localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupLocalizationV2UpdateRequest"
  },
  {
    "name": "subscription_group_localizations.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionGroupLocalizations",
    "description": "Create a subscription group localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupLocalizationCreateRequest"
  },
  {
    "name": "subscription_group_localizations.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionGroupLocalizations/{id}",
    "description": "Delete a subscription group localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_group_localizations.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroupLocalizations/{id}",
    "description": "Read one subscription group localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subscriptionGroup"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_group_localizations.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionGroupLocalizations/{id}",
    "description": "Update a subscription group localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupLocalizationUpdateRequest"
  },
  {
    "name": "subscription_group_submissions.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionGroupSubmissions",
    "description": "Create a subscription group submission.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupSubmissionCreateRequest"
  },
  {
    "name": "subscription_group_versions.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionGroupVersions",
    "description": "Create a subscription group version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupVersionCreateRequest"
  },
  {
    "name": "subscription_group_versions.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroupVersions/{id}",
    "description": "Read one subscription group version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_group_versions.localizations.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroupVersions/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a subscription group version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_groups.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionGroups",
    "description": "Create a subscription group. Subscriptions in the same group are mutually exclusive upgrade/downgrade options.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupCreateRequest"
  },
  {
    "name": "subscription_groups.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionGroups/{id}",
    "description": "Delete a subscription group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_groups.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}",
    "description": "Read one subscription group by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "subscription_groups.subscription_group_localizations.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}/subscriptionGroupLocalizations",
    "description": "List the subscription group localizations belonging to a subscription group.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subscriptionGroup"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_groups.subscription_group_localizations.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}/relationships/subscriptionGroupLocalizations",
    "description": "List only the IDs of the subscription group localizations linked to a subscription group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_groups.subscriptions.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}/subscriptions",
    "description": "List the subscriptions belonging to a subscription group.",
    "readOnly": true,
    "deprecated": false,
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "subscription_groups.subscriptions.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}/relationships/subscriptions",
    "description": "List only the IDs of the subscriptions linked to a subscription group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_groups.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionGroups/{id}",
    "description": "Update a subscription group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionGroupUpdateRequest"
  },
  {
    "name": "subscription_groups.versions.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}/versions",
    "description": "List the versions belonging to a subscription group.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subscriptionGroup",
          "localizations"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_groups.versions.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionGroups/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to a subscription group. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_images_v2.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v2/subscriptionImages",
    "description": "Create a subscription images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionImageV2CreateRequest"
  },
  {
    "name": "subscription_images_v2.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v2/subscriptionImages/{id}",
    "description": "Delete a subscription images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_images_v2.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v2/subscriptionImages/{id}",
    "description": "Read one subscription images (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_images_v2.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v2/subscriptionImages/{id}",
    "description": "Update a subscription images (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionImageV2UpdateRequest"
  },
  {
    "name": "subscription_images.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionImages",
    "description": "Create a subscription image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionImageCreateRequest"
  },
  {
    "name": "subscription_images.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionImages/{id}",
    "description": "Delete a subscription image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_images.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionImages/{id}",
    "description": "Read one subscription image by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_images.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionImages/{id}",
    "description": "Update a subscription image.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionImageUpdateRequest"
  },
  {
    "name": "subscription_introductory_offers.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionIntroductoryOffers",
    "description": "Create a subscription introductory offer.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionIntroductoryOfferCreateRequest"
  },
  {
    "name": "subscription_introductory_offers.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionIntroductoryOffers/{id}",
    "description": "Delete a subscription introductory offer.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_introductory_offers.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionIntroductoryOffers/{id}",
    "description": "Update a subscription introductory offer.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionIntroductoryOfferUpdateRequest"
  },
  {
    "name": "subscription_localizations_v2.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v2/subscriptionLocalizations",
    "description": "Create a subscription localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionLocalizationV2CreateRequest"
  },
  {
    "name": "subscription_localizations_v2.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v2/subscriptionLocalizations/{id}",
    "description": "Delete a subscription localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_localizations_v2.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v2/subscriptionLocalizations/{id}",
    "description": "Read one subscription localizations (v2) by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Update a subscription localizations (v2).",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionLocalizationV2UpdateRequest"
  },
  {
    "name": "subscription_localizations.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionLocalizations",
    "description": "Create a subscription localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionLocalizationCreateRequest"
  },
  {
    "name": "subscription_localizations.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionLocalizations/{id}",
    "description": "Delete a subscription localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_localizations.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionLocalizations/{id}",
    "description": "Read one subscription localization by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_localizations.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionLocalizations/{id}",
    "description": "Update a subscription localization.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionLocalizationUpdateRequest"
  },
  {
    "name": "subscription_offer_code_custom_codes.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionOfferCodeCustomCodes",
    "description": "Create a subscription offer code custom code.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeCustomCodeCreateRequest"
  },
  {
    "name": "subscription_offer_code_custom_codes.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodeCustomCodes/{id}",
    "description": "Read one subscription offer code custom code by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeCustomCodeUpdateRequest"
  },
  {
    "name": "subscription_offer_code_one_time_use_codes.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionOfferCodeOneTimeUseCodes",
    "description": "Create a subscription offer code one time use code.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeOneTimeUseCodeCreateRequest"
  },
  {
    "name": "subscription_offer_code_one_time_use_codes.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodeOneTimeUseCodes/{id}",
    "description": "Read one subscription offer code one time use code by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeOneTimeUseCodeUpdateRequest"
  },
  {
    "name": "subscription_offer_code_one_time_use_codes.values.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodeOneTimeUseCodes/{id}/values",
    "description": "Read the value for a subscription offer code one time use code.",
    "readOnly": true,
    "deprecated": false,
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
    "description": "Create a subscription offer code.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeCreateRequest"
  },
  {
    "name": "subscription_offer_codes.custom_codes.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}/customCodes",
    "description": "List the custom codes belonging to a subscription offer code.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "offerCode"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_offer_codes.custom_codes.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}/relationships/customCodes",
    "description": "List only the IDs of the custom codes linked to a subscription offer code. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_offer_codes.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}",
    "description": "Read one subscription offer code by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "offerCode"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_offer_codes.one_time_use_codes.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}/relationships/oneTimeUseCodes",
    "description": "List only the IDs of the one time use codes linked to a subscription offer code. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_offer_codes.prices.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}/prices",
    "description": "List the prices belonging to a subscription offer code.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory",
          "subscriptionPricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_offer_codes.prices.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionOfferCodes/{id}/relationships/prices",
    "description": "List only the IDs of the prices linked to a subscription offer code. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_offer_codes.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionOfferCodes/{id}",
    "description": "Update a subscription offer code.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionOfferCodeUpdateRequest"
  },
  {
    "name": "subscription_plan_availabilities.available_territories.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPlanAvailabilities/{id}/availableTerritories",
    "description": "List the available territories belonging to a subscription plan availability.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_plan_availabilities.available_territories.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPlanAvailabilities/{id}/relationships/availableTerritories",
    "description": "List only the IDs of the available territories linked to a subscription plan availability. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPlanAvailabilityAvailableTerritoriesLinkagesRequest"
  },
  {
    "name": "subscription_plan_availabilities.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionPlanAvailabilities",
    "description": "Create a subscription plan availability.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPlanAvailabilityCreateRequest"
  },
  {
    "name": "subscription_plan_availabilities.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPlanAvailabilities/{id}",
    "description": "Read one subscription plan availability by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPlanAvailabilityUpdateRequest"
  },
  {
    "name": "subscription_price_points.adjusted_equalizations.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPricePoints/{id}/adjustedEqualizations",
    "description": "List the adjusted equalizations belonging to a subscription price point.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "filter[subscription]",
        "type": "array",
        "description": "filter by id(s) of related 'subscription'"
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
        "description": "comma-separated list of relationships to include",
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
    "description": "List the equalizations belonging to a subscription price point.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "filter[subscription]",
        "type": "array",
        "description": "filter by id(s) of related 'subscription'"
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_price_points.equalizations.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPricePoints/{id}/relationships/equalizations",
    "description": "List only the IDs of the equalizations linked to a subscription price point. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_price_points.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPricePoints/{id}",
    "description": "Read one subscription price point by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Create a subscription price.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPriceCreateRequest"
  },
  {
    "name": "subscription_prices.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionPrices/{id}",
    "description": "Delete a subscription price.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_promotional_offers.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionPromotionalOffers",
    "description": "Create a subscription promotional offer.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPromotionalOfferCreateRequest"
  },
  {
    "name": "subscription_promotional_offers.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptionPromotionalOffers/{id}",
    "description": "Delete a subscription promotional offer.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_promotional_offers.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPromotionalOffers/{id}",
    "description": "Read one subscription promotional offer by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory",
          "subscriptionPricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_promotional_offers.prices.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionPromotionalOffers/{id}/relationships/prices",
    "description": "List only the IDs of the prices linked to a subscription promotional offer. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscription_promotional_offers.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptionPromotionalOffers/{id}",
    "description": "Update a subscription promotional offer.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPromotionalOfferUpdateRequest"
  },
  {
    "name": "subscription_submissions.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionSubmissions",
    "description": "Create a subscription submission.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionSubmissionCreateRequest"
  },
  {
    "name": "subscription_versions.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptionVersions",
    "description": "Create a subscription version.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionVersionCreateRequest"
  },
  {
    "name": "subscription_versions.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionVersions/{id}",
    "description": "Read one subscription version by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscription_versions.image.get_id",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionVersions/{id}/relationships/image",
    "description": "Read only the ID of the image linked to a subscription version.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
    "name": "subscription_versions.images.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionVersions/{id}/relationships/images",
    "description": "List only the IDs of the images linked to a subscription version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "version"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscription_versions.localizations.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptionVersions/{id}/relationships/localizations",
    "description": "List only the IDs of the localizations linked to a subscription version. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.app_store_review_screenshot.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/appStoreReviewScreenshot",
    "description": "Read the App Store review screenshot for a subscription.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.app_store_review_screenshot.get_id",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/appStoreReviewScreenshot",
    "description": "Read only the ID of the App Store review screenshot linked to a subscription.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscriptions.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/subscriptions",
    "description": "Create an auto-renewable subscription inside a subscription group.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionCreateRequest"
  },
  {
    "name": "subscriptions.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptions/{id}",
    "description": "Delete a subscription.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscriptions.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}",
    "description": "Read one subscription by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "subscriptions.images.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/images",
    "description": "List the images belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.images.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/images",
    "description": "List only the IDs of the images linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.introductory_offers.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/introductoryOffers",
    "description": "List the introductory offers belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "subscriptions.introductory_offers.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/introductoryOffers",
    "description": "List only the IDs of the introductory offers linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.introductory_offers.remove",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptions/{id}/relationships/introductoryOffers",
    "description": "Unlink introductory offers from a subscription.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionIntroductoryOffersLinkagesRequest"
  },
  {
    "name": "subscriptions.offer_codes.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/offerCodes",
    "description": "List the offer codes belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by territory"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "name": "subscriptions.offer_codes.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/offerCodes",
    "description": "List only the IDs of the offer codes linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.plan_availabilities.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/planAvailabilities",
    "description": "List the plan availabilities belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "availableTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.plan_availabilities.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/planAvailabilities",
    "description": "List only the IDs of the plan availabilities linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.price_points.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/pricePoints",
    "description": "List the price points belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.price_points.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/pricePoints",
    "description": "List only the IDs of the price points linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.prices.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/prices",
    "description": "List the prices belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "filter by id(s) of related 'subscriptionPricePoint'"
      },
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory",
          "subscriptionPricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.prices.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/prices",
    "description": "List only the IDs of the prices linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.prices.remove",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/subscriptions/{id}/relationships/prices",
    "description": "Unlink prices from a subscription.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionPricesLinkagesRequest"
  },
  {
    "name": "subscriptions.promoted_purchase.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/promotedPurchase",
    "description": "Read the promoted purchase for a subscription.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "inAppPurchaseV2",
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.promoted_purchase.get_id",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/promotedPurchase",
    "description": "Read only the ID of the promoted purchase linked to a subscription.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscriptions.promotional_offers.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/promotionalOffers",
    "description": "List the promotional offers belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by territory"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subscription",
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.promotional_offers.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/promotionalOffers",
    "description": "List only the IDs of the promotional offers linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.subscription_availability.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/subscriptionAvailability",
    "description": "Read the subscription availability for a subscription. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "availableTerritories"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.subscription_availability.get_id",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/subscriptionAvailability",
    "description": "Read only the ID of the subscription availability linked to a subscription. DEPRECATED by Apple.",
    "readOnly": true,
    "deprecated": true,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "subscriptions.subscription_localizations.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/subscriptionLocalizations",
    "description": "List the subscription localizations belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "subscription"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.subscription_localizations.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/subscriptionLocalizations",
    "description": "List only the IDs of the subscription localizations linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/subscriptions/{id}",
    "description": "Update a subscription.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "SubscriptionUpdateRequest"
  },
  {
    "name": "subscriptions.versions.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/versions",
    "description": "List the versions belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
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
    "name": "subscriptions.versions.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/versions",
    "description": "List only the IDs of the versions linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "subscriptions.win_back_offers.list",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/winBackOffers",
    "description": "List the win back offers belonging to a subscription.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "prices"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "subscriptions.win_back_offers.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/subscriptions/{id}/relationships/winBackOffers",
    "description": "List only the IDs of the win back offers linked to a subscription. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "territories.list",
    "domain": "apps",
    "method": "GET",
    "path": "/v1/territories",
    "description": "List territories.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [],
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
    "name": "territory_availabilities.update",
    "domain": "apps",
    "method": "PATCH",
    "path": "/v1/territoryAvailabilities/{id}",
    "description": "Update a territory availability.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "TerritoryAvailabilityUpdateRequest"
  },
  {
    "name": "user_invitations.create",
    "domain": "users",
    "method": "POST",
    "path": "/v1/userInvitations",
    "description": "Create a user invitation.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserInvitationCreateRequest"
  },
  {
    "name": "user_invitations.delete",
    "domain": "users",
    "method": "DELETE",
    "path": "/v1/userInvitations/{id}",
    "description": "Delete a user invitation.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "user_invitations.get",
    "domain": "users",
    "method": "GET",
    "path": "/v1/userInvitations/{id}",
    "description": "Read one user invitation by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'visibleApps'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
    "name": "user_invitations.visible_apps.list_ids",
    "domain": "users",
    "method": "GET",
    "path": "/v1/userInvitations/{id}/relationships/visibleApps",
    "description": "List only the IDs of the visible apps linked to a user invitation. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "users.get",
    "domain": "users",
    "method": "GET",
    "path": "/v1/users/{id}",
    "description": "Read one user by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
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
        "description": "filter by id(s) of related 'visibleApps'"
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
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "description": "Update a user.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserUpdateRequest"
  },
  {
    "name": "users.visible_apps.add",
    "domain": "users",
    "method": "POST",
    "path": "/v1/users/{id}/relationships/visibleApps",
    "description": "Link visible apps to a user.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserVisibleAppsLinkagesRequest"
  },
  {
    "name": "users.visible_apps.list",
    "domain": "users",
    "method": "GET",
    "path": "/v1/users/{id}/visibleApps",
    "description": "List the visible apps belonging to a user.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "users.visible_apps.list_ids",
    "domain": "users",
    "method": "GET",
    "path": "/v1/users/{id}/relationships/visibleApps",
    "description": "List only the IDs of the visible apps linked to a user. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserVisibleAppsLinkagesRequest"
  },
  {
    "name": "users.visible_apps.replace",
    "domain": "users",
    "method": "PATCH",
    "path": "/v1/users/{id}/relationships/visibleApps",
    "description": "Replace the full set of visible apps linked to a user.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "UserVisibleAppsLinkagesRequest"
  },
  {
    "name": "webhook_deliveries.create",
    "domain": "webhooks",
    "method": "POST",
    "path": "/v1/webhookDeliveries",
    "description": "Create a webhook delivery.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WebhookDeliveryCreateRequest"
  },
  {
    "name": "webhook_pings.create",
    "domain": "webhooks",
    "method": "POST",
    "path": "/v1/webhookPings",
    "description": "Create a webhook ping.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WebhookPingCreateRequest"
  },
  {
    "name": "webhooks.create",
    "domain": "webhooks",
    "method": "POST",
    "path": "/v1/webhooks",
    "description": "Create a webhook so Apple pushes App Store Connect events to your endpoint.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WebhookCreateRequest"
  },
  {
    "name": "webhooks.delete",
    "domain": "webhooks",
    "method": "DELETE",
    "path": "/v1/webhooks/{id}",
    "description": "Delete a webhook.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "webhooks.deliveries.list",
    "domain": "webhooks",
    "method": "GET",
    "path": "/v1/webhooks/{id}/deliveries",
    "description": "List the deliveries belonging to a webhook.",
    "readOnly": true,
    "deprecated": false,
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
        "description": "comma-separated list of relationships to include",
        "enum": [
          "event"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "webhooks.deliveries.list_ids",
    "domain": "webhooks",
    "method": "GET",
    "path": "/v1/webhooks/{id}/relationships/deliveries",
    "description": "List only the IDs of the deliveries linked to a webhook. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "webhooks.get",
    "domain": "webhooks",
    "method": "GET",
    "path": "/v1/webhooks/{id}",
    "description": "Read one webhook by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WebhookUpdateRequest"
  },
  {
    "name": "win_back_offers.create",
    "domain": "subscriptions",
    "method": "POST",
    "path": "/v1/winBackOffers",
    "description": "Create a win back offer.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WinBackOfferCreateRequest"
  },
  {
    "name": "win_back_offers.delete",
    "domain": "subscriptions",
    "method": "DELETE",
    "path": "/v1/winBackOffers/{id}",
    "description": "Delete a win back offer.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": false
  },
  {
    "name": "win_back_offers.get",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/winBackOffers/{id}",
    "description": "Read one win back offer by ID.",
    "readOnly": true,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
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
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [
      {
        "name": "filter[territory]",
        "type": "array",
        "description": "filter by id(s) of related 'territory'"
      },
      {
        "name": "limit",
        "type": "number",
        "description": "maximum resources per page"
      },
      {
        "name": "include",
        "type": "array",
        "description": "comma-separated list of relationships to include",
        "enum": [
          "territory",
          "subscriptionPricePoint"
        ]
      }
    ],
    "hasBody": false
  },
  {
    "name": "win_back_offers.prices.list_ids",
    "domain": "subscriptions",
    "method": "GET",
    "path": "/v1/winBackOffers/{id}/relationships/prices",
    "description": "List only the IDs of the prices linked to a win back offer. Use the related-resource tool instead if you need full records.",
    "readOnly": true,
    "deprecated": false,
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
    "name": "win_back_offers.update",
    "domain": "subscriptions",
    "method": "PATCH",
    "path": "/v1/winBackOffers/{id}",
    "description": "Update a win back offer.",
    "readOnly": false,
    "deprecated": false,
    "pathParams": [
      "id"
    ],
    "queryParams": [],
    "hasBody": true,
    "bodyRef": "WinBackOfferUpdateRequest"
  }
];
