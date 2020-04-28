import * as github from '@actions/github'
import * as core from '@actions/core'
import giphy, { SearchOptions } from 'giphy-api'

async function run() {
  const githubToken = core.getInput('github_token', { required: true });

  const octokit = new github.GitHub(githubToken);
  const { pull_request: pr } = github.context.payload;

  if (!pr) {
    throw new Error('Missing Pull Request event data');
  }

  const commentFooter =
    "<sub>Autogenerated by [comment-gif-action](https://github.com/rodrigomaia17/comment-gif-action).</sub>";


  const searchParams: SearchOptions = {
    q: "thumbs-up",
    rating: "g"
  }

  const gifs = await giphy().search(searchParams)
  const gif = gifs.data[0]

  const params = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: pr.number,
    body: `![${gif.title}](${gif.images.original.mp4})\n\n${commentFooter}`
  };

  await octokit.issues.createComment(params);
}

run();
