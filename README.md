# HopeWell Healthcare — Impact Dashboard

A full-stack web application simulating a nonprofit healthcare platform that manages and visualises community health outreach data across Nigerian states.

## Live Demo

**Frontend:** https://onikeyek.github.io/Hopewell-Health/

**Backend API:** https://hopewell-health.onrender.com/api/states

---

## Project Overview

HopeWell Healthcare Impact Dashboard is a multi-page web application built to address the lack of transparent, structured data reporting in nonprofit healthcare organisations. It provides real-time tracking of outreach efforts, donation impact, assistance requests, and success stories — all powered by a live REST API backend.

---

## Pages

| Page | Description |
|------|-------------|
| Home | Hero section, stats, focus areas, testimonials, news |
| Impact Dashboard | Charts, state filter, regional map, volunteer activity |
| Assistance Requests | Filterable cards by status, region, priority |
| Donation Calculator | Live impact calculator with Naira input |
| Success Stories | Editorial layout rendered from REST API |
| Story Detail | Full article page (Water Initiative) |
| Donate | 4-step donation flow with payment form |
| Volunteer Application | 6-step volunteer application portal |
| Request Detail | Clinical case detail with timeline and logistics |

---

## Technologies Used

**Frontend**
- HTML5 (semantic structure)
- CSS3 (Flexbox, Grid, responsive design)
- JavaScript ES6 (async/await, DOM manipulation, Fetch API)
- Chart.js (line charts)
- Leaflet.js (interactive Nigeria map)

**Backend**
- Node.js
- Express.js (REST API)
- JSON (data store — `hopewell.json`)
- CORS middleware

---

## Folder Structure

```
Hopewell-Health/
├── hopewell-backend/        # Node.js + Express API
│   ├── index.js
│   ├── routes/
│   │   ├── states.js
│   │   ├── requests.js
│   │   ├── stories.js
│   │   ├── monthly.js
│   │   └── donations.js
│   ├── data/
│   │   └── hopewell.json
│   └── package.json
├── hopewell-frontend/       # Static frontend (development)
│   ├── index.html
│   ├── dashboard.html
│   ├── requests.html
│   ├── calculator.html
│   ├── stories.html
│   ├── donate.html
│   ├── volunteer.html
│   ├── request-detail.html
│   ├── story-water-initiative.html
│   ├── css/
│   ├── js/
│   ├── images/
│   └── data/
└── docs/                    # GitHub Pages deployment (mirrors frontend)
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/states` | All Nigerian state outreach summaries |
| GET | `/api/requests` | Assistance requests (filterable by status, state, priority) |
| GET | `/api/requests/:id` | Single request detail |
| GET | `/api/stories` | Success stories with metadata |
| GET | `/api/monthly` | Monthly outreach trend data |
| GET | `/api/donations` | Donation-to-impact conversion rates |
| GET | `/data/nigeria-states.geojson` | Nigeria state boundaries for map |

---

## Setup Instructions

### Backend (local development)

```bash
cd hopewell-backend
npm install
npm start
```

Server runs on `http://localhost:3000`

### Frontend (local development)

Open `hopewell-frontend/index.html` directly in your browser, or use a local server:

```bash
npx serve hopewell-frontend
```

The frontend auto-detects the environment — it uses `localhost:3000` when running locally and the live Render URL in production.

---

## Architecture

```
Browser (HTML + CSS + JS)
        ↕ fetch() / async-await
Node.js + Express (REST API)
        ↕ require()
hopewell.json (Data Store)
```

Clear separation of concerns:
- **UI layer** — HTML pages + CSS stylesheets
- **Application logic** — per-page JavaScript files
- **Data handling** — Express routes reading from JSON

---

## AI Tool Usage Summary

This project was developed with the assistance of **Kiro AI** (AI-powered IDE assistant). AI was used for:

- Scaffolding the initial project structure and boilerplate
- Generating and refining HTML/CSS layouts based on design mockups
- Writing JavaScript logic for filtering, pagination, and async data fetching
- Debugging layout and CSS issues
- Implementing the interactive Nigeria map with Leaflet.js
- Building the multi-step volunteer application and donation flows
- Deployment configuration and GitHub Pages setup

All AI-generated code was reviewed, tested, and adapted to fit the specific requirements of the HopeWell project. Design decisions, content, and Nigerian healthcare context were provided by the developer.

---

## Deployment

- **Frontend:** GitHub Pages — served from `/docs` folder on `main` branch
- **Backend:** Render (free tier) — Node.js web service pointing to `hopewell-backend/` subdirectory

© 2026 HopeWell Healthcare Foundation. Year 2 Project.
