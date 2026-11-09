# Handoff: Soumyadeep Chandra personal website (al-folio)

Context for a Claude Code session continuing work started in a Claude chat on 2026-11-09.

## Goal
Personal academic/job-market website for Soumyadeep Chandra (Ph.D. candidate, ECE, Purdue; NRL, advisor Prof. Kaushik Roy; graduating Spring 2027). Built from the baseline repo https://github.com/amoghj98/amoghj98.github.io (al-folio Jekyll theme) using his resume LaTeX.

## Where the code is
- Delivered to the user as `soumyadeepchandra.github.io.zip` (the full repo, minus the original's .git and readme_preview/). **Unzip it locally and work from there** (`git init`, push to a new GitHub repo named `soumyadeepchandra.github.io`).
- The chat's cloud workspace is not shared with Claude Code, so the zip is the source of truth.
- A preview page (hand-built approximation of the theme) was published as a claude.ai artifact: https://claude.ai/artifact/7xfqMkbAWaBjwbtfvv8EWk

## Status
- Jekyll was NOT built or tested: RubyGems was blocked in the chat workspace. **First task in Claude Code: `bundle install && bundle exec jekyll serve`** (or `docker compose up`) and fix any build errors.
- Things most worth checking during the first build:
  - `_config.yml`: `jekyll_get_json: []`. The JSON Resume source was turned off so the CV renders from `_data/cv.yml`. If the plugin complains about an empty list, comment out the key or the plugin.
  - `_projects/*.md` use `{% bibliography --cited_in_order --query @*[key=...]* %}`. Check they render; delete those lines if not.
  - `_pages/projects.md` (Research page, permalink `/research/`) uses categories containing `&`; anchors use `slugify`.
  - `_includes/news.liquid`: the date format was changed to `'%b %Y'` (month-year only).

## Files customized (everything else is stock al-folio)
- `_config.yml`: name, description, keywords, favicon 🔥, url `https://soumyadeepchandra.github.io`, scholar last_name [Chandra] / first_name [Soumyadeep, S.], jekyll_get_json disabled.
- `_pages/about.md`: bio, subtitle, profile block; selected papers and news on.
- `_pages/projects.md`: new Research page (nav_order 1), 2 categories.
- `_pages/publications.md` and `_pages/cv.md`: text changes; the CV PDF is `assets/pdf/Soumyadeep_Chandra_CV.pdf`.
- `_projects/`: Therm3D, 2D-ThermAl, REMAP, OPEL, ViPeR, Image Grammar, Loss Knows Best.
- `_bibliography/papers.bib`: 9 papers. Selected: Therm3D, 2D-ThermAl, REMAP, OPEL.
- `_news/`: 7 items (OPEL at NeurIPS Dec 2024 → ICML Golden Reviewer Jul 2026).
- `_data/cv.yml`, `_data/socials.yml` (email chand133@purdue.edu, GitHub and LinkedIn soumyadeepchandra), `_data/repositories.yml` (2D-ThermAl, ViPeR).
- `assets/img/prof_pic.jpg`: a placeholder "SC" image.
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
