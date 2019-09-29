import * as mongoose from 'mongoose';
import * as restify from 'restify';
import { Router } from '../common/router';
import { environment } from './../common/environments';
import { handleError } from './error.handler';
import { mergePatchBodyParser } from './merge-patch.parser';

export class Server {

    application: restify.Server;

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() => {
            return this.initRoutes(routers).then(() => this);
        });
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }

    private initializeDb(): Promise<any> {
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
    }

    private initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(mergePatchBodyParser);

                //routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

                this.application.on('restifyError', handleError)
            } catch (error) {
                reject(error);
            }
        });
    }

}