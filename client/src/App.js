import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // NEW
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import LoginModal from './components/common/LoginModal';
import RegisterModal from './components/common/RegisterModal';
import RentalModal from './components/common/RentalModal';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute'; // NEW
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import MyRentals from './pages/MyRentals';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login'; // NEW
import Register from './pages/Register'; // NEW
import Dashboard from './pages/Dashboard'; // NEW
import AdminDashboard from './pages/AdminDashboard'; // NEW
import Cart from './pages/Cart'; // NEW
import Checkout from './pages/Checkout'; // NEW
import Contact from './pages/Contact'; // NEW
import About from './pages/About'; // NEW
import Payment from './pages/Payment'; // NEW
import './App.css';

function App() {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    type: 'login'
  });
  const [rentalModal, setRentalModal] = useState({
    isOpen: false,
    product: null
  });

  const openLoginModal = () => setAuthModal({ isOpen: true, type: 'login' });
  const openRegisterModal = () => setAuthModal({ isOpen: true, type: 'register' });
  const closeAuthModal = () => setAuthModal({ isOpen: false, type: 'login' });

  const openRentalModal = (product) => setRentalModal({ isOpen: true, product });
  const closeRentalModal = () => setRentalModal({ isOpen: false, product: null });

  const switchAuthModal = () => {
    setAuthModal(prev => ({
      isOpen: true,
      type: prev.type === 'login' ? 'register' : 'login'
    }));
  };

  return (
    <AuthProvider>
      <CartProvider> {/* NEW: Wrap with CartProvider */}
        <Router>
          <div className="App">
            <Header
              onLoginClick={openLoginModal}
              onRegisterClick={openRegisterModal}
            />

            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home onRentClick={openRentalModal} />} />
                <Route path="/products" element={<Products onRentClick={openRentalModal} />} />
                <Route path="/products/:id" element={<ProductDetail onRentClick={openRentalModal} />} />
                <Route
                  path="/my-rentals"
                  element={
                    <ProtectedRoute>
                      <MyRentals />
                    </ProtectedRoute>
                  }
                />
                <Route path="/how-it-works" element={<HowItWorks />} />

                {/* NEW ROUTES */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute> {/* NEW: Admin-only route */}
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Home onRentClick={openRentalModal} />} />
              </Routes>
            </main>

            <Footer />

            {/* Modals */}
            <LoginModal
              isOpen={authModal.isOpen && authModal.type === 'login'}
              onClose={closeAuthModal}
              switchToRegister={switchAuthModal}
            />

            <RegisterModal
              isOpen={authModal.isOpen && authModal.type === 'register'}
              onClose={closeAuthModal}
              switchToLogin={switchAuthModal}
            />

            <RentalModal
              isOpen={rentalModal.isOpen}
              onClose={closeRentalModal}
              product={rentalModal.product}
            />
          </div>
        </Router>
      </CartProvider> {/* NEW: Close CartProvider */}
    </AuthProvider>
  );
}

export default App;