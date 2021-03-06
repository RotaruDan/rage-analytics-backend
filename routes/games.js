'use strict';

var express = require('express'),
    Q = require('q'),
    router = express.Router(),
    restUtils = require('./rest-utils'),
    request = require('request');

var games = require('../lib/games'),
    versions = require('../lib/versions'),
    activities = require('../lib/activities'),
    kibana = require('../lib/kibana/kibana');

/**
 * @api {get} /games/my Return all games of the author in the x-gleaner-user header.
 * @apiName getSessions
 * @apiGroup Sessions
 *
 * @apiHeader {String} x-gleaner-user.
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *    [
 *      {
 *          "_id": "559a447831b76cec185bf511",
 *          "title": "My Game",
 *          "created": "2017-07-06T09:00:52.630Z",
 *          "authors": ["someDeveloper"],
 *          "developers": ["someDeveloper"],
 *          "public": "true",
 *          "deleted": "false"
 *      }
 *    ]
 */
router.get('/my', restUtils.find(games, function (req, callback) {
    var user = req.headers['x-gleaner-user'];
    // Creates a Query for the 'find' operation
    callback({
        developers: user.toString(),
        $or: [ {deleted: false}, {deleted: undefined} ]
    });
}));

/**
 * @api {get} /games/public Returns all the public games.
 * @apiName GetGames
 * @apiGroup Games
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              "_id": "559a447831b7acec185bf513",
 *              "title": "My Game",
 *              "created": "2017-07-06T09:00:52.630Z",
 *              "authors": ["someDeveloper"],
 *              "developers": ["someDeveloper"],
 *              "public": "true",
 *              "deleted": "false"
 *          }
 *      ]
 *
 */
router.get('/public', restUtils.find(games, function (req, callback) {
    // Creates a Query for the 'find' operation
    callback({
        public: true,
        deleted: false
    });
}));

/**
 * @api {get} /games/:gameId Returns a specific game.
 * @apiName GetGames
 * @apiGroup Games
 *
 * @apiParam {String} gameId Game id.
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_id": "559a447831b7acec185bf513",
 *          "title": "My Game",
 *          "created": "2017-07-06T09:00:52.630Z",
 *          "authors": ["someDeveloper"],
 *          "developers": ["someDeveloper"],
 *          "public": "true",
 *          "deleted": "false"
 *      }
 *
 */
router.get('/:gameId', function (req, res) {
    var username = req.headers['x-gleaner-user'];
    restUtils.processResponse(games.getGame(req.params.gameId, username), res);
});

/**
 * @api {post} /games Adds a new game.
 * @apiName PostGames
 * @apiGroup Games
 *
 * @apiHeader {String} x-gleaner-user.
 *
 * @apiParam {String} [title] The title of the game.
 * @apiParam {Boolean} [public] If other people can see the game.
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "title": "My Game",
 *          "public": "true"
 *      }
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_id": "559a447831b7acec185bf513",
 *          "title": "My Game",
 *          "created": "2017-07-06T09:00:52.630Z",
 *          "authors": ["someDeveloper"],
 *          "developers": ["someDeveloper"],
 *          "public": "true",
 *          "deleted": "false"
 *      }
 *
 */
router.post('/', function (req, res) {
    var username = req.headers['x-gleaner-user'];
    restUtils.processResponse(games.createGame(username,
        req.body.title || '', req.body.public || false), res);
});

/**
 * @api {post} /game/bundle/ Creates new Game, including a version one, dashboards and visualizations.
 * @apiName PostBundleGame
 * @apiGroup Games
 *
 * @apiParam {String} name The name for the Game.
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "title": "New name",
 *          "public": false
 *      }
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "gameId": "55e433c773415f105025d2d4",
 *          "versionId": "55e433c773415f105025d2d5",
 *          "name": "New name",
 *          "created": "2015-08-31T12:55:05.459Z",
 *          "developers": [
 *              "user"
 *          ],
 *          "_id": "55e44ea9f1448e1067e64d6c"
 *      }
 *
 */
router.post('/bundle', function (req, res) {
    var username = req.headers['x-gleaner-user'];
    var config = req.app.config;
    var extra = {
        timeFrom: 'now-7d',
        refreshInterval: {
            display: '10 seconds',
            pause: false,
            section: 1,
            value: 10000
        }
    };

    restUtils.processResponse(games.createGame(username,
        req.body.title || '', req.body.public || false)
        .then(function (game) {
            var gameId = game._id.toString();
            return versions.createVersion({ gameId: game._id })
                .then(function (version) {
                    return games.kibana.createGameTemplates(gameId, req.app.esClient)
                        .then(function () {

                            var deferred = Q.defer();

                            kibana.getKibanaBaseVisualizations('dev', config, gameId, req.app.esClient)
                                .then(function(visualizations) {
                                    console.log('PostBundle -> VisObtained!');
                                    return kibana.createIndex(config, version._id.toString(), gameId,
                                        username, req.app.esClient)
                                        .then(function(result) {
                                            console.log('PostBundle -> IndexCreated!');
                                            return kibana.createVisualizationsAndDashboard(config, version._id.toString(),
                                                gameId, visualizations, username, req.app.esClient, extra);
                                        })
                                        .then(function(result) {
                                            console.log('PostBundle -> VisAndDashCreated!');
                                            deferred.resolve(game);
                                        })
                                        .fail(function(e) {
                                            deferred.reject(e);
                                        });
                                })
                                .fail(function(err) {
                                    console.log('PostBundle -> getKibanaBaseVisualizationsFailcase!');
                                    console.log(JSON.stringify(err, null, 2));
                                    return deferred.reject(err);
                                });

                            return deferred.promise;
                        });
                });
        }), res);

    console.log('PostBundle -> finnished!');
});

/**
 * @api {put} /games/:gameId Changes the title, developers and public attribute of a game.
 * @apiName PutGames
 * @apiGroup Games
 *
 * @apiParam {String} gameId The id of the game.
 * @apiParam {String} [title] The new title of the game
 * @apiParam {Boolean} [public] Whether the game is public or not.
 * @apiParam {String[]} [developers] Array with the username of the authors that you want to add to the game. Also can be a String
 * @apiParamExample {json} Request-Example:
 *      {
 *          "title": "My New Name",
 *          "developers": ["Some Username"],
 *          "public": "true"
 *      }
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_id": "559a447831b7acec185bf513",
 *          "title": "My Game"
 *          "authors": ["someDeveloper"],
 *          "developers": ["Some Username"],
 *          "public": "true"
 *      }
 */
router.put('/:gameId', function (req, res) {
    var username = req.headers['x-gleaner-user'];
    restUtils.processResponse(games.modifyGame(req.params.gameId, username, req.body, true), res);
});

/**
 * @api {put} /games/:gameId/remove Removes an developer of the game
 * @apiName PutGames
 * @apiGroup Games
 *
 * @apiParam {String} gameId The id of the game.
 * @apiParam {String[]} [author] Array with the username of the authors that you want to add to the game. Also can be a String
 * @apiParamExample {json} Request-Example:
 *      {
 *          "developers": ["Some Username"]
 *      }
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_id": "559a447831b7acec185bf513",
 *          "title": "My Game"
 *          "authors": ["someDeveloper"],
 *          "developers": [],
 *          "public": "true"
 *      }
 */
router.put('/:gameId/remove', function (req, res) {
    var username = req.headers['x-gleaner-user'];
    restUtils.processResponse(games.modifyGame(req.params.gameId, username, req.body, false), res);
});

/**
 * @api {delete} /games/:id Removes the game if doesn't contain activities else change the deleted field by true.
 * @apiName DeleteGame
 * @apiGroup Games
 *
 * @apiParam {String} id Game id.
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *         "message": "Success."
 *      }
 *
 */
router.delete('/:id', function (req, res) {
    var username = req.headers['x-gleaner-user'];
    restUtils.processResponse(games.removeGame(username, req.params.id), res);
});

/**
 * VERSIONS
 **/

/**
 * @api {get} /games/:gameId/versions Returns all the versions of a given game.
 * @apiName GetVersions
 * @apiGroup Games
 *
 * @apiParam {String} gameId Game id.
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              "_id": "559a447831b76cec185bf513",
 *              "gameId": "559a447831b7acec185bf513"
 *          }
 *      ]
 *
 */
router.get('/:gameId/versions', function(req, res) {
    var query = {
        // Creates a Query for the 'find' operation
        gameId: games.toObjectID(req.params.gameId)
    };
    console.info(query);
    restUtils.processResponse(versions.find(query), res);
});

/**
 * @api {get} /games/:id/xapi/:versionId Returns the game with the given id.
 *              This route is mainly used as the Object.id of the xAPI statements.
 * @apiName GetGame
 * @apiGroup Games
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_id": "559a447831b7acec185bf513",
 *          "title": "My Game"
 *          "authors": ["someDeveloper"],
 *          "developers": ["someDeveloper"],
 *          "public": "true"
 *      }
 *
 */
router.get('/:id/xapi/:versionId', restUtils.findById(games));

/**
 * @api {post} /games/:gameId/versions Adds a new version for a specific game.
 * @apiName PostVersions
 * @apiGroup Games
 *
 * @apiParam {String} gameId Game id.
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_id": "559a447831b76cec185bf513",
 *          "gameId": "559a447831b7acec185bf513"
 *      }
 *
 */
router.post('/:gameId/versions', function(req, res) {
    restUtils.processResponse(versions.createVersion({
        gameId: req.params.gameId
    }), res);
});

/**
 * @api {get} /games/:gameId/versions/:id Returns a version for a specific game.
 * @apiName GetVersions
 * @apiGroup Games
 *
 * @apiParam {String} gameId Game id.
 * @apiParam {String} id Version id.
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_id": "559a447831b76cec185bf513",
 *          "gameId": "559a447831b7acec185bf514"
 *      }
 *
 */
router.get('/:gameId/versions/:id', restUtils.findById(versions));

/**
 * @api {post} /games/:gameId/versions/:id Adds a new name or link for a specific version.
 * @apiName PutVersions
 * @apiGroup Games
 *
 * @apiParam {String} gameId Game id.
 * @apiParam {String} id Version id.
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "name": "New name",
 *          "link": "New Link"
 *      }
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "name": "New name",
 *          "link": "New Link",
 *          "_id": "559a447831b76cec185bf513",
 *          "gameId": "559a447831b7acec185bf513"
 *      }
 *
 */
router.post('/:gameId/versions/:id', restUtils.findAndModify(versions, function (req) {
    // Ensures that the 'gameId' attribute cannot be changed in a 'version'
    if (req.body && req.body.gameId) {
        delete req.body.gameId;
    }
}));

/**
 * SESSIONS
 */

/**
 * @api {get} /games/:gameId/versions/:versionsId/activities Returns all the Activities of a
 * given version of a game.
 * @apiName GetActivities
 * @apiGroup Activities
 *
 * @apiParam {String} gameId The Game id of the activity.
 * @apiParam {String} versionId The Version id of the activity.
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              "_id": "559a447831b76cec185bf501"
 *              "gameId": "559a447831b76cec185bf513",
 *              "versionId": "559a447831b76cec185bf514",
 *              "classId": "559a447831b76cec185bf542",
 *              "created": "2015-07-06T09:00:50.630Z",
 *              "start": "2015-07-06T09:00:52.630Z",
 *              "end": "2015-07-06T09:03:45.631Z"
 *          },
 *          {
 *              "_id": "559a447831b76cec185bf511"
 *              "gameId": "559a447831b76cec185bf513",
 *              "versionId": "559a447831b76cec185bf514",
 *              "classId": "559a447831b76cec185bf547",
 *              "created": "2015-07-06T09:00:50.630Z",
 *              "start": "2015-07-06T09:03:52.636Z",
 *              "end": "2015-07-06T09:03:58.631Z"
 *          }
 *      ]
 *
 */
router.get('/:gameId/versions/:versionId/activities', function (req, res) {
    restUtils.processResponse(activities.getGameActivities(req.params.gameId, req.params.versionId), res);
});

/**
 * @api {get} /games/:gameId/versions/:versionsId/activities/my Returns all the Activities of a given
 * version of a game where the user participates.
 * @apiName GetActivities
 * @apiGroup Activities
 *
 *  @apiHeader {String} x-gleaner-user.
 *
 * @apiParam {String} gameId The Game id of the activity.
 * @apiParam {String} versionId The Version id of the activity.
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              "_id": "559a447831b76cec185bf501"
 *              "gameId": "559a447831b76cec185bf513",
 *              "versionId": "559a447831b76cec185bf514",
 *              "classId": "559a447831b76cec185bf542",
 *              "start": "2015-07-06T09:00:52.630Z",
 *              "end": "2015-07-06T09:03:45.631Z"
 *          },
 *          {
 *              "_id": "559a447831b76cec185bf511"
 *              "gameId": "559a447831b76cec185bf513",
 *              "versionId": "559a447831b76cec185bf514",
 *              "classId": "559a447831b76cec185bf546",
 *              "start": "2015-07-06T09:03:52.636Z"
 *          }
 *      ]
 *
 */
router.get('/:gameId/versions/:versionId/activities/my', function (req, res) {
    restUtils.processResponse(activities.getUserActivitiesByGame(req.params.gameId, req.params.versionId,
        req.headers['x-gleaner-user']), res);
});

/**
 * @api {get} /statements Returns all statements.
 * @apiName GetSessions
 * @apiGroup Sessions
 *
 * @apiParam {String} id The Session id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "statements": [
 *          {
 *              "id": "e5efec39-3992-401d-be17-86d24c3f1e76",
 *              "actor": {
 *              "objectType": "Agent",
 *              "name": "s",
 *              "account": {
 *                  "homePage": "http://www.gleaner.com/",
 *                  "name": "s"
 *              }
 *          },
 *          "verb": {
 *              "id": "http://www.gleaner.com/started_game",
 *              "display": {
 *                  "es-ES": "started_game",
 *                  "en-US": "started_game"
 *              }
 *          },
 *          "object": {
 *              "id": "http://www.gleaner.com/games/lostinspace/none",
 *              "objectType": "Activity",
 *              "definition": {
 *                  "type": "http://www.gleaner.com/objects/none",
 *                  "extensions": {
 *                      "event": "game_start",
 *                      "gameplayId": "55e57b03553dded764546f03"
 *                  }
 *              }
 *          },
 *          "stored": "2015-09-10T11:01:04Z"
 *      }
 *
 */
router.get('/statements', function (req, res, next) {

    var options = {
        uri: req.app.config.lrs.uri + '/statements',
        method: 'GET',
        json: true,
        headers: {
            Authorization: 'Basic ' + new Buffer(req.app.config.lrs.username + ':' + req.app.config.lrs.password)
                .toString('base64'),
            'X-Experience-API-Version': '1.0.1'
        }
    };

    request(options, function (err, response, body) {
        if (err) {
            next(err);
        } else {
            if (!body) {
                body = {statements: []};
            }
            res.json(body);
        }
    });
});

module.exports = router;