import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.GITHUB_TOKEN;

// /user/repos

const octokit = new Octokit({
    auth: token,
});

