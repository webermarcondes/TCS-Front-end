import logo from './logo.svg';
import './App.css';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import Login from './pages/Login';
import { BrowserRouter as Router } from 'react-router-dom';
import Routers from './Routes/Routes';
import Header from './components/Header';
function App() {
  return (
    <div className="App">
    <Router>
      <Header/>
      <Routers/>
    </Router>
    </div>
  );
}

export default App;
