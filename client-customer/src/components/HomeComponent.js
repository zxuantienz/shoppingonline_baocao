import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { newprods: [], hotprods: [] };
  }

  render() {
    const renderProd = (item, badgeLabel, badgeColor) => {
      if (!item) return null;
      return (
        <div key={item._id} className="product-card">
          <Link to={'/product/' + item._id} style={{ textDecoration: 'none' }}>
            <div className="img-wrapper">
              {badgeLabel && <span className="badge" style={{ backgroundColor: badgeColor }}>{badgeLabel}</span>}
              <img src={"data:image/jpg;base64," + item.image} alt={item.name} />
            </div>
            <div className="prod-info">
              <span className="category-tag">{item.category?.name}</span>
              <h3 className="prod-name">{item.name}</h3>
              <div className="price-row">
                <p className="prod-price">{(item.price || 0).toLocaleString('vi-VN')} đ</p>
                <span className="sold-count">Đã bán 1.2k</span>
              </div>
              <button className="buy-now-btn">XEM CHI TIẾT</button>
            </div>
          </Link>
        </div>
      );
    };

    return (
      <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh', paddingBottom: '80px', fontFamily: '"Inter", sans-serif' }}>
        <style>{`
          /* Banner & Hero */
          .hero-banner { 
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); 
            color: white; padding: 100px 20px; text-align: center; 
            position: relative; overflow: hidden;
          }
          .hero-banner::before {
            content: ""; position: absolute; top: -50%; left: -10%; width: 40%; height: 200%;
            background: rgba(255,255,255,0.05); transform: rotate(30deg);
          }
          .hero-title { font-size: 56px; font-weight: 900; margin-bottom: 20px; letter-spacing: -2px; text-shadow: 0 4px 10px rgba(0,0,0,0.2); }
          .hero-sub { font-size: 20px; opacity: 0.95; max-width: 700px; margin: 0 auto; line-height: 1.6; }

          /* Features Section */
          .features-bar { 
            display: flex; justify-content: space-around; background: white; 
            padding: 30px; margin: -40px auto 50px; max-width: 1100px; 
            border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            position: relative; z-index: 10;
          }
          .feature-item { text-align: center; flex: 1; border-right: 1px solid #f0f0f0; }
          .feature-item:last-child { border: none; }
          .feature-icon { font-size: 28px; margin-bottom: 10px; display: block; }
          .feature-text { font-weight: 700; color: #1e293b; font-size: 14px; }
          .feature-sub { font-size: 12px; color: #64748b; margin-top: 4px; display: block; }
          
          /* Section Layout */
          .section-container { max-width: 1240px; margin: 0 auto; padding: 0 20px; }
          .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 35px; }
          .section-title { font-size: 30px; font-weight: 850; color: #0f172a; position: relative; padding-bottom: 10px; }
          .section-title::after { content: ""; position: absolute; bottom: 0; left: 0; width: 60px; height: 5px; background: #3b82f6; border-radius: 10px; }
          
          /* Products Grid */
          .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; margin-bottom: 80px; }
          
          /* Product Card */
          .product-card { 
            background: white; border-radius: 24px; overflow: hidden; 
            box-shadow: 0 10px 20px rgba(0,0,0,0.03); 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            border: 1px solid #edf2f7; position: relative;
          }
          .product-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); border-color: #3b82f6; }
          
          .img-wrapper { width: 100%; height: 280px; overflow: hidden; background: #f8fafc; position: relative; }
          .img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
          .product-card:hover img { transform: scale(1.1); }
          
          .badge { 
            position: absolute; top: 15px; left: 15px; color: white; padding: 6px 12px; 
            border-radius: 10px; font-size: 11px; font-weight: 800; z-index: 5; text-transform: uppercase;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          }
          
          .prod-info { padding: 25px; }
          .category-tag { font-size: 12px; font-weight: 700; color: #6366f1; background: #eef2ff; padding: 5px 12px; border-radius: 8px; }
          .prod-name { font-size: 19px; font-weight: 800; color: #1e293b; margin: 15px 0 10px; height: 50px; overflow: hidden; }
          
          .price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
          .prod-price { font-size: 22px; font-weight: 900; color: #ef4444; margin: 0; }
          .sold-count { font-size: 12px; color: #94a3b8; }
          
          .buy-now-btn { 
            width: 100%; background: #f1f5f9; color: #1e293b; border: none; padding: 14px; 
            border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.3s;
            font-size: 14px;
          }
          .product-card:hover .buy-now-btn { background: #3b82f6; color: white; }
        `}</style>

        {/* HERO SECTION */}
        <div className="hero-banner">
          <h1 className="hero-title">SIÊU THỊ CÔNG NGHỆ MERN</h1>
          <p className="hero-sub">Nâng tầm trải nghiệm sống của bạn với những thiết bị công nghệ đỉnh cao, bảo hành chính hãng và mức giá không thể tốt hơn.</p>
        </div>

        {/* FEATURES BAR */}
        <div className="features-bar">
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <span className="feature-text">GIAO SIÊU TỐC</span>
            <span className="feature-sub">Nội thành trong 2h</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <span className="feature-text">CHÍNH HÃNG 100%</span>
            <span className="feature-sub">Hoàn tiền 200% nếu giả</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔄</span>
            <span className="feature-text">ĐỔI TRẢ 30 NGÀY</span>
            <span className="feature-sub">Lỗi là đổi mới ngay</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📞</span>
            <span className="feature-text">HỖ TRỢ 24/7</span>
            <span className="feature-sub">Giải đáp mọi thắc mắc</span>
          </div>
        </div>

        <div className="section-container">
          {/* NEW PRODUCTS */}
          <div className="section-header">
            <h2 className="section-title">SẢN PHẨM MỚI NHẤT</h2>
            <Link to="/" style={{ color: '#3b82f6', fontWeight: '700', textDecoration: 'none' }}>Xem tất cả →</Link>
          </div>
          <div className="products-grid">
            {this.state.newprods.map(item => renderProd(item, "NEW", "#10b981"))}
          </div>

          {/* HOT PRODUCTS */}
          {this.state.hotprods.length > 0 && (
            <>
              <div className="section-header">
                <h2 className="section-title">SẢN PHẨM BÁN CHẠY</h2>
                <Link to="/" style={{ color: '#3b82f6', fontWeight: '700', textDecoration: 'none' }}>Xem tất cả →</Link>
              </div>
              <div className="products-grid">
                {this.state.hotprods.map(item => renderProd(item, "HOT 🔥", "#f59e0b"))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  componentDidMount() { this.apiGetNewProducts(); this.apiGetHotProducts(); }
  apiGetNewProducts() { axios.get('http://localhost:3000/api/customer/products/new').then((res) => { this.setState({ newprods: res.data }); }); }
  apiGetHotProducts() { axios.get('http://localhost:3000/api/customer/products/hot').then((res) => { this.setState({ hotprods: res.data }); }); }
}
export default Home;