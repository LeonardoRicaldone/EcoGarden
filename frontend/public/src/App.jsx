import Footer from './components/Footer/Footer';
import {BrowserRouter as Router, Routes, Route} 
from 'react-router'
import Home from './screens/Home'
import Register from './screens/Register'
import Login from './screens/Login'
import About from './screens/About'
import Contact from './screens/Contact'
import Favorites from './screens/Favorites'
import Products from './screens/Products'
import Profile from './screens/Profile'
import ShoppingCart from './screens/ShoppingCart'
import TermsConditions from './screens/TermsConditions'
import Nav from './components/Nav/Nav'
import Layout from './components/Layaout';


function App() {

  return (
    <>

    <Router>
    <Layout>
    <Nav />
   
      <Routes>
        <Route path="/" element={<Home />} />
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
    
    </>
  )
}

export default App