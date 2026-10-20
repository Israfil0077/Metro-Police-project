// Shown only in the GitHub Pages build (VITE_DEMO=true), where there is no backend.
export default function DemoBanner() {
  if (import.meta.env.VITE_DEMO !== 'true') return null;

  return (
    <div
      style={{
        background: '#1e3a5f',
        color: '#fff',
        fontSize: '14px',
        padding: '8px 16px',
        textAlign: 'center',
        lineHeight: 1.5,
      }}
    >
      <strong>Live demo</strong> - this version runs without the backend, so nothing is saved.
      Log in with any password as <code>citizen@demo.com</code>, <code>officer@demo.com</code> or{' '}
      <code>admin@demo.com</code> to explore each dashboard.
    </div>
  );
}
