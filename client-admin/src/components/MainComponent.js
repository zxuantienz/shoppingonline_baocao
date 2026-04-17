import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';

class Main extends Component {
  static contextType = MyContext; // using this.context to access global state
  
  render() {
    // Nếu token KHÁC rỗng (Tức là đã đăng nhập)
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />
          <Routes>
            <Route path='/admin' element={<Navigate replace to='/admin/home' />} />
            <Route path='/admin/home' element={<Home />} />
            <Route path='/admin/category' element={<Category />} />
            <Route path='/admin/product' element={<Product />} />
            <Route path='/admin/order' element={<Order />} />
            <Route path='/admin/customer' element={<Customer />} />
            
            {/* 🛑 CHỐNG MÀN HÌNH TRẮNG: Nếu truy cập bất kỳ link nào khác, tự động bay vào Home */}
            <Route path='*' element={<Navigate replace to='/admin/home' />} />
          </Routes>
        </div>
      );
    }
    
    // Nếu chưa đăng nhập thì trả về div rỗng (Form Login sẽ được App.js hiển thị)
    return <div />;
  }
}

export default Main;
