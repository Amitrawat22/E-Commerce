import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories, selectProducts, selectCategories, selectPagination, selectProductsLoading } from '../../store/productSlice';
import { addProduct, updateProduct, deleteProduct, updateProductImage } from '../../api/productAPI';
import { useForm } from 'react-hook-form';
import Pagination from '../../components/Pagination';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '../../utils/productImages';

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const categories = useSelector(selectCategories);
  const pagination = useSelector(selectPagination);
  const loading = useSelector(selectProductsLoading);
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editProduct, setEditProduct] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchProducts({ pageNumber: page, pageSize: 10 }));
    dispatch(fetchCategories({ pageSize: 50 }));
  }, [dispatch, page]);

  const openAdd = () => { reset(); setEditProduct(null); setSelectedFile(null); setModal('add'); };
  const openEdit = (p) => {
    setEditProduct(p);
    setSelectedFile(null);
    Object.entries(p).forEach(([k, v]) => setValue(k, v));
    setValue('categoryId', p.categoryId);
    setValue('image', p.image || '');
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditProduct(null); setSelectedFile(null); reset(); };

  const onSubmit = async (data) => {
    try {
      const payload = {
        productName: data.productName,
        description: data.description,
        price: parseFloat(data.price),
        discount: parseFloat(data.discount || 0),
        quantity: parseInt(data.quantity),
        image: data.image ? data.image.trim() : 'default.png',
      };

      let saved;
      if (modal === 'add') {
        const res = await addProduct(data.categoryId, payload);
        saved = res.data;
        toast.success('Product added successfully!');
      } else {
        const res = await updateProduct(editProduct.productId, payload);
        saved = res.data;
        toast.success('Product updated successfully!');
      }

      // If user uploaded a local image file
      if (selectedFile && saved && saved.productId) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        await updateProductImage(saved.productId, formData);
        toast.success('Product image uploaded!');
      }

      dispatch(fetchProducts({ pageNumber: page, pageSize: 10 }));
      closeModal();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (productId, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(productId);
      toast.success('Product deleted');
      dispatch(fetchProducts({ pageNumber: page, pageSize: 10 }));
    } catch (e) {
      toast.error('Could not delete product');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>Product Management</h1>
          <p className="text-muted text-sm">{pagination.totalElements} products total in database</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add New Product
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Special Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const imgUrl = getProductImageUrl(p);
                return (
                  <tr key={p.productId}>
                    <td>
                      <img
                        src={imgUrl}
                        alt={p.productName}
                        style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: 'var(--color-surface-2)' }}
                        onError={(e) => { e.target.src = `https://picsum.photos/seed/${p.productId}/60/60`; }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.productName}</div>
                      <div className="text-xs text-muted" style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.description}
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{p.categoryName || '—'}</span></td>
                    <td>₹{p.price?.toFixed(2)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>₹{p.specialPrice?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.quantity > 10 ? 'badge-success' : p.quantity > 0 ? 'badge-warning' : 'badge-error'}`}>
                        {p.quantity} left
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.productId, p.productName)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'add' ? 'Add New Product' : 'Edit Product'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" {...register('categoryId', { required: true })}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                </select>
                {errors.categoryId && <span className="form-error">Please select a category</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input className="form-input" placeholder="e.g. Wireless Noise-Canceling Headphones" {...register('productName', { required: true, minLength: 3 })} />
                {errors.productName && <span className="form-error">Product name is required (min 3 chars)</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Internet Link) or Upload File</label>
                <input className="form-input" placeholder="https://images.unsplash.com/... or paste image URL" {...register('image')} style={{ marginBottom: 6 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                    <Upload size={14} /> Choose File
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setSelectedFile(e.target.files[0])} />
                  </label>
                  <span className="text-xs text-muted">{selectedFile ? selectedFile.name : 'No local file chosen'}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Detailed product specifications and features..." {...register('description', { required: true, minLength: 6 })} />
                {errors.description && <span className="form-error">Description is required (min 6 chars)</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" step="0.01" className="form-input" placeholder="1499.00" {...register('price', { required: true, min: 0 })} />
                  {errors.price && <span className="form-error">Required</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input type="number" step="0.01" className="form-input" placeholder="10" {...register('discount', { min: 0, max: 100 })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity</label>
                  <input type="number" className="form-input" placeholder="25" {...register('quantity', { required: true, min: 0 })} />
                  {errors.quantity && <span className="form-error">Required</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {modal === 'add' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
