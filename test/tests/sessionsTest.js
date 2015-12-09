'use strict';

var should = require('should'),
    ObjectID = require('mongodb').ObjectId;

var idGame = new ObjectID('dummyGameId0'),
    idVersion = new ObjectID('dummyVersId0'),
    idSession = new ObjectID('dummySessId0');

module.exports = function(request, db) {

    /**-------------------------------------------------------------**/
    /**-------------------------------------------------------------**/
    /**                   Test Sessions API                         **/
    /**-------------------------------------------------------------**/
    /**-------------------------------------------------------------**/
    describe('Sessions tests', function () {

        beforeEach(function (done) {
            db.collection('games').insert(
                {
                    _id: idGame,
                    title: 'Dummy'
                }, function () {
                    db.collection('versions').insert(
                        {
                            _id: idVersion,
                            gameId: idGame
                        }, function () {
                            db.collection('sessions').insert(
                                [{
                                    _id: idSession,
                                    gameId: idGame,
                                    versionId: idVersion,
                                    name: 'name',
                                    allowAnonymous: true,
                                    teachers: ['Teacher1'],
                                    students: ['Student1']
                                }, {
                                    gameId: idGame,
                                    versionId: idVersion
                                }], done);
                        });
                });
        });

        afterEach(function (done) {
            db.collection('games').drop(function () {
                db.collection('versions').drop(function () {
                    db.collection('sessions').drop(done);
                });
            });
        });

        it('should POST a new session', function (done) {
            request.post('/api/games/' + idGame + '/versions/' + idVersion + '/sessions')
                .expect(200)
                .set('Accept', 'application/json')
                .set('X-Gleaner-User', 'username')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body).be.Object();
                    should.equal(res.body.allowAnonymous, false);
                    should.equal(res.body.gameId, idGame);
                    should.equal(res.body.versionId, idVersion);
                    should(res.body.created).be.String();
                    should.not.exist(res.body.start);
                    should.not.exist(res.body.end);
                    done();
                });
        });

        it('should GET sessions', function (done) {
            request.get('/api/games/' + idGame + '/versions/' + idVersion + '/sessions')
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res).be.Object();
                    should.equal(res.body.length, 2);
                    done();
                });
        });

        it('should GET my sessions', function (done) {
            request.get('/api/games/' + idGame + '/versions/' + idVersion + '/sessions/my')
                .expect(200)
                .set('X-Gleaner-User', 'Teacher1')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res).be.Object();
                    should.equal(res.body.length, 1);
                    done();
                });
        });

        it('should GET a session', function (done) {
            request.get('/api/sessions/' + idSession)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res).be.Object();
                    should.equal(res.body._id, idSession);
                    done();
                });
        });

        it('should PUT (add) a session', function (done) {
            request.put('/api/sessions/' + idSession)
                .expect(401)
                .set('X-Gleaner-User', 'notAllowedUsername')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res).be.Object();
                    request.put('/api/sessions/' + idSession)
                        .expect(200)
                        .set('X-Gleaner-User', 'Teacher1')
                        .send({
                            name: 'someSessionName',
                            allowAnonymous: true,
                            teachers: ['Teacher1', 'Teacher2'],
                            students: ['Student2']
                        })
                        .end(function (err, res) {
                            should.not.exist(err);
                            should(res).be.Object();
                            should.equal(res.body.name, 'someSessionName');
                            should.equal(res.body.allowAnonymous, true);
                            should(res.body.teachers).containDeep(['Teacher1', 'Teacher2']);
                            should(res.body.students).containDeep(['Student1', 'Student2']);
                            done();
                        });
                });
        });

        it('should PUT (remove) a session', function (done) {
            request.put('/api/sessions/' + idSession + '/remove')
                .expect(401)
                .set('X-Gleaner-User', 'notAllowedUsername')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res).be.Object();
                    request.put('/api/sessions/' + idSession + '/remove')
                        .expect(200)
                        .set('X-Gleaner-User', 'Teacher1')
                        .send({
                            teachers: ['Teacher2'],
                            students: ['Student1']
                        })
                        .end(function (err, res) {
                            should.not.exist(err);
                            should(res).be.an.Object();
                            should(res.body.students).not.containDeep(['Student1']);
                            should(res.body.teachers).containDeep(['Teacher1']);
                            should.equal(res.body.teachers.length, 1);
                            should.equal(res.body.students.length, 0);
                            done();
                        });
                });
        });
    });
};
