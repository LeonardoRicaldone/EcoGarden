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
import Orders from './screens/Orders'
import Sales from './screens/Sales'
import Employees from './screens/Employees'
import Analytics from './screens/Analytics'
import Ratings from './screens/Ratings'
import Support from './screens/Support'
import Settings from './screens/Settings'


function App() {

  return (

    <>

    {/*<Router>*/}
    <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Nav />
    <div style={{ flex: 1}}>
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/products" element={<Products/>}/>
      <Route path="/products/addproduct" element={<AddProduct/>}/>
      <Route path='/products/inventary' element={<Inventary/>}/>
      <Route path='/products/categories' element={<Categories/>}/>
      <Route path="/orders" element={<Orders/>}/>
      <Route path='/employees' element={<Employees/>}/>
      <Route path='/sales' element={<Sales/>}/>
      <Route path="/analytics" element={<Analytics/>}/>
      <Route path="/ratings" element={<Ratings/>}/>
      {/*<Route path="/support" element={<Support/>}/>*/}
      <Route path="/settings" element={<Settings/>}/>
    </Routes>
    </div>
    </div>
    
    {/*</Router>*/}

{/*<FirstUserForm/>*/}
{/*<Login/>*/}
{/*<PasswordRecoveryPT1/>*/}
{/*<PasswordRecoveryPT2/>*/}
{/*<PasswordRecoveryPT3/>*/}

    
      
    </>
  )
}

export default App
