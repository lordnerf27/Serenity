export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'w-full py-3.5 rounded-2xl font-medium text-sm tracking-wide transition-all duration-200 active:scale-[0.98]'

  const variants = {
    primary:  'bg-sage-400 text-white shadow-soft hover:bg-sage-500',
    ghost:    'bg-cream-100 text-stone-600 hover:bg-cream-200',
    outline:  'border border-sage-300 text-sage-500 bg-transparent hover:bg-sage-300/10',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
