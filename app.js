const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphiQlSchema = require('./graphql-core/schema/index');
const graphiQlResolvers = require('./graphql-core/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();
const events = [];
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.send('Hello world!');
})

app.use(isAuth)
app.use('/graphql', graphqlHttp({
    schema: graphiQlSchema,
    rootValue: graphiQlResolvers,
    graphiql: true,
}));

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PWD;
const mongoDB = process.env.MONGO_DB;

mongoose.connect(
    `mongodb+srv://${mongoUser}:${
    mongoPassword
    }@myfirstcluster-mlbxs.mongodb.net/${mongoDB}?retryWrites=true&w=majority`
).then(() => {
    app.listen(3000);
})
    .catch(
        (err) => {
            console.error('An error occurred at connecting mongoDB', err);
        }
    )

