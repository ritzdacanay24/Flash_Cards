import React from 'react';
import './App.css';
import Header from './components/Header';
import Routes from './Routes';

function App() {
  return (
    <div className="App">
      <Header title="Flash Cards"></Header>
      <Routes />
    </div>
  );
}

export default App;
