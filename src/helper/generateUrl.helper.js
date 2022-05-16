const {GITHUB_USER} = require('../config/key');

exports.githubUrls = {
    getRpositories : (args) => {
        return `GET /user/repos?visibility=all&sort=created&direction=asc&per_page=${args.per_page}&page=${args.page}`;
    },
    getRepositoryDetails : (repo) => {
        return `GET /repos/${GITHUB_USER}/${repo}`;
    },
    getRepositoryWebhookDetails : (repo) => {
        return `GET /repos/${GITHUB_USER}/${repo}/hooks`;
    },
    getContentUrl: (repo, path) => {
        return `GET /repos/${GITHUB_USER}/${repo}/contents/${path}`;
    }
}

