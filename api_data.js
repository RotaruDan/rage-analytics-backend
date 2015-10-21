define({ "api": [
  {
    "type": "post",
    "url": "/collector/start/:trackingCode",
    "title": "Returns all the Sessions.",
    "description": "<p>This method expects an 'Authorization' header with one of the following formats 1.- &lt;Authorization, 'a:'&gt; or &lt;Authorization, 'a:playerName'&gt;. The first value will create a new anonymous player while the second will try to find the player with the given 'playerName'. 2.- &lt;Authorization, 'authToken'&gt; This format is used when the user is already authenticated.</p> ",
    "name": "postCollectorStart",
    "group": "Collector",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "trackingCode",
            "description": "<p>The tracking code assigned to a given game.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    authToken: <String>,        - Used as 'Authorization2' header for '/api/collector/track' requests.\n    playerName: <String>\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidTrackingCode",
            "description": "<p>The 'trackingCode' is not valid.</p> "
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>The player couldn't be created or couldn't be found.</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/collector.js",
    "groupTitle": "Collector"
  },
  {
    "type": "post",
    "url": "/api/collector/track",
    "title": "Tracks data from the request body.",
    "description": "<p>Note that this method expects an 'Authorization2' header with the following format &lt;Authorization, 'authToken'&gt;. The 'authToken' can be obtained by issuing a request to '/api/collector/start/:trackingCode'.</p> ",
    "name": "postCollectorTrack",
    "group": "Collector",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\ntrue",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/collector.js",
    "groupTitle": "Collector"
  },
  {
    "type": "delete",
    "url": "/games/:id",
    "title": "Removes the game.",
    "name": "DeleteGame",
    "group": "Games",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Game id.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\ntrue",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Games"
  },
  {
    "type": "get",
    "url": "/games/public",
    "title": "Returns all the public games.",
    "name": "GetGames",
    "group": "Games",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"_id\": \"559a447831b7acec185bf513\",\n        \"title\": \"My Game\",\n        \"author\": \"developer\",\n        \"public\": \"true\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Games"
  },
  {
    "type": "get",
    "url": "/games",
    "title": "Returns all the games.",
    "name": "GetGames",
    "group": "Games",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"_id\": \"559a447831b7acec185bf513\",\n        \"title\": \"My Game\",\n        \"author\": \"developer\",\n        \"public\": \"false\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Games"
  },
  {
    "type": "get",
    "url": "/games/:gameId/versions",
    "title": "Returns all the versions of a given game.",
    "name": "GetVersions",
    "group": "Games",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "gameId",
            "description": "<p>Game id.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"_id\": \"559a447831b76cec185bf513\",\n        \"gameId\": \"559a447831b7acec185bf513\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Games"
  },
  {
    "type": "get",
    "url": "/games/:gameId/versions/:id",
    "title": "Returns a version for a specific game.",
    "name": "GetVersions",
    "group": "Games",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "gameId",
            "description": "<p>Game id.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Version id.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"559a447831b76cec185bf513\",\n    \"gameId\": \"559a447831b7acec185bf513\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Games"
  },
  {
    "type": "post",
    "url": "/games/:id",
    "title": "Changes the game title and/or the field public.",
    "name": "PostGame",
    "group": "Games",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Game id.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Object</p> ",
            "optional": true,
            "field": "title",
            "description": "<p>The new game title.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Boolean</p> ",
            "optional": true,
            "field": "public",
            "description": "<p>If other people can see the game.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"title\": \"New title\",\n    \"public\" \"false\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"559a447831b7acec185bf513\",\n    \"title\": \"New title\",\n    \"author\": \"developer\",\n    \"public\": \"false\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Games"
  },
  {
    "type": "post",
    "url": "/games",
    "title": "Adds a new game.",
    "name": "PostGames",
    "group": "Games",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-gleaner-user.",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "title",
            "description": "<p>The title of the game.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Boolean</p> ",
            "optional": true,
            "field": "public",
            "description": "<p>If other people can see the game.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"title\": \"My Game\",\n    \"public\": \"true\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"559a447831b7acec185bf513\",\n    \"title\": \"My Game\"\n    \"author\": \"x-gleaner-user\",\n    \"public\": \"true\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Games"
  },
  {
    "type": "post",
    "url": "/games/:gameId/versions",
    "title": "Adds a new version for a specific game.",
    "name": "PostVersions",
    "group": "Games",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "gameId",
            "description": "<p>Game id.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"559a447831b76cec185bf513\",\n    \"gameId\": \"559a447831b7acec185bf513\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Games"
  },
  {
    "type": "post",
    "url": "/games/:gameId/versions/:id",
    "title": "Adds a new name or link for a specific version.",
    "name": "PutVersions",
    "group": "Games",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "gameId",
            "description": "<p>Game id.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>Version id.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"name\": \"New name\",\n    \"link\": \"New Link\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"name\": \"New name\",\n    \"link\": \"New Link\",\n    \"_id\": \"559a447831b76cec185bf513\",\n    \"gameId\": \"559a447831b7acec185bf513\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Games"
  },
  {
    "type": "get",
    "url": "/health",
    "title": "Check the api health.",
    "name": "Heath",
    "group": "Health",
    "permission": [
      {
        "name": "none"
      }
    ],
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": \"Available\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/health.js",
    "groupTitle": "Health"
  },
  {
    "type": "get",
    "url": "/games/:gameId/versions/:versionsId/sessions/my",
    "title": "Returns all the Sessions of a given version of a game where the user participates.",
    "name": "GetSessions",
    "group": "Sessions",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-gleaner-user.",
            "description": ""
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "gameId",
            "description": "<p>The Game id of the session.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "versionId",
            "description": "<p>The Version id of the session.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"_id\": \"559a447831b76cec185bf501\"\n        \"gameId\": \"559a447831b76cec185bf513\",\n        \"versionId\": \"559a447831b76cec185bf514\",\n        \"start\": \"2015-07-06T09:00:52.630Z\",\n        \"end\": \"2015-07-06T09:03:45.631Z\"\n    },\n    {\n        \"_id\": \"559a447831b76cec185bf511\"\n        \"gameId\": \"559a447831b76cec185bf513\",\n        \"versionId\": \"559a447831b76cec185bf514\",\n        \"start\": \"2015-07-06T09:03:52.636Z\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "get",
    "url": "/api/sessions/:id",
    "title": "Returns the Session that has the given id.",
    "name": "GetSessions",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The Session id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"559a447831b76cec185bf501\"\n    \"gameId\": \"559a447831b76cec185bf513\",\n    \"versionId\": \"559a447831b76cec185bf514\",\n    \"created\": \"2015-07-06T09:00:50.630Z\",\n    \"start\": \"2015-07-06T09:00:52.630Z\",\n    \"end\": \"2015-07-06T09:03:45.631Z\",\n    \"name\": \"Some Session Name\",\n    \"allowAnonymous\": false,\n    \"teachers\": [\"Ben\"],\n    \"students\": [\"Alice\", \"Dan\"]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/sessions.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "get",
    "url": "/games/:gameId/versions/:versionsId/sessions",
    "title": "Returns all the Sessions of a given version of a game.",
    "name": "GetSessions",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "gameId",
            "description": "<p>The Game id of the session.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "versionId",
            "description": "<p>The Version id of the session.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"_id\": \"559a447831b76cec185bf501\"\n        \"gameId\": \"559a447831b76cec185bf513\",\n        \"versionId\": \"559a447831b76cec185bf514\",\n        \"created\": \"2015-07-06T09:00:50.630Z\",\n        \"start\": \"2015-07-06T09:00:52.630Z\",\n        \"end\": \"2015-07-06T09:03:45.631Z\"\n    },\n    {\n        \"_id\": \"559a447831b76cec185bf511\"\n        \"gameId\": \"559a447831b76cec185bf513\",\n        \"versionId\": \"559a447831b76cec185bf514\",\n        \"created\": \"2015-07-06T09:00:50.630Z\",\n        \"start\": \"2015-07-06T09:03:52.636Z\",\n        \"end\": \"2015-07-06T09:03:58.631Z\"\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "get",
    "url": "/statements",
    "title": "Returns all statements.",
    "name": "GetSessions",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "id",
            "description": "<p>The Session id</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"statements\": [\n    {\n        \"id\": \"e5efec39-3992-401d-be17-86d24c3f1e76\",\n        \"actor\": {\n        \"objectType\": \"Agent\",\n        \"name\": \"s\",\n        \"account\": {\n            \"homePage\": \"http://www.gleaner.com/\",\n            \"name\": \"s\"\n        }\n    },\n    \"verb\": {\n        \"id\": \"http://www.gleaner.com/started_game\",\n        \"display\": {\n            \"es-ES\": \"started_game\",\n            \"en-US\": \"started_game\"\n        }\n    },\n    \"object\": {\n        \"id\": \"http://www.gleaner.com/games/lostinspace/none\",\n        \"objectType\": \"Activity\",\n        \"definition\": {\n            \"type\": \"http://www.gleaner.com/objects/none\",\n            \"extensions\": {\n                \"event\": \"game_start\",\n                \"gameplayId\": \"55e57b03553dded764546f03\"\n            }\n        }\n    },\n    \"stored\": \"2015-09-10T11:01:04Z\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "post",
    "url": "/sessions/:sessionId/results/:resultId",
    "title": "Updates a specific result from a session.",
    "name": "PostResult",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sessionId",
            "description": "<p>Game id.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "resultId",
            "description": "<p>The Result id.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"var\": {\"score\":296},\n    \"zone\": \"zone7\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"var\": {\n            \"score\": 296,\n            \"hasPickedValuableItem\": true,\n            \"timeSpentInLevel\": 1820000,\n            \"alias\": \"somePlayerAlias\"\n        },\n        \"zone\": \"zone7\",\n        \"interact\": {\n            \"tutorialButton\": 2,\n            \"helpButton\": 9\n        },\n        \"choice\": {\n            \"preferredFood\": {\n                \"pizza\": 4\n            },\n            \"favouriteItem\": {\n                \"healthPotion\": 9,\n                \"rusticSword\": 4\n            }\n        }\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/sessions.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "get",
    "url": "/sessions/:sessionId/results",
    "title": "Returns all the results of a session.",
    "name": "PostSessionResults",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sessionId",
            "description": "<p>The Session id.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n        \"var\": {\n            \"score\": 276,\n            \"hasPickedValuableItem\": true,\n            \"timeSpentInLevel\": 1820000,\n            \"alias\": \"somePlayerAlias\"\n        },\n        \"zone\": \"zone6\",\n        \"interact\": {\n            \"tutorialButton\": 2,\n            \"helpButton\": 9\n        },\n        \"choice\": {\n            \"preferredFood\": {\n                \"pizza\": 4\n            },\n            \"favouriteItem\": {\n                \"healthPotion\": 9,\n                \"rusticSword\": 4\n            }\n        }\n    }\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/sessions.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "post",
    "url": "/games/:gameId/versions/:versionsId/sessions",
    "title": "Creates new Session for a given version of a game.",
    "name": "PostSessions",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "gameId",
            "description": "<p>The Game id of the session.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "versionId",
            "description": "<p>The Version id of the session.</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"name\": \"New name\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"gameId\": \"55e433c773415f105025d2d4\",\n    \"versionId\": \"55e433c773415f105025d2d5\",\n    \"name\": \"New name\",\n    \"created\": \"2015-08-31T12:55:05.459Z\",\n    \"teachers\": [\n        \"user\"\n    ],\n    \"_id\": \"55e44ea9f1448e1067e64d6c\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "delete",
    "url": "/sessions/:sessionId",
    "title": "Deletes a session and all the results associated with it",
    "name": "deleteSessions",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sessionId",
            "description": "<p>The id of the session.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\ntrue",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/sessions.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "get",
    "url": "/games/my",
    "title": "Return all sessions with the userId in the students or teacher array.",
    "name": "getSessions",
    "group": "Sessions",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "x-gleaner-user.",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"559a447831b76cec185bf511\"\n    \"gameId\": \"559a447831b76cec185bf513\",\n    \"versionId\": \"559a447831b76cec185bf514\",\n    \"start\": \"2015-07-06T09:01:52.636Z\",\n    \"end\": \"2015-07-06T09:03:45.631Z\",\n    \"name\": \"Name\",\n    \"teachers\": [\"x-gleaner-user\"],\n    \"students\": [\"Some Student\"]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/games.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "post",
    "url": "/sessions/:sessionId/:event",
    "title": "Starts or ends a session depending on the event value.",
    "name": "postSessions",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "event",
            "description": "<p>Determines if we should start or end a session. Allowed values: start, end.</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"559a447831b76cec185bf511\"\n    \"gameId\": \"559a447831b76cec185bf513\",\n    \"versionId\": \"559a447831b76cec185bf514\",\n    \"name\": \"The Session Name\",\n    \"created\": \"2015-07-06T09:00:50.630Z\",\n    \"start\": \"2015-07-06T09:01:52.636Z\",\n    \"end\": \"2015-07-06T09:03:45.631Z\",\n    \"name\": \"Some Session Name\",\n    \"allowAnonymous\": false,\n    \"teachers\": [\"Ben\"],\n    \"students\": [\"Alice\", \"Dan\"]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/sessions.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "put",
    "url": "/sessions/:sessionId",
    "title": "Changes the name, students and/or teachers array of a session.",
    "name": "putSessions",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sessionId",
            "description": "<p>The id of the session.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "name",
            "description": "<p>The new name of the session</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>Boolean</p> ",
            "optional": true,
            "field": "allowAnonymous",
            "description": "<p>Whether this session should process data from anonymous users or not.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String[]</p> ",
            "optional": true,
            "field": "students",
            "description": "<p>Array with the username of the students that you want to add to the session. Also can be a String</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String[]</p> ",
            "optional": true,
            "field": "teachers",
            "description": "<p>Array with the username of the teachers that you want to add to the session. Also can be a String</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"name\": \"My New Name\",\n    \"allowAnonymous\": true,\n    \"teachers\": [\"Some Teacher\"],\n    \"students\": [\"Some Student\"]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"559a447831b76cec185bf511\"\n    \"gameId\": \"559a447831b76cec185bf513\",\n    \"versionId\": \"559a447831b76cec185bf514\",\n    \"created\": \"2015-07-06T09:00:50.630Z\",\n    \"start\": \"2015-07-06T09:01:52.636Z\",\n    \"end\": \"2015-07-06T09:03:45.631Z\",\n    \"name\": \"My New Name\",\n    \"allowAnonymous\": true,\n    \"teachers\": [\"Some Teacher\"],\n    \"students\": [\"Some Student\"]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/sessions.js",
    "groupTitle": "Sessions"
  },
  {
    "type": "put",
    "url": "/sessions/:sessionId/remove",
    "title": "Removes students and/or teachers from a session.",
    "name": "putSessions",
    "group": "Sessions",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "sessionId",
            "description": "<p>The id of the session.</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String[]</p> ",
            "optional": true,
            "field": "students",
            "description": "<p>Array with the username of the students that you want to remove from the session. Also can be a String</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String[]</p> ",
            "optional": true,
            "field": "teachers",
            "description": "<p>Array with the username of the teachers that you want to remove from the session. Also can be a String</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"teachers\": [\"Some Teacher\"],\n    \"students\": [\"Some Student\"]\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "Success.",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"_id\": \"559a447831b76cec185bf511\"\n    \"gameId\": \"559a447831b76cec185bf513\",\n    \"versionId\": \"559a447831b76cec185bf514\",\n    \"created\": \"2015-07-06T09:00:50.630Z\",\n    \"start\": \"2015-07-06T09:01:52.636Z\",\n    \"end\": \"2015-07-06T09:03:45.631Z\",\n    \"name\": \"My New Name\",\n    \"teachers\": [],\n    \"students\": []\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/sessions.js",
    "groupTitle": "Sessions"
  }
] });