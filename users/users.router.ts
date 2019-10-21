import { authorize } from './../security/authz.handler';
import { authenticate } from './../security/auth.handler';
import * as restify from 'restify';
import { ModelRouter } from '../common/model-router';
import { User } from './users.model';
import { ForbiddenError } from 'restify-errors';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);
        this.on('beforeRender', document => {
            document.password = undefined;
            //delete document.password
        });
    }

    findByEmail = (req, resp, next) => {
        if (req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => user ? [user] : [])
                .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                .catch(next);
        } else {
            next();
        }
    }

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            {
                version: '1.0.0',
                handler: [authorize('admin'), this.findAll]
            },
            {
                version: '2.0.0',
                handler: [authorize('admin'), this.findByEmail, this.findAll]
            }
        ]))
        application.get(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authorize('admin'), this.save]);
        application.put(`${this.basePath}/:id`, [authorize('admin','user'), this.validateChange, this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authorize('admin','user'), this.validateChange, this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete]);

        application.post(`${this.basePath}/authenticate`, authenticate);
    }

    private validateChange = (req, res, next) => {
        if (!req.authenticated.profiles.some(profile => profile === 'admin')) {
            if (req.authenticated._id.equals(req.params.id)) {
                return next();
            }
            else {
                next(new ForbiddenError('Access Denied.'));
            }
        }
        next();
    }
}

export const usersRouter = new UsersRouter();