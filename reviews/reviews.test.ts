import { beforeAllTests, afterAllTests } from './../jest.startup';
import { fail } from 'assert';
import 'jest';
import * as request from 'supertest';

const address = (<any>global).address;
const auth = (<any>global).auth;

beforeAll(beforeAllTests);
afterAll(afterAllTests);

test('get /reviews', () => {
    return request(address)
        .get('/reviews')
        .set('Authorization',auth)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        }).catch(fail);
});