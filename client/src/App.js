import './App.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';

import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import NewUserPage from './Pages/NewUserPage';
import { Toaster } from 'react-hot-toast';
import AdminPage from './Pages/AdminPage';
import Header from './components/Header';
function App() {
  return (
    <>
    <div>
        <Toaster position="top-center"></Toaster>
    </div>
    <Header/>
    <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/addUser" element={<NewUserPage />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
