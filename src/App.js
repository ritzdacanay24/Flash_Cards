import React from 'react';
import './App.css';
import Header from './components/Shared/Header';
import NavbarHeader from './components/Shared/NavbarHeader';
import Routes from './components/Routes';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications';

function App() {
  return (
    <div className="App">
      <NotificationContainer/>
      <NavbarHeader />
      <Header title="Flash Cards" />
      <Routes />
    </div>
  );
}

export default App;
