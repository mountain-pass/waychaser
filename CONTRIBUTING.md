# Contributing

waychaser is released under the non-restrictive Apache 2.0 licenses and follows a very standard Github development process, using Github tracker for issues and merging pull requests into master. Contributions of all form to this repository is acceptable, as long as it follows the prescribed community guidelines enumerated below.

## ToC

- [Contributing](#contributing)
  - [ToC](#toc)
  - [Reporting issue](#reporting-issue)
  - [Development](#development)
    - [Folder Structure](#folder-structure)
    - [Testing](#testing)
    - [🚫💩](#)
    - [ESLint](#eslint)
    - [VSCode + ESLint + Prettier](#vscode--eslint--prettier)
      - [Installation guide](#installation-guide)
    - [Contribution flow](#contribution-flow)
  - [Contributor agreement](#contributor-agreement)

## Reporting issue

Please report issues or request features in the [waychaser issues register](https://github.com/mountain-pass/waychaser/issues).

## Development

### Folder Structure

All the source code is inside the `src` directory. All the test source code is in `src/test` directory

### Testing

This software uses cucumber with different clients for interacting with the API, either directly or via Web Driver (for making sure the library works in the browser), `node-api` and `browser-api`.

Each interface has the same behaviour as described by the [cucumber scenarios](./src/test). Different test clients are used to interact with each interface.

The tests for these clients can be run using the `test:node-api` and `test:browser-api` npm scripts respectively.

To run all the tests, run `npm run test`

While developing, the `watch:test:*` npm scripts act as their `test:*` counterparts, but will automatically re-execute each time you change a relevant file.

The normal development cycle against a new backend API is:

1. Add scenario to feature file
2. run `npm run watch:test:node-api`
3. write code until the scenario passes
4. commit
5. run `npm run watch:test:browser-api`
6. write code until the scenario passes
7. commit
8. run `npm run test` to make you didn't break anything else along the way
9. run `npm run cover` and remove dead code
10. commit and push

### 🚫💩

If committing fails, check your commit logs.

There is a pre-commit hook, that:

- lint's the code,
- runs the `test:node-api` npm script

Please don't force commit. Fix your 💩 and then try again. If you need help, ask.

If you force commit 💩 then you could get...

![the old fork in the eye](./docs/images/fork_in_the_eye.gif)


### ESLint

[ESLint](https://eslint.org/) is a pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.

[.eslintrc.json file](<(https://eslint.org/docs/user-guide/configuring)>) (alternatively configurations can we written in Javascript or YAML as well) is used describe the configurations required for ESLint.

### VSCode + ESLint + Prettier

[VSCode](https://code.visualstudio.com/) is a lightweight but powerful source code editor. [ESLint](https://eslint.org/) takes care of the code-quality. [Prettier](https://prettier.io/) takes care of all the formatting.

#### Installation guide

1.  Install [VSCode](https://code.visualstudio.com/)
2.  Install [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
3.  Install [StandardJS extension](https://marketplace.visualstudio.com/items?itemName=chenxsan.vscode-standardjs)
4.  Install [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
5.  Install [Cover extension](https://marketplace.visualstudio.com/items?itemName=hindlemail.cover)
6.  Install [Commit Message Editor](https://marketplace.visualstudio.com/items?itemName=adam-bender.commit-message-editor)
7.  Install [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

### Contribution flow

A rough outline of an ideal contributors' workflow is as follows:

- Fork the current repository
- Create a topic branch from where to base the contribution. Mostly, it's the main branch.
- Make commits of logical units.
- Push changes in a topic branch to your forked repository.
- Before sending out the pull request, please sync your forked repository with the remote repository to ensure that your PR is elegant, concise. Reference the guide below:

```
git remote add upstream git@github.com:mountain-pass/waychaser.git
git fetch upstream
git rebase upstream/master
git checkout -b your_awesome_patch
... add some work
git push origin your_awesome_patch
```

- Submit a pull request to mountain-pass/waychaser and wait for the reply.

Thanks for contributing!

## Contributor agreement

By submitting changes to this repository, you are accepting:

1. To adhere to our [code of conduct](./CODE_OF_CONDUCT.md), and
2. You are transferring copyright of your change to the waychaser project.

You will get an author credit if we are able to accept your contribution. Active contributors may get invited to join the core team that will grant them privileges to merge existing PRs.
