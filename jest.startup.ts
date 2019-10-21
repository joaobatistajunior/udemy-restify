import { Review } from './reviews/reviews.model';
import { reviewsRouter } from './reviews/reviews.router';
import * as jestCli from 'jest-cli';
import { environment } from "./common/environments";
import { Server } from "./server/server";
import { User } from "./users/users.model";
import { usersRouter } from "./users/users.router";

let server: Server;

export const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    environment.server.port = process.env.SERVER_PORT || 3001;
    server = new Server();
    return server.bootstrap([usersRouter, reviewsRouter])
        .then(() => User.deleteMany({}).exec())
        .then(() => {
            let admin = new User();
            admin.name = "admin";
            admin.email = "admin@email.com";
            admin.password = "123456";
            admin.profiles = ["admin", "user"];
            return admin.save();
        })
        .then(() => Review.deleteMany({}).exec());
}

export const afterAllTests = () => {
    return server.shutdown();
}

// beforeAllTests()
//     .then(()=>jestCli.run())
//     .then(()=>afterAllTests())
//     .catch(console.error);