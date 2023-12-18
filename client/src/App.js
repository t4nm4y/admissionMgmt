import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import NewUserPage from './Pages/NewUserPage';
import { Toaster } from 'react-hot-toast';
import AdminPage from './Pages/AdminPage';
function App() {
  return (
    <>
    <div>
        <Toaster position="top-center"></Toaster>
    </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/admin' element={<AdminPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          <Route path='/addUser' element={<NewUserPage/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
