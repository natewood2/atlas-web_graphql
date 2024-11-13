const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema.js');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log('connected to database');
});

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('now listening for request on port 4000');
});