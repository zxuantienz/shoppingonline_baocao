import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center" style={{ marginTop: '20px', color: '#2c3e50', fontSize: '32px', fontWeight: 'bold' }}>
          BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <img 
            src="[https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop)" 
            width="800px" 
            style={{ borderRadius: '15px', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }} 
            alt="Welcome Admin" 
          />
        </div>
      </div>
    );
  }
}
export default Home;