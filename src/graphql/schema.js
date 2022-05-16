const { buildSchema } = require('graphql');

// Construct a schema
exports.schema = buildSchema(`

    type Repositories {
        name: String,
        size: Int,
        owner: String,
        repoDetails: Repository
    }

    type Repository {
        name: String,
        size: Int,
        owner: String,
        visibility: String,
        noOfFiles: Int,
        fileContent: String,
        webhooks: [Webhook]
    }

    type Webhook {
        name: String,
        active: Boolean,
        events: [String]
    }

    type Query {
        getRepositories(per_page: Int!, page: Int!): [Repositories],
    }
`);