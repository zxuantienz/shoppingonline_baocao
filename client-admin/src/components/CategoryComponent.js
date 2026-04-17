import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext; 
  constructor(props) {
    super(props);
    this.state = { categories: [], itemSelected: null };
  }

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <tr key={item._id} className="hover-row" onClick={() => this.trItemClick(item)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
          <td style={{ padding: '12px 15px', color: '#555', fontWeight: 'bold' }}>{item._id.substring(item._id.length - 6)}</td>
          <td style={{ padding: '12px 15px', fontSize: '16px' }}>{item.name}</td>
        </tr>
      );
    });
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '30px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
        <style>{`.hover-row:hover { background-color: #f8f9fa !important; }`}</style>
        <div style={{ flex: '1', maxWidth: '600px' }}>
          <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '24px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>DANH MỤC SẢN PHẨM</h2>
          <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', backgroundColor: 'white' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#34495e', color: 'white', textTransform: 'uppercase', fontSize: '14px' }}>
                  <th style={{ padding: '15px' }}>Mã DM</th>
                  <th style={{ padding: '15px' }}>Tên danh mục</th>
                </tr>
              </thead>
              <tbody>
                {cates}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ width: '450px' }}>
          <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
        </div>
      </div>
    );
  }

  updateCategories = (categories) => { 
    this.setState({ categories: categories });
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('http://localhost:3000/api/admin/categories', config)
      .then((res) => {
        const result = res.data;
        this.setState({ categories: result });
      })
      .catch(err => console.error(err));
  }
}
export default Category;