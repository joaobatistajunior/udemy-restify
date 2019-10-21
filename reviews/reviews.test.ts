import { beforeAllTests, afterAllTests } from './../jest.startup';
import { fail } from 'assert';
import 'jest';
import * as request from 'supertest';

let address = (<any>global).address;

beforeAll(beforeAllTests);
afterAll(afterAllTests);

test('get /reviews', () => {
    return request(address)
        .get('/reviews')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        }).catch(fail);
});