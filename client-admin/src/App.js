import './App.css';
import React, { Component } from 'react';
import MyProvider from './contexts/MyProvider';
import Login from './components/LoginComponent';
import Main from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <MyProvider>
        {/* Phải có thẻ Login ở đây thì mới không bị trắng trang khi chưa đăng nhập */}
        <Login />
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </MyProvider>
    );
  }
}

export default App;
