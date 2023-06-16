import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.GITHUB_TOKEN;

// /user/repos

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
    return issues;
}

const getIssuesForAllRepos = async (seed) => {
    let issues = [];
    for (let i = 0; i < seed.length; i++) {
        const { owner, repo } = seed[i];
        const issuesForRepo = await getIssues(owner, repo);
        issues.push(issuesForRepo);
    }
    return issues;
}

const getUserfromIssue = (issue) => {
    return issue.user.login;
}

const getAllReposfromUser = async (user) => {
    const repos = await octokit.repos.listForUser({
        username: user,
    });
    return repos;
}

const main = async () => {

}

main();