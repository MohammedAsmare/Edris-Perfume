import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/customer/CartDrawer';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ShopPage } from './pages/customer/ShopPage';
import { ProductDetailsPage } from './pages/customer/ProductDetailsPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrdersPage } from './pages/customer/OrdersPage';
import { LoyaltyPage } from './pages/customer/LoyaltyPage';
import { SupportPage } from './pages/customer/SupportPage';
import { AboutPage } from './pages/customer/AboutPage';
import { AuthPage } from './pages/customer/AuthPage';

// Merchant Pages
import { MerchantLoginPage } from './pages/merchant/MerchantLoginPage';
import { MerchantDashboard } from './pages/merchant/MerchantDashboard';
import { MerchantProductsPage } from './pages/merchant/MerchantProductsPage';
import { MerchantDispatchPage } from './pages/merchant/MerchantDispatchPage';

// Delivery Partner Pages
import { DeliveryPartnerPage } from './pages/delivery/DeliveryPartnerPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#252525]">
            {/* Unified Architecture Portal Switcher */}
            <RoleSwitcher />

            {/* Main Luxury Navigation */}
            <Navbar />

            {/* Slide-out Cart Bag */}
            <CartDrawer />

            {/* Main Application Routes */}
            <main className="flex-1">
              <Routes>
                {/* Customer Store */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:slug" element={<ProductDetailsPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/loyalty" element={<LoyaltyPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Merchant Portal */}
                <Route path="/merchant" element={<MerchantDashboard />} />
                <Route path="/merchant/login" element={<MerchantLoginPage />} />
                <Route path="/merchant/register" element={<MerchantLoginPage />} />
                <Route path="/merchant/products" element={<MerchantProductsPage />} />
                <Route path="/merchant/orders" element={<MerchantDispatchPage />} />
                <Route path="/merchant/dispatch" element={<MerchantDispatchPage />} />

                {/* Delivery Partner Portal */}
                <Route path="/delivery" element={<DeliveryPartnerPage />} />
                <Route path="/delivery/assignments" element={<DeliveryPartnerPage />} />

                {/* Administrator Dashboard */}
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Luxury Footer with Ethiopian Payment Badges */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
