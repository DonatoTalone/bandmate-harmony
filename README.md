
# Bandmate Harmony

A web application for finding musical collaborators and opportunities in your area.

## Project Overview

Bandmate Harmony helps musicians connect with each other for events, bands, and musical collaborations. Users can create profiles showcasing their musical skills, search for events needing musicians, and organize their own musical events.

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express (to be deployed)
- **Database**: PostgreSQL
- **Hosting**: Coolify (VPS deployment)
- **UI Components**: shadcn/ui

## Development Setup

### Prerequisites

- Node.js & npm
- PostgreSQL database
- Backend API server (separate repository)

### Frontend Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd bandmate-harmony

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL and other configuration

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
```

## Backend Requirements

This frontend requires a Node.js backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Profiles
- `GET /api/profiles/:id` - Get user profile
- `PUT /api/profiles/:id` - Update user profile

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get specific event

### File Upload
- `POST /api/upload` - Upload file
- `DELETE /api/upload/delete` - Delete file

## Database Schema

The PostgreSQL database should include these main tables:

- `users` - User authentication and basic info
- `profiles` - User profiles with musical information
- `events` - Musical events and opportunities
- `event_applications` - Applications to events
- `reviews` - User reviews and ratings

## Deployment with Coolify

1. Set up your VPS with Coolify installed
2. Create a new project in Coolify
3. Connect your Git repository
4. Configure environment variables
5. Set up PostgreSQL database
6. Deploy both frontend and backend services

## Features

- **User Authentication**: Secure login and registration
- **Profile Management**: Detailed musician profiles with instruments, experience, and location
- **Event Discovery**: Search and filter musical events by location, instrument, and type
- **Event Creation**: Organize your own musical events and find participants
- **Responsive Design**: Works on desktop and mobile devices

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
