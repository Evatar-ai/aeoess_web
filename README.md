# aeoess_web

Source for [aeoess.com](https://aeoess.com). Static HTML with shared CSS and JS, no build step,
no framework; GitHub Pages deploys from `main` on push (`CNAME` and `.nojekyll` at the root).

Generated inputs: `project-state.json` and `protocol-registry.json` are written by scripts and
read by the pages; `roadmap.yaml` feeds `roadmap.html` through `roadmap.js` (the roadmap of record
lives at [agent-passport.org/roadmap](https://agent-passport.org/roadmap)). Do not hand-edit generated
files.

The protocol itself is [Agent Passport System](https://github.com/aeoess/agent-passport-system).
Versions and counts on the site come from generated data, never from prose in this repository.
