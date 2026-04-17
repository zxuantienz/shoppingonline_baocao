import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  render() {
    const mycart = this.context.mycart.map((item, index) => {
      return (
        <tr key={item.product._id} className="hover-row" style={{ borderBottom: '1px solid #f0f0f0', transition: 'all 0.2s' }}>
          <td style={{ padding: '20px 15px', textAlign: 'center', color: '#95a5a6' }}>{index + 1}</td>
          <td style={{ padding: '20px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={"data:image/jpg;base64," + item.product.image} width="80px" height="80px" style={{ borderRadius: '10px', objectFit: 'cover', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }} alt={item.product.name} />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#2c3e50' }}>{item.product.name}</div>
                <div style={{ fontSize: '12px', color: '#bdc3c7', marginTop: '4px' }}>Mã SP: {item.product._id.substring(item.product._id.length - 6)}</div>
              </div>
            </div>
          </td>
          <td style={{ padding: '20px 15px', textAlign: 'right', fontWeight: '500' }}>{item.product.price.toLocaleString('vi-VN')} đ</td>
          <td style={{ padding: '20px 15px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: '20px', padding: '5px 15px' }}>
              <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{item.quantity}</span>
            </div>
          </td>
          <td style={{ padding: '20px 15px', textAlign: 'right', color: '#e74c3c', fontWeight: 'bold', fontSize: '16px' }}>{(item.product.price * item.quantity).toLocaleString('vi-VN')} đ</td>
          <td style={{ padding: '20px 15px', textAlign: 'center' }}>
            <button onClick={() => this.lnkRemoveClick(item.product._id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', textDecoration: 'underline' }}>
              Xóa
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
        <style>{`
          .hover-row:hover { background-color: #fcfcfc; }
          .checkout-btn:hover { transform: translateY(-2px); box-shadow: 0 7px 20px rgba(46, 204, 113, 0.4) !important; }
          .checkout-btn:active { transform: translateY(0); }
        `}</style>
        
        <h2 style={{ textAlign: 'left', color: '#2c3e50', fontSize: '28px', fontWeight: '800', marginBottom: '30px', borderLeft: '5px solid #3498db', paddingLeft: '15px' }}>
          GIỎ HÀNG CỦA BẠN
        </h2>
        
        {this.context.mycart.length > 0 ? (
          <div style={{ display: 'flex', gap: '30px', alignItems: 'start', flexWrap: 'wrap' }}>
            {/* DANH SÁCH SẢN PHẨM (BÊN TRÁI) */}
            <div style={{ flex: '1', minWidth: '600px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', color: '#7f8c8d', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '15px' }}>STT</th>
                    <th style={{ padding: '15px', textAlign: 'left' }}>Sản phẩm</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Đơn giá</th>
                    <th style={{ padding: '15px' }}>Số lượng</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Thành tiền</th>
                    <th style={{ padding: '15px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {mycart}
                </tbody>
              </table>
            </div>

            {/* TÓM TẮT THANH TOÁN (BÊN PHẢI) */}
            <div style={{ width: '350px', backgroundColor: '#2c3e50', color: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)', position: 'sticky', top: '20px' }}>
              <h3 style={{ margin: '0 0 25px 0', fontSize: '22px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', fontWeight: '700' }}>TẠM TÍNH</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Tổng số sản phẩm:</span>
                <span style={{ fontWeight: 'bold' }}>{this.context.mycart.length}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '20px' }}>
                <span style={{ fontSize: '18px', fontWeight: '500' }}>TỔNG THANH TOÁN:</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#2ecc71' }}>{CartUtil.getTotal(this.context.mycart).toLocaleString('vi-VN')} đ</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>(Đã bao gồm thuế)</div>
                </div>
              </div>

              <button 
                className="checkout-btn"
                onClick={() => this.lnkCheckoutClick()} 
                style={{ width: '100%', backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '18px', borderRadius: '15px', fontSize: '18px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 8px 20px rgba(46, 204, 113, 0.3)' }}>
                ĐẶT HÀNG NGAY
              </button>

              <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <span onClick={() => this.props.navigate('/home')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}>Tiếp tục chọn sản phẩm</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px', backgroundColor: 'white', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '80px', marginBottom: '30px' }}>🛍️</div>
            <h3 style={{ color: '#2c3e50', fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>Giỏ hàng của bạn đang trống!</h3>
            <p style={{ color: '#7f8c8d', fontSize: '16px', marginBottom: '35px' }}>Có vẻ như bạn chưa chọn được món đồ nào ưng ý. <br/> Hãy quay lại cửa hàng để khám phá hàng ngàn ưu đãi nhé!</p>
            <button onClick={() => this.props.navigate('/home')} style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 20px rgba(52, 152, 219, 0.3)', transition: 'transform 0.2s' }}>
              KHÁM PHÁ NGAY
            </button>
          </div>
        )}
      </div>
    );
  }

  lnkRemoveClick(id) {
    const mycart = this.context.mycart;
    const index = mycart.findIndex(x => x.product._id === id);
    if (index !== -1) { 
      mycart.splice(index, 1); 
      this.context.setMycart(mycart); 
    }
  }

  lnkCheckoutClick() {
    if (window.confirm('BẠN CÓ CHẮC CHẮN MUỐN THỰC HIỆN ĐẶT HÀNG?')) {
      if (this.context.mycart.length > 0) {
        if (this.context.customer) this.apiCheckout(CartUtil.getTotal(this.context.mycart), this.context.mycart, this.context.customer);
        else this.props.navigate('/login');
      } else alert('Giỏ hàng trống!');
    }
  }

  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('http://localhost:3000/api/customer/checkout', body, config).then((res) => {
      if (res.data) { 
        alert('CHÚC MỪNG! BẠN ĐÃ ĐẶT HÀNG THÀNH CÔNG!'); 
        this.context.setMycart([]); 
        this.props.navigate('/home'); 
      } else alert('LỖI HỆ THỐNG, VUI LÒNG THỬ LẠI!');
    });
  }
}
export default withRouter(Mycart);