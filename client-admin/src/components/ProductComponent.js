import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { products: [], noPages: 0, curPage: 1, itemSelected: null };
  }

  render() {
    const prods = this.state.products.map((item) => {
      return (
        <tr key={item._id} className="hover-row" onClick={() => this.trItemClick(item)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
          <td style={{ padding: '12px 15px', color: '#555', fontWeight: 'bold' }}>{item._id.substring(item._id.length - 6)}</td>
          <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{item.name}</td>
          <td style={{ padding: '12px 15px', color: '#e74c3c', fontWeight: 'bold' }}>{(item.price || 0).toLocaleString('vi-VN')} đ</td>
          <td style={{ padding: '12px 15px', fontSize: '13px', color: '#777' }}>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
          <td style={{ padding: '12px 15px' }}><span style={{ backgroundColor: '#e1f5fe', color: '#0288d1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{item.category?.name}</span></td>
          <td style={{ padding: '12px 15px' }}><img src={"data:image/jpg;base64," + item.image} width="60px" height="60px" style={{objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'}} alt="" /></td>
        </tr>
      );
    });

    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      const isCurrent = (index + 1) === this.state.curPage;
      return (
        <span key={index} className="link" onClick={() => this.lnkPageClick(index + 1)} 
              style={{ padding: '6px 12px', margin: '0 4px', borderRadius: '4px', cursor: 'pointer', 
                       backgroundColor: isCurrent ? '#3498db' : '#f1f5f9', color: isCurrent ? 'white' : '#333', 
                       fontWeight: isCurrent ? 'bold' : 'normal', display: 'inline-block' }}>
          {index + 1}
        </span>
      );
    });

    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', padding: '30px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
        <style>{`.hover-row:hover { background-color: #f8f9fa !important; }`}</style>
        <div style={{ flex: '1', overflowX: 'auto' }}>
          <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '24px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>DANH SÁCH SẢN PHẨM</h2>
          <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', backgroundColor: 'white' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#34495e', color: 'white', textTransform: 'uppercase', fontSize: '14px' }}>
                  <th style={{ padding: '15px' }}>Mã SP</th>
                  <th style={{ padding: '15px' }}>Tên sản phẩm</th>
                  <th style={{ padding: '15px' }}>Đơn giá</th>
                  <th style={{ padding: '15px' }}>Ngày tạo</th>
                  <th style={{ padding: '15px' }}>Danh mục</th>
                  <th style={{ padding: '15px' }}>Hình ảnh</th>
                </tr>
              </thead>
              <tbody>
                {prods}
              </tbody>
            </table>
            <div style={{ padding: '15px', textAlign: 'center', backgroundColor: '#fdfdfe', borderTop: '1px solid #eee' }}>
              {pagination}
            </div>
          </div>
        </div>
        <div style={{ width: '420px' }}>
          <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />
        </div>
      </div>
    );
  }

  updateProducts = (products, noPages) => {
    this.setState({ products: products, noPages: noPages });
  }

  componentDidMount() {
    this.apiGetProducts(this.state.curPage);
  }

  lnkPageClick(index) {
    this.apiGetProducts(index);
  }

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('http://localhost:3000/api/admin/products?page=' + page, config)
      .then((res) => {
        const result = res.data;
        this.setState({ products: result.products, noPages: result.noPages, curPage: result.curPage });
      })
      .catch(err => console.error(err));
  }
}
export default Product;