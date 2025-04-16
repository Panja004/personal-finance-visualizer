# Personal Finance Visualizer 💸

A modern and minimal web app to help you track income, expenses, and budgets, and visualize your financial data. Built with **Next.js**, **MongoDB**, and **styled-components**, it offers an intuitive interface to manage personal finances with real-time insights.

---

## ✨ Features

- 📥 Add income and expense transactions
- 📊 Visual representation of data using charts
- 📅 Monthly budget tracking by category
- 🔍 Search and filter transactions
- 📁 Category-wise insights
- 🧮 Budget vs Actual comparison
- ☁️ Persistent storage with MongoDB
- 📱 Fully responsive UI

---

## 🛠 Tech Stack

- **Frontend:** Next.js, React, TailwindCSS
- **Charts:** Recharts
- **Backend:** MongoDB, Mongoose
- **Deployment:** Vercel (Frontend), MongoDB Atlas (Database)

---

## 🚀 Installation

### 🔧 Prerequisites

Ensure the following are installed on your machine:

- Node.js (v14 or later)
- MongoDB or MongoDB Atlas
- Git

---

### ⚙️ Steps to Run the Project

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/personal-finance-visualizer.git
cd personal-finance-visualizer
```

````

2. **Install Dependencies**

```bash
npm install
```

3. **Setup Environment Variables**

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
```

4. **Run the App**

```bash
npm run dev
```

5. **Visit in Browser**

```
http://localhost:3000
```

---

---

## 🌐 API Routes

### `/api/transactions`

- `GET` - Fetch all transactions
- `POST` - Create a new transaction

### `/api/transactions/:id`

- `PUT` - Update a transaction
- `DELETE` - Delete a transaction

---

## 🧪 Environment Variables

Create a `.env` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
```

---

## 📦 Deployment

To deploy on **Vercel**:

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variable `MONGODB_URI`
4. Click Deploy ✅

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feature/NewFeature`
3. Commit changes: `git commit -m "Add new feature"`
4. Push branch: `git push origin feature/NewFeature`
5. Open Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 🧑‍💻 Author

**Anish Panja**
📧 [anishpanj026@gmail.com](mailto:anishpanj026@gmail.com)

---

If you found this useful, please ⭐ the repo on GitHub!

---

```

```
````
