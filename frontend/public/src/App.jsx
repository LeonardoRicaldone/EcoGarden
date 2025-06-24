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
import Nav from './components/Nav/Nav';
import Layout from './components/Layaout';
import Product from './screens/Product';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Layout>
            <Nav />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Product" element={<Product />} />
              <Route path="/About" element={<About />} />
              <Route path='/Contact' element={<Contact />} />
              <Route path='/Register' element={<Register />} />
              <Route path='/Login' element={<Login />} />
              <Route path='/Favorites' element={<Favorites />} />
              <Route path='/Products' element={<Products />} />
              <Route path='/Profile' element={<Profile />} />
              <Route path='/ShoppingCart' element={<ShoppingCart />} />
              <Route path='/TermsConditions' element={<TermsConditions />} />
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