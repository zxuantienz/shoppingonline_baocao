import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Menu extends Component {
  static contextType = MyContext;
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
  render() {
    // Styling Menu UI hiện đại
    const menuStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2c3e50', padding: '15px 30px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' };
    const linkStyle = { color: '#ecf0f1', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', marginRight: '25px', textTransform: 'uppercase', transition: '0.3s' };
    const btnStyle = { backgroundColor: '#e74c3c', color: 'white', textDecoration: 'none', padding: '8px 15px', borderRadius: '5px', fontWeight: 'bold', marginLeft: '15px', transition: '0.3s' };

    return (
      <div style={menuStyle}>
        <div>
          <Link to='/admin/home' style={linkStyle}>Trang Chủ</Link>
          <Link to='/admin/category' style={linkStyle}>Danh Mục</Link>
          <Link to='/admin/product' style={linkStyle}>Sản Phẩm</Link>
          <Link to='/admin/order' style={linkStyle}>Đơn Hàng</Link>
          <Link to='/admin/customer' style={linkStyle}>Khách Hàng</Link>
        </div>
        <div style={{ fontSize: '1.1rem' }}>
          Xin chào <b style={{ color: '#f1c40f', fontSize: '1.2rem' }}>{this.context.username}</b> 
          <Link to='/admin/home' onClick={() => this.lnkLogoutClick()} style={btnStyle}>Đăng Xuất</Link>
        </div>
      </div>
    );
  }
}
export default Menu;