import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Products from "@/components/pages/Products";
import Inventory from "@/components/pages/Inventory";
import Sales from "@/components/pages/Sales";
import Customers from "@/components/pages/Customers";
import Reports from "@/components/pages/Reports";
import Pricing from "@/components/pages/Pricing";
import BarcodeSearch from "@/components/pages/BarcodeSearch";
import Login from "@/components/pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
<Routes>
          <Route path="/login" element={<Login />} />
<Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="barcode-search" element={<BarcodeSearch />} />
            <Route path="sales" element={<Sales />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Routes>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;