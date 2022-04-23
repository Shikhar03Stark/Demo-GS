const mocha = require('mocha');
const supertest = require('supertest');
const assert = require('assert');
const app = require('../../server').app;


mocha.describe('Integration::Undefined route', () => {

    mocha.describe('GET /undefined_route', () => {
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
