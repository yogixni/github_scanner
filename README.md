# graphQL_Task

This task is basically to fetch user repositories and it's details.

# Getting Started
Install project in your system in order to start

# Prerequisites
You will require below things in your system.
1> NodeJS
2> NPM
3> Github account and personal access token

# Installing
After setting up prerequisites and project:
1> Type "npm install" in order to install dependencies
2> Fire command to configure .env file: cp .env.example .env

# After installing dependecies and keys:
=> Run "npm run start" in order to run project 

# Once you start project:
=> you will get "Running a GraphQL API server at http://localhost:4000/graphql" message in terminal
=> You can access graphQL server at : "http://localhost:4000/graphql" URL.
=> To fetch all repositories, please write below query in graphql ui:

# Graphql Query

query getListOfRepository {
  getRepositories (per_page: 3, page: 1) {
    name
    size
    owner
    repoDetails {
      name
      size
      owner
      private
      noOfFiles
      fileContent
      webhooks{
        name
        active
        events
      }
    }
  }
}