import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext;
  constructor(props) {
    super(props);
    this.state = {
      categories: [], txtID: '', txtName: '', txtPrice: '', cmbCategory: '', imgProduct: '',
    };
  }

  render() {
    const cates = this.state.categories.map((cate) => {
      if (this.props.item != null) {
        return (<option key={cate._id} value={cate._id} selected={cate._id === this.props.item.category._id}>{cate.name}</option>);
      } else {
        return (<option key={cate._id} value={cate._id}>{cate.name}</option>);
      }
    });

    const inputStyle = { width: '100%', padding: '10px', margin: '6px 0 15px', display: 'inline-block', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontFamily: 'inherit' };
    const btnStyle = { padding: '10px 12px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '8px', transition: 'opacity 0.2s', flex: 1 };

    return (
      <div style={{ padding: '25px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)', backgroundColor: 'white', borderTop: '4px solid #9b59b6' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '22px', marginBottom: '20px', textTransform: 'uppercase' }}>CHI TIẾT SẢN PHẨM</h2>
        <form>
          <div>
            <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>Mã SP (ID)</label>
            <input type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} style={{...inputStyle, backgroundColor: '#f9f9f9', color: '#888', marginBottom: '10px'}} placeholder="Tự động sinh..." />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>Tên sản phẩm</label>
            <input type="text" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} style={{...inputStyle, marginBottom: '10px'}} placeholder="Nhập tên SP..." />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>Đơn giá (VNĐ)</label>
            <input type="number" value={this.state.txtPrice} onChange={(e) => { this.setState({ txtPrice: e.target.value }) }} style={{...inputStyle, marginBottom: '10px'}} placeholder="Nhập giá tiền..." />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>Danh mục</label>
            <select onChange={(e) => { this.setState({ cmbCategory: e.target.value }) }} style={{...inputStyle, marginBottom: '10px'}}>{cates}</select>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', color: '#555', fontSize: '14px' }}>Hình ảnh</label>
            <input type="file" name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={(e) => this.previewImage(e)} style={{...inputStyle, border: 'none', padding: '10px 0', marginBottom: '5px'}} />
            {this.state.imgProduct && <div style={{ textAlign: 'center', marginBottom: '15px' }}><img src={this.state.imgProduct} width="150px" height="150px" style={{ objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', border: '2px solid #eee' }} alt="" /></div>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <input type="submit" value="THÊM" onClick={(e) => this.btnAddClick(e)} style={{...btnStyle, backgroundColor: '#2ecc71'}} />
            <input type="submit" value="CẬP NHẬT" onClick={(e) => this.btnUpdateClick(e)} style={{...btnStyle, backgroundColor: '#f39c12'}} />
            <input type="submit" value="XÓA" onClick={(e) => this.btnDeleteClick(e)} style={{...btnStyle, backgroundColor: '#e74c3c', marginRight: 0}} />
          </div>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image
      });
    }
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      }
      reader.readAsDataURL(file);
    }
  }

  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
    if (name && price && category && image) {
      const prod = { name: name, price: price, category: category, image: image };
      this.apiPostProduct(prod);
    } else { alert('Vui lòng nhập đầy đủ thông tin sản phẩm và hình ảnh!'); }
  }

  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');
    if (id && name && price && category && image) {
      const prod = { name: name, price: price, category: category, image: image };
      this.apiPutProduct(id, prod);
    } else { alert('Vui lòng chọn sản phẩm và nhập đầy đủ thông tin!'); }
  }

  btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('BẠN CÓ CHẮC CHẮN MUỐN XÓA SẢN PHẨM NÀY?')) {
      const id = this.state.txtID;
      if (id) { this.apiDeleteProduct(id); } else { alert('Vui lòng chọn sản phẩm để xóa!'); }
    }
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('http://localhost:3000/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }

  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('http://localhost:3000/api/admin/products', prod, config).then((res) => {
      const result = res.data;
      if (result) { alert('Thêm mới thành công!'); this.apiGetProducts(); } else { alert('Lỗi hệ thống!'); }
    });
  }

  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('http://localhost:3000/api/admin/products/' + id, prod, config).then((res) => {
      const result = res.data;
      if (result) { alert('Cập nhật thành công!'); this.apiGetProducts(); } else { alert('Lỗi hệ thống!'); }
    });
  }

  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('http://localhost:3000/api/admin/products/' + id, config).then((res) => {
      const result = res.data;
      if (result) { 
        alert('Xóa thành công!'); 
        this.setState({txtID: '', txtName: '', txtPrice: '', imgProduct: ''});
        this.apiGetProducts(); 
      } else { alert('Lỗi hệ thống!'); }
    });
  }

  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('http://localhost:3000/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages);
      } else {
        axios.get('http://localhost:3000/api/admin/products?page=' + (this.props.curPage - 1), config).then((res) => {
          const result = res.data;
          this.props.updateProducts(result.products, result.noPages);
        });
      }
    });
  }
}
export default ProductDetail;
