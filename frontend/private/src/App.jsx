import {BrowserRouter as Router, Routes, Route} from 'react-router'

import FirstUserForm from './screens/FirstUserForm'
import Login from './screens/Login'
import PasswordRecoveryPT1 from './screens/PasswordRecoveryPT1'
import PasswordRecoveryPT2 from './screens/PasswordRecoveryPT2'
import PasswordRecoveryPT3 from './screens/PasswordRecoveryPT3'

import Nav from "./components/Nav"
import Dashboard from './screens/Dashboard'
import Products from './screens/Products.jsx'
import AddProduct from './screens/AddProduct.jsx'
import Inventary from './screens/Inventary.jsx'
import Categories from './screens/Categories.jsx'
import Sales from './screens/Sales'
import Employees from './screens/Employees'
import Analytics from './screens/Analytics'
import Ratings from './screens/Ratings'
import Settings from './screens/Settings'
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './components/PrivateRoute.jsx'
import PrivateLayout from "./components/PrivateLayout.jsx"

function App() {

  return (

    <>
      <AuthProvider>
        
      <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<Login />} />

      {/* Rutas privadas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/addproduct" element={<AddProduct />} />
          <Route path="/products/inventary" element={<Inventary />} />
          <Route path="/products/categories" element={<Categories />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ratings" element={<Ratings />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
    </AuthProvider>

    </>
  )
}

export default App
