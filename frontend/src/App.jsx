import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// MUI Theme
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import store from './store';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';

// Components
import Landing from './components/pages/Landing';
import Register from './components/pages/Register';
import Login from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Board from './components/pages/Board';
import Alert from './components/other/Alert';
import './App.css';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#026aa7',
    },
    secondary: {
      main: '#ff784e',
    },
  },
});

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      store.dispatch(loadUser());
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Alert />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/board/:id' element={<Board />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
