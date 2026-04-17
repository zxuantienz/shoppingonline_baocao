import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class Login extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { txtUsername: 'sonkk', txtPassword: '123' };
  }

  render() {
    return (
      <div style={{ backgroundColor: '#f3f4f6', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .login-card { 
            background: white; width: 100%; max-width: 450px; padding: 40px; 
            border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); 
            animation: fadeIn 0.5s ease-out;
          }
          .login-title { text-align: center; color: #111827; font-size: 28px; font-weight: 800; margin-bottom: 8px; }
          .login-sub { text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 30px; }
          .form-group { margin-bottom: 20px; }
          .form-label { display: block; font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 8px; }
          .form-input { 
            width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #d1d5db; 
            font-size: 15px; color: #1f2937; transition: all 0.2s; box-sizing: border-box;
          }
          .form-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
          .login-btn { 
            width: 100%; background-color: #2563eb; color: white; border: none; 
            padding: 14px; border-radius: 12px; font-weight: 700; font-size: 16px; 
            cursor: pointer; transition: all 0.3s; margin-top: 10px;
          }
          .login-btn:hover { background-color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
          .hint-box { background: #eff6ff; border-radius: 12px; padding: 15px; margin-bottom: 25px; border-left: 4px solid #2563eb; }
          .hint-text { font-size: 13px; color: #1e40af; margin: 0; line-height: 1.5; }
        `}</style>

        <div className="login-card">
          <h2 className="login-title">ĐĂNG NHẬP</h2>
          <p className="login-sub">Chào mừng bạn quay trở lại với MERN-SHOP</p>

          {/* Hộp gợi ý tài khoản */}
          <div className="hint-box">
            <p className="hint-text">
              <strong>Tài khoản dùng thử:</strong><br/>
              Username: <span style={{fontWeight: 'bold'}}>sonkk</span> / Password: <span style={{fontWeight: 'bold'}}>123</span>
            </p>
          </div>
          
          <form onSubmit={(e) => this.btnLoginClick(e)}>
            <div className="form-group">
              <label className="form-group">Tài khoản</label>
              <input type="text" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} className="form-input" placeholder="Nhập tên đăng nhập..." />
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu</label>
              <input type="password" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} className="form-input" placeholder="••••••••" />
            </div>

            <button type="submit" className="login-btn">ĐĂNG NHẬP NGAY</button>
          </form>
          
          <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            Chưa có tài khoản? <span style={{ color: '#2563eb', fontWeight: '700', cursor: 'pointer' }} onClick={() => this.props.navigate('/signup')}>Đăng ký ngay</span>
          </div>
        </div>
      </div>
    );
  }

  btnLoginClick(e) {
    e.preventDefault();
    const { txtUsername, txtPassword } = this.state;
    if (txtUsername && txtPassword) {
      this.apiLogin({ username: txtUsername, password: txtPassword });
    } else {
      alert('Vui lòng nhập tài khoản và mật khẩu!');
    }
  }

  apiLogin(account) {
    axios.post('http://localhost:3000/api/customer/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);
        this.props.navigate('/home');
      } else {
        alert(result.message);
      }
    });
  }
}
export default withRouter(Login);