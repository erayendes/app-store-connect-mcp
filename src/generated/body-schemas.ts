// AUTO-GENERATED — do not edit by hand.
// Source: Apple App Store Connect OpenAPI specification v4.4.1
// Regenerate with: npm run generate

/** Simplified JSON Schemas for request bodies, keyed by Operation.bodyRef. */
export const BODY_SCHEMAS: Record<string, unknown> = {
 "AccessibilityDeclarationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "accessibilityDeclarations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "deviceFamily": {
        "type": "string",
        "enum": [
         "IPHONE",
         "IPAD",
         "APPLE_TV",
         "APPLE_WATCH",
         "MAC",
         "VISION"
        ]
       },
       "supportsAudioDescriptions": {
        "type": "boolean",
        "nullable": true
       },
       "supportsCaptions": {
        "type": "boolean",
        "nullable": true
       },
       "supportsDarkInterface": {
        "type": "boolean",
        "nullable": true
       },
       "supportsDifferentiateWithoutColorAlone": {
        "type": "boolean",
        "nullable": true
       },
       "supportsLargerText": {
        "type": "boolean",
        "nullable": true
       },
       "supportsReducedMotion": {
        "type": "boolean",
        "nullable": true
       },
       "supportsSufficientContrast": {
        "type": "boolean",
        "nullable": true
       },
       "supportsVoiceControl": {
        "type": "boolean",
        "nullable": true
       },
       "supportsVoiceover": {
        "type": "boolean",
        "nullable": true
       }
      },
      "required": [
       "deviceFamily"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AccessibilityDeclarationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "accessibilityDeclarations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "publish": {
        "type": "boolean",
        "nullable": true
       },
       "supportsAudioDescriptions": {
        "type": "boolean",
        "nullable": true
       },
       "supportsCaptions": {
        "type": "boolean",
        "nullable": true
       },
       "supportsDarkInterface": {
        "type": "boolean",
        "nullable": true
       },
       "supportsDifferentiateWithoutColorAlone": {
        "type": "boolean",
        "nullable": true
       },
       "supportsLargerText": {
        "type": "boolean",
        "nullable": true
       },
       "supportsReducedMotion": {
        "type": "boolean",
        "nullable": true
       },
       "supportsSufficientContrast": {
        "type": "boolean",
        "nullable": true
       },
       "supportsVoiceControl": {
        "type": "boolean",
        "nullable": true
       },
       "supportsVoiceover": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AgeRatingDeclarationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "ageRatingDeclarations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "advertising": {
        "type": "boolean",
        "nullable": true
       },
       "alcoholTobaccoOrDrugUseOrReferences": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "contests": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "gambling": {
        "type": "boolean",
        "nullable": true
       },
       "gamblingSimulated": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "gunsOrOtherWeapons": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "healthOrWellnessTopics": {
        "type": "boolean",
        "nullable": true
       },
       "kidsAgeBand": {
        "type": "string",
        "enum": [
         "FIVE_AND_UNDER",
         "SIX_TO_EIGHT",
         "NINE_TO_ELEVEN"
        ]
       },
       "lootBox": {
        "type": "boolean",
        "nullable": true
       },
       "medicalOrTreatmentInformation": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "messagingAndChat": {
        "type": "boolean",
        "nullable": true
       },
       "parentalControls": {
        "type": "boolean",
        "nullable": true
       },
       "profanityOrCrudeHumor": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "ageAssurance": {
        "type": "boolean",
        "nullable": true
       },
       "sexualContentGraphicAndNudity": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "sexualContentOrNudity": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "socialMedia": {
        "type": "boolean",
        "nullable": true
       },
       "socialMediaAgeRestricted": {
        "type": "boolean",
        "nullable": true
       },
       "horrorOrFearThemes": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "matureOrSuggestiveThemes": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "unrestrictedWebAccess": {
        "type": "boolean",
        "nullable": true
       },
       "userGeneratedContent": {
        "type": "boolean",
        "nullable": true
       },
       "violenceCartoonOrFantasy": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "violenceRealisticProlongedGraphicOrSadistic": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "violenceRealistic": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "INFREQUENT_OR_MILD",
         "FREQUENT_OR_INTENSE",
         "INFREQUENT",
         "FREQUENT"
        ]
       },
       "ageRatingOverride": {
        "type": "string",
        "deprecated": true,
        "nullable": true,
        "enum": [
         "NONE",
         "NINE_PLUS",
         "THIRTEEN_PLUS",
         "SIXTEEN_PLUS",
         "SEVENTEEN_PLUS",
         "UNRATED"
        ]
       },
       "ageRatingOverrideV2": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "NINE_PLUS",
         "THIRTEEN_PLUS",
         "SIXTEEN_PLUS",
         "EIGHTEEN_PLUS",
         "UNRATED"
        ]
       },
       "koreaAgeRatingOverride": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NONE",
         "FIFTEEN_PLUS",
         "NINETEEN_PLUS"
        ]
       },
       "developerAgeRatingInfoUrl": {
        "type": "string",
        "format": "uri",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AlternativeDistributionDomainCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "alternativeDistributionDomains"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "domain": {
        "type": "string"
       },
       "referenceName": {
        "type": "string"
       }
      },
      "required": [
       "domain",
       "referenceName"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AlternativeDistributionKeyCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "alternativeDistributionKeys"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "publicKey": {
        "type": "string"
       }
      },
      "required": [
       "publicKey"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AlternativeDistributionPackageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "alternativeDistributionPackages"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AnalyticsReportRequestCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "analyticsReportRequests"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "accessType": {
        "type": "string",
        "enum": [
         "ONE_TIME_SNAPSHOT",
         "ONGOING"
        ]
       }
      },
      "required": [
       "accessType"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AndroidToIosAppMappingDetailCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "androidToIosAppMappingDetails"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "packageName": {
        "type": "string"
       },
       "appSigningKeyPublicCertificateSha256Fingerprints": {
        "type": "array",
        "items": {
         "type": "string"
        }
       }
      },
      "required": [
       "appSigningKeyPublicCertificateSha256Fingerprints",
       "packageName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AndroidToIosAppMappingDetailUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "androidToIosAppMappingDetails"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "packageName": {
        "type": "string",
        "nullable": true
       },
       "appSigningKeyPublicCertificateSha256Fingerprints": {
        "type": "array",
        "items": {
         "type": "string"
        },
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppAvailabilityV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appAvailabilities"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "availableInNewTerritories": {
        "type": "boolean"
       }
      },
      "required": [
       "availableInNewTerritories"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "territoryAvailabilities": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territoryAvailabilities"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app",
       "territoryAvailabilities"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "territoryAvailabilities"
       ]
      },
      "id": {
       "type": "string"
      },
      "attributes": {
       "type": "object",
       "properties": {
        "available": {
         "type": "boolean",
         "nullable": true
        },
        "releaseDate": {
         "type": "string",
         "format": "date",
         "nullable": true
        },
        "preOrderEnabled": {
         "type": "boolean",
         "nullable": true
        }
       },
       "additionalProperties": false
      },
      "relationships": {
       "type": "object",
       "properties": {
        "territory": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipAdvancedExperienceImageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipAdvancedExperienceImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipAdvancedExperienceImageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipAdvancedExperienceImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipAdvancedExperienceCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipAdvancedExperiences"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "link": {
        "type": "string",
        "format": "uri"
       },
       "action": {
        "type": "string",
        "enum": [
         "OPEN",
         "VIEW",
         "PLAY"
        ]
       },
       "isPoweredBy": {
        "type": "boolean"
       },
       "place": {
        "type": "object",
        "properties": {
         "placeId": {
          "type": "string"
         },
         "names": {
          "type": "array",
          "items": {
           "type": "string"
          }
         },
         "mainAddress": {
          "type": "object",
          "properties": {
           "fullAddress": {
            "type": "string"
           },
           "structuredAddress": {
            "type": "object",
            "properties": {
             "streetAddress": {
              "type": "array",
              "items": {
               "type": "string"
              }
             },
             "floor": {
              "type": "string"
             },
             "neighborhood": {
              "type": "string"
             },
             "locality": {
              "type": "string"
             },
             "stateProvince": {
              "type": "string"
             },
             "postalCode": {
              "type": "string"
             },
             "countryCode": {
              "type": "string"
             }
            },
            "additionalProperties": false
           }
          },
          "additionalProperties": false
         },
         "displayPoint": {
          "type": "object",
          "properties": {
           "coordinates": {
            "type": "object",
            "properties": {
             "latitude": {
              "type": "number"
             },
             "longitude": {
              "type": "number"
             }
            },
            "additionalProperties": false
           },
           "source": {
            "type": "string",
            "enum": [
             "CALCULATED",
             "MANUALLY_PLACED"
            ]
           }
          },
          "additionalProperties": false
         },
         "mapAction": {
          "type": "string",
          "enum": [
           "BUY_TICKETS",
           "VIEW_AVAILABILITY",
           "VIEW_PRICING",
           "HOTEL_BOOK_ROOM",
           "PARKING_RESERVE_PARKING",
           "RESTAURANT_JOIN_WAITLIST",
           "RESTAURANT_ORDER_DELIVERY",
           "RESTAURANT_ORDER_FOOD",
           "RESTAURANT_ORDER_TAKEOUT",
           "RESTAURANT_RESERVATION",
           "SCHEDULE_APPOINTMENT",
           "RESTAURANT_VIEW_MENU",
           "THEATER_NOW_PLAYING",
           "AIRLINE_BOOK_TRAVEL",
           "AIRLINE_CHECK_IN",
           "AIRLINE_FLIGHT_STATUS",
           "APPLY",
           "BOOK",
           "BOOK_ACTIVITIES",
           "BOOK_RIDES",
           "BOOK_TEETIMES",
           "BOOK_TOURS",
           "CAREERS",
           "CHARGE_EV",
           "COUPONS",
           "DONATE",
           "EVENTS",
           "EVENTS_SHOWS",
           "EVENTS_SPORTS",
           "GIFT_CARD",
           "HOTEL_AMENITIES",
           "JOIN",
           "PARKING_AVAILABLE",
           "RESTAURANT_PICKUP",
           "RETAIL_SERVICE_QUOTE",
           "RETAIL_STORE_DELIVERY",
           "RETAIL_STORE_PICKUP",
           "RETAIL_STORE_SHOP",
           "SERVICES",
           "SUPPORT",
           "PAY_TO_PARK"
          ]
         },
         "relationship": {
          "type": "string",
          "enum": [
           "OWNER",
           "AUTHORIZED",
           "OTHER"
          ]
         },
         "phoneNumber": {
          "type": "object",
          "properties": {
           "number": {
            "type": "string"
           },
           "type": {
            "type": "string",
            "enum": [
             "FAX",
             "LANDLINE",
             "MOBILE",
             "TOLLFREE"
            ]
           },
           "intent": {
            "type": "string"
           }
          },
          "additionalProperties": false
         },
         "homePage": {
          "type": "string"
         },
         "categories": {
          "type": "array",
          "items": {
           "type": "string"
          }
         }
        },
        "nullable": true,
        "additionalProperties": false
       },
       "businessCategory": {
        "type": "string",
        "nullable": true,
        "enum": [
         "AUTOMOTIVE",
         "BEAUTY",
         "BIKES",
         "BOOKS",
         "CASINO",
         "EDUCATION",
         "EDUCATION_JAPAN",
         "ENTERTAINMENT",
         "EV_CHARGER",
         "FINANCIAL_USD",
         "FINANCIAL_CNY",
         "FINANCIAL_GBP",
         "FINANCIAL_JPY",
         "FINANCIAL_EUR",
         "FITNESS",
         "FOOD_AND_DRINK",
         "GAS",
         "GROCERY",
         "HEALTH_AND_MEDICAL",
         "HOTEL_AND_TRAVEL",
         "MUSIC",
         "PARKING",
         "PET_SERVICES",
         "PROFESSIONAL_SERVICES",
         "SHOPPING",
         "TICKETING",
         "TRANSIT"
        ]
       },
       "defaultLanguage": {
        "type": "string",
        "enum": [
         "AR",
         "CA",
         "CS",
         "DA",
         "DE",
         "EL",
         "EN",
         "ES",
         "FI",
         "FR",
         "HE",
         "HI",
         "HR",
         "HU",
         "ID",
         "IT",
         "JA",
         "KO",
         "MS",
         "NL",
         "NO",
         "PL",
         "PT",
         "RO",
         "RU",
         "SK",
         "SV",
         "TH",
         "TR",
         "UK",
         "VI",
         "ZH"
        ]
       }
      },
      "required": [
       "defaultLanguage",
       "isPoweredBy",
       "link"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appClip": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClips"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "headerImage": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClipAdvancedExperienceImages"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "localizations": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "appClipAdvancedExperienceLocalizations"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appClip",
       "headerImage",
       "localizations"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "appClipAdvancedExperienceLocalizations"
       ]
      },
      "id": {
       "type": "string"
      },
      "attributes": {
       "type": "object",
       "properties": {
        "language": {
         "type": "string",
         "enum": [
          "AR",
          "CA",
          "CS",
          "DA",
          "DE",
          "EL",
          "EN",
          "ES",
          "FI",
          "FR",
          "HE",
          "HI",
          "HR",
          "HU",
          "ID",
          "IT",
          "JA",
          "KO",
          "MS",
          "NL",
          "NO",
          "PL",
          "PT",
          "RO",
          "RU",
          "SK",
          "SV",
          "TH",
          "TR",
          "UK",
          "VI",
          "ZH"
         ]
        },
        "title": {
         "type": "string",
         "nullable": true
        },
        "subtitle": {
         "type": "string",
         "nullable": true
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipAdvancedExperienceUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipAdvancedExperiences"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "action": {
        "type": "string",
        "enum": [
         "OPEN",
         "VIEW",
         "PLAY"
        ]
       },
       "isPoweredBy": {
        "type": "boolean",
        "nullable": true
       },
       "place": {
        "type": "object",
        "properties": {
         "placeId": {
          "type": "string"
         },
         "names": {
          "type": "array",
          "items": {
           "type": "string"
          }
         },
         "mainAddress": {
          "type": "object",
          "properties": {
           "fullAddress": {
            "type": "string"
           },
           "structuredAddress": {
            "type": "object",
            "properties": {
             "streetAddress": {
              "type": "array",
              "items": {
               "type": "string"
              }
             },
             "floor": {
              "type": "string"
             },
             "neighborhood": {
              "type": "string"
             },
             "locality": {
              "type": "string"
             },
             "stateProvince": {
              "type": "string"
             },
             "postalCode": {
              "type": "string"
             },
             "countryCode": {
              "type": "string"
             }
            },
            "additionalProperties": false
           }
          },
          "additionalProperties": false
         },
         "displayPoint": {
          "type": "object",
          "properties": {
           "coordinates": {
            "type": "object",
            "properties": {
             "latitude": {
              "type": "number"
             },
             "longitude": {
              "type": "number"
             }
            },
            "additionalProperties": false
           },
           "source": {
            "type": "string",
            "enum": [
             "CALCULATED",
             "MANUALLY_PLACED"
            ]
           }
          },
          "additionalProperties": false
         },
         "mapAction": {
          "type": "string",
          "enum": [
           "BUY_TICKETS",
           "VIEW_AVAILABILITY",
           "VIEW_PRICING",
           "HOTEL_BOOK_ROOM",
           "PARKING_RESERVE_PARKING",
           "RESTAURANT_JOIN_WAITLIST",
           "RESTAURANT_ORDER_DELIVERY",
           "RESTAURANT_ORDER_FOOD",
           "RESTAURANT_ORDER_TAKEOUT",
           "RESTAURANT_RESERVATION",
           "SCHEDULE_APPOINTMENT",
           "RESTAURANT_VIEW_MENU",
           "THEATER_NOW_PLAYING",
           "AIRLINE_BOOK_TRAVEL",
           "AIRLINE_CHECK_IN",
           "AIRLINE_FLIGHT_STATUS",
           "APPLY",
           "BOOK",
           "BOOK_ACTIVITIES",
           "BOOK_RIDES",
           "BOOK_TEETIMES",
           "BOOK_TOURS",
           "CAREERS",
           "CHARGE_EV",
           "COUPONS",
           "DONATE",
           "EVENTS",
           "EVENTS_SHOWS",
           "EVENTS_SPORTS",
           "GIFT_CARD",
           "HOTEL_AMENITIES",
           "JOIN",
           "PARKING_AVAILABLE",
           "RESTAURANT_PICKUP",
           "RETAIL_SERVICE_QUOTE",
           "RETAIL_STORE_DELIVERY",
           "RETAIL_STORE_PICKUP",
           "RETAIL_STORE_SHOP",
           "SERVICES",
           "SUPPORT",
           "PAY_TO_PARK"
          ]
         },
         "relationship": {
          "type": "string",
          "enum": [
           "OWNER",
           "AUTHORIZED",
           "OTHER"
          ]
         },
         "phoneNumber": {
          "type": "object",
          "properties": {
           "number": {
            "type": "string"
           },
           "type": {
            "type": "string",
            "enum": [
             "FAX",
             "LANDLINE",
             "MOBILE",
             "TOLLFREE"
            ]
           },
           "intent": {
            "type": "string"
           }
          },
          "additionalProperties": false
         },
         "homePage": {
          "type": "string"
         },
         "categories": {
          "type": "array",
          "items": {
           "type": "string"
          }
         }
        },
        "nullable": true,
        "additionalProperties": false
       },
       "businessCategory": {
        "type": "string",
        "nullable": true,
        "enum": [
         "AUTOMOTIVE",
         "BEAUTY",
         "BIKES",
         "BOOKS",
         "CASINO",
         "EDUCATION",
         "EDUCATION_JAPAN",
         "ENTERTAINMENT",
         "EV_CHARGER",
         "FINANCIAL_USD",
         "FINANCIAL_CNY",
         "FINANCIAL_GBP",
         "FINANCIAL_JPY",
         "FINANCIAL_EUR",
         "FITNESS",
         "FOOD_AND_DRINK",
         "GAS",
         "GROCERY",
         "HEALTH_AND_MEDICAL",
         "HOTEL_AND_TRAVEL",
         "MUSIC",
         "PARKING",
         "PET_SERVICES",
         "PROFESSIONAL_SERVICES",
         "SHOPPING",
         "TICKETING",
         "TRANSIT"
        ]
       },
       "defaultLanguage": {
        "type": "string",
        "enum": [
         "AR",
         "CA",
         "CS",
         "DA",
         "DE",
         "EL",
         "EN",
         "ES",
         "FI",
         "FR",
         "HE",
         "HI",
         "HR",
         "HU",
         "ID",
         "IT",
         "JA",
         "KO",
         "MS",
         "NL",
         "NO",
         "PL",
         "PT",
         "RO",
         "RU",
         "SK",
         "SV",
         "TH",
         "TR",
         "UK",
         "VI",
         "ZH"
        ]
       },
       "removed": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appClip": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClips"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "headerImage": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClipAdvancedExperienceImages"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "localizations": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "appClipAdvancedExperienceLocalizations"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "appClipAdvancedExperienceLocalizations"
       ]
      },
      "id": {
       "type": "string"
      },
      "attributes": {
       "type": "object",
       "properties": {
        "language": {
         "type": "string",
         "enum": [
          "AR",
          "CA",
          "CS",
          "DA",
          "DE",
          "EL",
          "EN",
          "ES",
          "FI",
          "FR",
          "HE",
          "HI",
          "HR",
          "HU",
          "ID",
          "IT",
          "JA",
          "KO",
          "MS",
          "NL",
          "NO",
          "PL",
          "PT",
          "RO",
          "RU",
          "SK",
          "SV",
          "TH",
          "TR",
          "UK",
          "VI",
          "ZH"
         ]
        },
        "title": {
         "type": "string",
         "nullable": true
        },
        "subtitle": {
         "type": "string",
         "nullable": true
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipAppStoreReviewDetailCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipAppStoreReviewDetails"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "invocationUrls": {
        "type": "array",
        "items": {
         "type": "string",
         "format": "uri"
        },
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appClipDefaultExperience": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClipDefaultExperiences"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appClipDefaultExperience"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipAppStoreReviewDetailUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipAppStoreReviewDetails"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "invocationUrls": {
        "type": "array",
        "items": {
         "type": "string",
         "format": "uri"
        },
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipDefaultExperienceLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipDefaultExperienceLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "subtitle": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appClipDefaultExperience": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClipDefaultExperiences"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appClipDefaultExperience"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipDefaultExperienceLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipDefaultExperienceLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "subtitle": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipDefaultExperienceCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipDefaultExperiences"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "action": {
        "type": "string",
        "enum": [
         "OPEN",
         "VIEW",
         "PLAY"
        ]
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appClip": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClips"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "releaseWithAppStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appClipDefaultExperienceTemplate": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClipDefaultExperiences"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "appClip"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipDefaultExperienceUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipDefaultExperiences"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "action": {
        "type": "string",
        "enum": [
         "OPEN",
         "VIEW",
         "PLAY"
        ]
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "releaseWithAppStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipHeaderImageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipHeaderImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appClipDefaultExperienceLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClipDefaultExperienceLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appClipDefaultExperienceLocalization"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipHeaderImageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipHeaderImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppCustomProductPageLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appCustomProductPageLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "promotionalText": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appCustomProductPageVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCustomProductPageVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appCustomProductPageVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppCustomProductPageLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appCustomProductPageLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "promotionalText": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppCustomProductPageVersionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appCustomProductPageVersions"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "deepLink": {
        "type": "string",
        "format": "uri",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appCustomProductPage": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCustomProductPages"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "appCustomProductPageLocalizations": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "appCustomProductPageLocalizations"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "appCustomProductPage"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppCustomProductPageVersionUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appCustomProductPageVersions"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "deepLink": {
        "type": "string",
        "format": "uri",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppCustomProductPageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appCustomProductPages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       }
      },
      "required": [
       "name"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "appCustomProductPageVersions": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "appCustomProductPageVersions"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "appStoreVersionTemplate": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "customProductPageTemplate": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCustomProductPages"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "oneOf": [
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "appCustomProductPageLocalizations"
         ]
        },
        "id": {
         "type": "string"
        },
        "attributes": {
         "type": "object",
         "properties": {
          "locale": {
           "type": "string"
          },
          "promotionalText": {
           "type": "string",
           "nullable": true
          }
         },
         "required": [
          "locale"
         ],
         "additionalProperties": false
        },
        "relationships": {
         "type": "object",
         "properties": {
          "appCustomProductPageVersion": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "appCustomProductPageVersions"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "required": [
        "attributes",
        "type"
       ],
       "additionalProperties": false
      },
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "appCustomProductPageVersions"
         ]
        },
        "id": {
         "type": "string"
        },
        "attributes": {
         "type": "object",
         "properties": {
          "deepLink": {
           "type": "string",
           "format": "uri",
           "nullable": true
          }
         },
         "additionalProperties": false
        },
        "relationships": {
         "type": "object",
         "properties": {
          "appCustomProductPage": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "appCustomProductPages"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          },
          "appCustomProductPageLocalizations": {
           "type": "object",
           "properties": {
            "data": {
             "type": "array",
             "items": {
              "type": "object",
              "properties": {
               "type": {
                "type": "string",
                "enum": [
                 "appCustomProductPageLocalizations"
                ]
               },
               "id": {
                "type": "string"
               }
              },
              "required": [
               "id",
               "type"
              ],
              "additionalProperties": false
             }
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "required": [
        "type"
       ],
       "additionalProperties": false
      }
     ]
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppCustomProductPageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appCustomProductPages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "visible": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEncryptionDeclarationDocumentCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEncryptionDeclarationDocuments"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appEncryptionDeclaration": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appEncryptionDeclarations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appEncryptionDeclaration"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEncryptionDeclarationDocumentUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEncryptionDeclarationDocuments"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEncryptionDeclarationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEncryptionDeclarations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "appDescription": {
        "type": "string"
       },
       "containsProprietaryCryptography": {
        "type": "boolean"
       },
       "containsThirdPartyCryptography": {
        "type": "boolean"
       },
       "availableOnFrenchStore": {
        "type": "boolean"
       }
      },
      "required": [
       "availableOnFrenchStore",
       "appDescription",
       "containsThirdPartyCryptography",
       "containsProprietaryCryptography"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "deprecated": true,
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEventLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEventLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string",
        "nullable": true
       },
       "shortDescription": {
        "type": "string",
        "nullable": true
       },
       "longDescription": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appEvent": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appEvents"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appEvent"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEventLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEventLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "shortDescription": {
        "type": "string",
        "nullable": true
       },
       "longDescription": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEventScreenshotCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEventScreenshots"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       },
       "appEventAssetType": {
        "type": "string",
        "enum": [
         "EVENT_CARD",
         "EVENT_DETAILS_PAGE"
        ]
       }
      },
      "required": [
       "fileName",
       "appEventAssetType",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appEventLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appEventLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appEventLocalization"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEventScreenshotUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEventScreenshots"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEventVideoClipCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEventVideoClips"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       },
       "previewFrameTimeCode": {
        "type": "string",
        "nullable": true
       },
       "appEventAssetType": {
        "type": "string",
        "enum": [
         "EVENT_CARD",
         "EVENT_DETAILS_PAGE"
        ]
       }
      },
      "required": [
       "fileName",
       "appEventAssetType",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appEventLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appEventLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appEventLocalization"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEventVideoClipUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEventVideoClips"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "previewFrameTimeCode": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEventCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEvents"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "badge": {
        "type": "string",
        "nullable": true,
        "enum": [
         "LIVE_EVENT",
         "PREMIERE",
         "CHALLENGE",
         "COMPETITION",
         "NEW_SEASON",
         "MAJOR_UPDATE",
         "SPECIAL_EVENT"
        ]
       },
       "deepLink": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "purchaseRequirement": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NO_COST_ASSOCIATED",
         "IN_APP_PURCHASE"
        ]
       },
       "primaryLocale": {
        "type": "string",
        "nullable": true
       },
       "priority": {
        "type": "string",
        "nullable": true,
        "enum": [
         "HIGH",
         "NORMAL"
        ]
       },
       "purpose": {
        "type": "string",
        "nullable": true,
        "enum": [
         "APPROPRIATE_FOR_ALL_USERS",
         "ATTRACT_NEW_USERS",
         "KEEP_ACTIVE_USERS_INFORMED",
         "BRING_BACK_LAPSED_USERS"
        ]
       },
       "territorySchedules": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "territories": {
           "type": "array",
           "items": {
            "type": "string"
           }
          },
          "publishStart": {
           "type": "string",
           "format": "date-time"
          },
          "eventStart": {
           "type": "string",
           "format": "date-time"
          },
          "eventEnd": {
           "type": "string",
           "format": "date-time"
          }
         },
         "additionalProperties": false
        },
        "nullable": true
       }
      },
      "required": [
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEventUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEvents"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       },
       "badge": {
        "type": "string",
        "nullable": true,
        "enum": [
         "LIVE_EVENT",
         "PREMIERE",
         "CHALLENGE",
         "COMPETITION",
         "NEW_SEASON",
         "MAJOR_UPDATE",
         "SPECIAL_EVENT"
        ]
       },
       "deepLink": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "purchaseRequirement": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NO_COST_ASSOCIATED",
         "IN_APP_PURCHASE"
        ]
       },
       "primaryLocale": {
        "type": "string",
        "nullable": true
       },
       "priority": {
        "type": "string",
        "nullable": true,
        "enum": [
         "HIGH",
         "NORMAL"
        ]
       },
       "purpose": {
        "type": "string",
        "nullable": true,
        "enum": [
         "APPROPRIATE_FOR_ALL_USERS",
         "ATTRACT_NEW_USERS",
         "KEEP_ACTIVE_USERS_INFORMED",
         "BRING_BACK_LAPSED_USERS"
        ]
       },
       "territorySchedules": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "territories": {
           "type": "array",
           "items": {
            "type": "string"
           }
          },
          "publishStart": {
           "type": "string",
           "format": "date-time"
          },
          "eventStart": {
           "type": "string",
           "format": "date-time"
          },
          "eventEnd": {
           "type": "string",
           "format": "date-time"
          }
         },
         "additionalProperties": false
        },
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppInfoLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appInfoLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string"
       },
       "subtitle": {
        "type": "string",
        "nullable": true
       },
       "privacyPolicyUrl": {
        "type": "string",
        "nullable": true
       },
       "privacyChoicesUrl": {
        "type": "string",
        "nullable": true
       },
       "privacyPolicyText": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appInfo": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appInfos"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appInfo"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppInfoLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appInfoLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "subtitle": {
        "type": "string",
        "nullable": true
       },
       "privacyPolicyUrl": {
        "type": "string",
        "nullable": true
       },
       "privacyChoicesUrl": {
        "type": "string",
        "nullable": true
       },
       "privacyPolicyText": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppInfoUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appInfos"
      ]
     },
     "id": {
      "type": "string"
     },
     "relationships": {
      "type": "object",
      "properties": {
       "primaryCategory": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCategories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "primarySubcategoryOne": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCategories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "primarySubcategoryTwo": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCategories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "secondaryCategory": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCategories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "secondarySubcategoryOne": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCategories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "secondarySubcategoryTwo": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCategories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppPreviewSetCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appPreviewSets"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "previewType": {
        "type": "string",
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
       }
      },
      "required": [
       "previewType"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersionLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appCustomProductPageLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCustomProductPageLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appStoreVersionExperimentTreatmentLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionExperimentTreatmentLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppPreviewCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appPreviews"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       },
       "previewFrameTimeCode": {
        "type": "string",
        "nullable": true
       },
       "mimeType": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appPreviewSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appPreviewSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appPreviewSet"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppPreviewUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appPreviews"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "previewFrameTimeCode": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppPriceScheduleCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appPriceSchedules"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "baseTerritory": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "territories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "manualPrices": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "appPrices"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app",
       "manualPrices",
       "baseTerritory"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "oneOf": [
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "appPrices"
         ]
        },
        "id": {
         "type": "string"
        },
        "attributes": {
         "type": "object",
         "properties": {
          "startDate": {
           "type": "string",
           "format": "date",
           "nullable": true
          },
          "endDate": {
           "type": "string",
           "format": "date",
           "nullable": true
          }
         },
         "additionalProperties": false
        },
        "relationships": {
         "type": "object",
         "properties": {
          "appPricePoint": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "appPricePoints"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "required": [
        "type"
       ],
       "additionalProperties": false
      },
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "territories"
         ]
        },
        "id": {
         "type": "string"
        }
       },
       "required": [
        "type"
       ],
       "additionalProperties": false
      }
     ]
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppScreenshotSetCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appScreenshotSets"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "screenshotDisplayType": {
        "type": "string",
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
       }
      },
      "required": [
       "screenshotDisplayType"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersionLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appCustomProductPageLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCustomProductPageLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appStoreVersionExperimentTreatmentLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionExperimentTreatmentLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppScreenshotCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appScreenshots"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appScreenshotSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appScreenshotSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appScreenshotSet"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppScreenshotUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appScreenshots"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreReviewAttachmentCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreReviewAttachments"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreReviewDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreReviewDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreReviewDetail"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreReviewAttachmentUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreReviewAttachments"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreReviewDetailCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreReviewDetails"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "contactFirstName": {
        "type": "string",
        "nullable": true
       },
       "contactLastName": {
        "type": "string",
        "nullable": true
       },
       "contactPhone": {
        "type": "string",
        "nullable": true
       },
       "contactEmail": {
        "type": "string",
        "nullable": true
       },
       "demoAccountName": {
        "type": "string",
        "nullable": true
       },
       "demoAccountPassword": {
        "type": "string",
        "nullable": true
       },
       "demoAccountRequired": {
        "type": "boolean",
        "nullable": true
       },
       "notes": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreReviewDetailUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreReviewDetails"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "contactFirstName": {
        "type": "string",
        "nullable": true
       },
       "contactLastName": {
        "type": "string",
        "nullable": true
       },
       "contactPhone": {
        "type": "string",
        "nullable": true
       },
       "contactEmail": {
        "type": "string",
        "nullable": true
       },
       "demoAccountName": {
        "type": "string",
        "nullable": true
       },
       "demoAccountPassword": {
        "type": "string",
        "nullable": true
       },
       "demoAccountRequired": {
        "type": "boolean",
        "nullable": true
       },
       "notes": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionExperimentTreatmentLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionExperimentTreatmentLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       }
      },
      "required": [
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersionExperimentTreatment": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionExperimentTreatments"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersionExperimentTreatment"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionExperimentTreatmentCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionExperimentTreatments"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "appIconName": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersionExperiment": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionExperiments"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appStoreVersionExperimentV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionExperiments"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionExperimentTreatmentUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionExperimentTreatments"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "appIconName": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionExperimentV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionExperiments"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "platform": {
        "type": "string",
        "enum": [
         "IOS",
         "MAC_OS",
         "TV_OS",
         "VISION_OS"
        ]
       },
       "trafficProportion": {
        "type": "integer"
       }
      },
      "required": [
       "trafficProportion",
       "name",
       "platform"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionExperimentV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionExperiments"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "trafficProportion": {
        "type": "integer",
        "nullable": true
       },
       "started": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionExperimentCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionExperiments"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "trafficProportion": {
        "type": "integer"
       }
      },
      "required": [
       "trafficProportion",
       "name"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "AppStoreVersionExperimentUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionExperiments"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "trafficProportion": {
        "type": "integer",
        "nullable": true
       },
       "started": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "AppStoreVersionLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "description": {
        "type": "string",
        "nullable": true
       },
       "locale": {
        "type": "string"
       },
       "keywords": {
        "type": "string",
        "nullable": true
       },
       "marketingUrl": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "promotionalText": {
        "type": "string",
        "nullable": true
       },
       "supportUrl": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "whatsNew": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "description": {
        "type": "string",
        "nullable": true
       },
       "keywords": {
        "type": "string",
        "nullable": true
       },
       "marketingUrl": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "promotionalText": {
        "type": "string",
        "nullable": true
       },
       "supportUrl": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "whatsNew": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionPhasedReleaseCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionPhasedReleases"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "phasedReleaseState": {
        "type": "string",
        "enum": [
         "INACTIVE",
         "ACTIVE",
         "PAUSED",
         "COMPLETE"
        ]
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionPhasedReleaseUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionPhasedReleases"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "phasedReleaseState": {
        "type": "string",
        "enum": [
         "INACTIVE",
         "ACTIVE",
         "PAUSED",
         "COMPLETE"
        ]
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionPromotionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionPromotions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "appStoreVersionExperimentTreatment": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionExperimentTreatments"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersionExperimentTreatment",
       "appStoreVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionReleaseRequestCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersionReleaseRequests"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersions"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "platform": {
        "type": "string",
        "enum": [
         "IOS",
         "MAC_OS",
         "TV_OS",
         "VISION_OS"
        ]
       },
       "versionString": {
        "type": "string"
       },
       "copyright": {
        "type": "string",
        "nullable": true
       },
       "reviewType": {
        "type": "string",
        "nullable": true,
        "enum": [
         "APP_STORE",
         "NOTARIZATION"
        ]
       },
       "releaseType": {
        "type": "string",
        "nullable": true,
        "enum": [
         "MANUAL",
         "AFTER_APPROVAL",
         "SCHEDULED"
        ]
       },
       "earliestReleaseDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "usesIdfa": {
        "type": "boolean",
        "deprecated": true,
        "nullable": true
       }
      },
      "required": [
       "versionString",
       "platform"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "appStoreVersionLocalizations": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "appStoreVersionLocalizations"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "build": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "builds"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersions"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "versionString": {
        "type": "string",
        "nullable": true
       },
       "copyright": {
        "type": "string",
        "nullable": true
       },
       "reviewType": {
        "type": "string",
        "nullable": true,
        "enum": [
         "APP_STORE",
         "NOTARIZATION"
        ]
       },
       "releaseType": {
        "type": "string",
        "nullable": true,
        "enum": [
         "MANUAL",
         "AFTER_APPROVAL",
         "SCHEDULED"
        ]
       },
       "earliestReleaseDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "usesIdfa": {
        "type": "boolean",
        "deprecated": true,
        "nullable": true
       },
       "downloadable": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "build": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "builds"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appClipDefaultExperience": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appClipDefaultExperiences"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppTagUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appTags"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "visibleInAppStore": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "apps"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "accessibilityUrl": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "bundleId": {
        "type": "string",
        "nullable": true
       },
       "primaryLocale": {
        "type": "string",
        "nullable": true
       },
       "subscriptionStatusUrl": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "subscriptionStatusUrlVersion": {
        "type": "string",
        "enum": [
         "V1",
         "V2"
        ]
       },
       "subscriptionStatusUrlForSandbox": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "subscriptionStatusUrlVersionForSandbox": {
        "type": "string",
        "enum": [
         "V1",
         "V2"
        ]
       },
       "contentRightsDeclaration": {
        "type": "string",
        "nullable": true,
        "enum": [
         "DOES_NOT_USE_THIRD_PARTY_CONTENT",
         "USES_THIRD_PARTY_CONTENT"
        ]
       },
       "streamlinedPurchasingEnabled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BackgroundAssetUploadFileCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "backgroundAssetUploadFiles"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "assetType": {
        "type": "string",
        "enum": [
         "ASSET",
         "MANIFEST"
        ]
       },
       "fileName": {
        "type": "string"
       },
       "fileSize": {
        "type": "integer",
        "format": "int64",
        "maximum": 9007199254740991,
        "minimum": 1
       }
      },
      "required": [
       "fileName",
       "fileSize",
       "assetType"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "backgroundAssetVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "backgroundAssetVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "backgroundAssetVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BackgroundAssetUploadFileUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "backgroundAssetUploadFiles"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "deprecated": true,
        "nullable": true
       },
       "sourceFileChecksums": {
        "type": "object",
        "properties": {
         "file": {
          "type": "object",
          "properties": {
           "hash": {
            "type": "string"
           },
           "algorithm": {
            "type": "string",
            "enum": [
             "MD5",
             "SHA_256"
            ]
           }
          },
          "additionalProperties": false
         },
         "composite": {
          "type": "object",
          "properties": {
           "hash": {
            "type": "string"
           },
           "algorithm": {
            "type": "string",
            "enum": [
             "MD5"
            ]
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BackgroundAssetVersionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "backgroundAssetVersions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "backgroundAsset": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "backgroundAssets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "backgroundAsset"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BackgroundAssetCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "backgroundAssets"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "assetPackIdentifier": {
        "type": "string"
       }
      },
      "required": [
       "assetPackIdentifier"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BackgroundAssetUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "backgroundAssets"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "archived": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaAppClipInvocationLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaAppClipInvocationLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "title": {
        "type": "string"
       },
       "locale": {
        "type": "string"
       }
      },
      "required": [
       "locale",
       "title"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "betaAppClipInvocation": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "betaAppClipInvocations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "betaAppClipInvocation"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaAppClipInvocationLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaAppClipInvocationLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "title": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaAppClipInvocationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaAppClipInvocations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "url": {
        "type": "string",
        "format": "uri"
       }
      },
      "required": [
       "url"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "buildBundle": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "buildBundles"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "betaAppClipInvocationLocalizations": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "betaAppClipInvocationLocalizations"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "buildBundle",
       "betaAppClipInvocationLocalizations"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "betaAppClipInvocationLocalizations"
       ]
      },
      "id": {
       "type": "string"
      },
      "attributes": {
       "type": "object",
       "properties": {
        "title": {
         "type": "string"
        },
        "locale": {
         "type": "string"
        }
       },
       "required": [
        "locale",
        "title"
       ],
       "additionalProperties": false
      },
      "relationships": {
       "type": "object",
       "properties": {
        "betaAppClipInvocation": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "betaAppClipInvocations"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "attributes",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaAppClipInvocationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaAppClipInvocations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "url": {
        "type": "string",
        "format": "uri",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaAppLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaAppLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "feedbackEmail": {
        "type": "string",
        "nullable": true
       },
       "marketingUrl": {
        "type": "string",
        "nullable": true
       },
       "privacyPolicyUrl": {
        "type": "string",
        "nullable": true
       },
       "tvOsPrivacyPolicy": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       },
       "locale": {
        "type": "string"
       }
      },
      "required": [
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaAppLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaAppLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "feedbackEmail": {
        "type": "string",
        "nullable": true
       },
       "marketingUrl": {
        "type": "string",
        "nullable": true
       },
       "privacyPolicyUrl": {
        "type": "string",
        "nullable": true
       },
       "tvOsPrivacyPolicy": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaAppReviewDetailUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaAppReviewDetails"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "contactFirstName": {
        "type": "string",
        "nullable": true
       },
       "contactLastName": {
        "type": "string",
        "nullable": true
       },
       "contactPhone": {
        "type": "string",
        "nullable": true
       },
       "contactEmail": {
        "type": "string",
        "nullable": true
       },
       "demoAccountName": {
        "type": "string",
        "nullable": true
       },
       "demoAccountPassword": {
        "type": "string",
        "nullable": true
       },
       "demoAccountRequired": {
        "type": "boolean",
        "nullable": true
       },
       "notes": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaAppReviewSubmissionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaAppReviewSubmissions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "build": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "builds"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "build"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaBuildLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaBuildLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "whatsNew": {
        "type": "string",
        "nullable": true
       },
       "locale": {
        "type": "string"
       }
      },
      "required": [
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "build": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "builds"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "build"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaBuildLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaBuildLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "whatsNew": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaGroupCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaGroups"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "isInternalGroup": {
        "type": "boolean",
        "nullable": true
       },
       "hasAccessToAllBuilds": {
        "type": "boolean",
        "nullable": true
       },
       "publicLinkEnabled": {
        "type": "boolean",
        "nullable": true
       },
       "publicLinkLimitEnabled": {
        "type": "boolean",
        "nullable": true
       },
       "publicLinkLimit": {
        "type": "integer",
        "nullable": true
       },
       "feedbackEnabled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "required": [
       "name"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "builds": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "builds"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "betaTesters": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "betaTesters"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaGroupUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaGroups"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "publicLinkEnabled": {
        "type": "boolean",
        "nullable": true
       },
       "publicLinkLimitEnabled": {
        "type": "boolean",
        "nullable": true
       },
       "publicLinkLimit": {
        "type": "integer",
        "nullable": true
       },
       "feedbackEnabled": {
        "type": "boolean",
        "nullable": true
       },
       "iosBuildsAvailableForAppleSiliconMac": {
        "type": "boolean",
        "nullable": true
       },
       "iosBuildsAvailableForAppleVision": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaLicenseAgreementUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaLicenseAgreements"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "agreementText": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaRecruitmentCriterionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaRecruitmentCriteria"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "deviceFamilyOsVersionFilters": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "deviceFamily": {
           "type": "string",
           "enum": [
            "IPHONE",
            "IPAD",
            "APPLE_TV",
            "APPLE_WATCH",
            "MAC",
            "VISION"
           ]
          },
          "minimumOsInclusive": {
           "type": "string"
          },
          "maximumOsInclusive": {
           "type": "string"
          }
         },
         "additionalProperties": false
        }
       }
      },
      "required": [
       "deviceFamilyOsVersionFilters"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "betaGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "betaGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "betaGroup"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaRecruitmentCriterionUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaRecruitmentCriteria"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "deviceFamilyOsVersionFilters": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "deviceFamily": {
           "type": "string",
           "enum": [
            "IPHONE",
            "IPAD",
            "APPLE_TV",
            "APPLE_WATCH",
            "MAC",
            "VISION"
           ]
          },
          "minimumOsInclusive": {
           "type": "string"
          },
          "maximumOsInclusive": {
           "type": "string"
          }
         },
         "additionalProperties": false
        },
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaTesterInvitationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaTesterInvitations"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "betaTester": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "betaTesters"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "deprecated": true,
        "additionalProperties": false
       },
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaTesterCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "betaTesters"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "firstName": {
        "type": "string",
        "nullable": true
       },
       "lastName": {
        "type": "string",
        "nullable": true
       },
       "email": {
        "type": "string",
        "format": "email"
       }
      },
      "required": [
       "email"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "betaGroups": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "betaGroups"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "builds": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "builds"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BuildBetaDetailUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "buildBetaDetails"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "autoNotifyEnabled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BuildBetaNotificationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "buildBetaNotifications"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "build": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "builds"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "build"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BuildUploadFileCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "buildUploadFiles"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "assetType": {
        "type": "string",
        "enum": [
         "ASSET",
         "ASSET_DESCRIPTION",
         "ASSET_SPI"
        ]
       },
       "fileName": {
        "type": "string"
       },
       "fileSize": {
        "type": "integer",
        "format": "int64",
        "maximum": 9007199254740991,
        "minimum": 1
       },
       "uti": {
        "type": "string",
        "enum": [
         "com.apple.binary-property-list",
         "com.apple.ipa",
         "com.apple.pkg",
         "com.apple.xml-property-list",
         "com.pkware.zip-archive"
        ]
       }
      },
      "required": [
       "fileName",
       "fileSize",
       "uti",
       "assetType"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "buildUpload": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "buildUploads"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "buildUpload"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BuildUploadFileUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "buildUploadFiles"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksums": {
        "type": "object",
        "properties": {
         "file": {
          "type": "object",
          "properties": {
           "hash": {
            "type": "string"
           },
           "algorithm": {
            "type": "string",
            "enum": [
             "MD5",
             "SHA_256"
            ]
           }
          },
          "additionalProperties": false
         },
         "composite": {
          "type": "object",
          "properties": {
           "hash": {
            "type": "string"
           },
           "algorithm": {
            "type": "string",
            "enum": [
             "MD5"
            ]
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BuildUploadCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "buildUploads"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "cfBundleShortVersionString": {
        "type": "string"
       },
       "cfBundleVersion": {
        "type": "string"
       },
       "platform": {
        "type": "string",
        "enum": [
         "IOS",
         "MAC_OS",
         "TV_OS",
         "VISION_OS"
        ]
       }
      },
      "required": [
       "cfBundleVersion",
       "cfBundleShortVersionString",
       "platform"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BuildUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "builds"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "expired": {
        "type": "boolean",
        "nullable": true
       },
       "usesNonExemptEncryption": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appEncryptionDeclaration": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appEncryptionDeclarations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BundleIdCapabilityCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "bundleIdCapabilities"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "capabilityType": {
        "type": "string",
        "enum": [
         "ICLOUD",
         "IN_APP_PURCHASE",
         "GAME_CENTER",
         "PUSH_NOTIFICATIONS",
         "WALLET",
         "INTER_APP_AUDIO",
         "MAPS",
         "ASSOCIATED_DOMAINS",
         "PERSONAL_VPN",
         "APP_GROUPS",
         "HEALTHKIT",
         "HOMEKIT",
         "WIRELESS_ACCESSORY_CONFIGURATION",
         "APPLE_PAY",
         "DATA_PROTECTION",
         "SIRIKIT",
         "NETWORK_EXTENSIONS",
         "MULTIPATH",
         "HOT_SPOT",
         "NFC_TAG_READING",
         "CLASSKIT",
         "AUTOFILL_CREDENTIAL_PROVIDER",
         "ACCESS_WIFI_INFORMATION",
         "NETWORK_CUSTOM_PROTOCOL",
         "COREMEDIA_HLS_LOW_LATENCY",
         "SYSTEM_EXTENSION_INSTALL",
         "USER_MANAGEMENT",
         "APPLE_ID_AUTH"
        ]
       },
       "settings": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "key": {
           "type": "string",
           "enum": [
            "ICLOUD_VERSION",
            "DATA_PROTECTION_PERMISSION_LEVEL",
            "APPLE_ID_AUTH_APP_CONSENT"
           ]
          },
          "name": {
           "type": "string"
          },
          "description": {
           "type": "string"
          },
          "enabledByDefault": {
           "type": "boolean"
          },
          "visible": {
           "type": "boolean"
          },
          "allowedInstances": {
           "type": "string",
           "enum": [
            "ENTRY",
            "SINGLE",
            "MULTIPLE"
           ]
          },
          "minInstances": {
           "type": "integer"
          },
          "options": {
           "type": "array",
           "items": {
            "type": "object",
            "properties": {
             "key": {
              "type": "string",
              "enum": [
               "XCODE_5",
               "XCODE_6",
               "COMPLETE_PROTECTION",
               "PROTECTED_UNLESS_OPEN",
               "PROTECTED_UNTIL_FIRST_USER_AUTH",
               "PRIMARY_APP_CONSENT"
              ]
             },
             "name": {
              "type": "string"
             },
             "description": {
              "type": "string"
             },
             "enabledByDefault": {
              "type": "boolean"
             },
             "enabled": {
              "type": "boolean"
             },
             "supportsWildcard": {
              "type": "boolean"
             }
            },
            "additionalProperties": false
           }
          }
         },
         "additionalProperties": false
        },
        "nullable": true
       }
      },
      "required": [
       "capabilityType"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "bundleId": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "bundleIds"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "bundleId"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BundleIdCapabilityUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "bundleIdCapabilities"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "capabilityType": {
        "type": "string",
        "enum": [
         "ICLOUD",
         "IN_APP_PURCHASE",
         "GAME_CENTER",
         "PUSH_NOTIFICATIONS",
         "WALLET",
         "INTER_APP_AUDIO",
         "MAPS",
         "ASSOCIATED_DOMAINS",
         "PERSONAL_VPN",
         "APP_GROUPS",
         "HEALTHKIT",
         "HOMEKIT",
         "WIRELESS_ACCESSORY_CONFIGURATION",
         "APPLE_PAY",
         "DATA_PROTECTION",
         "SIRIKIT",
         "NETWORK_EXTENSIONS",
         "MULTIPATH",
         "HOT_SPOT",
         "NFC_TAG_READING",
         "CLASSKIT",
         "AUTOFILL_CREDENTIAL_PROVIDER",
         "ACCESS_WIFI_INFORMATION",
         "NETWORK_CUSTOM_PROTOCOL",
         "COREMEDIA_HLS_LOW_LATENCY",
         "SYSTEM_EXTENSION_INSTALL",
         "USER_MANAGEMENT",
         "APPLE_ID_AUTH"
        ]
       },
       "settings": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "key": {
           "type": "string",
           "enum": [
            "ICLOUD_VERSION",
            "DATA_PROTECTION_PERMISSION_LEVEL",
            "APPLE_ID_AUTH_APP_CONSENT"
           ]
          },
          "name": {
           "type": "string"
          },
          "description": {
           "type": "string"
          },
          "enabledByDefault": {
           "type": "boolean"
          },
          "visible": {
           "type": "boolean"
          },
          "allowedInstances": {
           "type": "string",
           "enum": [
            "ENTRY",
            "SINGLE",
            "MULTIPLE"
           ]
          },
          "minInstances": {
           "type": "integer"
          },
          "options": {
           "type": "array",
           "items": {
            "type": "object",
            "properties": {
             "key": {
              "type": "string",
              "enum": [
               "XCODE_5",
               "XCODE_6",
               "COMPLETE_PROTECTION",
               "PROTECTED_UNLESS_OPEN",
               "PROTECTED_UNTIL_FIRST_USER_AUTH",
               "PRIMARY_APP_CONSENT"
              ]
             },
             "name": {
              "type": "string"
             },
             "description": {
              "type": "string"
             },
             "enabledByDefault": {
              "type": "boolean"
             },
             "enabled": {
              "type": "boolean"
             },
             "supportsWildcard": {
              "type": "boolean"
             }
            },
            "additionalProperties": false
           }
          }
         },
         "additionalProperties": false
        },
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BundleIdCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "bundleIds"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "platform": {
        "type": "string",
        "enum": [
         "IOS",
         "MAC_OS",
         "UNIVERSAL",
         "SERVICES"
        ]
       },
       "identifier": {
        "type": "string"
       },
       "seedId": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "identifier",
       "name",
       "platform"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BundleIdUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "bundleIds"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "CertificateCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "certificates"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "csrContent": {
        "type": "string"
       },
       "certificateType": {
        "type": "string",
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
       }
      },
      "required": [
       "csrContent",
       "certificateType"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "merchantId": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "merchantIds"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "passTypeId": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "passTypeIds"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "CertificateUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "certificates"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "activated": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "CiBuildRunCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "ciBuildRuns"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "clean": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "buildRun": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "ciBuildRuns"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "workflow": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "ciWorkflows"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "sourceBranchOrTag": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "scmGitReferences"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "pullRequest": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "scmPullRequests"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "CiWorkflowCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "ciWorkflows"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "description": {
        "type": "string"
       },
       "branchStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "filesAndFoldersRule": {
          "type": "object",
          "properties": {
           "mode": {
            "type": "string",
            "enum": [
             "START_IF_ANY_FILE_MATCHES",
             "DO_NOT_START_IF_ALL_FILES_MATCH"
            ]
           },
           "matchers": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "directory": {
               "type": "string"
              },
              "fileExtension": {
               "type": "string"
              },
              "fileName": {
               "type": "string"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "autoCancel": {
          "type": "boolean"
         }
        },
        "additionalProperties": false
       },
       "tagStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "filesAndFoldersRule": {
          "type": "object",
          "properties": {
           "mode": {
            "type": "string",
            "enum": [
             "START_IF_ANY_FILE_MATCHES",
             "DO_NOT_START_IF_ALL_FILES_MATCH"
            ]
           },
           "matchers": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "directory": {
               "type": "string"
              },
              "fileExtension": {
               "type": "string"
              },
              "fileName": {
               "type": "string"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "autoCancel": {
          "type": "boolean"
         }
        },
        "additionalProperties": false
       },
       "pullRequestStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "destination": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "filesAndFoldersRule": {
          "type": "object",
          "properties": {
           "mode": {
            "type": "string",
            "enum": [
             "START_IF_ANY_FILE_MATCHES",
             "DO_NOT_START_IF_ALL_FILES_MATCH"
            ]
           },
           "matchers": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "directory": {
               "type": "string"
              },
              "fileExtension": {
               "type": "string"
              },
              "fileName": {
               "type": "string"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "autoCancel": {
          "type": "boolean"
         }
        },
        "additionalProperties": false
       },
       "scheduledStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "schedule": {
          "type": "object",
          "properties": {
           "frequency": {
            "type": "string",
            "enum": [
             "WEEKLY",
             "DAILY",
             "HOURLY"
            ]
           },
           "days": {
            "type": "array",
            "items": {
             "type": "string",
             "enum": [
              "SUNDAY",
              "MONDAY",
              "TUESDAY",
              "WEDNESDAY",
              "THURSDAY",
              "FRIDAY",
              "SATURDAY"
             ]
            }
           },
           "hour": {
            "type": "integer"
           },
           "minute": {
            "type": "integer"
           },
           "timezone": {
            "type": "string"
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "manualBranchStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "manualTagStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "manualPullRequestStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "destination": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "actions": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "name": {
           "type": "string"
          },
          "actionType": {
           "type": "string",
           "enum": [
            "BUILD",
            "ANALYZE",
            "TEST",
            "ARCHIVE"
           ]
          },
          "destination": {
           "type": "string",
           "enum": [
            "ANY_IOS_DEVICE",
            "ANY_IOS_SIMULATOR",
            "ANY_TVOS_DEVICE",
            "ANY_TVOS_SIMULATOR",
            "ANY_WATCHOS_DEVICE",
            "ANY_WATCHOS_SIMULATOR",
            "ANY_MAC",
            "ANY_MAC_CATALYST",
            "ANY_VISIONOS_DEVICE",
            "ANY_VISIONOS_SIMULATOR"
           ]
          },
          "buildDistributionAudience": {
           "type": "string",
           "enum": [
            "INTERNAL_ONLY",
            "APP_STORE_ELIGIBLE"
           ]
          },
          "testConfiguration": {
           "type": "object",
           "properties": {
            "kind": {
             "type": "string",
             "enum": [
              "USE_SCHEME_SETTINGS",
              "SPECIFIC_TEST_PLANS"
             ]
            },
            "testPlanName": {
             "type": "string"
            },
            "testDestinations": {
             "type": "array",
             "items": {
              "type": "object",
              "properties": {
               "deviceTypeName": {
                "type": "string"
               },
               "deviceTypeIdentifier": {
                "type": "string"
               },
               "runtimeName": {
                "type": "string"
               },
               "runtimeIdentifier": {
                "type": "string"
               },
               "kind": {
                "type": "string",
                "enum": [
                 "SIMULATOR",
                 "MAC"
                ]
               }
              },
              "additionalProperties": false
             }
            }
           },
           "additionalProperties": false
          },
          "scheme": {
           "type": "string"
          },
          "platform": {
           "type": "string",
           "enum": [
            "MACOS",
            "IOS",
            "TVOS",
            "WATCHOS",
            "VISIONOS"
           ]
          },
          "isRequiredToPass": {
           "type": "boolean"
          }
         },
         "additionalProperties": false
        }
       },
       "isEnabled": {
        "type": "boolean"
       },
       "isLockedForEditing": {
        "type": "boolean",
        "nullable": true
       },
       "clean": {
        "type": "boolean"
       },
       "containerFilePath": {
        "type": "string"
       }
      },
      "required": [
       "containerFilePath",
       "isEnabled",
       "name",
       "description",
       "clean",
       "actions"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "product": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "ciProducts"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "repository": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "scmRepositories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "xcodeVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "ciXcodeVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "macOsVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "ciMacOsVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "macOsVersion",
       "product",
       "repository",
       "xcodeVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "CiWorkflowUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "ciWorkflows"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       },
       "branchStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "filesAndFoldersRule": {
          "type": "object",
          "properties": {
           "mode": {
            "type": "string",
            "enum": [
             "START_IF_ANY_FILE_MATCHES",
             "DO_NOT_START_IF_ALL_FILES_MATCH"
            ]
           },
           "matchers": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "directory": {
               "type": "string"
              },
              "fileExtension": {
               "type": "string"
              },
              "fileName": {
               "type": "string"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "autoCancel": {
          "type": "boolean"
         }
        },
        "additionalProperties": false
       },
       "tagStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "filesAndFoldersRule": {
          "type": "object",
          "properties": {
           "mode": {
            "type": "string",
            "enum": [
             "START_IF_ANY_FILE_MATCHES",
             "DO_NOT_START_IF_ALL_FILES_MATCH"
            ]
           },
           "matchers": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "directory": {
               "type": "string"
              },
              "fileExtension": {
               "type": "string"
              },
              "fileName": {
               "type": "string"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "autoCancel": {
          "type": "boolean"
         }
        },
        "additionalProperties": false
       },
       "pullRequestStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "destination": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "filesAndFoldersRule": {
          "type": "object",
          "properties": {
           "mode": {
            "type": "string",
            "enum": [
             "START_IF_ANY_FILE_MATCHES",
             "DO_NOT_START_IF_ALL_FILES_MATCH"
            ]
           },
           "matchers": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "directory": {
               "type": "string"
              },
              "fileExtension": {
               "type": "string"
              },
              "fileName": {
               "type": "string"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "autoCancel": {
          "type": "boolean"
         }
        },
        "additionalProperties": false
       },
       "scheduledStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "schedule": {
          "type": "object",
          "properties": {
           "frequency": {
            "type": "string",
            "enum": [
             "WEEKLY",
             "DAILY",
             "HOURLY"
            ]
           },
           "days": {
            "type": "array",
            "items": {
             "type": "string",
             "enum": [
              "SUNDAY",
              "MONDAY",
              "TUESDAY",
              "WEDNESDAY",
              "THURSDAY",
              "FRIDAY",
              "SATURDAY"
             ]
            }
           },
           "hour": {
            "type": "integer"
           },
           "minute": {
            "type": "integer"
           },
           "timezone": {
            "type": "string"
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "manualBranchStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "manualTagStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "manualPullRequestStartCondition": {
        "type": "object",
        "properties": {
         "source": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         },
         "destination": {
          "type": "object",
          "properties": {
           "isAllMatch": {
            "type": "boolean"
           },
           "patterns": {
            "type": "array",
            "items": {
             "type": "object",
             "properties": {
              "pattern": {
               "type": "string"
              },
              "isPrefix": {
               "type": "boolean"
              }
             },
             "additionalProperties": false
            }
           }
          },
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "actions": {
        "type": "array",
        "items": {
         "type": "object",
         "properties": {
          "name": {
           "type": "string"
          },
          "actionType": {
           "type": "string",
           "enum": [
            "BUILD",
            "ANALYZE",
            "TEST",
            "ARCHIVE"
           ]
          },
          "destination": {
           "type": "string",
           "enum": [
            "ANY_IOS_DEVICE",
            "ANY_IOS_SIMULATOR",
            "ANY_TVOS_DEVICE",
            "ANY_TVOS_SIMULATOR",
            "ANY_WATCHOS_DEVICE",
            "ANY_WATCHOS_SIMULATOR",
            "ANY_MAC",
            "ANY_MAC_CATALYST",
            "ANY_VISIONOS_DEVICE",
            "ANY_VISIONOS_SIMULATOR"
           ]
          },
          "buildDistributionAudience": {
           "type": "string",
           "enum": [
            "INTERNAL_ONLY",
            "APP_STORE_ELIGIBLE"
           ]
          },
          "testConfiguration": {
           "type": "object",
           "properties": {
            "kind": {
             "type": "string",
             "enum": [
              "USE_SCHEME_SETTINGS",
              "SPECIFIC_TEST_PLANS"
             ]
            },
            "testPlanName": {
             "type": "string"
            },
            "testDestinations": {
             "type": "array",
             "items": {
              "type": "object",
              "properties": {
               "deviceTypeName": {
                "type": "string"
               },
               "deviceTypeIdentifier": {
                "type": "string"
               },
               "runtimeName": {
                "type": "string"
               },
               "runtimeIdentifier": {
                "type": "string"
               },
               "kind": {
                "type": "string",
                "enum": [
                 "SIMULATOR",
                 "MAC"
                ]
               }
              },
              "additionalProperties": false
             }
            }
           },
           "additionalProperties": false
          },
          "scheme": {
           "type": "string"
          },
          "platform": {
           "type": "string",
           "enum": [
            "MACOS",
            "IOS",
            "TVOS",
            "WATCHOS",
            "VISIONOS"
           ]
          },
          "isRequiredToPass": {
           "type": "boolean"
          }
         },
         "additionalProperties": false
        },
        "nullable": true
       },
       "isEnabled": {
        "type": "boolean",
        "nullable": true
       },
       "isLockedForEditing": {
        "type": "boolean",
        "nullable": true
       },
       "clean": {
        "type": "boolean",
        "nullable": true
       },
       "containerFilePath": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "xcodeVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "ciXcodeVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "macOsVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "ciMacOsVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "CustomerReviewResponseV1CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "customerReviewResponses"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "responseBody": {
        "type": "string"
       }
      },
      "required": [
       "responseBody"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "review": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "customerReviews"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "review"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "DeviceCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "devices"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "platform": {
        "type": "string",
        "enum": [
         "IOS",
         "MAC_OS",
         "UNIVERSAL",
         "SERVICES"
        ]
       },
       "udid": {
        "type": "string"
       }
      },
      "required": [
       "name",
       "udid",
       "platform"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "DeviceUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "devices"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "status": {
        "type": "string",
        "nullable": true,
        "enum": [
         "ENABLED",
         "DISABLED"
        ]
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "EndAppAvailabilityPreOrderCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "endAppAvailabilityPreOrders"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "territoryAvailabilities": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territoryAvailabilities"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "territoryAvailabilities"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "EndUserLicenseAgreementCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "endUserLicenseAgreements"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "agreementText": {
        "type": "string"
       }
      },
      "required": [
       "agreementText"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "territories": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app",
       "territories"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "EndUserLicenseAgreementUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "endUserLicenseAgreements"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "agreementText": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "territories": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementImageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterAchievementLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterAchievementLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterAchievementLocalization"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterAchievementImageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterAchievementImageV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "localization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterAchievementLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "localization"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementImageV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementLocalizationV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string"
       },
       "beforeEarnedDescription": {
        "type": "string"
       },
       "afterEarnedDescription": {
        "type": "string"
       }
      },
      "required": [
       "name",
       "beforeEarnedDescription",
       "locale",
       "afterEarnedDescription"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterAchievementVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementLocalizationV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "beforeEarnedDescription": {
        "type": "string",
        "nullable": true
       },
       "afterEarnedDescription": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string"
       },
       "beforeEarnedDescription": {
        "type": "string"
       },
       "afterEarnedDescription": {
        "type": "string"
       }
      },
      "required": [
       "name",
       "beforeEarnedDescription",
       "locale",
       "afterEarnedDescription"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterAchievement": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterAchievements"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterAchievement"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterAchievementLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "beforeEarnedDescription": {
        "type": "string",
        "nullable": true
       },
       "afterEarnedDescription": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterAchievementReleaseCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementReleases"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "gameCenterAchievement": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterAchievements"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterDetail",
       "gameCenterAchievement"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterAchievementVersionV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievementVersions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "achievement": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterAchievements"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "achievement"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievements"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "vendorIdentifier": {
        "type": "string"
       },
       "points": {
        "type": "integer"
       },
       "showBeforeEarned": {
        "type": "boolean"
       },
       "repeatable": {
        "type": "boolean"
       },
       "activityProperties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       }
      },
      "required": [
       "vendorIdentifier",
       "repeatable",
       "showBeforeEarned",
       "referenceName",
       "points"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "versions": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterAchievementVersions"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "versions"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterAchievementVersions"
       ]
      },
      "id": {
       "type": "string"
      },
      "relationships": {
       "type": "object",
       "properties": {
        "achievement": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterAchievements"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievements"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       },
       "points": {
        "type": "integer",
        "nullable": true
       },
       "showBeforeEarned": {
        "type": "boolean",
        "nullable": true
       },
       "repeatable": {
        "type": "boolean",
        "nullable": true
       },
       "archived": {
        "type": "boolean",
        "nullable": true
       },
       "activityProperties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievements"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "vendorIdentifier": {
        "type": "string"
       },
       "points": {
        "type": "integer"
       },
       "showBeforeEarned": {
        "type": "boolean"
       },
       "repeatable": {
        "type": "boolean"
       },
       "activityProperties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       }
      },
      "required": [
       "vendorIdentifier",
       "repeatable",
       "showBeforeEarned",
       "referenceName",
       "points"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterAchievementUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievements"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       },
       "points": {
        "type": "integer",
        "nullable": true
       },
       "showBeforeEarned": {
        "type": "boolean",
        "nullable": true
       },
       "repeatable": {
        "type": "boolean",
        "nullable": true
       },
       "archived": {
        "type": "boolean",
        "nullable": true
       },
       "activityProperties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterActivityCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivities"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "vendorIdentifier": {
        "type": "string"
       },
       "playStyle": {
        "type": "string",
        "nullable": true,
        "enum": [
         "ASYNCHRONOUS",
         "SYNCHRONOUS"
        ]
       },
       "minimumPlayersCount": {
        "type": "integer",
        "nullable": true
       },
       "maximumPlayersCount": {
        "type": "integer",
        "nullable": true
       },
       "supportsPartyCode": {
        "type": "boolean",
        "nullable": true
       },
       "properties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       }
      },
      "required": [
       "vendorIdentifier",
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "versions": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterActivityVersions"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterActivityVersions"
       ]
      },
      "id": {
       "type": "string"
      },
      "attributes": {
       "type": "object",
       "properties": {
        "fallbackUrl": {
         "type": "string",
         "nullable": true
        }
       },
       "additionalProperties": false
      },
      "relationships": {
       "type": "object",
       "properties": {
        "activity": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterActivities"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterActivityUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivities"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       },
       "playStyle": {
        "type": "string",
        "nullable": true,
        "enum": [
         "ASYNCHRONOUS",
         "SYNCHRONOUS"
        ]
       },
       "minimumPlayersCount": {
        "type": "integer",
        "nullable": true
       },
       "maximumPlayersCount": {
        "type": "integer",
        "nullable": true
       },
       "supportsPartyCode": {
        "type": "boolean",
        "nullable": true
       },
       "archived": {
        "type": "boolean",
        "nullable": true
       },
       "properties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterActivityImageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivityImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "localization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterActivityLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterActivityVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterActivityImageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivityImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterActivityLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivityLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string"
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterActivityVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterActivityLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivityLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterActivityVersionReleaseCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivityVersionReleases"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterActivityVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterDetail",
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterActivityVersionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivityVersions"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fallbackUrl": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "activity": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterActivities"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "activity"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterActivityVersionUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivityVersions"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fallbackUrl": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAppVersionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAppVersions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAppVersionUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAppVersions"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "enabled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterChallengeImageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallengeImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "localization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterChallengeLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterChallengeVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterChallengeImageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallengeImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterChallengeLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallengeLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string"
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterChallengeVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterChallengeLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallengeLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterChallengeVersionReleaseCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallengeVersionReleases"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterChallengeVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterDetail",
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterChallengeVersionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallengeVersions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "challenge": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterChallenges"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "challenge"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterChallengeCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallenges"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "vendorIdentifier": {
        "type": "string"
       },
       "challengeType": {
        "type": "string",
        "enum": [
         "LEADERBOARD"
        ]
       },
       "repeatable": {
        "type": "boolean",
        "nullable": true
       }
      },
      "required": [
       "vendorIdentifier",
       "challengeType",
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "versions": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterChallengeVersions"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "leaderboard": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "deprecated": true,
        "additionalProperties": false
       },
       "leaderboardV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterChallengeVersions"
       ]
      },
      "id": {
       "type": "string"
      },
      "relationships": {
       "type": "object",
       "properties": {
        "challenge": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterChallenges"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterChallengeUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallenges"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       },
       "archived": {
        "type": "boolean",
        "nullable": true
       },
       "repeatable": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "leaderboard": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "deprecated": true,
        "additionalProperties": false
       },
       "leaderboardV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterDetailCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterDetails"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "challengeEnabled": {
        "type": "boolean",
        "deprecated": true,
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterDetailUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterDetails"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "challengeEnabled": {
        "type": "boolean",
        "deprecated": true,
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "defaultLeaderboard": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "deprecated": true,
        "additionalProperties": false
       },
       "defaultLeaderboardV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "defaultGroupLeaderboard": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "deprecated": true,
        "additionalProperties": false
       },
       "defaultGroupLeaderboardV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterGroupCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterGroups"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterGroupUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterGroups"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardEntrySubmissionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardEntrySubmissions"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "bundleId": {
        "type": "string"
       },
       "challengeIds": {
        "type": "array",
        "items": {
         "type": "string"
        },
        "nullable": true
       },
       "context": {
        "type": "string",
        "format": "number",
        "nullable": true
       },
       "scopedPlayerId": {
        "type": "string"
       },
       "score": {
        "type": "string",
        "format": "number"
       },
       "submittedDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "vendorIdentifier": {
        "type": "string"
       },
       "preReleased": {
        "type": "boolean",
        "nullable": true
       }
      },
      "required": [
       "vendorIdentifier",
       "score",
       "bundleId",
       "scopedPlayerId"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardImageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterLeaderboardLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterLeaderboardLocalization"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardImageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardImageV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "localization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "localization"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardImageV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string"
       },
       "formatterOverride": {
        "type": "string",
        "enum": [
         "INTEGER",
         "DECIMAL_POINT_1_PLACE",
         "DECIMAL_POINT_2_PLACE",
         "DECIMAL_POINT_3_PLACE",
         "ELAPSED_TIME_CENTISECOND",
         "ELAPSED_TIME_MINUTE",
         "ELAPSED_TIME_SECOND",
         "MONEY_POUND_DECIMAL",
         "MONEY_POUND",
         "MONEY_DOLLAR_DECIMAL",
         "MONEY_DOLLAR",
         "MONEY_EURO_DECIMAL",
         "MONEY_EURO",
         "MONEY_FRANC_DECIMAL",
         "MONEY_FRANC",
         "MONEY_KRONER_DECIMAL",
         "MONEY_KRONER",
         "MONEY_YEN"
        ]
       },
       "formatterSuffix": {
        "type": "string",
        "nullable": true
       },
       "formatterSuffixSingular": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterLeaderboard": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterLeaderboard"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "formatterOverride": {
        "type": "string",
        "enum": [
         "INTEGER",
         "DECIMAL_POINT_1_PLACE",
         "DECIMAL_POINT_2_PLACE",
         "DECIMAL_POINT_3_PLACE",
         "ELAPSED_TIME_CENTISECOND",
         "ELAPSED_TIME_MINUTE",
         "ELAPSED_TIME_SECOND",
         "MONEY_POUND_DECIMAL",
         "MONEY_POUND",
         "MONEY_DOLLAR_DECIMAL",
         "MONEY_DOLLAR",
         "MONEY_EURO_DECIMAL",
         "MONEY_EURO",
         "MONEY_FRANC_DECIMAL",
         "MONEY_FRANC",
         "MONEY_KRONER_DECIMAL",
         "MONEY_KRONER",
         "MONEY_YEN"
        ]
       },
       "formatterSuffix": {
        "type": "string",
        "nullable": true
       },
       "formatterSuffixSingular": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardLocalizationV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string"
       },
       "formatterOverride": {
        "type": "string",
        "enum": [
         "INTEGER",
         "DECIMAL_POINT_1_PLACE",
         "DECIMAL_POINT_2_PLACE",
         "DECIMAL_POINT_3_PLACE",
         "ELAPSED_TIME_CENTISECOND",
         "ELAPSED_TIME_MINUTE",
         "ELAPSED_TIME_SECOND",
         "MONEY_POUND_DECIMAL",
         "MONEY_POUND",
         "MONEY_DOLLAR_DECIMAL",
         "MONEY_DOLLAR",
         "MONEY_EURO_DECIMAL",
         "MONEY_EURO",
         "MONEY_FRANC_DECIMAL",
         "MONEY_FRANC",
         "MONEY_KRONER_DECIMAL",
         "MONEY_KRONER",
         "MONEY_YEN"
        ]
       },
       "formatterSuffix": {
        "type": "string",
        "nullable": true
       },
       "formatterSuffixSingular": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardLocalizationV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "formatterOverride": {
        "type": "string",
        "enum": [
         "INTEGER",
         "DECIMAL_POINT_1_PLACE",
         "DECIMAL_POINT_2_PLACE",
         "DECIMAL_POINT_3_PLACE",
         "ELAPSED_TIME_CENTISECOND",
         "ELAPSED_TIME_MINUTE",
         "ELAPSED_TIME_SECOND",
         "MONEY_POUND_DECIMAL",
         "MONEY_POUND",
         "MONEY_DOLLAR_DECIMAL",
         "MONEY_DOLLAR",
         "MONEY_EURO_DECIMAL",
         "MONEY_EURO",
         "MONEY_FRANC_DECIMAL",
         "MONEY_FRANC",
         "MONEY_KRONER_DECIMAL",
         "MONEY_KRONER",
         "MONEY_YEN"
        ]
       },
       "formatterSuffix": {
        "type": "string",
        "nullable": true
       },
       "formatterSuffixSingular": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardReleaseCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardReleases"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "gameCenterLeaderboard": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterDetail",
       "gameCenterLeaderboard"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetImageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterLeaderboardSetLocalization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardSetLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterLeaderboardSetLocalization"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetImageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetImageV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "localization": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardSetLocalizations"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "localization"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetImageV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string"
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterLeaderboardSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterLeaderboardSet"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetLocalizationV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "locale": {
        "type": "string"
       },
       "name": {
        "type": "string"
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardSetVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetLocalizationV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetMemberLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetMemberLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "locale": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterLeaderboardSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "gameCenterLeaderboard": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterLeaderboard",
       "gameCenterLeaderboardSet"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetMemberLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetMemberLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetReleaseCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetReleases"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "gameCenterLeaderboardSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "gameCenterDetail",
       "gameCenterLeaderboardSet"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetVersionV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSetVersions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "leaderboardSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "leaderboardSet"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSets"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "vendorIdentifier": {
        "type": "string"
       }
      },
      "required": [
       "vendorIdentifier",
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterLeaderboards": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterLeaderboards"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "versions": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterLeaderboardSetVersions"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "versions"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboardSetVersions"
       ]
      },
      "id": {
       "type": "string"
      },
      "relationships": {
       "type": "object",
       "properties": {
        "leaderboardSet": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterLeaderboardSets"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSets"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSets"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "vendorIdentifier": {
        "type": "string"
       }
      },
      "required": [
       "vendorIdentifier",
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterLeaderboards": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterLeaderboards"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSets"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardVersionV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardVersions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "leaderboard": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboards"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "leaderboard"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboards"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "defaultFormatter": {
        "type": "string",
        "enum": [
         "INTEGER",
         "DECIMAL_POINT_1_PLACE",
         "DECIMAL_POINT_2_PLACE",
         "DECIMAL_POINT_3_PLACE",
         "ELAPSED_TIME_CENTISECOND",
         "ELAPSED_TIME_MINUTE",
         "ELAPSED_TIME_SECOND",
         "MONEY_POUND_DECIMAL",
         "MONEY_POUND",
         "MONEY_DOLLAR_DECIMAL",
         "MONEY_DOLLAR",
         "MONEY_EURO_DECIMAL",
         "MONEY_EURO",
         "MONEY_FRANC_DECIMAL",
         "MONEY_FRANC",
         "MONEY_KRONER_DECIMAL",
         "MONEY_KRONER",
         "MONEY_YEN"
        ]
       },
       "referenceName": {
        "type": "string"
       },
       "vendorIdentifier": {
        "type": "string"
       },
       "submissionType": {
        "type": "string",
        "enum": [
         "BEST_SCORE",
         "MOST_RECENT_SCORE"
        ]
       },
       "scoreSortType": {
        "type": "string",
        "enum": [
         "ASC",
         "DESC"
        ]
       },
       "scoreRangeStart": {
        "type": "string",
        "format": "number",
        "nullable": true
       },
       "scoreRangeEnd": {
        "type": "string",
        "format": "number",
        "nullable": true
       },
       "recurrenceStartDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "recurrenceDuration": {
        "type": "string",
        "format": "duration",
        "nullable": true
       },
       "recurrenceRule": {
        "type": "string",
        "nullable": true
       },
       "activityProperties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       },
       "visibility": {
        "type": "string",
        "nullable": true,
        "enum": [
         "SHOW_FOR_ALL",
         "HIDE_FOR_ALL"
        ]
       }
      },
      "required": [
       "vendorIdentifier",
       "submissionType",
       "defaultFormatter",
       "scoreSortType",
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterLeaderboardSets": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterLeaderboardSets"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboards"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "defaultFormatter": {
        "type": "string",
        "enum": [
         "INTEGER",
         "DECIMAL_POINT_1_PLACE",
         "DECIMAL_POINT_2_PLACE",
         "DECIMAL_POINT_3_PLACE",
         "ELAPSED_TIME_CENTISECOND",
         "ELAPSED_TIME_MINUTE",
         "ELAPSED_TIME_SECOND",
         "MONEY_POUND_DECIMAL",
         "MONEY_POUND",
         "MONEY_DOLLAR_DECIMAL",
         "MONEY_DOLLAR",
         "MONEY_EURO_DECIMAL",
         "MONEY_EURO",
         "MONEY_FRANC_DECIMAL",
         "MONEY_FRANC",
         "MONEY_KRONER_DECIMAL",
         "MONEY_KRONER",
         "MONEY_YEN"
        ]
       },
       "referenceName": {
        "type": "string",
        "nullable": true
       },
       "submissionType": {
        "type": "string",
        "nullable": true,
        "enum": [
         "BEST_SCORE",
         "MOST_RECENT_SCORE"
        ]
       },
       "scoreSortType": {
        "type": "string",
        "nullable": true,
        "enum": [
         "ASC",
         "DESC"
        ]
       },
       "scoreRangeStart": {
        "type": "string",
        "format": "number",
        "nullable": true
       },
       "scoreRangeEnd": {
        "type": "string",
        "format": "number",
        "nullable": true
       },
       "recurrenceStartDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "recurrenceDuration": {
        "type": "string",
        "format": "duration",
        "nullable": true
       },
       "recurrenceRule": {
        "type": "string",
        "nullable": true
       },
       "archived": {
        "type": "boolean",
        "nullable": true
       },
       "activityProperties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       },
       "visibility": {
        "type": "string",
        "nullable": true,
        "enum": [
         "SHOW_FOR_ALL",
         "HIDE_FOR_ALL"
        ]
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboards"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "defaultFormatter": {
        "type": "string",
        "enum": [
         "INTEGER",
         "DECIMAL_POINT_1_PLACE",
         "DECIMAL_POINT_2_PLACE",
         "DECIMAL_POINT_3_PLACE",
         "ELAPSED_TIME_CENTISECOND",
         "ELAPSED_TIME_MINUTE",
         "ELAPSED_TIME_SECOND",
         "MONEY_POUND_DECIMAL",
         "MONEY_POUND",
         "MONEY_DOLLAR_DECIMAL",
         "MONEY_DOLLAR",
         "MONEY_EURO_DECIMAL",
         "MONEY_EURO",
         "MONEY_FRANC_DECIMAL",
         "MONEY_FRANC",
         "MONEY_KRONER_DECIMAL",
         "MONEY_KRONER",
         "MONEY_YEN"
        ]
       },
       "referenceName": {
        "type": "string"
       },
       "vendorIdentifier": {
        "type": "string"
       },
       "submissionType": {
        "type": "string",
        "enum": [
         "BEST_SCORE",
         "MOST_RECENT_SCORE"
        ]
       },
       "scoreSortType": {
        "type": "string",
        "enum": [
         "ASC",
         "DESC"
        ]
       },
       "scoreRangeStart": {
        "type": "string",
        "format": "number",
        "nullable": true
       },
       "scoreRangeEnd": {
        "type": "string",
        "format": "number",
        "nullable": true
       },
       "recurrenceStartDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "recurrenceDuration": {
        "type": "string",
        "format": "duration",
        "nullable": true
       },
       "recurrenceRule": {
        "type": "string",
        "nullable": true
       },
       "activityProperties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       },
       "visibility": {
        "type": "string",
        "nullable": true,
        "enum": [
         "SHOW_FOR_ALL",
         "HIDE_FOR_ALL"
        ]
       }
      },
      "required": [
       "vendorIdentifier",
       "submissionType",
       "defaultFormatter",
       "scoreSortType",
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "gameCenterDetail": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterDetails"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterLeaderboardSets": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterLeaderboardSets"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "versions": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterLeaderboardVersions"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "versions"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboardVersions"
       ]
      },
      "id": {
       "type": "string"
      },
      "relationships": {
       "type": "object",
       "properties": {
        "leaderboard": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterLeaderboards"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboards"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "defaultFormatter": {
        "type": "string",
        "enum": [
         "INTEGER",
         "DECIMAL_POINT_1_PLACE",
         "DECIMAL_POINT_2_PLACE",
         "DECIMAL_POINT_3_PLACE",
         "ELAPSED_TIME_CENTISECOND",
         "ELAPSED_TIME_MINUTE",
         "ELAPSED_TIME_SECOND",
         "MONEY_POUND_DECIMAL",
         "MONEY_POUND",
         "MONEY_DOLLAR_DECIMAL",
         "MONEY_DOLLAR",
         "MONEY_EURO_DECIMAL",
         "MONEY_EURO",
         "MONEY_FRANC_DECIMAL",
         "MONEY_FRANC",
         "MONEY_KRONER_DECIMAL",
         "MONEY_KRONER",
         "MONEY_YEN"
        ]
       },
       "referenceName": {
        "type": "string",
        "nullable": true
       },
       "submissionType": {
        "type": "string",
        "nullable": true,
        "enum": [
         "BEST_SCORE",
         "MOST_RECENT_SCORE"
        ]
       },
       "scoreSortType": {
        "type": "string",
        "nullable": true,
        "enum": [
         "ASC",
         "DESC"
        ]
       },
       "scoreRangeStart": {
        "type": "string",
        "format": "number",
        "nullable": true
       },
       "scoreRangeEnd": {
        "type": "string",
        "format": "number",
        "nullable": true
       },
       "recurrenceStartDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "recurrenceDuration": {
        "type": "string",
        "format": "duration",
        "nullable": true
       },
       "recurrenceRule": {
        "type": "string",
        "nullable": true
       },
       "archived": {
        "type": "boolean",
        "nullable": true
       },
       "activityProperties": {
        "type": "object",
        "additionalProperties": {
         "type": "string"
        }
       },
       "visibility": {
        "type": "string",
        "nullable": true,
        "enum": [
         "SHOW_FOR_ALL",
         "HIDE_FOR_ALL"
        ]
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterMatchmakingQueueCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterMatchmakingQueues"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "classicMatchmakingBundleIds": {
        "type": "array",
        "items": {
         "type": "string"
        },
        "nullable": true
       }
      },
      "required": [
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "ruleSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterMatchmakingRuleSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "experimentRuleSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterMatchmakingRuleSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "ruleSet"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterMatchmakingQueueUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterMatchmakingQueues"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "classicMatchmakingBundleIds": {
        "type": "array",
        "items": {
         "type": "string"
        },
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "ruleSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterMatchmakingRuleSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "experimentRuleSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterMatchmakingRuleSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterMatchmakingRuleSetTestCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterMatchmakingRuleSetTests"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "matchmakingRuleSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterMatchmakingRuleSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "matchmakingRequests": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "gameCenterMatchmakingTestRequests"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "matchmakingRuleSet",
       "matchmakingRequests"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "oneOf": [
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "gameCenterMatchmakingTestPlayerProperties"
         ]
        },
        "id": {
         "type": "string"
        },
        "attributes": {
         "type": "object",
         "properties": {
          "playerId": {
           "type": "string"
          },
          "properties": {
           "type": "array",
           "items": {
            "type": "object",
            "properties": {
             "key": {
              "type": "string"
             },
             "value": {
              "type": "string"
             }
            },
            "additionalProperties": false
           },
           "nullable": true
          }
         },
         "additionalProperties": false
        }
       },
       "required": [
        "type"
       ],
       "additionalProperties": false
      },
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "gameCenterMatchmakingTestRequests"
         ]
        },
        "id": {
         "type": "string"
        },
        "attributes": {
         "type": "object",
         "properties": {
          "requestName": {
           "type": "string"
          },
          "secondsInQueue": {
           "type": "integer"
          },
          "locale": {
           "type": "string",
           "nullable": true,
           "enum": [
            "AR-SA",
            "CA-ES",
            "CS-CZ",
            "DA-DK",
            "DE-DE",
            "EL-GR",
            "EN-AU",
            "EN-GB",
            "EN-US",
            "EN-KY",
            "ES-ES",
            "ES-MX",
            "FI-FI",
            "FR-CA",
            "FR-FR",
            "HI-IN",
            "HR-HR",
            "HU-HU",
            "ID-ID",
            "IT-IT",
            "IW-IL",
            "JA-JP",
            "KO-KR",
            "MS-MY",
            "NL-NL",
            "NO-NO",
            "PL-PL",
            "PT-BR",
            "PT-PT",
            "RO-RO",
            "RU-RU",
            "SK-SK",
            "SV-SE",
            "TH-TH",
            "TR-TR",
            "UK-UA",
            "ZH-CN",
            "ZH-TW",
            "ZH-HK"
           ]
          },
          "location": {
           "type": "object",
           "properties": {
            "latitude": {
             "type": "number"
            },
            "longitude": {
             "type": "number"
            }
           },
           "additionalProperties": false
          },
          "minPlayers": {
           "type": "integer",
           "nullable": true
          },
          "maxPlayers": {
           "type": "integer",
           "nullable": true
          },
          "playerCount": {
           "type": "integer",
           "nullable": true
          },
          "bundleId": {
           "type": "string"
          },
          "platform": {
           "type": "string",
           "enum": [
            "IOS",
            "MAC_OS",
            "TV_OS",
            "VISION_OS"
           ]
          },
          "appVersion": {
           "type": "string"
          }
         },
         "additionalProperties": false
        },
        "relationships": {
         "type": "object",
         "properties": {
          "matchmakingPlayerProperties": {
           "type": "object",
           "properties": {
            "data": {
             "type": "array",
             "items": {
              "type": "object",
              "properties": {
               "type": {
                "type": "string",
                "enum": [
                 "gameCenterMatchmakingTestPlayerProperties"
                ]
               },
               "id": {
                "type": "string"
               }
              },
              "required": [
               "id",
               "type"
              ],
              "additionalProperties": false
             }
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "required": [
        "type"
       ],
       "additionalProperties": false
      }
     ]
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterMatchmakingRuleSetCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterMatchmakingRuleSets"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "ruleLanguageVersion": {
        "type": "integer"
       },
       "minPlayers": {
        "type": "integer"
       },
       "maxPlayers": {
        "type": "integer"
       }
      },
      "required": [
       "maxPlayers",
       "minPlayers",
       "referenceName",
       "ruleLanguageVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterMatchmakingRuleSetUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterMatchmakingRuleSets"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "minPlayers": {
        "type": "integer",
        "nullable": true
       },
       "maxPlayers": {
        "type": "integer",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterMatchmakingRuleCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterMatchmakingRules"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "description": {
        "type": "string"
       },
       "type": {
        "type": "string",
        "enum": [
         "COMPATIBLE",
         "DISTANCE",
         "MATCH",
         "TEAM"
        ]
       },
       "expression": {
        "type": "string"
       },
       "weight": {
        "type": "number",
        "nullable": true
       }
      },
      "required": [
       "expression",
       "description",
       "type",
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "ruleSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterMatchmakingRuleSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "ruleSet"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterMatchmakingRuleUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterMatchmakingRules"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "description": {
        "type": "string",
        "nullable": true
       },
       "expression": {
        "type": "string",
        "nullable": true
       },
       "weight": {
        "type": "number",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterMatchmakingTeamCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterMatchmakingTeams"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "minPlayers": {
        "type": "integer"
       },
       "maxPlayers": {
        "type": "integer"
       }
      },
      "required": [
       "maxPlayers",
       "minPlayers",
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "ruleSet": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterMatchmakingRuleSets"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "ruleSet"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterMatchmakingTeamUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterMatchmakingTeams"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "minPlayers": {
        "type": "integer",
        "nullable": true
       },
       "maxPlayers": {
        "type": "integer",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterPlayerAchievementSubmissionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterPlayerAchievementSubmissions"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "bundleId": {
        "type": "string"
       },
       "challengeIds": {
        "type": "array",
        "items": {
         "type": "string"
        },
        "nullable": true
       },
       "percentageAchieved": {
        "type": "integer"
       },
       "scopedPlayerId": {
        "type": "string"
       },
       "submittedDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "vendorIdentifier": {
        "type": "string"
       },
       "preReleased": {
        "type": "boolean",
        "nullable": true
       }
      },
      "required": [
       "vendorIdentifier",
       "percentageAchieved",
       "bundleId",
       "scopedPlayerId"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseAppStoreReviewScreenshotCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseAppStoreReviewScreenshots"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "inAppPurchaseV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchases"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "inAppPurchaseV2"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseAppStoreReviewScreenshotUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseAppStoreReviewScreenshots"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseAvailabilityCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseAvailabilities"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "availableInNewTerritories": {
        "type": "boolean"
       }
      },
      "required": [
       "availableInNewTerritories"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "inAppPurchase": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchases"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "availableTerritories": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "inAppPurchase",
       "availableTerritories"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseImageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "inAppPurchase": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchases"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "inAppPurchase"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseImageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseImageV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchaseVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseImageV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "locale": {
        "type": "string"
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "inAppPurchaseV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchases"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "inAppPurchaseV2"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseLocalizationV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "locale": {
        "type": "string"
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchaseVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseLocalizationV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseOfferCodeCustomCodeCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseOfferCodeCustomCodes"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "customCode": {
        "type": "string"
       },
       "numberOfCodes": {
        "type": "integer"
       },
       "expirationDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       }
      },
      "required": [
       "numberOfCodes",
       "customCode"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "offerCode": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchaseOfferCodes"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "offerCode"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseOfferCodeCustomCodeUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseOfferCodeCustomCodes"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "active": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseOfferCodeOneTimeUseCodeCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseOfferCodeOneTimeUseCodes"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "numberOfCodes": {
        "type": "integer"
       },
       "expirationDate": {
        "type": "string",
        "format": "date"
       },
       "environment": {
        "type": "string",
        "enum": [
         "PRODUCTION",
         "SANDBOX"
        ]
       }
      },
      "required": [
       "numberOfCodes",
       "expirationDate"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "offerCode": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchaseOfferCodes"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "offerCode"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseOfferCodeOneTimeUseCodeUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseOfferCodeOneTimeUseCodes"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "active": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseOfferCodeCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseOfferCodes"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "customerEligibilities": {
        "type": "array",
        "items": {
         "type": "string",
         "enum": [
          "NON_SPENDER",
          "ACTIVE_SPENDER",
          "CHURNED_SPENDER"
         ]
        }
       }
      },
      "required": [
       "name",
       "customerEligibilities"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "inAppPurchase": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchases"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "prices": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "inAppPurchaseOfferPrices"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "inAppPurchase",
       "prices"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "inAppPurchaseOfferPrices"
       ]
      },
      "id": {
       "type": "string"
      },
      "relationships": {
       "type": "object",
       "properties": {
        "territory": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        },
        "pricePoint": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "inAppPurchasePricePoints"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseOfferCodeUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseOfferCodes"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "active": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchasePriceScheduleCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchasePriceSchedules"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "inAppPurchase": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchases"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "baseTerritory": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "territories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "manualPrices": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "inAppPurchasePrices"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "inAppPurchase",
       "manualPrices",
       "baseTerritory"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "oneOf": [
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "inAppPurchasePrices"
         ]
        },
        "id": {
         "type": "string"
        },
        "attributes": {
         "type": "object",
         "properties": {
          "startDate": {
           "type": "string",
           "format": "date",
           "nullable": true
          },
          "endDate": {
           "type": "string",
           "format": "date",
           "nullable": true
          }
         },
         "additionalProperties": false
        },
        "relationships": {
         "type": "object",
         "properties": {
          "inAppPurchaseV2": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "inAppPurchases"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          },
          "inAppPurchasePricePoint": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "inAppPurchasePricePoints"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "required": [
        "type"
       ],
       "additionalProperties": false
      },
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "territories"
         ]
        },
        "id": {
         "type": "string"
        }
       },
       "required": [
        "type"
       ],
       "additionalProperties": false
      }
     ]
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseSubmissionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseSubmissions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "inAppPurchaseV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchases"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "inAppPurchaseV2"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseVersionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchaseVersions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "inAppPurchase": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchases"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "inAppPurchase"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchases"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "productId": {
        "type": "string"
       },
       "inAppPurchaseType": {
        "type": "string",
        "enum": [
         "CONSUMABLE",
         "NON_CONSUMABLE",
         "NON_RENEWING_SUBSCRIPTION"
        ]
       },
       "reviewNote": {
        "type": "string",
        "nullable": true
       },
       "familySharable": {
        "type": "boolean",
        "nullable": true
       }
      },
      "required": [
       "productId",
       "name",
       "inAppPurchaseType"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "InAppPurchaseV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "inAppPurchases"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "reviewNote": {
        "type": "string",
        "nullable": true
       },
       "familySharable": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "MarketplaceSearchDetailCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "marketplaceSearchDetails"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "catalogUrl": {
        "type": "string",
        "format": "uri"
       }
      },
      "required": [
       "catalogUrl"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "MarketplaceSearchDetailUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "marketplaceSearchDetails"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "catalogUrl": {
        "type": "string",
        "format": "uri",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "MarketplaceWebhookCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "marketplaceWebhooks"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "endpointUrl": {
        "type": "string",
        "format": "uri"
       },
       "secret": {
        "type": "string"
       }
      },
      "required": [
       "endpointUrl",
       "secret"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "MarketplaceWebhookUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "marketplaceWebhooks"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "endpointUrl": {
        "type": "string",
        "format": "uri",
        "nullable": true
       },
       "secret": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "MerchantIdCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "merchantIds"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "identifier": {
        "type": "string"
       }
      },
      "required": [
       "identifier",
       "name"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "MerchantIdUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "merchantIds"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "NominationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "nominations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "type": {
        "type": "string",
        "enum": [
         "APP_LAUNCH",
         "APP_ENHANCEMENTS",
         "NEW_CONTENT"
        ]
       },
       "description": {
        "type": "string"
       },
       "submitted": {
        "type": "boolean"
       },
       "publishStartDate": {
        "type": "string",
        "format": "date-time"
       },
       "publishEndDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "deviceFamilies": {
        "type": "array",
        "items": {
         "type": "string",
         "enum": [
          "IPHONE",
          "IPAD",
          "APPLE_TV",
          "APPLE_WATCH",
          "MAC",
          "VISION"
         ]
        },
        "nullable": true
       },
       "locales": {
        "type": "array",
        "items": {
         "type": "string"
        },
        "nullable": true
       },
       "supplementalMaterialsUris": {
        "type": "array",
        "items": {
         "type": "string",
         "format": "uri"
        },
        "nullable": true
       },
       "hasInAppEvents": {
        "type": "boolean",
        "nullable": true
       },
       "launchInSelectMarketsFirst": {
        "type": "boolean",
        "nullable": true
       },
       "notes": {
        "type": "string",
        "nullable": true
       },
       "preOrderEnabled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "required": [
       "submitted",
       "publishStartDate",
       "name",
       "description",
       "type"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "relatedApps": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "apps"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "inAppEvents": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "appEvents"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "supportedTerritories": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "relatedApps"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "NominationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "nominations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "type": {
        "type": "string",
        "nullable": true,
        "enum": [
         "APP_LAUNCH",
         "APP_ENHANCEMENTS",
         "NEW_CONTENT"
        ]
       },
       "description": {
        "type": "string",
        "nullable": true
       },
       "submitted": {
        "type": "boolean",
        "nullable": true
       },
       "archived": {
        "type": "boolean",
        "nullable": true
       },
       "publishStartDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "publishEndDate": {
        "type": "string",
        "format": "date-time",
        "nullable": true
       },
       "deviceFamilies": {
        "type": "array",
        "items": {
         "type": "string",
         "enum": [
          "IPHONE",
          "IPAD",
          "APPLE_TV",
          "APPLE_WATCH",
          "MAC",
          "VISION"
         ]
        },
        "nullable": true
       },
       "locales": {
        "type": "array",
        "items": {
         "type": "string"
        },
        "nullable": true
       },
       "supplementalMaterialsUris": {
        "type": "array",
        "items": {
         "type": "string",
         "format": "uri"
        },
        "nullable": true
       },
       "hasInAppEvents": {
        "type": "boolean",
        "nullable": true
       },
       "launchInSelectMarketsFirst": {
        "type": "boolean",
        "nullable": true
       },
       "notes": {
        "type": "string",
        "nullable": true
       },
       "preOrderEnabled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "relatedApps": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "apps"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "inAppEvents": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "appEvents"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "supportedTerritories": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "PassTypeIdCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "passTypeIds"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "identifier": {
        "type": "string"
       }
      },
      "required": [
       "identifier",
       "name"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "PassTypeIdUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "passTypeIds"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "ProfileCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "profiles"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "profileType": {
        "type": "string",
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
       }
      },
      "required": [
       "profileType",
       "name"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "bundleId": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "bundleIds"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "devices": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "devices"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "certificates": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "certificates"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "certificates",
       "bundleId"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "PromotedPurchaseCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "promotedPurchases"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "visibleForAllUsers": {
        "type": "boolean"
       },
       "enabled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "required": [
       "visibleForAllUsers"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "inAppPurchaseV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchases"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "PromotedPurchaseUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "promotedPurchases"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "visibleForAllUsers": {
        "type": "boolean",
        "nullable": true
       },
       "enabled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "ReviewSubmissionItemCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "reviewSubmissionItems"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "reviewSubmission": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "reviewSubmissions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appCustomProductPageVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appCustomProductPageVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appStoreVersionExperiment": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionExperiments"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appStoreVersionExperimentV2": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersionExperiments"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "appEvent": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appEvents"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "backgroundAssetVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "backgroundAssetVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterAchievementVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterAchievementVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterActivityVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterActivityVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterChallengeVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterChallengeVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterLeaderboardSetVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardSetVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "gameCenterLeaderboardVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "gameCenterLeaderboardVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "inAppPurchaseVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "inAppPurchaseVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "subscriptionVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "subscriptionGroupVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionGroupVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "reviewSubmission"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "ReviewSubmissionItemUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "reviewSubmissionItems"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "resolved": {
        "type": "boolean",
        "nullable": true
       },
       "removed": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "ReviewSubmissionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "reviewSubmissions"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "platform": {
        "type": "string",
        "enum": [
         "IOS",
         "MAC_OS",
         "TV_OS",
         "VISION_OS"
        ]
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "ReviewSubmissionUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "reviewSubmissions"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "platform": {
        "type": "string",
        "enum": [
         "IOS",
         "MAC_OS",
         "TV_OS",
         "VISION_OS"
        ]
       },
       "submitted": {
        "type": "boolean",
        "nullable": true
       },
       "canceled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "RoutingAppCoverageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "routingAppCoverages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "appStoreVersion": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "appStoreVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "appStoreVersion"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "RoutingAppCoverageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "routingAppCoverages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SandboxTesterV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "sandboxTesters"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "territory": {
        "type": "string",
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
         "CIV",
         "CMR",
         "COD",
         "COG",
         "COK",
         "COL",
         "COM",
         "CPV",
         "CRI",
         "CUB",
         "CUW",
         "CXR",
         "CYM",
         "CYP",
         "CZE",
         "DEU",
         "DJI",
         "DMA",
         "DNK",
         "DOM",
         "DZA",
         "ECU",
         "EGY",
         "ERI",
         "ESP",
         "EST",
         "ETH",
         "FIN",
         "FJI",
         "FLK",
         "FRA",
         "FRO",
         "FSM",
         "GAB",
         "GBR",
         "GEO",
         "GGY",
         "GHA",
         "GIB",
         "GIN",
         "GLP",
         "GMB",
         "GNB",
         "GNQ",
         "GRC",
         "GRD",
         "GRL",
         "GTM",
         "GUF",
         "GUM",
         "GUY",
         "HKG",
         "HND",
         "HRV",
         "HTI",
         "HUN",
         "IDN",
         "IMN",
         "IND",
         "IRL",
         "IRQ",
         "ISL",
         "ISR",
         "ITA",
         "JAM",
         "JEY",
         "JOR",
         "JPN",
         "KAZ",
         "KEN",
         "KGZ",
         "KHM",
         "KIR",
         "KNA",
         "KOR",
         "KWT",
         "LAO",
         "LBN",
         "LBR",
         "LBY",
         "LCA",
         "LIE",
         "LKA",
         "LSO",
         "LTU",
         "LUX",
         "LVA",
         "MAC",
         "MAR",
         "MCO",
         "MDA",
         "MDG",
         "MDV",
         "MEX",
         "MHL",
         "MKD",
         "MLI",
         "MLT",
         "MMR",
         "MNE",
         "MNG",
         "MNP",
         "MOZ",
         "MRT",
         "MSR",
         "MTQ",
         "MUS",
         "MWI",
         "MYS",
         "MYT",
         "NAM",
         "NCL",
         "NER",
         "NFK",
         "NGA",
         "NIC",
         "NIU",
         "NLD",
         "NOR",
         "NPL",
         "NRU",
         "NZL",
         "OMN",
         "PAK",
         "PAN",
         "PER",
         "PHL",
         "PLW",
         "PNG",
         "POL",
         "PRI",
         "PRT",
         "PRY",
         "PSE",
         "PYF",
         "QAT",
         "REU",
         "ROU",
         "RUS",
         "RWA",
         "SAU",
         "SEN",
         "SGP",
         "SHN",
         "SLB",
         "SLE",
         "SLV",
         "SMR",
         "SOM",
         "SPM",
         "SRB",
         "SSD",
         "STP",
         "SUR",
         "SVK",
         "SVN",
         "SWE",
         "SWZ",
         "SXM",
         "SYC",
         "TCA",
         "TCD",
         "TGO",
         "THA",
         "TJK",
         "TKM",
         "TLS",
         "TON",
         "TTO",
         "TUN",
         "TUR",
         "TUV",
         "TWN",
         "TZA",
         "UGA",
         "UKR",
         "UMI",
         "URY",
         "USA",
         "UZB",
         "VAT",
         "VCT",
         "VEN",
         "VGB",
         "VIR",
         "VNM",
         "VUT",
         "WLF",
         "WSM",
         "XKS",
         "YEM",
         "ZAF",
         "ZMB",
         "ZWE"
        ]
       },
       "interruptPurchases": {
        "type": "boolean",
        "nullable": true
       },
       "subscriptionRenewalRate": {
        "type": "string",
        "nullable": true,
        "enum": [
         "MONTHLY_RENEWAL_EVERY_ONE_HOUR",
         "MONTHLY_RENEWAL_EVERY_THIRTY_MINUTES",
         "MONTHLY_RENEWAL_EVERY_FIFTEEN_MINUTES",
         "MONTHLY_RENEWAL_EVERY_FIVE_MINUTES",
         "MONTHLY_RENEWAL_EVERY_THREE_MINUTES"
        ]
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SandboxTestersClearPurchaseHistoryRequestV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "sandboxTestersClearPurchaseHistoryRequest"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "sandboxTesters": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "sandboxTesters"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "sandboxTesters"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionAppStoreReviewScreenshotCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionAppStoreReviewScreenshots"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionAppStoreReviewScreenshotUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionAppStoreReviewScreenshots"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionAvailabilityCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionAvailabilities"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "availableInNewTerritories": {
        "type": "boolean"
       }
      },
      "required": [
       "availableInNewTerritories"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "availableTerritories": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription",
       "availableTerritories"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "SubscriptionGracePeriodUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionGracePeriods"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "optIn": {
        "type": "boolean",
        "nullable": true
       },
       "sandboxOptIn": {
        "type": "boolean",
        "nullable": true
       },
       "duration": {
        "type": "string",
        "enum": [
         "THREE_DAYS",
         "SIXTEEN_DAYS",
         "TWENTY_EIGHT_DAYS"
        ]
       },
       "renewalType": {
        "type": "string",
        "nullable": true,
        "enum": [
         "ALL_RENEWALS",
         "PAID_TO_PAID_ONLY"
        ]
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionGroupLocalizationV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionGroupLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "customAppName": {
        "type": "string",
        "nullable": true
       },
       "locale": {
        "type": "string"
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionGroupVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionGroupLocalizationV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionGroupLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "customAppName": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionGroupLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionGroupLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "customAppName": {
        "type": "string",
        "nullable": true
       },
       "locale": {
        "type": "string"
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscriptionGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscriptionGroup"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionGroupLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionGroupLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "customAppName": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionGroupSubmissionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionGroupSubmissions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscriptionGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscriptionGroup"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionGroupVersionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionGroupVersions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscriptionGroup": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscriptionGroup"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionGroupCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionGroups"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       }
      },
      "required": [
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionGroupUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionGroups"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionImageCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionImageUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "sourceFileChecksum": {
        "type": "string",
        "nullable": true
       },
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionImageV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionImages"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "fileSize": {
        "type": "integer"
       },
       "fileName": {
        "type": "string"
       }
      },
      "required": [
       "fileName",
       "fileSize"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionImageV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionImages"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "uploaded": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionIntroductoryOfferCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionIntroductoryOffers"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "startDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       },
       "endDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       },
       "duration": {
        "type": "string",
        "enum": [
         "THREE_DAYS",
         "ONE_WEEK",
         "TWO_WEEKS",
         "ONE_MONTH",
         "TWO_MONTHS",
         "THREE_MONTHS",
         "SIX_MONTHS",
         "ONE_YEAR"
        ]
       },
       "offerMode": {
        "type": "string",
        "enum": [
         "PAY_AS_YOU_GO",
         "PAY_UP_FRONT",
         "FREE_TRIAL"
        ]
       },
       "numberOfPeriods": {
        "type": "integer"
       },
       "targetSubscriptionPlanType": {
        "type": "string",
        "enum": [
         "MONTHLY",
         "UPFRONT"
        ]
       }
      },
      "required": [
       "duration",
       "numberOfPeriods",
       "offerMode"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "territory": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "territories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "subscriptionPricePoint": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionPricePoints"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       }
      },
      "required": [
       "subscription"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "subscriptionPricePoints"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionIntroductoryOfferUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionIntroductoryOffers"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "endDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionLocalizationV2CreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "locale": {
        "type": "string"
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "version": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionVersions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "version"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionLocalizationV2UpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionLocalizationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionLocalizations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "locale": {
        "type": "string"
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "required": [
       "name",
       "locale"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionLocalizationUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionLocalizations"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "description": {
        "type": "string",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionOfferCodeCustomCodeCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionOfferCodeCustomCodes"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "customCode": {
        "type": "string"
       },
       "numberOfCodes": {
        "type": "integer"
       },
       "expirationDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       }
      },
      "required": [
       "numberOfCodes",
       "customCode"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "offerCode": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionOfferCodes"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "offerCode"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionOfferCodeCustomCodeUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionOfferCodeCustomCodes"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "active": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionOfferCodeOneTimeUseCodeCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionOfferCodeOneTimeUseCodes"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "numberOfCodes": {
        "type": "integer"
       },
       "expirationDate": {
        "type": "string",
        "format": "date"
       },
       "environment": {
        "type": "string",
        "enum": [
         "PRODUCTION",
         "SANDBOX"
        ]
       }
      },
      "required": [
       "numberOfCodes",
       "expirationDate"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "offerCode": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionOfferCodes"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "offerCode"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionOfferCodeOneTimeUseCodeUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionOfferCodeOneTimeUseCodes"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "active": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionOfferCodeCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionOfferCodes"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "customerEligibilities": {
        "type": "array",
        "items": {
         "type": "string",
         "enum": [
          "NEW",
          "EXISTING",
          "EXPIRED"
         ]
        }
       },
       "offerEligibility": {
        "type": "string",
        "enum": [
         "STACK_WITH_INTRO_OFFERS",
         "REPLACE_INTRO_OFFERS"
        ]
       },
       "duration": {
        "type": "string",
        "enum": [
         "THREE_DAYS",
         "ONE_WEEK",
         "TWO_WEEKS",
         "ONE_MONTH",
         "TWO_MONTHS",
         "THREE_MONTHS",
         "SIX_MONTHS",
         "ONE_YEAR"
        ]
       },
       "offerMode": {
        "type": "string",
        "enum": [
         "PAY_AS_YOU_GO",
         "PAY_UP_FRONT",
         "FREE_TRIAL"
        ]
       },
       "numberOfPeriods": {
        "type": "integer"
       },
       "autoRenewEnabled": {
        "type": "boolean",
        "nullable": true
       },
       "targetSubscriptionPlanType": {
        "type": "string",
        "enum": [
         "MONTHLY",
         "UPFRONT"
        ]
       }
      },
      "required": [
       "duration",
       "offerEligibility",
       "name",
       "numberOfPeriods",
       "offerMode",
       "customerEligibilities"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "prices": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionOfferCodePrices"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription",
       "prices"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "subscriptionOfferCodePrices"
       ]
      },
      "id": {
       "type": "string"
      },
      "relationships": {
       "type": "object",
       "properties": {
        "territory": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        },
        "subscriptionPricePoint": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionPricePoints"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionOfferCodeUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionOfferCodes"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "active": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionPlanAvailabilityCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionPlanAvailabilities"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "availableInNewTerritories": {
        "type": "boolean",
        "nullable": true
       },
       "planType": {
        "type": "string",
        "enum": [
         "MONTHLY",
         "UPFRONT"
        ]
       }
      },
      "required": [
       "planType"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "availableTerritories": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "availableTerritories",
       "subscription"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionPlanAvailabilityUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionPlanAvailabilities"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "availableInNewTerritories": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "availableTerritories": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionPriceCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionPrices"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "startDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       },
       "preserveCurrentPrice": {
        "type": "boolean",
        "nullable": true
       },
       "planType": {
        "type": "string",
        "enum": [
         "MONTHLY",
         "UPFRONT"
        ]
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "territory": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "territories"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "additionalProperties": false
       },
       "subscriptionPricePoint": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionPricePoints"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription",
       "subscriptionPricePoint"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionPromotionalOfferCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionPromotionalOffers"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "duration": {
        "type": "string",
        "enum": [
         "THREE_DAYS",
         "ONE_WEEK",
         "TWO_WEEKS",
         "ONE_MONTH",
         "TWO_MONTHS",
         "THREE_MONTHS",
         "SIX_MONTHS",
         "ONE_YEAR"
        ]
       },
       "name": {
        "type": "string"
       },
       "numberOfPeriods": {
        "type": "integer"
       },
       "offerCode": {
        "type": "string"
       },
       "offerMode": {
        "type": "string",
        "enum": [
         "PAY_AS_YOU_GO",
         "PAY_UP_FRONT",
         "FREE_TRIAL"
        ]
       },
       "targetSubscriptionPlanType": {
        "type": "string",
        "enum": [
         "MONTHLY",
         "UPFRONT"
        ]
       }
      },
      "required": [
       "duration",
       "offerCode",
       "name",
       "numberOfPeriods",
       "offerMode"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "prices": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionPromotionalOfferPrices"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription",
       "prices"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "subscriptionPromotionalOfferPrices"
       ]
      },
      "id": {
       "type": "string"
      },
      "relationships": {
       "type": "object",
       "properties": {
        "territory": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        },
        "subscriptionPricePoint": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionPricePoints"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionPromotionalOfferUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionPromotionalOffers"
      ]
     },
     "id": {
      "type": "string"
     },
     "relationships": {
      "type": "object",
      "properties": {
       "prices": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionPromotionalOfferPrices"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "subscriptionPromotionalOfferPrices"
       ]
      },
      "id": {
       "type": "string"
      },
      "relationships": {
       "type": "object",
       "properties": {
        "territory": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        },
        "subscriptionPricePoint": {
         "type": "object",
         "properties": {
          "data": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionPricePoints"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionSubmissionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionSubmissions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionVersionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptionVersions"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptions"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string"
       },
       "productId": {
        "type": "string"
       },
       "familySharable": {
        "type": "boolean",
        "nullable": true
       },
       "subscriptionPeriod": {
        "type": "string",
        "nullable": true,
        "enum": [
         "ONE_WEEK",
         "ONE_MONTH",
         "TWO_MONTHS",
         "THREE_MONTHS",
         "SIX_MONTHS",
         "ONE_YEAR"
        ]
       },
       "reviewNote": {
        "type": "string",
        "nullable": true
       },
       "groupLevel": {
        "type": "integer",
        "nullable": true
       }
      },
      "required": [
       "productId",
       "name"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "group": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptionGroups"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "group"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "subscriptions"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "name": {
        "type": "string",
        "nullable": true
       },
       "familySharable": {
        "type": "boolean",
        "nullable": true
       },
       "subscriptionPeriod": {
        "type": "string",
        "nullable": true,
        "enum": [
         "ONE_WEEK",
         "ONE_MONTH",
         "TWO_MONTHS",
         "THREE_MONTHS",
         "SIX_MONTHS",
         "ONE_YEAR"
        ]
       },
       "reviewNote": {
        "type": "string",
        "nullable": true
       },
       "groupLevel": {
        "type": "integer",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "introductoryOffers": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionIntroductoryOffers"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "promotionalOffers": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionPromotionalOffers"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       },
       "prices": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionPrices"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "oneOf": [
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "subscriptionPromotionalOffers"
         ]
        },
        "id": {
         "type": "string"
        },
        "attributes": {
         "type": "object",
         "properties": {
          "duration": {
           "type": "string",
           "enum": [
            "THREE_DAYS",
            "ONE_WEEK",
            "TWO_WEEKS",
            "ONE_MONTH",
            "TWO_MONTHS",
            "THREE_MONTHS",
            "SIX_MONTHS",
            "ONE_YEAR"
           ]
          },
          "name": {
           "type": "string"
          },
          "numberOfPeriods": {
           "type": "integer"
          },
          "offerCode": {
           "type": "string"
          },
          "offerMode": {
           "type": "string",
           "enum": [
            "PAY_AS_YOU_GO",
            "PAY_UP_FRONT",
            "FREE_TRIAL"
           ]
          },
          "targetSubscriptionPlanType": {
           "type": "string",
           "enum": [
            "MONTHLY",
            "UPFRONT"
           ]
          }
         },
         "required": [
          "duration",
          "offerCode",
          "name",
          "numberOfPeriods",
          "offerMode"
         ],
         "additionalProperties": false
        },
        "relationships": {
         "type": "object",
         "properties": {
          "subscription": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "subscriptions"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          },
          "prices": {
           "type": "object",
           "properties": {
            "data": {
             "type": "array",
             "items": {
              "type": "object",
              "properties": {
               "type": {
                "type": "string",
                "enum": [
                 "subscriptionPromotionalOfferPrices"
                ]
               },
               "id": {
                "type": "string"
               }
              },
              "required": [
               "id",
               "type"
              ],
              "additionalProperties": false
             }
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "required": [
        "attributes",
        "type"
       ],
       "additionalProperties": false
      },
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "subscriptionPrices"
         ]
        },
        "id": {
         "type": "string"
        },
        "attributes": {
         "type": "object",
         "properties": {
          "startDate": {
           "type": "string",
           "format": "date",
           "nullable": true
          },
          "preserveCurrentPrice": {
           "type": "boolean",
           "nullable": true
          },
          "planType": {
           "type": "string",
           "enum": [
            "MONTHLY",
            "UPFRONT"
           ]
          }
         },
         "additionalProperties": false
        },
        "relationships": {
         "type": "object",
         "properties": {
          "subscription": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "subscriptions"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          },
          "territory": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "territories"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          },
          "subscriptionPricePoint": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "subscriptionPricePoints"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "required": [
        "type"
       ],
       "additionalProperties": false
      },
      {
       "type": "object",
       "properties": {
        "type": {
         "type": "string",
         "enum": [
          "subscriptionIntroductoryOffers"
         ]
        },
        "id": {
         "type": "string"
        },
        "attributes": {
         "type": "object",
         "properties": {
          "startDate": {
           "type": "string",
           "format": "date",
           "nullable": true
          },
          "endDate": {
           "type": "string",
           "format": "date",
           "nullable": true
          },
          "duration": {
           "type": "string",
           "enum": [
            "THREE_DAYS",
            "ONE_WEEK",
            "TWO_WEEKS",
            "ONE_MONTH",
            "TWO_MONTHS",
            "THREE_MONTHS",
            "SIX_MONTHS",
            "ONE_YEAR"
           ]
          },
          "offerMode": {
           "type": "string",
           "enum": [
            "PAY_AS_YOU_GO",
            "PAY_UP_FRONT",
            "FREE_TRIAL"
           ]
          },
          "numberOfPeriods": {
           "type": "integer"
          },
          "targetSubscriptionPlanType": {
           "type": "string",
           "enum": [
            "MONTHLY",
            "UPFRONT"
           ]
          }
         },
         "required": [
          "duration",
          "numberOfPeriods",
          "offerMode"
         ],
         "additionalProperties": false
        },
        "relationships": {
         "type": "object",
         "properties": {
          "subscription": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "subscriptions"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          },
          "territory": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "territories"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          },
          "subscriptionPricePoint": {
           "type": "object",
           "properties": {
            "data": {
             "type": "object",
             "properties": {
              "type": {
               "type": "string",
               "enum": [
                "subscriptionPricePoints"
               ]
              },
              "id": {
               "type": "string"
              }
             },
             "required": [
              "id",
              "type"
             ],
             "additionalProperties": false
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "required": [
        "attributes",
        "type"
       ],
       "additionalProperties": false
      }
     ]
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "TerritoryAvailabilityUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "territoryAvailabilities"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "available": {
        "type": "boolean",
        "nullable": true
       },
       "releaseDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       },
       "preOrderEnabled": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "UserInvitationCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "userInvitations"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "email": {
        "type": "string",
        "format": "email"
       },
       "firstName": {
        "type": "string"
       },
       "lastName": {
        "type": "string"
       },
       "roles": {
        "type": "array",
        "items": {
         "type": "string",
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
        }
       },
       "allAppsVisible": {
        "type": "boolean",
        "nullable": true
       },
       "provisioningAllowed": {
        "type": "boolean",
        "nullable": true
       }
      },
      "required": [
       "firstName",
       "lastName",
       "roles",
       "email"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "visibleApps": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "apps"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "UserUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "users"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "roles": {
        "type": "array",
        "items": {
         "type": "string",
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
        "nullable": true
       },
       "allAppsVisible": {
        "type": "boolean",
        "nullable": true
       },
       "provisioningAllowed": {
        "type": "boolean",
        "nullable": true
       }
      },
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "visibleApps": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "apps"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "additionalProperties": false
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "WebhookDeliveryCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "webhookDeliveries"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "template": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "webhookDeliveries"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "template"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "WebhookPingCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "webhookPings"
      ]
     },
     "relationships": {
      "type": "object",
      "properties": {
       "webhook": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "webhooks"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "webhook"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "WebhookCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "webhooks"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "enabled": {
        "type": "boolean"
       },
       "eventTypes": {
        "type": "array",
        "items": {
         "type": "string",
         "enum": [
          "ALTERNATIVE_DISTRIBUTION_PACKAGE_AVAILABLE_UPDATED",
          "ALTERNATIVE_DISTRIBUTION_PACKAGE_VERSION_CREATED",
          "ALTERNATIVE_DISTRIBUTION_TERRITORY_AVAILABILITY_UPDATED",
          "APP_STORE_VERSION_APP_VERSION_STATE_UPDATED",
          "BACKGROUND_ASSET_VERSION_APP_STORE_RELEASE_STATE_UPDATED",
          "BACKGROUND_ASSET_VERSION_EXTERNAL_BETA_RELEASE_STATE_UPDATED",
          "BACKGROUND_ASSET_VERSION_INTERNAL_BETA_RELEASE_CREATED",
          "BACKGROUND_ASSET_VERSION_STATE_UPDATED",
          "BETA_FEEDBACK_CRASH_SUBMISSION_CREATED",
          "BETA_FEEDBACK_SCREENSHOT_SUBMISSION_CREATED",
          "BUILD_BETA_DETAIL_EXTERNAL_BUILD_STATE_UPDATED",
          "BUILD_UPLOAD_STATE_UPDATED"
         ]
        }
       },
       "name": {
        "type": "string"
       },
       "secret": {
        "type": "string"
       },
       "url": {
        "type": "string",
        "format": "uri"
       }
      },
      "required": [
       "name",
       "secret",
       "eventTypes",
       "url",
       "enabled"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "app": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "apps"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "app"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "WebhookUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "webhooks"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "enabled": {
        "type": "boolean",
        "nullable": true
       },
       "eventTypes": {
        "type": "array",
        "items": {
         "type": "string",
         "enum": [
          "ALTERNATIVE_DISTRIBUTION_PACKAGE_AVAILABLE_UPDATED",
          "ALTERNATIVE_DISTRIBUTION_PACKAGE_VERSION_CREATED",
          "ALTERNATIVE_DISTRIBUTION_TERRITORY_AVAILABILITY_UPDATED",
          "APP_STORE_VERSION_APP_VERSION_STATE_UPDATED",
          "BACKGROUND_ASSET_VERSION_APP_STORE_RELEASE_STATE_UPDATED",
          "BACKGROUND_ASSET_VERSION_EXTERNAL_BETA_RELEASE_STATE_UPDATED",
          "BACKGROUND_ASSET_VERSION_INTERNAL_BETA_RELEASE_CREATED",
          "BACKGROUND_ASSET_VERSION_STATE_UPDATED",
          "BETA_FEEDBACK_CRASH_SUBMISSION_CREATED",
          "BETA_FEEDBACK_SCREENSHOT_SUBMISSION_CREATED",
          "BUILD_BETA_DETAIL_EXTERNAL_BUILD_STATE_UPDATED",
          "BUILD_UPLOAD_STATE_UPDATED"
         ]
        },
        "nullable": true
       },
       "name": {
        "type": "string",
        "nullable": true
       },
       "secret": {
        "type": "string",
        "nullable": true
       },
       "url": {
        "type": "string",
        "format": "uri",
        "nullable": true
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "WinBackOfferCreateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "winBackOffers"
      ]
     },
     "attributes": {
      "type": "object",
      "properties": {
       "referenceName": {
        "type": "string"
       },
       "offerId": {
        "type": "string"
       },
       "duration": {
        "type": "string",
        "enum": [
         "THREE_DAYS",
         "ONE_WEEK",
         "TWO_WEEKS",
         "ONE_MONTH",
         "TWO_MONTHS",
         "THREE_MONTHS",
         "SIX_MONTHS",
         "ONE_YEAR"
        ]
       },
       "offerMode": {
        "type": "string",
        "enum": [
         "PAY_AS_YOU_GO",
         "PAY_UP_FRONT",
         "FREE_TRIAL"
        ]
       },
       "periodCount": {
        "type": "integer"
       },
       "customerEligibilityPaidSubscriptionDurationInMonths": {
        "type": "integer"
       },
       "customerEligibilityTimeSinceLastSubscribedInMonths": {
        "type": "object",
        "properties": {
         "minimum": {
          "type": "integer"
         },
         "maximum": {
          "type": "integer"
         }
        },
        "additionalProperties": false
       },
       "customerEligibilityWaitBetweenOffersInMonths": {
        "type": "integer",
        "nullable": true
       },
       "startDate": {
        "type": "string",
        "format": "date"
       },
       "endDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       },
       "priority": {
        "type": "string",
        "enum": [
         "HIGH",
         "NORMAL"
        ]
       },
       "promotionIntent": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NOT_PROMOTED",
         "USE_AUTO_GENERATED_ASSETS"
        ]
       },
       "targetSubscriptionPlanType": {
        "type": "string",
        "enum": [
         "MONTHLY",
         "UPFRONT"
        ]
       }
      },
      "required": [
       "duration",
       "customerEligibilityTimeSinceLastSubscribedInMonths",
       "periodCount",
       "offerId",
       "offerMode",
       "priority",
       "customerEligibilityPaidSubscriptionDurationInMonths",
       "startDate",
       "referenceName"
      ],
      "additionalProperties": false
     },
     "relationships": {
      "type": "object",
      "properties": {
       "subscription": {
        "type": "object",
        "properties": {
         "data": {
          "type": "object",
          "properties": {
           "type": {
            "type": "string",
            "enum": [
             "subscriptions"
            ]
           },
           "id": {
            "type": "string"
           }
          },
          "required": [
           "id",
           "type"
          ],
          "additionalProperties": false
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       },
       "prices": {
        "type": "object",
        "properties": {
         "data": {
          "type": "array",
          "items": {
           "type": "object",
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "winBackOfferPrices"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "required": [
            "id",
            "type"
           ],
           "additionalProperties": false
          }
         }
        },
        "required": [
         "data"
        ],
        "additionalProperties": false
       }
      },
      "required": [
       "subscription",
       "prices"
      ],
      "additionalProperties": false
     }
    },
    "required": [
     "relationships",
     "attributes",
     "type"
    ],
    "additionalProperties": false
   },
   "included": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "winBackOfferPrices"
       ]
      },
      "id": {
       "type": "string"
      },
      "relationships": {
       "type": "object",
       "required": [
        "territory"
       ],
       "properties": {
        "territory": {
         "type": "object",
         "required": [
          "data"
         ],
         "properties": {
          "data": {
           "type": "object",
           "required": [
            "type",
            "id"
           ],
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "territories"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        },
        "subscriptionPricePoint": {
         "type": "object",
         "required": [
          "data"
         ],
         "properties": {
          "data": {
           "type": "object",
           "required": [
            "type",
            "id"
           ],
           "properties": {
            "type": {
             "type": "string",
             "enum": [
              "subscriptionPricePoints"
             ]
            },
            "id": {
             "type": "string"
            }
           },
           "additionalProperties": false
          }
         },
         "additionalProperties": false
        }
       },
       "additionalProperties": false
      }
     },
     "required": [
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "WinBackOfferUpdateRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "winBackOffers"
      ]
     },
     "id": {
      "type": "string"
     },
     "attributes": {
      "type": "object",
      "properties": {
       "customerEligibilityPaidSubscriptionDurationInMonths": {
        "type": "integer",
        "nullable": true
       },
       "customerEligibilityTimeSinceLastSubscribedInMonths": {
        "type": "object",
        "properties": {
         "minimum": {
          "type": "integer"
         },
         "maximum": {
          "type": "integer"
         }
        },
        "additionalProperties": false
       },
       "customerEligibilityWaitBetweenOffersInMonths": {
        "type": "integer",
        "nullable": true
       },
       "startDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       },
       "endDate": {
        "type": "string",
        "format": "date",
        "nullable": true
       },
       "priority": {
        "type": "string",
        "nullable": true,
        "enum": [
         "HIGH",
         "NORMAL"
        ]
       },
       "promotionIntent": {
        "type": "string",
        "nullable": true,
        "enum": [
         "NOT_PROMOTED",
         "USE_AUTO_GENERATED_ASSETS"
        ]
       }
      },
      "additionalProperties": false
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppClipDefaultExperienceReleaseWithAppStoreVersionLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appStoreVersions"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppCustomProductPageLocalizationSearchKeywordsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "appKeywords"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppEncryptionDeclarationBuildsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "builds"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "AppPreviewSetAppPreviewsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "appPreviews"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppScreenshotSetAppScreenshotsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "appScreenshots"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionLocalizationSearchKeywordsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "appKeywords"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionAppClipDefaultExperienceLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appClipDefaultExperiences"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppStoreVersionBuildLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "builds"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppBetaTestersLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "betaTesters"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "AppPromotedPurchasesLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "promotedPurchases"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaGroupBetaTestersLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "betaTesters"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaGroupBuildsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "builds"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaTesterAppsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "apps"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaTesterBetaGroupsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "betaGroups"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BetaTesterBuildsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "builds"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BuildAppEncryptionDeclarationLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "appEncryptionDeclarations"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BuildBetaGroupsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "betaGroups"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "BuildIndividualTestersLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "betaTesters"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementV2ActivityLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivities"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAchievementActivityLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivities"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterAchievementGroupAchievementLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterAchievements"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterActivityAchievementsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterAchievements"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterActivityAchievementsV2LinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterAchievements"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterActivityLeaderboardsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboards"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterActivityLeaderboardsV2LinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboards"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterAppVersionCompatibilityVersionsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterAppVersions"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterChallengeLeaderboardLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboards"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterChallengeLeaderboardV2LinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboards"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterDetailChallengesMinimumPlatformVersionsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "appStoreVersions"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterDetailGameCenterAchievementsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterAchievements"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterDetailGameCenterAchievementsV2LinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterAchievements"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterDetailGameCenterLeaderboardSetsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboardSets"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterDetailGameCenterLeaderboardSetsV2LinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboardSets"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterDetailGameCenterLeaderboardsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboards"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterDetailGameCenterLeaderboardsV2LinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboards"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterEnabledVersionCompatibleVersionsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterEnabledVersions"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterGroupGameCenterAchievementsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterAchievements"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterGroupGameCenterAchievementsV2LinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterAchievements"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterGroupGameCenterLeaderboardSetsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboardSets"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterGroupGameCenterLeaderboardSetsV2LinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboardSets"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterGroupGameCenterLeaderboardsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboards"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterGroupGameCenterLeaderboardsV2LinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboards"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetV2GameCenterLeaderboardsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboards"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetGameCenterLeaderboardsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "gameCenterLeaderboards"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardSetGroupLeaderboardSetLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboardSets"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardActivityLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivities"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardChallengeLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallenges"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardGroupLeaderboardLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterLeaderboards"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "deprecated": true,
  "additionalProperties": false
 },
 "GameCenterLeaderboardV2ActivityLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterActivities"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "GameCenterLeaderboardV2ChallengeLinkageRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "object",
    "properties": {
     "type": {
      "type": "string",
      "enum": [
       "gameCenterChallenges"
      ]
     },
     "id": {
      "type": "string"
     }
    },
    "required": [
     "id",
     "type"
    ],
    "additionalProperties": false
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionPlanAvailabilityAvailableTerritoriesLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "territories"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionIntroductoryOffersLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "subscriptionIntroductoryOffers"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "SubscriptionPricesLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "subscriptionPrices"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 },
 "UserVisibleAppsLinkagesRequest": {
  "type": "object",
  "properties": {
   "data": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "type": {
       "type": "string",
       "enum": [
        "apps"
       ]
      },
      "id": {
       "type": "string"
      }
     },
     "required": [
      "id",
      "type"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "data"
  ],
  "additionalProperties": false
 }
};
