# Panos Kokmotos – Personal Website

This repository contains the source code for my personal website, hosted at **panoskokmotos.com**.
It showcases my background, projects, and interests, and includes an interactive AI assistant that visitors can chat with directly on the site. 
## Tech stack

- **HTML / CSS / JavaScript** for the main single-page site and UI interactions (`index.html`, `style.css`, `script.js`, `chat.js`). 
- **Python** backend agent (`agent.py`) that powers code analysis and helper utilities used during development.
- **GitHub Pages** for static site hosting and the `CNAME` setup for the custom domain `panoskokmotos.com`.   
- **Cloudflare Worker** (`cloudflare-worker.js`) for edge routing/proxying between the front-end chat UI and the AI backend.

## Main features

- **Personal** profile section with a real profile photo (`photo.jpg`), bio, experience, and key milestones.   
- Responsive layout with a modern design that works on desktop and mobile.
- Dark/light mode theming with a redesigned UI and smooth transitions between themes.
- Interactive sections for projects, leadership/activities, and programs, using JavaScript to handle toggles, badges, and animations. 
- Built-in chat assistant that lets visitors ask questions through a chat panel, which is wired up via `chat.js` and the Cloudflare worker.
