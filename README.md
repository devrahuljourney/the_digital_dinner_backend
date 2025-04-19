# 🍽️ The Digital Diner - Backend

A full-stack food ordering platform built with MERN and PostgreSQL. This repository contains the backend APIs for managing categories, products, and orders. The system is designed to support a seamless ordering experience with efficient data models and organized API endpoints.

---

## 🚀 Getting Started - Local Setup

Follow the instructions below to run the backend locally.

### 1. Clone the Repository

```bash
git clone https://github.com/devrahuljourney/the_digital_dinner_backend
cd the_digital_dinner_backend

2. Install Dependencies
 
    npm install
3. Setup Environment Variables
Create a .env file in the root directory and add the following variables:

PORT=5000

# MongoDB (used for categories and products)
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/the-digital-diner

# PostgreSQL (used for user & orders)
POSTGRESQL_URL=postgresql://<username>:<password>@<host>/<database-name>

# Cloudinary (for product images)
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret

# CORS origin settings
ORIGIN_URL=http://localhost:3000
ORIGIN_URL1=https://guileless-capybara-c016f3.netlify.app


4. Start the Server
  npm run dev

Feature | MongoDB | PostgreSQL
Categories & Products | ✅ Chosen — Flexible schema for fast iteration, nested data, and optional fields | ❌ Not ideal for dynamic content like optional tags/images
Orders & Users | ❌ Not used — requires joins and relational data | ✅ Chosen — Better for ACID compliance and order-user relationships

📦 API Endpoints
Base URL: https://the-digital-dinner-frontend-nngp.vercel.app/api/v1



### Category Routes
Method | Endpoint | Description
POST | /category/addcategory | Add a new category
POST | /category/editcategory/:id | Edit a category
GET | /category/getallcategory | Fetch all categories

### Product Routes 

Method | Endpoint | Description
POST | /product/createproduct | Add a new product
GET | /product/get-product/:categoryId | Get products by category
GET | /product/get-product-by-id/:productId | Get single product by ID


#Order Route 

Method | Endpoint | Description
POST | /order/createorder | Create a new order
GET | /order/getorder/:phone | Get orders by user's phone number

