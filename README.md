# J Dublon - NC News

This API utilises Express and Knex to communicate with a PostgreSQL database. It serves articles, comments, topics and users, and enables the posting and deleting of comments, and the amending of "vote" property of both comments and articles.

## Getting Started

The instructions below will allow you to get a copy of this project up and running on your local machine for development and testing purposes.

Node.js (13.13.0) is necessary to run this project, as is PostgreSQL (12.2). For installing dependencies and dev-dependencies, see below.

## Installing

1. To clone the project:

2. Installing dependencies: Express, Knex and PostgreSQL can all be installed with the following command:

   `npm i express knex pg`

3. Installing dev-dependencies (for testing purposes only): Mocha, Chai, Chai-Sorted and Supertest should be installed using the following command:

   `npm i -D mocha chai chai-sorted supertest`

4. This project includes two databases: one **test database** for testing purposes and one **dev database**.

   - First setup your databases using the following command:

     `npm run setup-dbs`

   - Then seed the database you wish to work with:

     - `npm run seed-dev`
     - **or**
     - `npm run seed-test`

## Running the tests

To test the util functions:

`npm run test-utils`

To test the server:

`npm run test`

## Built with:

- **Node.js** - runtime environment
- **Express** - application framework
- **Knex** - SQL query builder
- **PostgreSQL** - relational database management system
- **Mocha** - testing framework
- **Chai** and **Chai-sorted** - testing assertion library
- **Supertest** - http testing assertion library

## Contributing

[Please see here](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for an excellent guide on how to contribute.

## Authors

Jodi Dublon

## Acknowledgements

Many thanks to all the staff at Northcoders.
