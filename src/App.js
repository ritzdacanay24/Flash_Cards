import React from 'react';
import './App.css';
import Header from './components/Header';
import NavbarHeader from './components/NavbarHeader';
import Routes from './components/routes/Routes';

function App() {
  return (
    <div className="App">
      <NavbarHeader />
      <Header title="Flash Cards" />
      <Routes />
    </div>
  );
}

export default App;
