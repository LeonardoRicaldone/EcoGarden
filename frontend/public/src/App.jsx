import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'; 
import Home from './screens/Home';
import Register from './screens/Register';
import Login from './screens/Login';
import About from './screens/About';
import Contact from './screens/Contact';
import Favorites from './screens/Favorites';
import Products from './screens/Products';
import Profile from './screens/Profile';
import ShoppingCart from './screens/ShoppingCart';
import TermsConditions from './screens/TermsConditions';
import PasswordRecovery from './screens/PasswordRecovery';
import EmailVerification from './components/EmailVerification/EmailVerification'; // Nueva pantalla
import Nav from './components/Nav/Nav';
import Layout from './components/Layaout';
import Product from './screens/Product';
import Checkout from './screens/CheckOut';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Layout>
            <Nav />
            
            <Routes>
              <Route path="/" element={<Home />} />
              
              <Route path="/Products" element={<Products />} />
              <Route path="/product/:id" element={<Product />} />
              
              <Route path="/About" element={<About />} />
              <Route path="/Contact" element={<Contact />} />
              <Route path="/Register" element={<Register />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/PasswordRecovery" element={<PasswordRecovery />} />
              <Route path="/TermsConditions" element={<TermsConditions />} />
              
              {/* Nueva ruta para verificación de email */}
              <Route path="/verify-email" element={<EmailVerification />} />
              
              <Route 
                path="/Favorites" 
                element={
                    <Favorites />
                } 
              />
              <Route 
                path="/Profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ShoppingCart" 
                element={
                  <ProtectedRoute>
                    <ShoppingCart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              
              {/* Página 404 */}
              <Route path="*" element={
                <div style={{ 
                  textAlign: 'center', 
                  padding: '50px',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <h2 style={{ fontSize: '2rem', color: '#374151', marginBottom: '1rem' }}>
                    404 - Página no encontrada
                  </h2>
                  <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                    La página que buscas no existe o ha sido movida.
                  </p>
                  <a 
                    href="/" 
                    style={{
                      backgroundColor: '#93A267',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    Volver al inicio
                  </a>
                </div>
              } />
            </Routes>
          </Layout>
          <Footer/>
        </Router>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
            error: {
              duration: 4000,
              theme: {
                primary: '#ff4b4b',
              },
            },
          }}
        />
      </AuthProvider>
    </>
  )
}

export default App