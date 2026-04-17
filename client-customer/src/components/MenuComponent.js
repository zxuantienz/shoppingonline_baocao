import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { categories: [], txtKeyword: '' };
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <li key={item._id} className="nav-item">
        <Link to={'/product/category/' + item._id} className="nav-link">{item.name}</Link>
      </li>
    ));

    return (
      <nav style={{ backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '15px 0', position: 'sticky', top: 0, zIndex: 1000, fontFamily: '"Inter", sans-serif' }}>
        <style>{`
          .nav-container { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          .logo { font-size: 26px; font-weight: 900; color: #2563eb; text-decoration: none; letter-spacing: -1px; flex-shrink: 0; }
          .nav-list { list-style: none; display: flex; margin: 0 40px; padding: 0; gap: 25px; flex-grow: 1; justify-content: center; }
          .nav-link { text-decoration: none; color: #4b5563; font-weight: 600; font-size: 13px; text-transform: uppercase; transition: all 0.3s; }
          .nav-link:hover { color: #2563eb; }
          .search-form { display: flex; background: #f3f4f6; border-radius: 99px; padding: 6px 16px; border: 1px solid #e5e7eb; width: 220px; }
          .search-input { border: none; background: transparent; outline: none; width: 100%; font-size: 13px; color: #1f2937; }
          .search-btn { background: none; border: none; color: #2563eb; cursor: pointer; font-weight: 800; font-size: 12px; padding-left: 8px; }
        `}</style>

        <div className="nav-container">
          <Link to='/' className="logo">MERN<span style={{color: '#1e293b'}}>-SHOP</span></Link>
          <ul className="nav-list">
            <li className="nav-item"><Link to='/home' className="nav-link">Trang Chủ</Link></li>
            {cates}
          </ul>
          <form className="search-form" onSubmit={(e) => this.btnSearchClick(e)}>
            <input type="search" placeholder="Tìm sản phẩm..." className="search-input" value={this.state.txtKeyword} onChange={(e) => this.setState({ txtKeyword: e.target.value })} />
            <button type="submit" className="search-btn">TÌM</button>
          </form>
        </div>
      </nav>
    );
  }

  componentDidMount() { this.apiGetCategories(); }
  btnSearchClick(e) { e.preventDefault(); if (this.state.txtKeyword.trim()) this.props.navigate('/product/search/' + this.state.txtKeyword); }
  apiGetCategories() { axios.get('http://localhost:3000/api/customer/categories').then((res) => { this.setState({ categories: res.data }); }); }
}
export default withRouter(Menu);
