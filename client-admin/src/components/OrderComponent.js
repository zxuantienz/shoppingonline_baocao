import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { orders: [], order: null };
  }

  render() {
    // 1. Hiển thị danh sách đơn hàng
    const orders = this.state.orders.map((item) => {
      const dateString = item.cdate ? new Date(item.cdate).toLocaleString('vi-VN') : 'N/A';
      return (
        <tr key={item._id} className="hover-row" onClick={() => this.trItemClick(item)} style={{ cursor: 'pointer', borderBottom: '1px solid #eee', transition: 'background-color 0.3s' }}>
          <td style={{ padding: '12px 15px', color: '#555' }}><strong>{item._id ? item._id.substring(item._id.length - 6) : 'N/A'}</strong></td>
          <td style={{ padding: '12px 15px' }}>{dateString}</td>
          <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{item.customer?.name || 'Khách vãng lai'}</td>
          <td style={{ padding: '12px 15px' }}>{item.customer?.phone || 'N/A'}</td>
          <td style={{ padding: '12px 15px', color: '#e74c3c', fontWeight: 'bold' }}>{(item.total || 0).toLocaleString('vi-VN')} đ</td>
          <td style={{ padding: '12px 15px' }}>
            <span style={{ 
              padding: '5px 12px', 
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              backgroundColor: item.status === 'APPROVED' ? '#d4edda' : item.status === 'CANCELED' ? '#f8d7da' : '#fff3cd', 
              color: item.status === 'APPROVED' ? '#155724' : item.status === 'CANCELED' ? '#721c24' : '#856404' 
            }}>
              {item.status}
            </span>
          </td>
          <td style={{ padding: '12px 15px' }}>
            {item.status === 'PENDING' ?
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                <button onClick={(e) => { e.stopPropagation(); this.lnkApproveClick(item._id); }} style={{ backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Duyệt</button>
                <button onClick={(e) => { e.stopPropagation(); this.lnkCancelClick(item._id); }} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Hủy</button>
              </div>
              : <span style={{ color: '#aaa', fontStyle: 'italic' }}>Đã xử lý</span>}
          </td>
        </tr>
      );
    });

    // 2. Hiển thị chi tiết khi chọn đơn hàng
    let items = null;
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product?._id || index} className="hover-row" style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px 15px', textAlign: 'center' }}>{index + 1}</td>
            <td style={{ padding: '12px 15px', color: '#555' }}>{item.product?._id ? item.product._id.substring(item.product._id.length - 6) : 'N/A'}</td>
            <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{item.product?.name || 'Sản phẩm đã xóa'}</td>
            <td style={{ padding: '12px 15px' }}>
              <img src={"data:image/jpg;base64," + item.product?.image} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} alt="" />
            </td>
            <td style={{ padding: '12px 15px' }}>{(item.product?.price || 0).toLocaleString('vi-VN')} đ</td>
            <td style={{ padding: '12px 15px', textAlign: 'center' }}>{item.quantity}</td>
            <td style={{ padding: '12px 15px', color: '#e74c3c', fontWeight: 'bold' }}>{((item.product?.price || 0) * item.quantity).toLocaleString('vi-VN')} đ</td>
          </tr>
        );
      });
    }

    return (
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
        <style>{`.hover-row:hover { background-color: #f8f9fa !important; }`}</style>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '24px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>QUẢN LÝ ĐƠN HÀNG</h2>
          <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', backgroundColor: 'white' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#34495e', color: 'white', textTransform: 'uppercase', fontSize: '14px' }}>
                  <th style={{ padding: '15px' }}>Mã ĐH</th>
                  <th style={{ padding: '15px' }}>Ngày đặt</th>
                  <th style={{ padding: '15px' }}>Khách hàng</th>
                  <th style={{ padding: '15px' }}>Điện thoại</th>
                  <th style={{ padding: '15px' }}>Tổng tiền</th>
                  <th style={{ padding: '15px' }}>Trạng thái</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders : <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>Chưa có đơn hàng nào</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {this.state.order ?
          <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '20px', marginBottom: '20px', textTransform: 'uppercase', borderTop: '2px dashed #eee', paddingTop: '30px' }}>
              CHI TIẾT ĐƠN HÀNG: <span style={{ color: '#e74c3c' }}>{this.state.order._id ? this.state.order._id.substring(this.state.order._id.length - 6) : ''}</span>
            </h2>
            <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', backgroundColor: 'white' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', color: '#2c3e50', borderBottom: '2px solid #dee2e6' }}>
                    <th style={{ padding: '15px', textAlign: 'center' }}>STT</th>
                    <th style={{ padding: '15px' }}>Mã SP</th>
                    <th style={{ padding: '15px' }}>Tên sản phẩm</th>
                    <th style={{ padding: '15px' }}>Hình ảnh</th>
                    <th style={{ padding: '15px' }}>Đơn giá</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Số lượng</th>
                    <th style={{ padding: '15px' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </table>
              <div style={{ padding: '20px', backgroundColor: '#fdfdfe', textAlign: 'right', borderTop: '2px solid #eee' }}>
                 <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '20px' }}>TỔNG CỘNG: <span style={{ color: '#e74c3c', fontSize: '26px' }}>{(this.state.order.total || 0).toLocaleString('vi-VN')} đ</span></h3>
              </div>
            </div>
          </div>
        : null}
      </div>
    );
  }

  componentDidMount() { this.apiGetOrders(); }
  trItemClick(item) { this.setState({ order: item }); }
  lnkApproveClick(id) { this.apiPutOrderStatus(id, 'APPROVED'); }
  lnkCancelClick(id) { this.apiPutOrderStatus(id, 'CANCELED'); }

  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    // Sử dụng đường dẫn tương đối để tương thích với Render
    axios.get('/api/admin/orders', config).then((res) => { 
      this.setState({ orders: res.data }); 
    }).catch(err => console.error(err));
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      if (res.data) { 
        this.apiGetOrders(); 
      } else { 
        alert('Lỗi hệ thống!'); 
      }
    });
  }
}
export default Order;