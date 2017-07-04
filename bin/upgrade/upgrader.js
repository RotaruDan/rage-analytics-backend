/*
 * Copyright 2016 e-UCM (http://www.e-ucm.es/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * This project has received funding from the European Union’s Horizon
 * 2020 research and innovation programme under grant agreement No 644187.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0 (link is external)
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var Path = require('path');
var async = require('async');
var fs = require('fs');
var config = require(Path.resolve(__dirname, '../../config.js'));

function logError(err, result) {
    console.error('Unexpected error,', err);
    console.error('Result,', result);
    process.exit(1);
}

var controllers = {};

function controller(name, controller) {
    controllers[name] = controller;
}

function roll() {

    var refreshes = {};
    for (var key in controllers) {
        var controller = controllers[key];
        refreshes[key] = controller.refresh.bind(controller);
    }

    console.log('Starting refresh phase!');
    async.series(refreshes,
        function (err, status) {
            // results is now equal to: {one: 1, two: 2}
            console.log('Finished refresh phase!');
            if (err) {
                return logError(err, status);
            }

            var finish = true;
            for (var key in status) {
                var refresh = status[key];
                if(refresh.status !== 0) {
                    finish = false;
                }
                if (refresh.status === 2) {
                    return logError('Error, refresh returned 2!',
                        refresh);
                }
            }

            if (finish) {
                return console.log('Finished upgrading!');
            }

            /*

             {
             mongo : [1,2,3]

             }

             */

            var requirements = {};

            /*
             Gathering requirements for all controllers to any version
             */
            for (var key in controllers) {
                var contrReqs = status[key].requirements;
                for (var contrReq in contrReqs) {
                    var contrReqVersion = contrReqs[contrReq].toString();
                    if (!requirements[contrReq])
                        requirements[contrReq] = {};

                    if (!requirements[contrReq][contrReqVersion]) {
                        requirements[contrReq][contrReqVersion] = true;
                    }
                }
            }

            var transforms = {};
            for (var key in controllers) {
                if(status[key].status === 0) {
                    continue;
                }
                var version = status[key].version;
                if (!requirements[key] || !requirements[key][version.origin.toString()]) {
                    // Update
                    transforms[key] = controllers[key].transform.bind(controllers[key]);
                }
            }

            // TODO, is empty transforms -> double dependency?
            async.series(transforms,
                function (err, status) {
                    // Results is now equal to: {one: 1, two: 2}
                    if (err) {
                        return logError(err, status);
                    }
                    console.log('Finished transforms phase!', status);
                    roll();
                });
        });
}

function upgrade() {
    var connects = [function (callback) {
        console.log('Starting connect phase...');
        callback(null, config);
    }];
    for (var key in controllers) {
        var controller = controllers[key];
        connects.push(controller.connect.bind(controller));
    }
    console.log(JSON.stringify(controllers, null, 4));
    async.waterfall(connects,
        function (err, result) {
            console.log('Finished connect phase!');
            if (err) {
                return logError(err, result);
            }
            roll();
        });
}

module.exports = {
    controller: controller,
    upgrade: upgrade
};
