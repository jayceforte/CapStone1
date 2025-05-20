This Capstone project is a review site meant for conusmer to come and view reviews on A restaurant they plan on visiting! 

#  Restaurant Review App

A full-stack restaurant review platform where users can sign up, log in, and post reviews for different restaurants. Built with:

-  Node.js + Express
-  PostgreSQL
-  React (Vite)
-  REST API
-  Authenticated sessions (express-session)

---

##  Features

- User authentication (sign up, login, logout)
- View list of restaurants with average ratings
- View details and reviews for each restaurant
- Submit a review (requires login)
- Delete your own review
- Search restaurants by name, cuisine, or location
- Responsive styling with clean UI

---

##  File Structure
capstone1/
├── backend/
│ ├── server.js # Express app and API routes
│ ├── start.js # Starts the server
│ └── .env # Environment variables
│
├── client/ # React frontend (Vite)
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Home.jsx
│ │ │ ├── RestaurantDetail.jsx
│ │ │ ├── SubmitReview.jsx
│ │ │ ├── Login.jsx
│ │ │ └── Signup.jsx
│ │ ├── App.jsx
│ │ └── api.js
│ └── public/


---

## Running the project on your own

  Musts before running locally

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

##  Setting up

## 1. Clone the Repository


git clone https://github.com/jayceforte/CapStone1.git
cd CapStone1

2. Setup the DB/Make a DB on postgres
   make a .env file in your backend
   DATABASE_URL=postgresql://your_user:your_password@localhost:5432/restaurant_reviews
SESSION_SECRET=your_secret_here
Use pgadmin to make this schema CREATE TABLE users (...);
CREATE TABLE restaurants (...);
CREATE TABLE reviews (...);

 3. Install the dependencies
    frontend -- cd Client-- npm install
    backend -- cd backend --npm install

4. Start the App
   backend -- node server.js in the terminal so the backend is running
   frontend -- npm run dev to make sure front is up and running
click the link http://localhost:5173 to check the site out
