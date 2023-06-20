import { Octokit } from "@octokit/rest";

const token = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
    auth: token,
});

const getIssues = async (owner, repo) => {
    const issues = await octokit.issues.listForRepo({
        owner: owner,
        repo: repo,
    });

    var gfiPattern = /good\sfirst\sissue/i

    // filtered issues must have a label of good first issue

    const filteredIssues = issues.data.filter((issue) => {
        return issue.labels.some((label) => {
            return gfiPattern.test(label.name);
        })
    })

    const parsedIssues = filteredIssues.map((issue) => {
        return {
            title: issue.title,
            url: issue.html_url,
            body: issue.body,
            // parse label to only show name
            label: issue.labels.map((label) => {
                return label.name;
            }),
            user: issue.user.login
        }
    })

    return parsedIssues


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


getIssues("j-doka", "reacton").then((issues) => {
    console.log(issues);
})