const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');

const port = process.env.port || 4000;

const typeDefs = gql`
    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note
    }
    type Note {
        id: ID!
        content: String!
        author: String!
    }
    type Mutation {
        newNote(content: String!): Note!
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello world',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id)
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let note = {
                id: String(notes.length + 1),
                content: args.content,
                author: 'adam'
            }
            notes.push(note);

            return note;
        }
    }
};

let notes = [
    {id: '1', content: 'note1', author: 'user1'},
    {id: '2', content: 'note2', author: 'user2'},
    {id: '3', content: 'note3', author: 'user3'},
];


const app = express();

const server = new ApolloServer({typeDefs, resolvers});

server.start().then(() => {
    server.applyMiddleware({app, path: '/api'});
});

app.get('/', (req, res) => res.send('Hello World'));

app.listen(port, () => console.log(`Listening on port ${port}`));