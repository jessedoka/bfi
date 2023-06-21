import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
    auth: token,
});

const getIssues = async (owner, repo) => {
    const issues = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: owner,
        repo: repo,
        state: "open",
        labels: "good first issue",
    });

    // filter out pull requests
    const filteredIssues = issues.data.filter((issue) => {
        return issue.pull_request === undefined;
    })

    const parsedIssues = filteredIssues.map((issue) => {
        return {
            title: issue.title,
            url: issue.html_url,
            // parse label to only show name
            label: issue.labels.map((label) => {
                return label.name;
            }),
            user: issue.user.login,
            time: issue.created_at,
        }
    })

    return parsedIssues


}

const getAllReposfromUser = async (user) => {
    const repos = await octokit.request('GET /users/{username}/repos', {
        username: user,
        type: "owner",
        sort: "updated",
        direction: "desc",
    });

    const filteredRepos = repos.data.filter((repo) => {
        return repo.fork === false && repo.open_issues_count > 0 && repo.archived === false;
    })

    const parsedRepos = filteredRepos.map((repo) => {
        return {
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            issues: repo.open_issues_count,
            stars: repo.stargazers_count,
            lang: repo.language,
        }
    })

    return parsedRepos;
}

const getChildrenFromRepo = async (owner, repo) => {
    try {
        const issues = await getIssues(owner, repo);

        let users = [];
        let userRepo = [];

        issues.forEach((issue) => {
            users.push(issue.user);
        })

        users.forEach((user) => {
            getAllReposfromUser(user).then((repos) => {
                // decide between recursivly adding new repos with issues or setting it to be an active button which adds at random intervals
            })
        })

        return userRepo;
        
    } catch (error) {
        return error;
    }
}

