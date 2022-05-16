const {getListOfRepositories} = require('../helper/request.helper');

// Define resolver function for each API endpoint
exports.root = {
    getRepositories: (args) => getListOfRepositories(args),
};