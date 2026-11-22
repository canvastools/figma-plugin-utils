---
name: review
description: Steps to review a package against its own rules — the code, the JSDoc, docs/ and .claude. It finds the violations of the rules, the contradictions between the rules, the duplicates and the old facts, and proposes changes. Use it when the user asks for a review of a change, of a set of files or of the whole package.
---

# Review

## Goal

The user has a list of problems for the scope of the review. Each problem names the rule, the place and a proposed change.
The review changes no file. The user selects the changes, and the work starts after that.

## Done when

- Each problem has a type, a place as `file:line`, the rule with its source, and a proposed change.
- Each problem with two or more possible fixes lists each fix. The report does not select one.
- Each rule file and each skill in `.claude` is in the report as read, or in `Not verified`.
- The checks of the package from `Commands` in `.claude/CLAUDE.md` ran, and the report has their results.
- No file of the package changed: `git status` shows the same list as before the review.

## Stop

- Ask the user when a point of the task is not clear. Do not start the work while a question is open.
- Do not select an interpretation for the user.
- Ask the user in these cases:
  - The scope of the review is not clear: a change, a set of files or the whole package.
  - Two rules contradict each other, and the review needs one of them to judge the code.
  - A rule has two possible meanings, and the meaning changes a problem.
  - A problem is outside the package, for example in another package or in a project.
- Ask the user when an instruction of the user breaks a rule of this package. Tell the user the rule.
- Show the plan to the user before you change a file. Start the changes after the user agrees.
- Do not change a file in the review. Write the change as a proposal in the report.
- Do not commit, push or publish. The user does these actions.

## Steps

### Plan

1. Find the scope: the diff of `git diff` and of the new files, a list of files, or the whole package.
   Why: the scope sets which rules apply. A review of a diff also finds a rule that the diff makes false.
2. Read `.claude/CLAUDE.md`, each file in `.claude/rules` and each skill in `.claude/skills`.
   Why: the rules are the scale of the review. A rule that the review does not read cannot give a problem.
3. List the rules that apply to the scope. Use `paths:` of each rule file to find them.
   Why: the list shows the user what the review checks, and what it does not check.
4. Show the plan to the user in the plan format below. Start the next section after the user agrees.
   Why: a review of a wrong scope costs more than a question.

### Review

1. Run the checks of the package from `Commands` in `.claude/CLAUDE.md`. Do not run a command that writes files, for example `npm run format`.
   Why: a script finds a mechanical violation faster and more surely than a read. The review changes no file.
2. Read each file of the scope against each rule of the list. Write a problem for each violation.
   Why: a script checks only a part of the rules. The rest needs a read.
3. Compare the rules with each other: `CLAUDE.md`, the rules, the skills, `docs/` and the JSDoc. Write a problem for each contradiction.
   Why: two rules that disagree make each later change wrong for one of them.
4. Search for a fact that is in two places. Write a problem, and name the place that keeps the fact.
   Why: two copies of a fact drift apart, and a reader cannot see which copy is true.
5. Compare each fact in the text with the code. Write a problem for each fact that the code makes false.
   Why: an old fact misleads a reader more than an absent fact.
6. Find the documentation of a different package or of a project in the scope. Write a problem for it.
   Why: each package documents itself. A copy in another package becomes old without an error.
7. Find a frequent decision in the code that no rule names. Write it as a gap with a proposed rule.
   Why: a decision without a rule changes from one author to the next.
8. Write a proposed change for each problem. Give each possible fix when a problem has more than one.
   Why: the user selects the fix. The report gives the facts for that decision.
9. Run `git status`. Check that the list of changed files is the same as before the review.
   Why: the review proposes changes and does not make them.
10. Write the report in the report format below.
    Why: the user decides which problems to fix and in which order.

## Types of problems

| Type          | Meaning                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| violation     | The code or a text breaks a rule.                                       |
| contradiction | Two rules, or a rule and a text, say different things about one point. |
| duplicate     | One fact is in two places.                                              |
| old fact      | A text says a thing that the code does not do.                          |
| foreign       | A text describes a different package or a project.                     |
| gap           | A frequent decision of the code has no rule.                            |

The severity of a problem:

- `high`: a project gets a wrong result, or a check fails.
- `medium`: a reader gets a wrong rule or a wrong fact.
- `low`: the form of a text or of the code, with no effect on a result.

## Plan format

```md
**Plan: review of <scope>**

- Scope: <diff | files | package> — <list or count of the files>
- Rules to check: <list of the rule files and skills>
- Checks to run: <commands>
- Not in the review: <list, or "nothing">

**Questions**

1. <question, with the possible answers>
```

## Report format

```md
**<N> problems in <scope>: <H> high, <M> medium, <L> low.** | **No problems in <scope>.**

| Check | Result |
| ----- | ------ |

| #   | Type | Severity | Place     | Rule (source)    | Finding | Proposed change                    |
| --- | ---- | -------- | --------- | ---------------- | ------- | ---------------------------------- |
| 1   |      |          | file:line | rule (file:line) |         | <one change>                       |
| 2   |      |          | file:line | rule (file:line) |         | **A:** <change><br>**B:** <change> |

**Rules that the review read**

- <file>

**Not verified**

- <item, or "nothing">
```
