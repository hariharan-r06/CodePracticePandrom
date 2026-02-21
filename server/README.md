# CodePractice Backend

Complete Node.js + Express + TypeScript REST API for the CodePractice platform, integrated with Supabase for authentication, database, and storage.

## 🚀 Features

- **Auth**: JWT-based authentication using Supabase Auth.
- **Admin Control**: Role-based access control for content management.
- **File Uploads**: Screenshot submissions handled via Multer and Supabase Storage.
- **Real-Time**: Server-Sent Events (SSE) for instant notifications.
- **Data Visualization**: Heatmap and leaderboard calculation logic.
- **Scalability**: Clean architecture with separate layers for routes, controllers, and services.

## 🛠️ Setup

### Prerequisites

- Node.js (v18+)
- Supabase account and project

### Installation

1. Navigate to the server directory:
   ```sh
   cd server
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   - Copy `.env` and fill in your Supabase credentials.

4. Database Setup:
   - Run the SQL migrations provided in the `migrations.sql` file (found in this folder) in your Supabase SQL Editor.
   - Create a public storage bucket named `submissions` in your Supabase dashboard.

### Local Development

```sh
npm run dev
```

The API will be available at `http://localhost:5000/api`.

## 📌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/patterns` | Fetch all coding patterns |
| POST | `/api/problems` | Create a new problem (Admin) |
| POST | `/api/submissions` | Submit a problem screenshot |
| GET | `/api/notifications/stream` | SSE Connection for real-time updates |

## 🔔 Notifications

The server triggers SSE events for:
- New problems added (`all`)
- New patterns added (`all`)
- Submission status updates (`student`)
- New submissions received (`admin`)
