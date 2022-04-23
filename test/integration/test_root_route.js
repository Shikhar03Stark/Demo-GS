const mocha = require('mocha');
const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server').app;


mocha.describe('Integration::Root route', () => {

    mocha.describe('GET /', () => {
        mocha.it('should return status 200 and correct response signature', (done) => {
            supertest(app)
                .get('/')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(res => {
                    assert.strictEqual(res.body.hasOwnProperty('ok'), true);
                    assert.strictEqual(res.body.hasOwnProperty('data'), true);

                    assert.strictEqual(res.body.ok, true);
                })
                .end((err, res) => {
                    if(err) throw err;
                    done();
                });
        })
    });

    mocha.describe('POST /', () => {
        mocha.it('should return status 404 and correct response signature', (done) => {
            supertest(app)
                .post('/')
                .send({})
                .expect(404)
                .expect(res => {
                    assert.strictEqual(res.body.hasOwnProperty('ok'), true);
                    assert.strictEqual(res.body.hasOwnProperty('error'), true);

                    assert.strictEqual(res.body.ok, false);
                })
                .end((err, res) => {
                    if(err) throw err;
                    done();
                });
        });
    });

});
