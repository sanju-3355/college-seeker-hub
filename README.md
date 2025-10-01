# College Dashboard with Filters and Enhanced Features
You are required to **design and develop a Full-Stack College Dashboard application** that displays a list of colleges and allows users to **filter, search, add favorites, and manage reviews**. The application should include both **frontend (UI)** and **backend (API + persistence)** with a clean, responsive design and real-time interactions.

> Demo Link : https://college-dashboard.lovable.app/
## **Detailed Requirements**

### **1. Navigation Bar**

- Display a **logo** on the top-left.
- Display navigation items on the top-right:
    - **Home**
    - **Colleges**
    - **Reviews**
    - **Favorites**
    - **Logout**
- Each item should redirect to the respective page.

### **2. Pages**

- **Home Page**
    - Show a welcome message with short app description.
    - Add a **“Get Started” button** that redirects to the Colleges page.
- **Colleges Page (Main Dashboard)**
    - Fetch list of colleges from backend API and display in **card/grid format**.
    - Each college card should include:
        - College Name
        - Location
        - Course Offered
        - Fee
        - ⭐ **Add to Favorites button**
- **Reviews Page**
    - Allow users to **add reviews** via form (college name, rating, comment).
    - Reviews should be stored in backend (DB) and fetched/displayed dynamically.
- **Favorites Page**
    - Show only colleges marked as favorites by the user.
    - Option to **remove from favorites** (update backend).
- **Logout Page**
    - Show placeholder text: *“You have been logged out”*

### **3. Filters & Search**

- **Location Filter:** Dropdown (e.g., Hyderabad, Bangalore, Chennai).
- **Course Filter:** Dropdown (e.g., CSE, ECE, MBA).
- **Fee Range Filter:** Slider or min–max input.
- **Search Box:** Search dynamically by College Name.
- **Sorting Options:** Sort by Fee (Low → High, High → Low).
- **Filter Combination:** All filters should work **together**.

### **4. UI & Features**

- ✅ **Responsive Design:** Should look good on desktop and mobile.
- ✅ **Dark Mode Toggle:** Switch between light/dark mode.
- ✅ **Error Handling:** Friendly message if no colleges match filters/search.
- ✅ **Persistence (Backend DB):** Store favorites and reviews in database (not just local storage).
- ✅ **Bonus (Optional):** Deploy both frontend and backend.


### **5. Backend Requirements**

- Build a **Node.js + Express.js backend**.
- Expose REST API endpoints for:
    - `GET /colleges` → Fetch all colleges (with optional query params for filters/search).
    - `POST /reviews` → Add a new review.
    - `GET /reviews` → Fetch all reviews.
    - `POST /favorites` → Add a college to favorites.
    - `GET /favorites` → Fetch user’s favorites.
    - `DELETE /favorites/:id` → Remove from favorites.
- Use a **database** (MongoDB/MySQL/Postgres/SQLite) to store colleges, reviews, and favorites.
- Provide **sample seed data** in DB.
