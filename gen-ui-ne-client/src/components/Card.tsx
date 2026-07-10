interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <div className="px-6 py-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        {children}
      </div>
    </div>
  );
}
