# Rentify

Rentify is a modern rental marketplace web application where tenants can search and save properties, and landlords can list and manage rental properties. This repository includes a Node.js + Express backend and a React + Vite frontend with Tailwind CSS.

## Project description

Rentify provides an end-to-end flow for property rentals: user authentication, property listings, searching and filtering, favorites, booking/inquiry management, and owner dashboards to manage listings and inquiries. The backend uses MongoDB for persistence and Cloudinary for image uploads.


## Features

- User registration and login (tenant or owner roles)
- JWT-based authentication and protected routes
- Property CRUD for owners (add, edit, delete)
- Property search and filters (city, rent range)
- Favorites (save/unsave properties)
- Booking/inquiry workflow for tenants and inquiry management for owners
- Image upload support (Cloudinary)
- Responsive, modern UI built with Tailwind CSS

## Technology stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Authentication: JSON Web Tokens (JWT)
- File storage: Cloudinary
- HTTP client: Axios

## Installation

Prerequisites:

- Node.js (>=16) and npm or Yarn
- MongoDB connection (cloud or local)
- Cloudinary account (for image uploads) — optional for basic flows

Setup:

1. Clone the repository:

```
git clone <repo-url>
cd RENTIFY
```

2. Backend

- Copy environment example and fill values: [server/.env.example](server/.env.example)
- Install and run the server:

```
cd server
npm install
npm start
```

By default, the backend listens on port `8000` (see `PORT` in `.env`).

3. Frontend

```
cd client
npm install
npm run dev
```

Open http://localhost:5173 (Vite default) and make sure the backend is running at http://localhost:8000/api.

## API

The frontend expects the backend base URL at `http://localhost:8000/api`. See `client/src/services/api.js` for details.

Important server routes:

- `POST /api/user/signup` — register
- `POST /api/user/login` — login (returns JWT token)
- `GET /api/property` — list properties
- `POST /api/property` — create property (owner only)

See the `server/routes` folder for the full list of endpoints.

## Future enhancements

- Add end-to-end tests (Cypress / Playwright) and unit tests (Jest)
- Improve image upload UI with progress and multiple images support
- Add payment integration for bookings or deposits
- Implement advanced search (map, radius, tags) and saved searches
- Add audit logs and admin moderation tools

## Contributing

Contributions are welcome. Please open issues for bugs or feature requests. For code contributions, fork the repo and submit a pull request.

