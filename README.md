# Utibe-Abasi Abia Udoh: Student Portfolio & Academic Management Website

**COS/CSC 106 Introduction to Web Technologies: Practical Term Project**

A responsive, multi-page personal portfolio and academic management website built with
**HTML5, CSS3 and vanilla JavaScript** (no frameworks or libraries).

- **Live site:** https://utyabia.github.io/portfolio/ *(confirm after publishing)*
- **Repository:** https://github.com/utyabia/portfolio *(confirm after publishing)*

## Pages

| Page | File | What it contains |
|------|------|------------------|
| Home | `index.html` | Name and photo, welcome message, typing-effect roles, brief biography, animated stats, **audio introduction** with transcript |
| About Me | `about.html` | Education and curriculum **tables**, career goals, milestone timeline, animated skill bars, hobbies and interests |
| Projects | `projects.html` | Three projects with images, descriptions and links, category filter, **explainer video** with captions |
| Academic Planner | `planner.html` | Add, complete, delete and filter tasks, progress statistics, saved in `localStorage` |
| Contact | `contact.html` | Name, email, phone and message form with JavaScript validation, contact details, embedded map |

## How the brief's requirements are met

**HTML:** semantic elements (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `address`, `footer`),
forms, tables (education, curriculum), images, hyperlinks, lists (ordered, unordered, timeline), and multimedia (`<audio>` and `<video>` with a `<track>` captions file).

**CSS:** one external stylesheet (`css/style.css`), CSS variables for a consistent navy/amber/teal colour scheme,
Flexbox (navigation, buttons, toolbars) and CSS Grid (cards, hero, planner, contact layouts), and media queries at 960px, 768px and 480px
for a mobile-friendly layout with a hamburger menu. It also has transitions, keyframe animations, a dark mode and support for `prefers-reduced-motion`.

**JavaScript:**

| Feature | File | Concepts |
|---------|------|----------|
| Mobile menu, active-page highlight, theme toggle, scroll reveal, back-to-top | `js/main.js` | Event handling, DOM manipulation, `classList`, `IntersectionObserver`, `localStorage` |
| Typing effect, counters, audio player | `js/home.js` | Arrays, `setTimeout`, `requestAnimationFrame`, media events |
| Skill bars | `js/about.js` | `data-` attributes, `IntersectionObserver` |
| Project filter | `js/projects.js` | Event handling, dynamic content updates |
| Task manager | `js/planner.js` | Array of objects, `push`/`filter`/`map`/`sort`, event delegation, `createElement`, JSON and `localStorage` |
| Form validation | `js/contact.js` | Regular expressions, validator functions, `preventDefault`, live feedback |

## Folder structure

```
portfolio/
├── index.html  about.html  projects.html  planner.html  contact.html
├── css/style.css
├── js/main.js  home.js  about.js  projects.js  planner.js  contact.js
└── assets/
    ├── images/   profile photo, project images, video poster
    ├── video/    rag-explainer.mp4, rag-explainer.vtt (captions)
    └── audio/    intro.mp3 (voice introduction)
```

## Running locally

Open `index.html` in a browser, or serve the folder with `python -m http.server` and visit `http://localhost:8000`.

## Notes

- The contact form has no back-end, so sending is simulated: a confirmation is shown after the form passes validation.
- The yield-driver chart on the explainable-AI project is illustrative, not published NRCRI results.
