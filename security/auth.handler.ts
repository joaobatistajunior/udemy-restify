import * as jwt from 'jsonwebtoken';
import * as restify from 'restify';
import { NotAuthorizedError } from 'restify-errors';
import { environment } from './../common/environments';
import { User } from './../users/users.model';

export const authenticate: restify.RequestHandler = (req, resp, next) => {
    const { email, password } = req.body;
    User.findByEmail(email, '+password')
        .then(user => {
            if (user && user.matches(password)) {
                //gerar o token
                const token = jwt.sign({ sub: user.email as any, iss: 'meat-api' }, environment.security.apiSecret);
                resp.json({ name: user.name, email: user.email, accessToken: token });
                return next(false);
            } else {
                return next(new NotAuthorizedError('Invalid credentials.'));
            }
        }).catch(next);
} 