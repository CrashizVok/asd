# Git cheatsheet

The commands you actually type, in the order you type them. Run `git status` when unsure; it usually tells you the next step.

## Start a repository

```bash
git init                  # create .git in the current folder
git init my-project       # create the folder and the repo
git clone https://example.com/repo.git
git clone repo.git mydir  # clone into another folder name
```

`git init` only creates the hidden `.git` directory. It tracks nothing until you add files.

## Check state

```bash
git status                # changed, staged, untracked
git status -s             # short form
git log --oneline --graph --all
git log -5 --stat
git show HEAD
git diff                  # unstaged changes
git diff --staged         # what goes into the next commit
git diff main..feature    # between two branches
```

`git diff` compares the working tree with the index. `--staged` compares the index with the last commit. Before committing, run `git diff --staged` and read it.

## Stage and commit

```bash
git add file.txt
git add css/              # whole folder
git add .
git add -p                # choose hunks one by one
git commit -m "Add room card layout"
git commit -am "Fix price format"   # tracked files only, no new files
git commit --amend -m "Better message"
```

A commit is a snapshot plus a message. Write the message in the imperative: "Add search filter", not "Added" or "Adding". Keep one idea per commit. `--amend` rewrites the last commit; do not use it on a commit already pushed to a shared branch.

## Branches

```bash
git branch                # local branches, * marks the current one
git branch -a             # include remote branches
git branch feature-search
git switch feature-search # move to it
git switch -c fix-nav     # create and move in one step
git switch main
git branch -d feature-search   # delete when merged
git branch -D old-branch       # force delete
```

`git checkout` still works for branches, but `switch` and `restore` split its two jobs into clear commands. Create a branch per task, so `main` stays working.

## Merge

```bash
git switch main
git merge feature-search      # fast-forward or merge commit
git merge --no-ff feature-search   # always a merge commit
git merge --abort             # cancel a conflicted merge
```

A fast-forward just moves the pointer. A true merge creates a commit with two parents. On conflict, Git marks the files and you edit the `<<<<<<<`, `=======`, `>>>>>>>` blocks by hand, then `git add` the file and commit.

## Rebase in one line

```bash
git switch feature
git rebase main
```

Replays your commits on top of main and gives a straight history. Never rebase a branch other people pull from.

## Remotes

```bash
git remote -v
git remote add origin https://example.com/repo.git
git remote set-url origin git@example.com:repo.git
git remote remove origin
```

`origin` is the default name for the server you cloned from. `upstream` is the usual name for the original repo when you work on a fork.

## Push and pull

```bash
git push -u origin main        # first push, sets the upstream
git push                       # later pushes
git push origin feature-search
git push --force-with-lease    # safer force, after a rebase
git pull                       # fetch plus merge
git pull --rebase              # fetch plus rebase
git fetch origin               # download without touching your branch
```

`--force` overwrites the remote branch and can destroy someone's work. `--force-with-lease` refuses when the remote moved since your last fetch. Prefer fetch plus a look at `git log origin/main` when the pull result is unclear.

## Stash

```bash
git stash                     # park tracked changes
git stash -u                  # include untracked files
git stash list
git stash show -p stash@{0}
git stash pop                 # apply and drop
git stash apply               # apply and keep the entry
git stash drop stash@{0}
git stash clear
```

Stash when you must switch branches with unfinished work. Name it (`git stash push -m "wip nav"`) so the list stays readable.

## Restore and reset

```bash
git restore file.txt          # discard unstaged edits, permanent
git restore --staged file.txt # unstage, keep the edits
git restore .                 # discard all unstaged edits
git reset --soft HEAD~1       # undo last commit, keep changes staged
git reset HEAD~1              # undo last commit, keep changes unstaged
git reset --hard HEAD~1       # undo last commit and delete the changes
git revert <sha>              # new commit that undoes an old one
```

`restore` works on files, `reset` on commits and the index. `--hard` deletes work with no undo. On a pushed branch use `revert` instead of `reset`, because it does not rewrite history.

## .gitignore

```gitignore
node_modules/
dist/
*.log
.env
.DS_Store
.vscode/
```

Patterns are relative to the file's folder. A trailing slash matches folders only. `!keep.log` re-includes a file excluded earlier. Git ignores the rule for files already tracked, so run `git rm --cached file` once. Never commit `.env` or keys.

## Daily workflow

```bash
git switch main
git pull
git switch -c feature/hotel-filter
# edit, run the app
git status
git diff
git add .
git commit -m "Add hotel price filter"
git push -u origin feature/hotel-filter
# open a pull request, get it reviewed, merge
git switch main
git pull
git branch -d feature/hotel-filter
```

## Fixes for common trouble

```bash
git restore .                 # ruined the working tree, no commit yet
git reset --hard origin/main  # local branch diverged and you want the server copy
git clean -fd                 # remove untracked files and folders, check first
git log --oneline --all --graph   # find a lost commit
git reflog                    # every position HEAD has been in
git commit --amend            # forgot a file or typo in the message
git add forgotten.txt && git commit --amend --no-edit
```

`git reflog` is the safety net. A commit removed by `reset` still sits there for weeks.

## Rules that save marks

- Commit often, push at least once a day.
- Pull before you start, not after you finish.
- Never commit `node_modules`, build output, or secrets.
- One branch, one task, one pull request.
- Read `git status` output instead of guessing.
- If a command needs `--hard` or `--force`, pause and read it twice.
