import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { orders: [], order: null };
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} className="hover-row" onClick={() => this.setState({ order: item })} style={{ cursor: 'pointer', borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
          <td style={{ padding: '15px', fontWeight: 'bold', color: '#34495e' }}>{item._id ? item._id.substring(item._id.length - 6) : 'N/A'}</td>
          <td style={{ padding: '15px' }}>{new Date(item.cdate).toLocaleString('vi-VN')}</td>
          <td style={{ padding: '15px', color: '#e74c3c', fontWeight: 'bold' }}>{(item.total || 0).toLocaleString('vi-VN')} đ</td>
          <td style={{ padding: '15px', textAlign: 'center' }}>
            <span style={{
              padding: '6px 15px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              backgroundColor: item.status === 'APPROVED' ? '#d4edda' : item.status === 'CANCELED' ? '#f8d7da' : '#fff3cd',
              color: item.status === 'APPROVED' ? '#155724' : item.status === 'CANCELED' ? '#721c24' : '#856404'
            }}>
              {item.status}
            </span>
          </td>
        </tr>
      );
    });

    return (
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <style>{`.hover-row:hover { background-color: #f1f8ff !important; }`}</style>
        
        {/* TỔNG QUAN */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '26px', fontWeight: '800' }}>LỊCH SỬ MUA HÀNG</h2>
            <div style={{ backgroundColor: '#3498db', color: 'white', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold' }}>
                Tổng cộng: {this.state.orders.length} đơn hàng
            </div>
        </div>

        {/* DANH SÁCH ĐƠN HÀNG */}
        <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', backgroundColor: 'white', marginBottom: '50px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#2c3e50', color: 'white', textTransform: 'uppercase', fontSize: '13px' }}>
                  <th style={{ padding: '18px 15px' }}>Mã Đơn Hàng</th>
                  <th style={{ padding: '18px 15px' }}>Ngày Đặt</th>
                  <th style={{ padding: '18px 15px' }}>Tổng Tiền</th>
                  <th style={{ padding: '18px 15px', textAlign: 'center' }}>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders : <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#bdc3c7' }}>Bạn chưa thực hiện đơn hàng nào.</td></tr>}
              </tbody>
            </table>
        </div>

        {/* CHI TIẾT ĐƠN HÀNG */}
        {this.state.order && (
          <div style={{ animation: 'slideUp 0.4s ease-out' }}>
            <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '22px', marginBottom: '20px', textTransform: 'uppercase', borderTop: '2px dashed #eee', paddingTop: '40px' }}>
              CHI TIẾT ĐƠN HÀNG #<span style={{ color: '#3498db' }}>{this.state.order._id.substring(this.state.order._id.length - 6)}</span>
            </h2>
            
            <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.05)', backgroundColor: 'white', border: '1px solid #f0f0f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', color: '#7f8c8d', borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '15px', textAlign: 'center' }}>STT</th>
                    <th style={{ padding: '15px' }}>Tên Sản Phẩm</th>
                    <th style={{ padding: '15px' }}>Hình Ảnh</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Giá</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Số Lượng</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.order.items.map((item, index) => {
                    if (!item.product) return null;
                    return (
                      <tr key={item.product._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                        <td style={{ padding: '12px 15px', textAlign: 'center', color: '#95a5a6' }}>{index + 1}</td>
                        <td style={{ padding: '12px 15px', fontWeight: '600' }}>{item.product.name}</td>
                        <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                          <img src={"data:image/jpg;base64," + item.product.image} width="60px" height="60px" style={{ borderRadius: '8px', objectFit: 'cover' }} alt="" />
                        </td>
                        <td style={{ padding: '12px 15px', textAlign: 'right' }}>{item.product.price.toLocaleString('vi-VN')} đ</td>
                        <td style={{ padding: '12px 15px', textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 15px', textAlign: 'right', color: '#2c3e50', fontWeight: 'bold' }}>{(item.product.price * item.quantity).toLocaleString('vi-VN')} đ</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ padding: '25px', backgroundColor: '#fdfdfe', textAlign: 'right', borderTop: '2px solid #eee' }}>
                <h3 style={{ margin: 0, color: '#7f8c8d', fontWeight: 'normal' }}>
                  TỔNG CỘNG THÀNH TIỀN: <span style={{ color: '#e74c3c', fontSize: '28px', fontWeight: '800', marginLeft: '10px' }}>{(this.state.order.total || 0).toLocaleString('vi-VN')} đ</span>
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() { 
    if (this.context.customer) this.apiGetOrdersByCustID(this.context.customer._id); 
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('http://localhost:3000/api/customer/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }
}
export default Myorders;
