import { Octokit } from "@octokit/rest";
// import { get } from "cypress/types/lodash";
// import { get } from "cypress/types/lodash";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
    auth: token,
});

let seed = [
    {
        "owner": "facebook",
        "repo": "react",
    }
]

const getIssues = async (owner, repo) => {
    const issues = await octokit.issues.listForRepo({
        owner: owner,
        repo: repo,
    });
    return issues.data;
}

const getAllReposfromUser = async (user) => {
    const repos = await octokit.repos.listForUser({
        username: user,
    });
    return repos;
}

const getChildrenFromRepo = async (owner, repo) => {
    getIssues(owner, repo).then((issues) => {  
        issues.forEach((issue) => {
            getAllReposfromUser(issue.user.login).then((repos) => {
                repos.data.forEach((repo) => {
                    console.log(repo.html_url);
                    // TODO: need to filter some of these links oe else it will be too much. GITHUB API unhappy :(
                })
            })
        })
    })

}

getChildrenFromRepo("facebook", "react");