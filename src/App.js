import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Universities from './pages/universities';
import Postal from './pages/postal';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/universities' element={<Universities />} />
        <Route path='/postal' element={<Postal />} />
      </Routes>
    </Router>
  );
}

export default App;
