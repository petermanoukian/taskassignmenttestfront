# **Task Management Frontend**

This project is the frontend client for a comprehensive task management system. It's a single-page application (SPA) that communicates with a Laravel API backend to provide user authentication, task management, and real-time updates.

## **🚀 Technologies**

* **Framework**: Vue.js  
* **Language**: TypeScript  
* **Styling**: Tailwind CSS  
* **Build Tool**: Vite  
* **State Management**: Pinia  
* **Real-time Communication**: Laravel Reverb Client (for WebSockets)

## **✨ Features**

The application provides a clean and intuitive user interface to interact with the task management backend. Key features include:

* **Secure Login**: Users can securely log in to access their personalized dashboard.  
* **Real-time Task Updates**: As tasks are assigned or updated by an admin, users receive live notifications without needing to refresh the page.  
* **User & Task Management**: An administrative panel allows for managing user accounts and assigning/updating tasks.  
* **Responsive Design**: The application is fully responsive and designed to work seamlessly on both desktop and mobile devices.

## **📦 Local Setup and Installation**

Follow these steps to get the project running locally.

### **Prerequisites**

* Node.js (version 16 or higher)  
* npm or yarn

### **1\. Clone the Repository**

\# Clone the repository  
git clone https://github.com/petermanoukian/taskassignmenttestfront.git

\# Navigate into the frontend directory  
cd taskfront

### **2\. Install Dependencies**

Install all the required npm packages.

npm install  
\# or  
yarn install

### **3\. Environment Configuration**

Create a .env file in the root of your Vue.js project by copying the example file.

cp .env.example .env

Ensure your .env file points to your running Laravel backend and Reverb server.

VITE\_API\_URL=http://localhost:8000/api  
VITE\_REVERB\_APP\_KEY=your\_reverb\_app\_key  
VITE\_REVERB\_HOST=localhost  
VITE\_REVERB\_PORT=8080  
VITE\_REVERB\_SCHEME=http

*Note: The values for VITE\_REVERB\_ variables should match your Laravel .env file.*

### **4\. Run the Application**

Start the development server.

npm run dev  
\# or  
yarn dev

The application will be accessible at http://localhost:5173 