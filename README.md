#  OMS - Premium Order Management System

 OMS is a high-performance, enterprise-grade Order Management System built with a focus on scalability, clean architecture, and premium user experience. It features a robust Laravel 11 backend and a sleek React 18 frontend.

## 🚀 Key Features

- **Premium UI/UX**: Designed with a focus on modern aesthetics using **Outfit** and **Plus Jakarta Sans** typography, glassmorphism, and a sophisticated color palette.
- **Enterprise Architecture**: Follows the **Service-Controller Pattern** for a clean separation of concerns.
- **Role-Based Access Control (RBAC)**: Secure access for Admins, Managers, and Customers.
- **Real-time Analytics**: A comprehensive Admin Dashboard with live stats and order status tracking.
- **Inventory Management**: Automated stock reduction on order placement and restoration on cancellation.
- **Optimized Performance**: Database indexing and application-level caching for lightning-fast responses.

## 🛠️ Tech Stack

- **Backend**: Laravel 11 (PHP 8.2+), MySQL
- **Frontend**: React 18, Vite, Tailwind CSS (Custom Design System)
- **Authentication**: Laravel Sanctum (Token-based)
- **Icons**: Lucide React
- **Notifications**: Custom Toast Engineering

## 📂 Project Structure

```text
├── app/
│   ├── Http/Controllers/Api/  # Lean Controllers
│   ├── Http/Requests/Api/     # Dedicated Form Requests for Validation
│   ├── Services/              # Core Business Logic Layer
│   └── Models/                # Eloquent Models
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios Configuration
│   │   ├── context/           # Auth, Cart, and Toast Contexts
│   │   ├── pages/             # Premium Page Components
│   │   └── components/        # Reusable UI Elements
├── database/                  # Migrations and Seeders
└── routes/                    # API and Web Routes
```

## ⚙️ Installation & Setup

### 1. Prerequisites
- PHP 8.2 or higher
- Node.js & npm
- MySQL

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/Raju190394/ecom_laravel_react.git
cd ecom_laravel_react

# Install dependencies
composer install

# Setup environment
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure your database in .env
DB_CONNECTION=mysql
DB_DATABASE=oms_project
# ... rest of your db config

# Run migrations and seed the database
php artisan migrate:fresh --seed
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies sdasd
npm install

# Run the development server
npm run dev
```

### 4. Running the Project
```bash
# In the root directory (Backend)
php artisan serve --port=8002

# In the frontend directory
npm run dev
```

## 🔑 Demo Credentials

- **Admin Account**: `admin@example.com` / `password`
- **Customer Account**: `customer@example.com` / `password`

## 📈 Performance Highlights
- Implemented **Database Indexing** on high-traffic columns.
- Integrated **Laravel Cache** for product listings and dashboard analytics.
- **Stock Integrity**: Used Database Transactions and `lockForUpdate` to prevent race conditions during checkout.

## 📄 License
Internal Development -  Agentic Coding.
