import { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparkles, Globe, ThumbsUp, AlertTriangle, UserCheck, ShieldAlert } from 'lucide-react';

export default function AiProductInsights({ productId, compact = false }) {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    axios.get(`/api/public/products/${productId}/ai-insights`)
      .then(res => setInsight(res.data))
      .catch(() => setInsight(null))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div style={{ padding: 16, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', fontSize: 14, fontWeight: 600 }}>
          <Sparkles size={16} className="spinner" /> Analyzing Global Reviews & Climate Sentiment...
        </div>
      </div>
    );
  }

  if (!insight) return null;

  if (compact) {
    return (
      <div style={{
        padding: 14,
        background: 'linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(249,115,22,0.05) 100%)',
        border: '1px solid rgba(37,99,235,0.2)',
        borderRadius: 'var(--radius-md)',
        fontSize: 13,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', fontWeight: 700, marginBottom: 4 }}>
          <Sparkles size={14} /> AI Reality Check & Climate Fit
        </div>
        <div className="text-muted" style={{ marginBottom: 6 }}>
          {insight.overallSentiment}
        </div>
        {insight.regionalInsights && insight.regionalInsights.length > 0 && (
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
            <strong>Regional Insight:</strong> {insight.regionalInsights[0].region} ({insight.regionalInsights[0].rating}) — {insight.regionalInsights[0].feedback}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1.5px solid rgba(37,99,235,0.25)',
      borderRadius: 'var(--radius-xl)',
      padding: 24,
      boxShadow: 'var(--shadow-sm)',
      marginTop: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: 8, borderRadius: 'var(--radius-md)' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: 'var(--color-text-primary)' }}>
              AI Reality & Global Climate Fit Analysis
            </div>
            <div className="text-xs text-muted">
              Synthesized from 100+ global verified customer reviews & regional reports
            </div>
          </div>
        </div>
        <span className="badge badge-primary" style={{ fontSize: 12 }}>
          {insight.overallSentiment}
        </span>
      </div>

      {/* Regional / Climate Fit */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Globe size={16} className="text-primary" /> Regional & Climate Performance
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {insight.regionalInsights?.map((reg, idx) => (
            <div key={idx} style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span className="font-semibold" style={{ fontSize: 13 }}>{reg.region}</span>
                <span className="badge badge-success" style={{ fontSize: 11 }}>{reg.rating}</span>
              </div>
              <p className="text-xs text-muted" style={{ lineHeight: 1.4 }}>{reg.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pros & Dealbreakers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Top Praise */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <ThumbsUp size={14} /> What Buyers Loved Most
          </div>
          <ul style={{ paddingLeft: 16, fontSize: 13, color: '#166534', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {insight.topPraise?.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        {/* Common Dealbreakers */}
        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 'var(--radius-md)', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <AlertTriangle size={14} /> Common Dealbreakers & Notes
          </div>
          <ul style={{ paddingLeft: 16, fontSize: 13, color: '#92400e', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {insight.commonDealbreakers?.map((d, i) => <li key={i}>{d}</li>)}
          </ul>
        </div>
      </div>

      {/* Buyer Profiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
        <div style={{ background: 'var(--color-surface-2)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', marginBottom: 2 }}>
            <UserCheck size={14} /> Ideal For
          </div>
          <div className="text-muted">{insight.idealFor}</div>
        </div>
        <div style={{ background: 'var(--color-surface-2)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-error)', marginBottom: 2 }}>
            <ShieldAlert size={14} /> Not Recommended For
          </div>
          <div className="text-muted">{insight.notRecommendedFor}</div>
        </div>
      </div>
    </div>
  );
}
