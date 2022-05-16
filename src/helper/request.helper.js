const { Octokit } = require('octokit');
const async = require('async')
const constant = require('../config/constant');
const { GITHUB_TOKEN } = require('../config/key');

const { githubUrls } = require('./generateUrl.helper');

const octokit = new Octokit({
    auth: GITHUB_TOKEN
})

//Call github rest APIs
const callGitHubApi = async (url = '') => {
    try {
        const result = await octokit.request(url);
        if(result && result.status === constant.github_status.success && result.data) {
            return result.data;
        }
    } catch (error) {
        console.log("Error while calling an github API => () {}", error);
    }
    return null;
}

//Get list of all repositories
exports.getListOfRepositories = async (args) => {
    try {
        const result = await callGitHubApi(githubUrls.getRpositories(args));
        if(result) {
            let functionProcess = [];
            result.forEach(element => {
                functionProcess.push((callback) => {
                    new Promise(async (resolve, reject) => {
                        resolve(await processAndPrepareResponseForRepository(element));
                    })
                    .then(value => {
                        callback(null, value);
                    })
                    .catch(err => {
                        callback(null, err);
                    })            
                });
            });

            return await new Promise ((resolve, reject) => {
                async.parallelLimit(functionProcess, constant.concurrency,
                (err, results) => {
                    if (err) {
                        console.log('Error while getting parallel result', err);
                        reject(err);
                    }
                    resolve(results)
                });
            })
        }
        return []
    } catch (error) {
        console.log('Error while fetching repos', error);
        return []
    }
}

//Processes and prepares a response for each repository
const processAndPrepareResponseForRepository = async (el) => {
    try {
        let data = await getFileData({repo: el.name});
        return {
            name: el.name,
            owner: el.owner.login,
            size: el.size,
            repoDetails: {
                name: el.name,
                owner: el.owner.login,
                size: el.size,
                visibility: el.visibility,
                noOfFiles: data.fileCount,
                fileContent: data.fileContent ? await getFileContent(data.fileContent) : '',
                webhooks: await getRepositoryActiveWebhooks(el.name)
            }
        }
    } catch (error) {
        console.log("Error while processing and preparing a response", error);
    }
    return {};
}

//Get repository webhook status
const getRepositoryActiveWebhooks = async (repo) => {
    try {
        const result = await callGitHubApi(githubUrls.getRepositoryWebhookDetails(repo));
        if(result) {
            return result.map( el => {
                if (el.active === true) {
                    return {
                        name: el.name,
                        active: el.active,
                        events: el.events
                    }
                }
            })
        }
        return []
    } catch (error) {
        console.log('Error while fetching repository webhooks', error);
        return []
    }
}

//Get repository file data
const getFileData = async ({repo, path = '', fileContent = '', checkForFile = true, fileCount = 0}) => {
    try {

        let file = constant.file;
        let scanFileContent = true;
        while (scanFileContent) {
            let data = await getContentOfRepository({repo, path});
            if (data.length > 0) {
                let files = data.filter(el => el.type === 'file');
                fileCount += files.length;

                if (checkForFile) {
                    let isFileExist = files.find(el => el.name.includes(file));
                    if (isFileExist) {
                        checkForFile = false;
                        fileContent = isFileExist.git_url;
                    }
                }

                let checkDirs = data.filter(el => el.type === 'dir');
                if (checkDirs.length > 0) {
                    console.log(checkDirs.length, 'checkDirs.length');
                    for(let i=0; i<checkDirs.length;i++) {
                        console.log(i, 'processing');
                        let path = checkDirs[i].path;
                        let data = await getFileData({repo, path, fileContent, checkForFile, fileCount});
                        fileCount = data.fileCount;
                        checkForFile = data.checkForFile;
                        fileContent = data.fileContent;
                    }
                    scanFileContent = false;
                    break;
                } else {
                    scanFileContent = false;
                    break;
                }
            } else {
                scanFileContent = false;
                break;
            }
        }

        return {
            checkForFile,
            fileCount,
            fileContent
        }
    } catch (error) {
        return {
            checkForFile,
            fileCount,
            fileContent
        }
    }
}

//Get content of repository
const getContentOfRepository = async ({repo, path}) => {
    try {
        const result = await callGitHubApi(githubUrls.getContentUrl(repo, path));
        if (result) {
            return result;
        }
        return null
    } catch (error) {
        console.log("Error while fetching repository content", error);
        return null
    }
}

//Get file content of repository
const getFileContent = async (path) => {
    try {
        const result = await callGitHubApi(path);
        if (result) {
            return (Buffer.from(result.content, 'base64')).toString();
        }
        return ''
    } catch (error) {
        console.log("Error while fetching file content", error);
        return ''
    }
}