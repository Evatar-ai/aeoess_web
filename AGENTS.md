# AGENTS.md

This repository is the source of a static website. There is no protocol logic here.

- Edit HTML, CSS and JS directly; there is no build step. Pushing to `main` deploys.
- Do not hand-edit generated files (`project-state.json`, `protocol-registry.json`, anything under
  `roadmap-data/`); regenerate them with the script that owns them.
- Do not write versions, counts or test totals into page text; the pages read them from generated data.
- Do not add tracking, third-party scripts or external requests without the maintainer's approval.
- Keep the two root `*.txt` key files; search engines use them for site verification.
- Protocol changes belong in [agent-passport-system](https://github.com/aeoess/agent-passport-system),
  not here.
