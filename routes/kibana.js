'use strict';

var express = require('express'),
    router = express.Router();

/**
 * @api {post} /api/kibana/templates/:type/:id Adds a new template in .template index of ElasticSearch.
 * @apiDescription :type must be visualization or index
 * @apiName PostTemplate
 * @apiGroup Templates
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".template",
 *          "_type": "visualization",
 *         "_id": "template_visualization",
 *           "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.post('/templates/:type/:id', function (req, res) {
    if (req.params.type !== 'visualization' && req.params.type !== 'index') {
        res.json('Invalid type parameter', 300);
    } else {
        req.app.esClient.index({
            index: '.template',
            type: req.params.type,
            id: req.params.id,
            body: req.body
        }, function (error, response) {
            if (!error) {
                res.json(response);
            } else {
                res.status(error.status);
                res.json(error);
            }
        });
    }
});

/**
 * @api {post} /api/kibana/templates/:type/:idTemplate/:idAuthor Adds a new template in .template index of ElasticSearch.
 * @apiDescription :type must be visualization or index
 * @apiName PostTemplate
 * @apiGroup Templates
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".template",
 *          "_type": "visualization",
 *          "_id": "template_visualization",
 *           "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.post('/templates/:type/:idTemplate/:idAuthor', function (req, res) {
    if (req.params.type !== 'visualization' && req.params.type !== 'index') {
        res.json('Invalid type parameter', 300);
    } else {
        req.body.author = req.params.idAuthor;
        req.app.esClient.index({
            index: '.template',
            type: req.params.type,
            id: req.params.idTemplate,
            body: req.body
        }, function (error, response) {
            if (!error) {
                res.json(response);
            } else {
                res.status(error.status);
                res.json(error);
            }
        });
    }
});

/**
 * @api {get} /api/kibana/templates/:idAuthor Return a list with the author's visualizations.
 * @apiName GetVisualizationFields
 * @apiGroup Kibana
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      ['field1', 'field2', 'field3']
 */
router.get('/templates/:idAuthor', function (req, res) {
    req.app.esClient.search({
        index: '.template',
        q: 'author:' + req.params.idAuthor
    }, function (error, response) {
        if (!error) {
            var result = [];
            if (response.hits) {
                for (var i = 0; i < response.hits.hits.length; i++) {
                    result[i] = response.hits.hits[i]._id;
                }
            }
            res.json(result);
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

/**
 * @api {get} /api/kibana/templates/index/:id Return the index with the id.
 * @apiName GetIndexTemplate
 * @apiGroup Kibana
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      ['field1', 'field2', 'field3']
 */
router.get('/templates/index/:id', function (req, res) {
    req.app.esClient.search({
        index: '.template',
        q: '_id:' + req.params.id
    }, function (error, response) {
        if (!error) {
            if (response.hits.hits[0]) {
                res.json(response.hits.hits[0]);
            } else {
                res.json(new Error('Index not found', 404));
            }
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

/**
 * @api {get} /api/kibana/templates/fields/:id Return the fields of visualization with the id.
 * @apiName GetVisualizationFields
 * @apiGroup Kibana
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      ['field1', 'field2', 'field3']
 */
router.get('/templates/fields/:id', function (req, res) {
    req.app.esClient.search({
        index: '.template',
        q: '_id:' + req.params.id
    }, function (error, response) {
        if (!error) {
            var result = [];
            if (response.hits.hits[0]) {
                var re = /"field":"(\w+.?\w+)"/g;

                var sourceField = 'visState';
                if (response.hits.hits[0]._type === 'index') {
                    sourceField = 'fields';
                    re = /"name":"([^_]\w+.?\w+)"/g;
                }

                var pos = 0;
                var m;
                while ((m = re.exec(response.hits.hits[0]._source[sourceField])) !== null) {
                    if (!exist(result, m[1])) {
                        result[pos] = m[1];
                        pos++;
                    }

                    if (m.index === re.lastIndex) {
                        re.lastIndex++;

                    }
                }
            }
            res.json(result);
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

function exist(result, element) {
    var exist = false;
    result.forEach(function (str) {
        if (str === element) {
            exist = true;
        }
    });
    return exist;
}

/**
 * @api {post} /api/kibana/visualization/game/:gameId/:id Adds a new visualization in .kibana index of ElasticSearch.
 * @apiName PostVisualization
 * @apiGroup Kibana
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".games",
 *          "_type": "visualization",
 *          "_id": "testing",
 *          "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.post('/visualization/game/:gameId/:id', function (req, res) {
    req.app.esClient.search({
        index: '.template',
        q: '_id:' + req.params.id
    }, function (error, response) {
        if (!error) {
            // Replace template and save it
            if (response.hits.hits[0]) {
                var obj = response.hits.hits[0]._source;
                Object.keys(req.body).forEach(function (key) {
                    obj.visState = obj.visState.replace(new RegExp(key, 'g'), req.body[key]);
                });

                req.app.esClient.index({
                    index: '.games' + req.params.gameId,
                    type: 'visualization',
                    id: req.params.id,
                    body: obj
                }, function (error, response) {
                    if (!error) {
                        res.json(response);
                    } else {
                        res.json(error);
                    }
                });
            } else {
                res.json(new Error('Template not found', 404));
            }
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

/**
 * @api {get} /api/kibana/tuples/fields/game/:id
 * @apiName GetFields
 * @apiGroup Kibana
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".games",
 *          "_type": "visualization",
 *          "_id": "testing",
 *          "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.get('/visualization/tuples/fields/game/:id', function (req, res) {
    req.app.esClient.search({
        index: '.games' + req.params.id,
        type: 'fields',
        q: '_id:fields' + req.params.id
    }, function (error, response) {
        if (!error) {
            if (response.hits.hits[0]) {
                res.json(response.hits.hits[0]._source);
            } else {
                res.json(new Error('Fields not found', 404));
            }
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

/**
 * @api {post} /api/kibana/tuples/fields/game/:id
 * @apiName GetFields
 * @apiGroup Kibana
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".games",
 *          "_type": "visualization",
 *          "_id": "testing",
 *          "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.post('/visualization/tuples/fields/game/:id', function (req, res) {
    req.app.esClient.index({
        index: '.games' + req.params.id,
        type: 'fields',
        id: 'fields' + req.params.id,
        body: req.body
    }, function (error, response) {
        if (!error) {
            res.json(response);
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

/**
 * @api {post} /api/kibana/visualization/list/:id Replace the visualization names in a document with the id.
 * @apiName PostVisualization
 * @apiGroup Kibana
 *
 * @apiParam {String} id The list id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".games",
 *          "_type": "list",
 *          "_id": "visualization_list",
 *          "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.post('/visualization/list/:id', function (req, res) {
    req.app.esClient.index({
        index: '.games' + req.params.id,
        type: 'list',
        id: req.params.id,
        body: req.body
    }, function (error, response) {
        if (!error) {
            res.json(response);
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

/**
 * @api {put} /api/kibana/visualization/list/:id Adds a list of visualization names in a document with the id.
 * @apiName PostVisualization
 * @apiGroup Kibana
 *
 * @apiParam {String} id The list id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".games",
 *          "_type": "list",
 *          "_id": "visualization_list",
 *          "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.put('/visualization/list/:id', function (req, res) {
    req.app.esClient.search({
        index: '.games' + req.params.id,
        type: 'list',
        q: '_id:' + req.params.id
    }, function (error, response) {
        if (!error) {
            var body = [];
            if (response.hits.hits[0]) {
                response = response.hits.hits[0]._source.visualizations;
                for (var i = 0; i < response.length; i++) {
                    addDifferents(req, body, response[i]);
                }
            }
            body = {
                visualizations: req.body.visualizations.concat(body)
            };
            req.app.esClient.index({
                index: '.games' + req.params.id,
                type: 'list',
                id: req.params.id,
                body: body
            }, function (error, response) {
                if (!error) {
                    res.json(response);
                } else {
                    res.status(error.status);
                    res.json(error);
                }
            });
        }
    });
});

function addDifferents(req, body, obj) {
    req.body.visualizations.forEach(function (v) {
        if (v !== obj) {
            body.push(obj);
        }
    });
}

/**
 * @api {get} /api/kibana/visualization/list/:id Return the list with the id.
 * @apiName GetVisualizationFields
 * @apiGroup Kibana
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "visualizations": [
 *              "UserScore_56962ebf5d817ba040bdca5f"
 *          ]
 *      }
 */
router.get('/visualization/list/:id', function (req, res) {
    req.app.esClient.search({
        index: '.games' + req.params.id,
        type: 'list',
        q: '_id:' + req.params.id
    }, function (error, response) {
        if (!error) {
            if (response.hits.hits[0]) {
                res.json(response.hits.hits[0]._source.visualizations);
            } else {
                res.json([]);
            }
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

/**
 * @api {delete} /api/kibana/visualization/list/:listId/:idToRemove Remove the idToRemove in the list with listId.
 * @apiName GetVisualizationFields
 * @apiGroup Kibana
 *
 * @apiParam {String} listId The list id
 * @apiParam {String} idToRemove The id to remove
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "visualizations": [
 *              "UserScore_56962ebf5d817ba040bdca5f"
 *          ]
 *      }
 */
router.delete('/visualization/list/:listId/:idToRemove', function (req, res) {
    req.app.esClient.search({
        index: '.games' + req.params.listId,
        type: 'list',
        q: '_id:' + req.params.listId
    }, function (error, response) {
        if (!error) {
            if (response.hits.hits[0]) {
                var obj = response.hits.hits[0]._source;

                var i = 0;
                obj.visualizations.forEach(function (v) {
                    if (v === req.params.idToRemove) {
                        obj.visualizations.splice(i,1);
                    }
                    i++;
                });

                req.app.esClient.index({
                    index: '.games' + req.params.listId,
                    type: 'list',
                    id: req.params.listId,
                    body: obj
                }, function (error, response) {
                    if (!error) {
                        res.json(obj);
                    } else {
                        res.status(error.status);
                        res.json(error);
                    }
                });
            } else {
                res.json([]);
            }
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

/**
 * @api {post} /api/kibana/index/:indexTemplate/:indexName Adds a new index in .kibana index of ElasticSearch.
 * @apiName PostIndex
 * @apiGroup Index
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".kibana",
 *          "_type": "index-pattern",
 *         "_id": "0535H53W34g",
 *           "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.post('/index/:indexTemplate/:indexName', function (req, res) {
    req.body.title = req.params.indexName;
    req.app.esClient.search({
        index: '.template',
        q: '_id:' + req.params.indexTemplate
    }, function (error, response) {
        if (response.hits.hits[0]) {
            response.hits.hits[0]._source.title = req.params.indexName;
            req.app.esClient.index({
                index: '.kibana',
                type: 'index-pattern',
                id: req.params.indexName,
                body: response.hits.hits[0]._source
            }, function (error, response) {
                if (!error) {
                    res.json(response);
                } else {
                    res.status(error.status);
                    res.json(error);
                }
            });
        } else {
            res.json(new Error('Template not found', 404));
        }
    });
});

/**
 * @api {post} /api/kibana/visualization/session/:gameId/:visualizationId/:sessionId Adds a new visualization in .kibana index of ElasticSearch.
 * @apiName PostVisualization
 * @apiGroup Kibana
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".kibana",
 *          "_type": "visualization",
 *          "_id": "sessionId",
 *          "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.post('/visualization/session/:gameId/:visualizationId/:sessionId', function (req, res) {
    req.app.esClient.search({
        index: '.games' + req.params.gameId,
        q: '_id:' + req.params.visualizationId
    }, function (error, response) {
        if (!error) {
            if (response.hits.hits[0] && response.hits.hits[0]._source.kibanaSavedObjectMeta) {
                var re = /"index":"(\w+.?\w+)"/;

                var obj = response.hits.hits[0]._source;
                // Replace template and save it
                var m = re.exec(obj.kibanaSavedObjectMeta.searchSourceJSON);

                obj.kibanaSavedObjectMeta.searchSourceJSON = obj.kibanaSavedObjectMeta.searchSourceJSON.replace(m[1], req.params.sessionId);
                // Replace template and save it
                obj.title = response.hits.hits[0]._id + '_' + req.params.sessionId;

                req.app.esClient.index({
                    index: '.kibana',
                    type: 'visualization',
                    id: response.hits.hits[0]._id + '_' + req.params.sessionId,
                    body: obj
                }, function (error, response) {
                    if (!error) {
                        res.json(response);
                    } else {
                        res.status(error.status);
                        res.json(error);
                    }
                });
            } else {
                res.json(new Error('Template not found', 404));
            }
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

/**
 * @api {post} /api/kibana/dashboard/session/:sessionId Adds a new dashboard in .kibana index of ElasticSearch.
 * @apiName PostVisualization
 * @apiGroup Kibana
 *
 * @apiParam {String} id The visualization id
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "_index": ".kibana",
 *          "_type": "visualization",
 *          "_id": "sessionId",
 *          "_version": 1,
 *          "_shards": {
 *              "total": 2,
 *              "successful": 1,
 *              "failed": 0
 *          },
 *          "created": true
 *      }
 */
router.post('/dashboard/session/:sessionId', function (req, res) {
    req.app.esClient.index({
        index: '.kibana',
        type: 'dashboard',
        id: 'dashboard_' + req.params.sessionId,
        body: req.body
    }, function (error, response) {
        if (!error) {
            res.json(response);
        } else {
            res.status(error.status);
            res.json(error);
        }
    });
});

module.exports = router;