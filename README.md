# 🛒 Multi-Vendor E-Commerce Application

A full-stack e-commerce platform where multiple vendors can manage products and users can browse, add items to cart, and place orders.

Built using **ASP.NET Core Web API**, **React**, and **MySQL**, with deployment on **Render (Backend)** and **Vercel (Frontend)**.

---

## 🚀 Live Demo

- 🌐 **Frontend (Vercel):**  
  https://multi-vendor-e-commerce-seven.vercel.app  

- 🔗 **Backend API (Render):**  
  https://multivendorecommerce-fw8x.onrender.com

- 📘 **Swagger Docs:**   
  https://multivendorecommerce-fw8x.onrender.com/swagger/index.html  

---

## 🛠️ Tech Stack

### Frontend
- React.js  
- JavaScript (ES6+)  
- CSS  

### Backend
- ASP.NET Core Web API (.NET 8)  
- ADO.NET (No Entity Framework)  

### Database
- MySQL (Railway)  

### Deployment
- Frontend → Vercel  
- Backend → Render  

---

## 🔐 Features

### 👤 Authentication
- User Registration  
- Login with JWT Token  
- Secure API access  

### 🛍️ User Features
- View all products  
- Add products to cart  
- Update quantity / remove items  
- Place order  
- View order history  

### 🧑‍💼 Admin Features
- Admin dashboard  
- View total orders  
- View total sales  

---

## 📦 API Endpoints

### Auth
- `POST /api/auth/register`  
- `POST /api/auth/login`  

### Products
- `GET /api/product/all`  

### Orders
- `POST /api/order/place`  
- `GET /api/order/my-orders`  
- `GET /api/order/dashboard` (Admin)  

---

## 📸 Screenshots

### Login Page  
![Login](https://github.com/user-attachments/assets/f1203eb1-0ec8-4a55-9eda-1fbd3a54f32a)

### Products Page  
<img width="1874" height="930" alt="image" src="https://github.com/user-attachments/assets/262b6f59-8b9d-47c1-98c1-8dad859f691f" />

### Cart Page  
<img width="1902" height="746" alt="image" src="https://github.com/user-attachments/assets/83794faa-ad8e-4562-905f-256715ad8dac" />


### Orders Page  
![Orders](https://github.com/user-attachments/assets/96306f6b-55fd-462b-a448-ed99848eedf9)

### Admin Dashboard  
![Admin](https://github.com/user-attachments/assets/77e9049b-4500-498f-9744-6f2db0034cbb)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/MadhuriKamble21/MultiVendorECommerce.git
cd MultiVendorECommerce
```
---

### 2️⃣ Backend Setup (.NET API)

- Open the solution in Visual Studio  
- Update connection string in appsettings.json  
- Add environment variables (JWT Key, Issuer, Audience)  

Run backend:
```bash
dotnet run
```
---

### 3️⃣ Frontend Setup (React)

cd frontend/multivendor-frontend  
npm install  
npm start  

---

## 🔧 Environment Variables (Backend)
```bash
Jwt__Key=MyJWTKey21339977!  
Jwt__Issuer=MultiVendorApp  
Jwt__Audience=MultiVendorUsers  
```
---

## ⚠️ Known Issues

- Manifest warning (can be ignored)  
- No image upload support yet  

---

## 🚀 Future Improvements

- Product image upload  
- Payment integration (Razorpay/Stripe)  
- Search & filtering  
- UI/UX improvements  
- Vendor-specific dashboards  

---

## 👩‍💻 Author

Madhuri Kamble  
https://github.com/MadhuriKamble21  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
