interface PromptCardProps {
  title: string
  message: string
  action?: string
}

export function PromptCard({ title, message, action }: PromptCardProps) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-5 shadow-sm">
      <p className="font-semibold text-green-900">{title}</p>
      <p className="mt-1 text-sm text-green-800">{message}</p>
      {action && (
        <button className="mt-3 rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700">
          {action}
        </button>
      )}
    </div>
  )
}
