'use strict';

module.exports = (function () {
    var Q = require('q');
    var Collection = require('easy-collections');
    var db = require('./db');
    var analysis = new Collection(db, 'analysis');
    var versions = require('./versions');
    var fs = require('fs');
    var mkdirp = require('mkdirp');
    var multer = require('multer');
    var async = require('async');
    var AdmZip = require('adm-zip');

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            var pathDir = './uploads/' + req.params.versionId + '/';
            mkdirp(pathDir, function (err) {
                if (err) {
                    console.error(JSON.stringify(err));
                    cb(err);
                } else {
                    cb(null, pathDir);
                }
            });
        },
        filename: function (req, file, cb) {
            if (file.mimetype !== 'application/zip' &&
                file.mimetype.indexOf('zip') === -1) {
                return cb({
                    message: 'Required mimetype application/zip, received ' + file.mimetype,
                    status: 400
                });
            }
            cb(null, file.originalname);
        }
    });
    var upload = multer({ // Multer settings
        storage: storage
    }).single('analysis');

    var uploadPromise = function (req, res) {
        var deferred = Q.defer();
        upload(req, res, function (err) {
            if (err) {
                deferred.reject({
                    message: JSON.stringify(err),
                    status: err.status || 400
                });
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    };

    var mkdirPromise = function (path) {
        var deferred = Q.defer();
        mkdirp(path, function (err) {
            if (err) {
                deferred.reject({
                    message: JSON.stringify(err),
                    status: err.status || 400
                });
            } else {
                deferred.resolve(path);
            }
        });
        return deferred.promise;
    };

    /**
     * Removes a folder recursively
     * @param location
     * @param next
     */
    function removeFolder(location, next) {
        fs.readdir(location, function (err, files) {
            async.each(files, function (file, cb) {
                file = location + '/' + file;
                fs.stat(file, function (err, stat) {
                    if (err) {
                        return cb(err);
                    }
                    if (stat.isDirectory()) {
                        removeFolder(file, cb);
                    } else {
                        fs.unlink(file, function (err) {
                            if (err) {
                                return cb(err);
                            }
                            return cb();
                        });
                    }
                });
            }, function (err) {
                if (err) {
                    return next(err);
                }
                fs.rmdir(location, function (err) {
                    if (err && err.code === 'ENOENT') {
                        return next();
                    }
                    return next(err);
                });
            });
        });
    }

    var removeFolderPromise = function (folder) {
        var deferred = Q.defer();
        removeFolder(folder, function (err) {
            if (err) {
                return deferred.reject({
                    message: JSON.stringify(err),
                    status: err.status || 400
                });
            }
            deferred.resolve();
        });
        return deferred.promise;
    };

    /**
     * Creates a new analysis for the given versionId.
     * @Returns a promise with the analysis created
     */
    analysis.createAnalysis = function (versionId, username, req, res) {

        versionId = analysis.toObjectID(versionId);
        return analysis.findById(versionId)
            .then(function (analysisResult) {
                if (analysisResult) {
                    throw {
                        message: 'Analysis (' + versionId + ') already exists. ' +
                        'Delete it first and then create a new one.',
                        status: 400
                    };
                }

                return versions.findById(versionId);
            })
            .then(function (version) {
                if (!version) {
                    throw {
                        message: 'Version (' + versionId + ') does not exist.',
                        status: 400
                    };
                }

                return uploadPromise(req, res);
            })
            .then(function (err) {
                if (err) {
                    throw err;
                }
                if (!req.file) {
                    throw {
                        message: 'You must upload a .zip file with the ' +
                        '\'realtime.jar\' and \'flux.yml\' files.',
                        status: 400
                    };
                }

                // Reading archives
                var zip = new AdmZip(req.file.path);
                var zipEntries = zip.getEntries(); // An array of ZipEntry records

                if (zipEntries.length !== 3) {
                    throw {
                        message: 'You must upload a .zip file with the only 3 files: ' +
                        '\'realtime.jar\', \'indices.json\' and \'flux.yml\' files. Found: ' +
                        zipEntries.length + ' entries!',
                        status: 400
                    };
                }
                var zipEntryNames = [
                    zipEntries[0].entryName,
                    zipEntries[1].entryName,
                    zipEntries[2].entryName
                ];
                if (zipEntryNames.indexOf('realtime.jar') === -1) {
                    throw {
                        message: 'Missing \'realtime.jar\' file inside the uploaded .zip!',
                        status: 400
                    };
                }
                if (zipEntryNames.indexOf('flux.yml') === -1) {
                    throw {
                        message: 'Missing \'flux.yml\' file inside the uploaded .zip!',
                        status: 400
                    };
                }
                if (zipEntryNames.indexOf('indices.json') === -1) {
                    throw {
                        message: 'Missing \'indices.json\' file inside the uploaded .zip!',
                        status: 400
                    };
                }

                var analysisFolder = req.app.config.storm.analysisFolder +
                    '/' + versionId.toString() + '/';

                return mkdirPromise(analysisFolder)
                    .then(function (path) {
                        return {
                            analysis: path,
                            zip: zip
                        };
                    });
            })
            .then(function (result) {

                result.zip.extractAllTo(result.analysis, true);
                var data = fs.readFileSync(result.analysis + 'indices.json', 'utf8');

                var err;
                var obj = JSON.parse(data);
                if (!obj.sessionKey) {
                    err = {
                        message: '\'indices.json\' need a session_key field',
                        status: 400
                    };
                } else if (!obj.indices) {
                    err = {
                        message: '\'indices.json\' need a indices field',
                        status: 400
                    };
                } else if (!Array.isArray(obj.indices)) {
                    err = {
                        message: '\'indices.json\' should be a string array',
                        status: 400
                    };
                } else {
                    obj.indices.some(function (ind) {
                        if (!ind.includes(obj.sessionKey)) {
                            err = {
                                message: 'All values in indices field of \'indices.json\' needs contain the key',
                                status: 400
                            };
                            return true;
                        }
                    });
                }

                if (err) {
                    return removeFolderPromise(result.analysis).then(function () {
                        throw err;
                    });
                }

                return analysis.insert({
                    _id: versionId,
                    realtimePath: result.analysis + 'realtime.jar',
                    fluxPath: result.analysis + 'flux.yml',
                    indicesPath: result.analysis + 'indices.json',
                    created: new Date()
                });


            })
            .fin(function() {
                return removeFolderPromise('./uploads/' + versionId.toString());
            });
    };

    /**
     * Removes the analysis of a given version id
     * @param analysisId
     * @param username
     * @returns {Promise|*}
     */
    analysis.removeAnalysis = function (config, analysisId, username) {
        analysisId = analysis.toObjectID(analysisId);
        return analysis.findById(analysisId)
            .then(function (analysisResult) {
                if (!analysisResult) {
                    throw {
                        message: 'Analysis does not exist',
                        status: 400
                    };
                }

                // Var analysisIdentifier = analysisId.toString();
                var analysisFolder = './' + config.storm.analysisFolder +
                    '/' + analysisId.toString() + '/';

                return removeFolderPromise(analysisFolder).then(function (err) {
                    if (err) {
                        throw err;
                    }
                    return analysis.removeById(analysisId).then(function (result, err) {
                        if (!err) {
                            return {
                                message: 'Success.'
                            };
                        }
                    });
                });
            });
    };

    return analysis;
})();