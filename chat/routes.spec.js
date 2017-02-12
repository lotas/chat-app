/* global describe, it, expect */

const app = require('../index.js');
const request = require('supertest')(app);

describe('routes', function() {
    it('should be', function() {
        expect(1).toEqual(1);
    });

    it('should get list of users', function(cb) {
        request
            .get('/users')
            .expect(200)
            .end(cb);
    });

    describe('Registered user', function() {
        let authUser = null;

        it('should register user', function(cb) {
            request
                .post('/user')
                .send({
                    name: 'test1'
                })
                .expect(200, function(err, res) {
                    if (err) {
                        return cb(err);
                    }

                    authUser = res.body;

                    expect(res.body.id).toBeDefined();
                    expect(res.body.authToken).toBeDefined();
                    expect(res.body.name).toEqual('test1');

                    cb();
                });
        });


        it('should not send without authorisation', function(cb) {
            request
                .post('/message')
                .send({
                    to: 'doesnt matter',
                    from: 'no authtoken sent anyway'
                })
                .expect(403, cb);
        });

        it('should not send without recipient', function(cb) {
            request
                .post('/message')
                .send({
                    authToken: authUser.authToken
                })
                .expect(412, cb);
        });

        it('should not send to unkown user', function(cb) {
            request
                .post('/message')
                .send({
                    authToken: authUser.authToken,
                    to: 'notRegisteredForSure'
                })
                .expect(404, cb);
        });

        it('should not send empty message', function(cb) {
            request
                .post('/message')
                .send({
                    authToken: authUser.authToken,
                    to: 'test1'
                })
                .expect(412, cb);
        });

        it('should send new message', function(cb) {
            request
                .post('/message')
                .send({
                    authToken: authUser.authToken,
                    to: 'test1',
                    text: 'text'
                })
                .expect(200, function(err, res) {
                    if (err) {
                        return cb(err);
                    }

                    authUser = res.body;

                    expect(res.body.id).toBeDefined();
                    expect(res.body.to).toEqual('test1');
                    expect(res.body.from).toEqual('test1');
                    expect(res.body.text).toEqual('text');
                    expect(res.body.sentAt).toBeDefined();

                    cb();
                });
        });

        it('should unregister', function(cb) {
            request
                .delete('/user')
                .send({
                    authToken: authUser.authToken
                })
                .expect(200, cb);
        });


    });
});