import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { getMyAddresses, addAddress, deleteAddress } from '../api/orderAPI';
import { User, Mail, Shield, MapPin, Plus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const user = useSelector(selectUser);
  const [addresses, setAddresses] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    getMyAddresses()
      .then(res => setAddresses(res.data))
      .catch(() => {});
  };

  const onAddAddress = async (data) => {
    try {
      await addAddress(data);
      toast.success('Address added!');
      setShowAdd(false);
      reset();
      fetchAddresses();
    } catch (e) {
      toast.error('Failed to add address');
    }
  };

  const onDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await deleteAddress(id);
      toast.success('Address removed');
      fetchAddresses();
    } catch (e) {
      toast.error('Could not delete address');
    }
  };

  return (
    <div className="container" style={{ padding: '32px 24px 60px' }}>
      <h1 className="page-title" style={{ marginBottom: 32 }}>My Account</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32 }}>
        {/* User Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 32,
              fontWeight: 700,
              color: 'white',
            }}>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>{user?.username}</h2>
            <div className="text-sm text-muted">{user?.email}</div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <User size={16} className="text-primary" />
              <span>ID: #{user?.id}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <Mail size={16} className="text-primary" />
              <span>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
              <Shield size={16} className="text-primary" />
              <span>Roles: {user?.roles?.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} className="text-primary" /> Saved Addresses
              </h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAdd(!showAdd)}>
                <Plus size={14} /> Add New
              </button>
            </div>

            {addresses.length === 0 && !showAdd ? (
              <p className="text-muted text-sm">No saved addresses yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {addresses.map(addr => (
                  <div key={addr.addressId} className="card-glass" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="font-semibold">{addr.street}, {addr.buildingName}</div>
                      <div className="text-sm text-muted">{addr.city}, {addr.state} - {addr.pincode}, {addr.country}</div>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => onDeleteAddress(addr.addressId)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAdd && (
              <form onSubmit={handleSubmit(onAddAddress)} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Street</label>
                    <input className="form-input" {...register('street', { required: true, minLength: 5 })} placeholder="123 Street" />
                    {errors.street && <span className="form-error">Required</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Building Name</label>
                    <input className="form-input" {...register('buildingName', { required: true, minLength: 5 })} placeholder="Building / Apt" />
                    {errors.buildingName && <span className="form-error">Required</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" {...register('city', { required: true, minLength: 4 })} placeholder="City" />
                    {errors.city && <span className="form-error">Required</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" {...register('state', { required: true, minLength: 2 })} placeholder="State" />
                    {errors.state && <span className="form-error">Required</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input className="form-input" {...register('country', { required: true, minLength: 2 })} placeholder="Country" />
                    {errors.country && <span className="form-error">Required</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input className="form-input" {...register('pincode', { required: true, minLength: 6 })} placeholder="Pincode" />
                    {errors.pincode && <span className="form-error">Required</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary">Save Address</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
