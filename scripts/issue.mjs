import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
    auth: token,
});

let seed = [
    {
        "owner": "facebook",
        "repo": "react",
        "issues": 0,
        "parent": null,

    }
]

const getIssues = async (owner, repo) => {
    const issues = await octokit.issues.listForRepo({
        owner: owner,
        repo: repo,
    });
    
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
                repos.forEach((repo) => {
                    // check if repo is already in seed
                    let exists = false;
                    seed.forEach((seedRepo) => {
                        if (seedRepo.owner === repo.owner.login && seedRepo.repo === repo.name) {
                            exists = true;
                        }
                    })

                    if (!exists) {
                        seed.push({
                            "owner": repo.owner.login,
                            "repo": repo.name,
                            "issues": repo.open_issues_count,
                            "parent": {
                                "owner": owner,
                                "repo": repo,
                            }
                        })
                    }
                    
                    getChildrenFromRepo(repo.owner.login, repo.name);
                })
            })
        })
        
    } catch (error) {
        return error;
    }
}

seed.forEach((repo) => {
    getChildrenFromRepo(repo.owner, repo.repo);

    setTimeout(() => {
        console.log(seed);
    }, 5000)
})