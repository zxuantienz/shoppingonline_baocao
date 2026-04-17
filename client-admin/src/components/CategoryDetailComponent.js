import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = { txtID: '', txtName: '' };
  }

  render() {
    const inputStyle = { width: '100%', padding: '10px', margin: '8px 0', display: 'inline-block', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' };
    const btnStyle = { padding: '10px 15px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px', marginTop: '15px', transition: 'opacity 0.2s' };

    return (
      <div style={{ padding: '25px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', backgroundColor: 'white', borderTop: '4px solid #3498db' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '22px', marginBottom: '20px', textTransform: 'uppercase' }}>CHI TIẾT DANH MỤC</h2>
        <form>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold', color: '#555' }}>Mã Danh Mục (ID)</label>
            <input type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} style={{...inputStyle, backgroundColor: '#f9f9f9', color: '#888'}} placeholder="ID tự động sinh..." />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', color: '#555' }}>Tên Danh Mục</label>
            <input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} style={inputStyle} placeholder="Nhập tên danh mục..." />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            <input type="submit" value="THÊM MỚI" onClick={(e) => this.btnAddClick(e)} style={{...btnStyle, backgroundColor: '#2ecc71'}} />
            <input type="submit" value="CẬP NHẬT" onClick={(e) => this.btnUpdateClick(e)} style={{...btnStyle, backgroundColor: '#f39c12'}} />
            <input type="submit" value="XÓA" onClick={(e) => this.btnDeleteClick(e)} style={{...btnStyle, backgroundColor: '#e74c3c', marginRight: 0}} />
          </div>
        </form>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else { alert('Vui lòng nhập tên danh mục!'); }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else { alert('Vui lòng chọn danh mục và nhập tên mới!'); }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('BẠN CÓ CHẮC CHẮN MUỐN XÓA DANH MỤC NÀY?')) {
      const id = this.state.txtID;
      if (id) { this.apiDeleteCategory(id); } else { alert('Vui lòng chọn danh mục để xóa!'); }
    }
  }

  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('http://localhost:3000/api/admin/categories', cate, config).then((res) => {
      const result = res.data;
      if (result) { alert('Thêm mới thành công!'); this.apiGetCategories(); } else { alert('Lỗi hệ thống!'); }
    });
  }

  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('http://localhost:3000/api/admin/categories/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) { alert('Cập nhật thành công!'); this.apiGetCategories(); } else { alert('Lỗi hệ thống!'); }
    });
  }

  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('http://localhost:3000/api/admin/categories/' + id, config).then((res) => {
      const result = res.data;
      if (result) { alert('Xóa thành công!'); this.apiGetCategories(); this.setState({txtID: '', txtName: ''}); } else { alert('Lỗi hệ thống!'); }
    });
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('http://localhost:3000/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }
}
export default CategoryDetail;