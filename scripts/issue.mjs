import { Octokit } from "@octokit/rest";
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
    
    // filter out pull requests
    const filteredIssues = issues.data.filter((issue) => {
        return issue.pull_request === undefined;
    })

    return filteredIssues;
}

const getAllReposfromUser = async (user) => {
    const repos = await octokit.repos.listForUser({
        username: user,
    });

    const filteredRepos = repos.data.filter((repo) => {
        return repo.fork === false && repo.open_issues_count > 0 && repo.archived === false;
    })

    return filteredRepos;

    
    // return repos.data;
}

const getChildrenFromRepo = async (owner, repo) => {
    try {
        const issues = await getIssues(owner, repo);
        let users = [];

        issues.forEach((issue) => {
            users.push(issue.user.login);
        })

        users.forEach((user) => {
            getAllReposfromUser(user).then((repos) => {
                repos.forEach((repo) => {
                    // check if repo is already in seed
                    let found = seed.find((seedRepo) => {
                        return seedRepo.owner === repo.owner.login && seedRepo.repo === repo.name;
                    })

                    if (found === undefined) {
                        seed.push({
                            "owner": repo.owner.login,
                            "repo": repo.name,
                        })
                    }
                })
            })
        })
        
    } catch (error) {
        return error;
    }
}