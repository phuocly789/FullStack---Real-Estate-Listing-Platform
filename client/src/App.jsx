// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/Home';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ContactPage from './pages/ContactPage/ContactPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import CollectionPage from './pages/CollectionPage/CollectionPage';
import AdminPage from './pages/AdminPage/AdminPage';
import ProtectedRoute from './pages/ProtectedRoute';
import AdminProperties from './components/Admin/AdminProperties/AdminProperties';
import AdminUsers from './components/Admin/AdminUsers/AdminUsers';
import AdminContact from './components/Admin/AdminContact/AdminContact';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/index" element={<Home />} /> */}

      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/collection" element={<CollectionPage />} />
      {/* USER chỉ được truy cập */}
      <Route
        path="/profile"
        element={<ProtectedRoute element={<ProfilePage />} allowedRoles={['USER']} />}
      />
   
      {/* ADMIN chỉ được truy cập */}
      <Route
        path="/admin"
        element={<ProtectedRoute element={<AdminPage />} allowedRoles={['ADMIN']} />}
      />
      <Route
        path="/admin/properties"
        element={<ProtectedRoute element={<AdminProperties />} allowedRoles={['ADMIN']} />}
      />
      <Route
        path="/admin/users"
        element={<ProtectedRoute element={<AdminUsers />} allowedRoles={['ADMIN']} />}
      />
      <Route
        path="/admin/contacts"
        element={<ProtectedRoute element={<AdminContact />} allowedRoles={['ADMIN']} />}
      />
    </Routes>
  </Router>
);

export default App;
