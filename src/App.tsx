import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Cart from './Pages/Cart';
import Product from './Pages/Product';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product/>} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}