import "reflect-metadata";
import express from 'express'
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import { UserResolver} from "./UserResolver"
import {createConnection} from "typeorm"

(async () => {
    const app = express();
    app.get("/", (_req, res)=> res.send("hello"));

    await createConnection().then(async () => {
    
        console.log("Inserting a new user into the database...");
    }).catch(error => console.log(error));
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[UserResolver]
        })
    })

    apolloServer.applyMiddleware({app})

    app.listen(4000, () => {
        console.log("express server started")
    })
})();
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

