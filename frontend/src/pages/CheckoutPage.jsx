import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createOrder, selectOrdersLoading } from '../store/orderSlice';
import { fetchCart, selectCartItems, selectCartTotal } from '../store/cartSlice';
import { getMyAddresses, addAddress } from '../api/orderAPI';
import { CreditCard, MapPin, Plus, Check } from 'lucide-react';

const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { value: 'CARD', label: 'Credit/Debit Card', icon: '💳' },
  { value: 'UPI', label: 'UPI Payment', icon: '📱' },
  { value: 'NETBANKING', label: 'Net Banking', icon: '🏦' },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const loading = useSelector(selectOrdersLoading);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchCart());
    getMyAddresses().then(res => {
      setAddresses(res.data);
      if (res.data.length > 0) setSelectedAddress(res.data[0].addressId);
    }).catch(() => {});
  }, []);

  const onAddAddress = async (data) => {
    try {
      const res = await addAddress(data);
      setAddresses(prev => [...prev, res.data]);
      setSelectedAddress(res.data.addressId);
      setShowAddAddress(false);
      reset();
    } catch (e) { console.error(e); }
  };

  const onPlaceOrder = async () => {
    if (!selectedAddress) { alert('Please select a delivery address'); return; }
    const result = await dispatch(createOrder({
      paymentMethod,
      addressId: selectedAddress,
      pgDetails: { pgName: 'Manual', pgPaymentId: `PG${Date.now()}`, pgStatus: 'COMPLETED', pgResponseMessage: 'Payment successful' },
    }));
    if (createOrder.fulfilled.match(result)) {
      navigate('/orders');
    }
  };

  const shipping = total >= 500 ? 0 : 49;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container" style={{ padding: '32px 24px 60px' }}>
      <h1 className="page-title" style={{ marginBottom: 32 }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Delivery Address */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} style={{ color: 'var(--color-primary)' }} /> Delivery Address
              </h2>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddAddress(!showAddAddress)}>
                <Plus size={14} /> Add New
              </button>
            </div>

            {addresses.length === 0 && !showAddAddress && (
              <div className="text-muted text-sm" style={{ marginBottom: 12 }}>
                No saved addresses. Add one below.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {addresses.map(addr => (
                <div
                  key={addr.addressId}
                  onClick={() => setSelectedAddress(addr.addressId)}
                  style={{
                    padding: 16,
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${selectedAddress === addr.addressId ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: selectedAddress === addr.addressId ? 'var(--color-primary-light)' : 'var(--color-surface-2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    {selectedAddress === addr.addressId && <Check size={16} style={{ color: 'var(--color-primary)' }} />}
                    <span className="font-semibold" style={{ fontSize: 14 }}>{addr.street}, {addr.buildingName}</span>
                  </div>
                  <div className="text-sm text-muted">{addr.city}, {addr.state} - {addr.pincode}, {addr.country}</div>
                </div>
              ))}
            </div>

            {showAddAddress && (
              <form onSubmit={handleSubmit(onAddAddress)} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Street</label>
                    <input className="form-input" {...register('street', { required: true, minLength: 5 })} placeholder="123 Main Street" />
                    {errors.street && <span className="form-error">Required (min 5 chars)</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Building Name</label>
                    <input className="form-input" {...register('buildingName', { required: true, minLength: 5 })} placeholder="Apt / Building" />
                    {errors.buildingName && <span className="form-error">Required (min 5 chars)</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" {...register('city', { required: true, minLength: 4 })} placeholder="Mumbai" />
                    {errors.city && <span className="form-error">Required</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" {...register('state', { required: true, minLength: 2 })} placeholder="Maharashtra" />
                    {errors.state && <span className="form-error">Required</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input className="form-input" {...register('country', { required: true, minLength: 2 })} placeholder="India" />
                    {errors.country && <span className="form-error">Required</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input className="form-input" {...register('pincode', { required: true, minLength: 6 })} placeholder="400001" />
                    {errors.pincode && <span className="form-error">Required (6 digits)</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" className="btn btn-primary">Save Address</button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowAddAddress(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Payment Method */}
          <div className="card">
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={18} style={{ color: 'var(--color-primary)' }} /> Payment Method
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {PAYMENT_METHODS.map(pm => (
                <div
                  key={pm.value}
                  onClick={() => setPaymentMethod(pm.value)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${paymentMethod === pm.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: paymentMethod === pm.value ? 'var(--color-primary-light)' : 'var(--color-surface-2)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{pm.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{pm.label}</span>
                  {paymentMethod === pm.value && <Check size={14} style={{ color: 'var(--color-primary)', marginLeft: 'auto' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(item => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span className="text-muted">{item.productName} × {item.quantity}</span>
                <span>₹{((item.specialPrice || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span className="text-muted">Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span className="text-muted">Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--color-success)' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : `₹${shipping}`}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
              <span>Total</span>
              <span style={{ color: 'var(--color-primary)' }}>₹{(total + shipping).toFixed(2)}</span>
            </div>
          </div>

          <div style={{ marginTop: 8, padding: 12, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
            <div>Payment: <strong>{PAYMENT_METHODS.find(p => p.value === paymentMethod)?.label}</strong></div>
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 16 }}
            onClick={onPlaceOrder}
            disabled={loading || !selectedAddress}
          >
            {loading ? 'Placing Order...' : '🎉 Place Order'}
          </button>

          <p className="text-xs text-muted" style={{ textAlign: 'center', marginTop: 12 }}>
            🔒 Your payment information is secure
          </p>
        </div>
      </div>
    </div>
  );
}
