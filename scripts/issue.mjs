import { Octokit } from "@octokit/rest";
import { get } from "http";

const token = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
    auth: token,
});

const getIssues = async (owner, repo) => {
    const issues = await octokit.issues.listForRepo({
        owner: owner,
        repo: repo,
    });

    // get every issue with the label "good first issue"

    const goodFirstIssues = issues.data.filter((issue) => {
        return issue.labels.find((label) => {
            return label.name === "good first issue";
        })
    })

    // filter out pull requests
    const filteredIssues = issues.data.filter((issue) => {
        return issue.pull_request === undefined && issue.state === "open";
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
                console.log(repos)
            })
        })
        
    } catch (error) {
        return error;
    }
}

getChildrenFromRepo("facebook", "react");

let seed = [
    {
        owner: "facebook",
        repo: "react",
        parent: null,
        issues: await getIssues("facebook", "react"),
        // children: await getChildrenFromRepo("facebook", "react"),
    }
];

// console.log(seed);