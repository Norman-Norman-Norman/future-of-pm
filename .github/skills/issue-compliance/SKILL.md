---
name: issue-compliance
description: 'Enforce that every commit is linked to a GitHub issue. Detects related issues, creates one if none exists, and blocks non-compliant commits. Use when committing, checking commit compliance, enforcing issue traceability, or validating commit-issue linkage.'
---

# Issue Compliance — Every Commit Must Have an Issue

This skill enforces a strict policy: **no commit may be pushed without a linked GitHub issue**. It detects related issues from branch names, changed files, and recent history. If no issue exists, it creates one automatically. If the user declines issue creation, the commit is blocked and the user is informed of the compliance requirement.

This skill is designed to run **before** the commit is finalized. It can be invoked standalone or composed with the `commit-and-push` skill (insert between staging and committing).

---

## Prerequisites

1. **Git is initialized** with at least one remote configured.
2. **GitHub MCP Server tools are available.** The procedure needs `mcp_github` or `mcp_github2` prefixed tools for issue search and creation.
3. **Repository identity is known.** Owner and repo name must be resolvable from the git remote or provided by the user. Default upstream: `Norman-Norman-Norman/future-of-pm`.

---

## Procedure

### Step 1: Identify the Repository

**Tool:** `run_in_terminal`

Determine the GitHub owner and repo from the git remote.

**Action:**
```
run_in_terminal with:
  command: "git remote get-url upstream 2>$null || git remote get-url origin"
  explanation: "Getting the remote URL to identify the GitHub repository."
  goal: "Identify repo owner and name"
  isBackground: false
  timeout: 5000
```

**Decision logic:**
- Parse the remote URL to extract `<owner>` and `<repo>`.
- If no remote is found, ask the user for the owner/repo and stop if not provided.
- Record `OWNER` and `REPO` for use in subsequent steps.

---

### Step 2: Gather Change Context

Collect signals that may reference existing GitHub issues.

#### 2a. Get the current branch name

**Tool:** `run_in_terminal`

```
run_in_terminal with:
  command: "git branch --show-current"
  explanation: "Getting current branch name to check for issue references."
  goal: "Identify branch"
  isBackground: false
  timeout: 5000
```

Look for issue number patterns: `feature/123-description`, `fix/456`, `issue-789`, `gh-42`.

#### 2b. Get the list of changed files

**Tool:** `get_changed_files` or `run_in_terminal`

```
run_in_terminal with:
  command: "git diff --name-only HEAD"
  explanation: "Listing changed files to search for issue references."
  goal: "Get changed files"
  isBackground: false
  timeout: 5000
```

If no HEAD exists yet (initial commit), use `git diff --cached --name-only`.

#### 2c. Search changed files for issue references

**Tool:** `grep_search`

```
grep_search with:
  query: "#[0-9]+"
  isRegexp: true
  includePattern: "<changed files from 2b>"
```

Extract any `#123`, `GH-456`, `Closes #789`, `Refs #42` patterns.

#### 2d. Check recent commit messages

**Tool:** `run_in_terminal`

```
run_in_terminal with:
  command: "git log --oneline -10"
  explanation: "Checking recent commits for issue references."
  goal: "Find related issues in history"
  isBackground: false
  timeout: 5000
```

**Record:** Collect all unique issue numbers found across 2a–2d into `CANDIDATE_ISSUES`.

---

### Step 3: Verify Candidate Issues on GitHub

**Tool:** `mcp_github_search_issues` or `mcp_github2_search_issues`

For each issue number in `CANDIDATE_ISSUES`, verify it exists and is open on the target repository.

**Action:**
```
For each candidate issue number N:
  Call search_issues with:
    query: "repo:<OWNER>/<REPO> is:issue <N>"
    perPage: 5
```

**Decision logic:**
- If at least one verified open issue is found, record it as `LINKED_ISSUE` and proceed to **Step 6** (compliance confirmed).
- If candidate issues exist but are all closed, inform the user and ask: "Issue #N is closed. Should I reference the closed issue, reopen it, or create a new one?"
- If no candidates were found at all, proceed to **Step 4**.

---

### Step 4: Search for Related Issues by Content

**Tool:** `mcp_github_search_issues` or `mcp_github2_search_issues`

If no issue number was detected, search by keywords derived from the changes.

**Action:**
1. Summarize the changes into 3–5 keywords based on the changed files, branch name, and diff content.
2. Search GitHub:
```
Call search_issues with:
  query: "repo:<OWNER>/<REPO> is:issue is:open <keywords>"
  perPage: 10
```

**Decision logic:**
- If a matching open issue is found that clearly relates to the current changes, present it to the user: "I found issue #N: '<title>'. Should I link your commit to this issue?"
  - If the user confirms, record it as `LINKED_ISSUE` and proceed to **Step 6**.
  - If the user declines, proceed to **Step 5**.
- If no matching issues are found, proceed to **Step 5**.

---

### Step 5: Create a New Issue

**⚠️ COMPLIANCE GATE — No issue exists for this commit. The user must either create one or acknowledge non-compliance.**

Inform the user:

> **⚠️ Issue Compliance Check Failed**
>
> No GitHub issue is linked to this commit. Repository policy requires every commit to reference an issue for traceability.
>
> I can create an issue automatically based on your changes. Shall I proceed?

**If the user agrees (or does not object):**

#### 5a. Compose the Issue

Build an issue from the change context gathered in Step 2:

- **Title:** Derive from the branch name or a summary of the changes. Use a category prefix: `[Feature]`, `[Bug]`, `[Chore]`, `[Docs]`, `[Refactor]`.
- **Body:** Use the Task/Chore template:

```markdown
## Summary
<1–2 sentences describing the work being committed.>

## Details
<What was changed and why, based on the diff and changed files.>

## Checklist
- [x] Implementation complete
- [ ] Tests verified
- [ ] Documentation updated (if applicable)

## Notes
This issue was auto-created by the issue-compliance skill to maintain commit traceability.
```

- **Labels:** Use `compliance` if it exists; otherwise omit.

#### 5b. Check for Duplicates

**Tool:** `mcp_github_search_issues` or `mcp_github2_search_issues`

```
Call search_issues with:
  query: "repo:<OWNER>/<REPO> is:issue <title keywords>"
  perPage: 5
```

If a duplicate exists, link to it instead of creating a new one.

#### 5c. Create the Issue

**Tool:** `mcp_github_issue_write` or `mcp_github2_issue_write`

```
Call issue_write with:
  method: "create"
  owner: "<OWNER>"
  repo: "<REPO>"
  title: "<composed title>"
  body: "<composed body>"
```

Record the returned issue number as `LINKED_ISSUE`.

**If the user declines issue creation:**

Report non-compliance and block:

> **❌ Commit Blocked — Non-Compliant**
>
> Repository policy requires every commit to reference a GitHub issue.
> No issue was found and you declined to create one.
>
> To proceed, either:
> 1. Create an issue manually and re-run the commit.
> 2. Provide an existing issue number to link to.
> 3. Re-run this check and allow automatic issue creation.

**STOP. Do not proceed to Step 6. Do not allow the commit.**

---

### Step 6: Report Compliance and Return Issue Reference

The commit has a linked issue. Report the compliance status to the user and return the issue reference for use in the commit message footer.

**Output to user:**

> **✅ Issue Compliance — Passed**
>
> Commit is linked to issue **#<LINKED_ISSUE>**: *<issue title>*
>
> The following footer should be included in the commit message:
> ```
> Refs #<LINKED_ISSUE>
> ```
> *(Use `Closes #<LINKED_ISSUE>` if this commit fully resolves the issue.)*

**Return values** (for composability with other skills):

| Variable | Value | Description |
|---|---|---|
| `LINKED_ISSUE` | `<number>` | The GitHub issue number |
| `ISSUE_TITLE` | `<string>` | The issue title |
| `COMMIT_FOOTER` | `Refs #<number>` | Ready-to-use commit footer line |
| `COMPLIANCE_STATUS` | `PASSED` or `BLOCKED` | Whether the commit may proceed |

---

## Integration with commit-and-push

This skill is designed to compose with the existing `commit-and-push` skill. Insert it **between Step 4 (Stage Changes) and Step 5 (Identify Related Issues)** of commit-and-push:

1. After staging, call **issue-compliance** Steps 1–6.
2. If `COMPLIANCE_STATUS = PASSED`, use the returned `COMMIT_FOOTER` in the commit message footer.
3. If `COMPLIANCE_STATUS = BLOCKED`, abort the commit (same as a test failure).

The commit-and-push skill's own Step 5 (Identify Related Issues) becomes redundant when issue-compliance is active — issue-compliance is the authoritative source for issue linkage.

---

## Edge Cases

| Scenario | Behavior |
|---|---|
| Multiple issues found | Present all candidates; let the user choose which to link. |
| Branch is `main` or `master` | Still enforce compliance — direct commits to default branch especially need traceability. |
| Merge commits | Skip compliance check for merge commits (detected via `git log -1 --format=%P` having two parents). |
| Amend commits | Re-run compliance on the amended content. The original issue link carries forward. |
| No internet / GitHub API failure | Warn the user that compliance could not be verified. Do NOT silently allow the commit. Ask the user to provide an issue number manually. |
| User provides issue number directly | Accept it, verify it exists (Step 3), and skip to Step 6. |
