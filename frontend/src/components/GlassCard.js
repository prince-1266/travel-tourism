export default function GlassCard({ children }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-lg">
      {children}
    </div>
  );
}
