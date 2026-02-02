
---

## 🔐 Authentication & Authorization

### Roles
- CUSTOMER  
- SELLER  
- ADMIN  

### Auth Features
- User registration & login
- JWT-based authentication
- Role-based route protection
- Password hashing (bcrypt)
- Account status control (active / banned)

---

## 🗄️ Database Schema

### Users
| Field | Type | Description |
|------|------|-------------|
| id | UUID/ObjectId | Primary key |
| name | String | Full name |
| email | String | Unique |
| password | String | Hashed |
| role | Enum | customer / seller / admin |
| status | Enum | active / banned |
| createdAt | Date | Timestamp |

---

### Categories
| Field | Type | Description |
|------|------|-------------|
| id | UUID/ObjectId | Primary key |
| name | String | Category name |
| description | String | Optional |
| createdAt | Date | Timestamp |

---

### Medicines
| Field | Type | Description |
|------|------|-------------|
| id | UUID/ObjectId | Primary key |
| name | String | Medicine name |
| description | String | Details |
| price | Number | Price |
| stock | Number | Available quantity |
| categoryId | FK | Category reference |
| sellerId | FK | Seller reference |
| manufacturer | String | Manufacturer |
| createdAt | Date | Timestamp |

---

### Orders
| Field | Type | Description |
|------|------|-------------|
| id | UUID/ObjectId | Primary key |
| customerId | FK | Customer reference |
| totalPrice | Number | Total amount |
| status | Enum | placed / processing / shipped / delivered / cancelled |
| shippingAddress | String | Delivery address |
| createdAt | Date | Timestamp |

---

### OrderItems
| Field | Type | Description |
|------|------|-------------|
| id | UUID/ObjectId | Primary key |
| orderId | FK | Order reference |
| medicineId | FK | Medicine reference |
| quantity | Number | Quantity |
| price | Number | Unit price |

---

### Reviews
| Field | Type | Description |
|------|------|-------------|
| id | UUID/ObjectId | Primary key |
| customerId | FK | Customer reference |
| medicineId | FK | Medicine reference |
| rating | Number | 1–5 |
| comment | String | Review text |
| createdAt | Date | Timestamp |

---

## 🌐 API Endpoints

### 🔑 Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Authenticated |

---

### 💊 Medicines (Public)
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/medicines | Public |
| GET | /api/medicines/:id | Public |
| GET | /api/categories | Public |

---

### 🛒 Orders (Customer)
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/orders | Customer |
| GET | /api/orders | Customer |
| GET | /api/orders/:id | Customer |

---

### 🏪 Seller
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/seller/medicines | Seller |
| PUT | /api/seller/medicines/:id | Seller |
| DELETE | /api/seller/medicines/:id | Seller |
| GET | /api/seller/orders | Seller |
| PATCH | /api/seller/orders/:id | Seller |

---

### 👑 Admin
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/admin/users | Admin |
| PATCH | /api/admin/users/:id | Admin |
| GET | /api/admin/orders | Admin |
| POST | /api/admin/categories | Admin |

---

## 🔄 Order Status Flow

PLACED → PROCESSING → SHIPPED → DELIVERED
↓
CANCELLED


---

## ⚙️ Environment Variables
PORT=5000
DB_URI=your_database_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development


---

## 🚀 Setup Instructions

```bash
git clone <backend-repo-url>
cd backend
npm install


Create .env file:

cp .env.example .env


Run server:

npm run dev

👑 Admin Seeding

Admins must be pre-seeded in the database manually or via seed script.

Example fields:

role: "admin"

status: "active"

📄 License

This project is for educational purposes.

MediStore Backend – Secure, scalable, production-ready API


---

If you want, I can also give you:
✅ `.env.example`  
✅ `package.json` template  
✅ folder structure with dummy files  
✅ API Swagger YAML  
✅ DB seed scripts  
✅ Postman collection  
✅ Auth middleware code  
✅ RBAC middleware  
✅ Order status machine logic  

Tell me what layer you’re building next — backend architecture, auth, DB, or APIs.
