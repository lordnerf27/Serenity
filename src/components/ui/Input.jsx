export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-stone-600 tracking-wide uppercase">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3.5 rounded-2xl bg-cream-100 border border-transparent
          text-stone-800 text-sm placeholder:text-stone-400
          focus:outline-none focus:border-sage-300 focus:bg-white transition-all duration-200
          ${error ? 'border-red-300' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
