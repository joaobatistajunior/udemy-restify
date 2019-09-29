import { environment } from './../common/environments';
import 'jest';
import * as request from 'supertest';
import { fail } from 'assert';
import { Server } from '../server/server';
import { usersRouter } from './users.router';
import { User } from './users.model';

let address: string;
let server: Server;

beforeAll(() => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    environment.server.port = process.env.SERVER_PORT || 3001;
    address = `http://localhost:${environment.server.port}`;
    server = new Server();
    return server.bootstrap([usersRouter])
        .then(() => User.deleteMany({}).exec())
        .catch(console.error);
});


afterAll(() => {
    return server.shutdown();
});

test('get /users', () => {
    request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        }).catch(fail);
});

test('post /users', () => {
    request(address)
        .post('/users')
        .send({
            name: 'usuario1',
            email: 'usuario1@email.com',
            password: '123456',
            cpf: '918.983.606-50'
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