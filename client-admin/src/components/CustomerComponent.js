import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext; 
  constructor(props) {
    super(props);
    this.state = { customers: [], orders: [], order: null };
  }

  render() {
    const customers = this.state.customers.map((item) => {
      return (
        <tr key={item._id} className="hover-row" onClick={() => this.trCustomerClick(item)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
          <td style={{ padding: '12px 15px', color: '#555', fontWeight: 'bold' }}>{item._id.substring(item._id.length - 6)}</td>
          <td style={{ padding: '12px 15px' }}>{item.username}</td>
          <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{item.name}</td>
          <td style={{ padding: '12px 15px' }}>{item.phone}</td>
          <td style={{ padding: '12px 15px', color: '#2980b9' }}>{item.email}</td>
          <td style={{ padding: '12px 15px', textAlign: 'center' }}>
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: item.active === 1 ? '#d4edda' : '#e2e3e5', color: item.active === 1 ? '#155724' : '#383d41' }}>
              {item.active === 1 ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
            </span>
          </td>
          <td style={{ padding: '12px 15px', textAlign: 'center' }}>
            {item.active === 0 ?
              <button onClick={(e) => { e.stopPropagation(); this.lnkEmailClick(item); }} style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Gửi Email</button>
              :
              <button onClick={(e) => { e.stopPropagation(); this.lnkDeactiveClick(item); }} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Khóa TK</button>}
          </td>
        </tr>
      );
    });

    const orders = this.state.orders.map((item) => {
      const dateString = item.cdate ? new Date(item.cdate).toLocaleString('vi-VN') : 'N/A';
      return (
        <tr key={item._id} className="hover-row" onClick={() => this.trOrderClick(item)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee' }}>
          <td style={{ padding: '12px 15px', color: '#555' }}>{item._id.substring(item._id.length - 6)}</td>
          <td style={{ padding: '12px 15px' }}>{dateString}</td>
          <td style={{ padding: '12px 15px' }}>{item.customer?.name}</td>
          <td style={{ padding: '12px 15px' }}>{item.customer?.phone}</td>
          <td style={{ padding: '12px 15px', color: '#e74c3c', fontWeight: 'bold' }}>{(item.total || 0).toLocaleString('vi-VN')} đ</td>
          <td style={{ padding: '12px 15px' }}>
            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: item.status === 'APPROVED' ? '#d4edda' : item.status === 'CANCELED' ? '#f8d7da' : '#fff3cd', color: item.status === 'APPROVED' ? '#155724' : item.status === 'CANCELED' ? '#721c24' : '#856404' }}>{item.status}</span>
          </td>
        </tr>
      );
    });

    let items = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product?._id} className="hover-row" style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '10px 15px', textAlign: 'center' }}>{index + 1}</td>
            <td style={{ padding: '10px 15px', color: '#555' }}>{item.product?._id ? item.product._id.substring(item.product._id.length - 6) : 'N/A'}</td>
            <td style={{ padding: '10px 15px', fontWeight: 'bold' }}>{item.product?.name || 'Đã xóa'}</td>
            <td style={{ padding: '10px 15px' }}><img src={"data:image/jpg;base64," + item.product?.image} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} alt="" /></td>
            <td style={{ padding: '10px 15px' }}>{(item.product?.price || 0).toLocaleString('vi-VN')} đ</td>
            <td style={{ padding: '10px 15px', textAlign: 'center' }}>{item.quantity}</td>
            <td style={{ padding: '10px 15px', color: '#e74c3c', fontWeight: 'bold' }}>{((item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')} đ</td>
          </tr>
        );
      });
    }

    return (
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
        <style>{`.hover-row:hover { background-color: #f8f9fa !important; }`}</style>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '24px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>QUẢN LÝ KHÁCH HÀNG</h2>
        <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', backgroundColor: 'white', marginBottom: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white', textTransform: 'uppercase', fontSize: '14px' }}>
                <th style={{ padding: '15px' }}>Mã KH</th><th style={{ padding: '15px' }}>Tài khoản</th><th style={{ padding: '15px' }}>Họ Tên</th><th style={{ padding: '15px' }}>Điện thoại</th><th style={{ padding: '15px' }}>Email</th><th style={{ padding: '15px', textAlign: 'center' }}>Trạng thái</th><th style={{ padding: '15px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? customers : <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>Chưa có khách hàng nào</td></tr>}
            </tbody>
          </table>
        </div>
        
        {this.state.orders.length > 0 ?
          <div style={{ animation: 'fadeIn 0.5s ease-in-out', marginBottom: '40px' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '20px', marginBottom: '15px', textTransform: 'uppercase', borderTop: '2px dashed #eee', paddingTop: '20px' }}>LỊCH SỬ ĐƠN HÀNG</h2>
            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.05)', backgroundColor: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', color: '#2c3e50', fontSize: '14px' }}>
                    <th style={{ padding: '12px 15px' }}>Mã ĐH</th><th style={{ padding: '12px 15px' }}>Ngày đặt</th><th style={{ padding: '12px 15px' }}>Khách hàng</th><th style={{ padding: '12px 15px' }}>Điện thoại</th><th style={{ padding: '12px 15px' }}>Tổng tiền</th><th style={{ padding: '12px 15px' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>{orders}</tbody>
              </table>
            </div>
          </div>
        : null}
          
        {this.state.order ?
          <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            <h2 style={{ textAlign: 'center', color: '#e74c3c', fontSize: '18px', marginBottom: '15px', textTransform: 'uppercase' }}>CHI TIẾT ĐƠN HÀNG: {this.state.order._id ? this.state.order._id.substring(this.state.order._id.length - 6) : ''}</h2>
            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.05)', backgroundColor: 'white', border: '1px solid #eee' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fdfdfe', color: '#555', fontSize: '13px', borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '10px 15px', textAlign: 'center' }}>STT</th><th style={{ padding: '10px 15px' }}>Mã SP</th><th style={{ padding: '10px 15px' }}>Tên sản phẩm</th><th style={{ padding: '10px 15px' }}>Hình ảnh</th><th style={{ padding: '10px 15px' }}>Đơn giá</th><th style={{ padding: '10px 15px', textAlign: 'center' }}>Số lượng</th><th style={{ padding: '10px 15px' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </table>
            </div>
          </div>
        : null}
      </div>
    );
  }

  componentDidMount() { this.apiGetCustomers(); }
  trCustomerClick(item) { this.setState({ orders: [], order: null }); this.apiGetOrdersByCustID(item._id); }
  trOrderClick(item) { this.setState({ order: item }); }
  lnkDeactiveClick(item) { if(window.confirm('Khóa tài khoản này?')) this.apiPutCustomerDeactive(item._id, item.token); }
  lnkEmailClick(item) { this.apiGetCustomerSendmail(item._id); }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('http://localhost:3000/api/admin/customers', config).then((res) => { this.setState({ customers: res.data }); }).catch(err => console.error(err));
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('http://localhost:3000/api/admin/orders/customer/' + cid, config).then((res) => { this.setState({ orders: res.data }); });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('http://localhost:3000/api/admin/customers/deactive/' + id, body, config).then((res) => {
      if (res.data) { alert('Khóa thành công!'); this.apiGetCustomers(); } else { alert('Lỗi hệ thống!'); }
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('http://localhost:3000/api/admin/customers/sendmail/' + id, config).then((res) => { alert(res.data.message); });
  }
}

export default Customer;