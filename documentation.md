# Technical Documentation

## Website architecture

- `index.html`: semantic page structure, navigation, dashboard, student table, and form dialog
- `assets/styles.css`: responsive design, visual effects, components, and reduced-motion styling
- `assets/scene.js`: Three.js scene setup, lighting, geometry, particles, resize handling, and pointer response
- `assets/app.js`: demo records, search, CRUD actions, validation, and localStorage persistence

## Browser data model

Each demo record contains an identifier, name, roll number, course, email, and status. A unique roll number is enforced by the client-side demo logic.

## Storage and security

Browser data is local to one browser profile and is not a central database. The demo has no login or access control and is not suitable for real student data.

## Desktop application

`main.py` uses Tkinter for the desktop interface and SQLite for local persistence. It is a separate program and does not communicate with the website.

## Hosting

GitHub Pages serves static files. The website requires no build command. Three.js is imported from jsDelivr using an import map; Google Fonts is loaded from Google Fonts. A CDN outage may prevent those external visual resources from loading.
