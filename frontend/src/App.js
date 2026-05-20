import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ui/Toast";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Home from "./pages/user/Home";
import Cart from "./pages/user/Cart";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Wishlist from "./pages/user/Wishlist";
import BookDetail from "./pages/user/BookDetail";

import Dashboard from "./pages/admin/Dashboard";
import AdminBooks from "./pages/admin/Books";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <ToastContainer />
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/books" element={<ProtectedRoute role="ADMIN"><AdminBooks /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute role="ADMIN"><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><AdminUsers /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;