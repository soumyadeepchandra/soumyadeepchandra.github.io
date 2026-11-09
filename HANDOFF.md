# Handoff: Soumyadeep Chandra personal website (al-folio)

Context for a Claude Code session continuing work started in a Claude chat on 2026-11-09.

## Goal
Personal academic/job-market website for Soumyadeep Chandra (Ph.D. candidate, ECE, Purdue; NRL, advisor Prof. Kaushik Roy; graduating Spring 2027). Built from the baseline repo https://github.com/amoghj98/amoghj98.github.io (al-folio Jekyll theme) using his resume LaTeX.

## Where the code is
- Delivered to the user as `soumyadeepchandra.github.io.zip` (the full repo, minus the original's .git and readme_preview/). **Unzip it locally and work from there** (`git init`, push to a new GitHub repo named `soumyadeepchandra.github.io`).
- The chat's cloud workspace is not shared with Claude Code, so the zip is the source of truth.
- A preview page (hand-built approximation of the theme) was published as a claude.ai artifact: https://claude.ai/artifact/7xfqMkbAWaBjwbtfvv8EWk

## Status
- 2026-11-09: the site builds on GitHub Actions ("Deploy site" → `gh-pages`) with no errors. The local machine has no Ruby or Docker, so CI is the build loop: push to `main`, then watch `git ls-remote origin refs/heads/gh-pages` for a new commit (the GitHub API is often rate-limited from Purdue's IP).
- Checked in the built HTML: Scholar and ORCID icons, theme color `#28699b`, photo with webp variants, month-year news dates, Research page anchors, 9 publications, and the CV page with its PDF.
- Fixed: project pages showed no papers because `--cited_in_order` lists only cited entries. They now use `{% bibliography --query @*[key=...] %}`.
- Live at https://soumyadeepchandra.github.io since 2026-11-09. Pages source is `gh-pages` / root. A `.nojekyll` file (listed under `include:` in `_config.yml`) stops Pages from re-running Jekyll on the prebuilt site; without it, the "pages-build-deployment" run fails. CLAUDE.md, HANDOFF.md and requirements.txt are excluded from the build so they aren't published.
- Original first-build checklist (all resolved):
  - `_config.yml`: `jekyll_get_json: []`. The JSON Resume source was turned off so the CV renders from `_data/cv.yml`. If the plugin complains about an empty list, comment out the key or the plugin.
  - `_projects/*.md` use `{% bibliography --cited_in_order --query @*[key=...]* %}`. Check they render; delete those lines if not.
  - `_pages/projects.md` (Research page, permalink `/research/`) uses categories containing `&`; anchors use `slugify`.
  - `_includes/news.liquid`: the date format was changed to `'%b %Y'` (month-year only).

## Home page redesign (2026-11-09)
- The home page (`_pages/about.md`, `layout: home`) is a standalone single-page layout whose section flow follows https://vinaykenny.com: nav with scroll-progress bar, hero, stats, about, background timeline, filterable research cards, skills, publication cards, news, contact. Other pages (CV, Publications, Research, project pages) still use al-folio.
- Files: `_layouts/home.liquid`, `_layouts/bib_card.liquid` (jekyll-scholar template for publication cards), `_includes/pub_image.liquid`, `assets/css/home.scss` (no Bootstrap; imports only Font Awesome), `assets/js/home.js`.
- Text such as the hero, stats, skills and research filter labels is in the front matter of `_pages/about.md`. Education, experience and honors come from `_data/cv.yml`. Project cards use `paper`, `venue`, `result` and `tools` from each `_projects/*.md`.
- **Paper images:** put one image per paper at `assets/img/publication_preview/<bibkey>.png` (or .jpg/.webp/.gif). It shows on the publication card and on the matching project card. Papers without an image get a gradient placeholder. Keys: chandra2026therm3d, chandra2025thermal, chandra2025remap, alwis2026loss, chandra2025viper, chowdhury2024opel, chowdhury2024visual, chandra2023axonal, mazumder2022hadamard.
- PurgeCSS runs on the built CSS: any class that home.js adds must appear as a literal string in the JS, or its styles get stripped.

## Files customized (everything else is stock al-folio)
- `_config.yml`: name, description, keywords, favicon 🔥, url `https://soumyadeepchandra.github.io`, scholar last_name [Chandra] / first_name [Soumyadeep, S.], jekyll_get_json disabled.
- `_pages/about.md`: bio, subtitle, profile block; selected papers and news on.
- `_pages/projects.md`: new Research page (nav_order 1), 2 categories.
- `_pages/publications.md` and `_pages/cv.md`: text changes; the CV PDF is `assets/pdf/Soumyadeep_Chandra_CV.pdf`.
- `_projects/`: Therm3D, 2D-ThermAl, REMAP, OPEL, ViPeR, Image Grammar, Loss Knows Best.
- `_bibliography/papers.bib`: 9 papers. Selected: Therm3D, 2D-ThermAl, REMAP, OPEL.
- `_news/`: 7 items (OPEL at NeurIPS Dec 2024 → ICML Golden Reviewer Jul 2026).
- `_data/cv.yml`, `_data/socials.yml` (email chand133@purdue.edu, GitHub and LinkedIn soumyadeepchandra), `_data/repositories.yml` (2D-ThermAl, ViPeR).
- `assets/img/prof_pic.jpg`: the user's real photo (replaced the placeholder).
- Removed: previous owner's news, papers, PDFs, photos, preview images, the example `_posts/` and `_projects/`, and `assets/json/resume.json`.

## Open items for the user
- [x] Replace `assets/img/prof_pic.jpg` with a real photo. (Done by user.)
- [x] Verify the guessed news dates: QIF finalist (Apr 2026), ICML Golden Reviewer (Jul 2026), 2D-ThermAl TCAD (Dec 2025). (Confirmed correct by user.)
- [x] Confirm 2D-ThermAl is published in TCAD. (Confirmed by user: IEEE TCAD, 2025; added `publisher={IEEE}` to the bib.)
- [x] The ViPeR bib uses the full 9-author list from IEEE; the resume shows 5. (User: keep the 9-author list.)
- [x] Add a Google Scholar ID and ORCID in `_data/socials.yml`. (Scholar `xaRULDcAAAAJ`, ORCID `0009-0002-0182-3618`.)
- [ ] (User will do this.) Replace the CV PDF. It was compiled with a stand-in for the `fontawesome` package, so the header icons are letters. It also includes the phone number.
- [x] Change the theme color in `_sass/_variables.scss` (`$purple-color`) to the resume blue `#28699b`. (Done; light theme only. Dark theme still uses al-folio's default.)

## Deploy
1. Push to `main` of `soumyadeepchandra/soumyadeepchandra.github.io`.
2. Settings → Actions → General → Workflow permissions: Read and write.
3. After the "Deploy site" workflow runs: Settings → Pages → Source: branch `gh-pages`.

## Verified links used in the bib
- 2D-ThermAl: arXiv 2512.01163; code github.com/soumyadeepchandra/2D-ThermAl
- REMAP: arXiv 2509.24382. Loss Knows Best: arXiv 2602.15154
- OPEL: neurips.cc/virtual/2024/poster/93812; DOI 10.52202/079017-1915
- ViPeR: ieeexplore.ieee.org/document/11078244; code github.com/soumyadeepchandra/ViPeR
- Visual Syntax: DOI 10.1109/ACCESS.2024.3397061; arXiv 2401.17497
- Axonal transport: DOI 10.3389/fncel.2023.1215945
