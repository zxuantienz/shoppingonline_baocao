import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

class Myprofile extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { 
      txtUsername: '', 
      txtPassword: '', 
      txtName: '', 
      txtPhone: '', 
      txtEmail: '' 
    };
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    return (
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .profile-card { 
            background: white; width: 100%; max-width: 500px; padding: 40px; 
            border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); 
            animation: fadeIn 0.5s ease-out;
          }
          .form-group { margin-bottom: 20px; }
          .form-label { display: block; font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 8px; }
          .form-input { 
            width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #d1d5db; 
            font-size: 15px; color: #1f2937; transition: all 0.2s; box-sizing: border-box;
          }
          .form-input:focus { outline: none; border-color: #2563eb; ring: 3px rgba(37, 99, 235, 0.1); box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
          .form-input:disabled { background-color: #f9fafb; color: #9ca3af; cursor: not-allowed; }
          .update-btn { 
            width: 100%; background-color: #2563eb; color: white; border: none; 
            padding: 14px; border-radius: 12px; font-weight: 700; font-size: 16px; 
            cursor: pointer; transition: all 0.3s; margin-top: 10px;
          }
          .update-btn:hover { background-color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
          .avatar-circle { 
            width: 80px; height: 80px; background: #eff6ff; color: #2563eb; 
            border-radius: 50%; display: flex; align-items: center; justify-content: center; 
            margin: 0 auto 25px; font-size: 32px; font-weight: 800; border: 4px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          }
        `}</style>

        <div className="profile-card">
          {/* AVATAR GIA LẬP */}
          <div className="avatar-circle">
            {this.state.txtName ? this.state.txtName.charAt(0).toUpperCase() : 'U'}
          </div>

          <h2 style={{ textAlign: 'center', color: '#111827', fontSize: '24px', fontWeight: '800', marginBottom: '30px' }}>THÔNG TIN CÁ NHÂN</h2>
          
          <form onSubmit={(e) => this.btnUpdateClick(e)}>
            <div className="form-group">
              <label className="form-label">Tên đăng nhập</label>
              <input type="text" value={this.state.txtUsername} disabled className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input type="password" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} className="form-input" placeholder="Nhập mật khẩu mới..." />
            </div>

            <div className="form-group">
              <label className="form-label">Họ và Tên</label>
              <input type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} className="form-input" placeholder="Nhập tên của bạn..." />
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input type="tel" value={this.state.txtPhone} onChange={(e) => this.setState({ txtPhone: e.target.value })} className="form-input" placeholder="090..." />
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ Email</label>
              <input type="email" value={this.state.txtEmail} onChange={(e) => this.setState({ txtEmail: e.target.value })} className="form-input" placeholder="email@example.com" />
            </div>

            <button type="submit" className="update-btn">CẬP NHẬT THÔNG TIN</button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#6b7280' }}>
            Thông tin của bạn được bảo mật tuyệt đối trên hệ thống.
          </p>
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (this.context.customer) {
      const { username, password, name, phone, email } = this.context.customer;
      this.setState({ 
        txtUsername: username, 
        txtPassword: password, 
        txtName: name, 
        txtPhone: phone, 
        txtEmail: email 
      });
    }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;
    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const customer = { 
        username: txtUsername, 
        password: txtPassword, 
        name: txtName, 
        phone: txtPhone, 
        email: txtEmail 
      };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      alert('Vui lòng điền đầy đủ các thông tin!');
    }
  }

  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('http://localhost:3000/api/customer/customers/' + id, customer, config).then((res) => {
      if (res.data) { 
        alert('Cập nhật hồ sơ thành công!'); 
        this.context.setCustomer(res.data); 
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại!');
      }
    });
  }
}
export default Myprofile;