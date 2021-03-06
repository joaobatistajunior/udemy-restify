import { beforeAllTests, afterAllTests } from './../jest.startup';
import { fail } from 'assert';
import 'jest';
import * as request from 'supertest';

const address = (<any>global).address;
const auth = (<any>global).auth;

beforeAll(beforeAllTests);
afterAll(afterAllTests);

test('get /users', async () => {
    await request(address)
        .get('/users')
        .set('Authorization',auth)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        }).catch(fail);
});

test('post /users', () => {
    return request(address)
        .post('/users')
        .set('Authorization',auth)
        .send({
            name: 'usuario1',
            email: 'usuario1@email.com',
            password: '123456',
            cpf: '918.983.606-50',
            profiles: ['user']
        })
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('usuario1');
            expect(response.body.email).toBe('usuario1@email.com');
            expect(response.body.cpf).toBe('918.983.606-50');
            expect(response.body.passowrd).toBeUndefined();
        }).catch(fail);
});

test('get /users/aaaa - not found', () => {
    return request(address)
        .get('/users/aaaa')
        .set('Authorization',auth)
        .then(response => {
            expect(response.status).toBe(404);
        }).catch(fail);
});

test('patch /users/:id', () => {
    return request(address)
        .post('/users')
        .set('Authorization',auth)
        .send({
            name: 'usuario2',
            email: 'usuario2@email.com',
            password: '123456',
            profiles: ['user']
        })
        .then(response => request(address)
            .patch(`/users/${response.body._id}`)
            .set('Authorization',auth)
            .send({
                name: 'usuario2 - patch'
            }))
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('usuario2 - patch');
            expect(response.body.email).toBe('usuario2@email.com');
            expect(response.body.passowrd).toBeUndefined();
        })
        .catch(fail);
});
