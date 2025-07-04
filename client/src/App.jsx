// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/Home';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import LoginPage from './pages/LoginPage/LoginPage';
import NewsPage from './pages/NewsPage/NewsPage';
import ContactPage from './pages/ContactPage/ContactPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Profile from './components/Profile/Profile/Profile';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/index" element={<Home />} /> */}

      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/profile" element={<ProfilePage />} />

    </Routes>
  </Router>
);

export default App;
