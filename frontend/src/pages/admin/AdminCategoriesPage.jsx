import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories } from '../../store/productSlice';
import { createCategory, updateCategory, deleteCategory } from '../../api/productAPI';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, X, Tags } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminCategoriesPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [editCategory, setEditCategory] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchCategories({ pageSize: 100 }));
  }, [dispatch]);

  const openAdd = () => { reset(); setEditCategory(null); setModal('add'); };
  const openEdit = (c) => {
    setEditCategory(c);
    setValue('categoryName', c.categoryName);
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditCategory(null); reset(); };

  const onSubmit = async (data) => {
    try {
      if (modal === 'add') {
        await createCategory({ categoryName: data.categoryName });
        toast.success('Category created!');
      } else {
        await updateCategory(editCategory.categoryId, { categoryName: data.categoryName });
        toast.success('Category updated!');
      }
      dispatch(fetchCategories({ pageSize: 100 }));
      closeModal();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (categoryId, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(categoryId);
      toast.success('Category deleted');
      dispatch(fetchCategories({ pageSize: 100 }));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not delete category');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>Categories</h1>
          <p className="text-muted text-sm">{categories.length} categories total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: 32 }} className="text-muted">
                  No categories found. Create your first category above.
                </td>
              </tr>
            ) : (
              categories.map(c => (
                <tr key={c.categoryId}>
                  <td>#{c.categoryId}</td>
                  <td>
                    <span className="font-semibold">{c.categoryName}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.categoryId, c.categoryName)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'add' ? 'Add Category' : 'Edit Category'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={closeModal}><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. Electronics, Fashion"
                  {...register('categoryName', { required: true, minLength: 5 })}
                />
                {errors.categoryName && <span className="form-error">Category name must be at least 5 characters</span>}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {modal === 'add' ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
