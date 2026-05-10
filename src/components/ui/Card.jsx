export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-cream-100 rounded-3xl shadow-soft p-4 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-150' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
