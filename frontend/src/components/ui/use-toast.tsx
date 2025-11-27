import * as React from "react"

export type ToastVariant = "default" | "destructive"

type Toast = {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type ToastContextType = {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismissToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback(({ duration = 5000, ...props }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)

    setToasts((prevToasts) => [...prevToasts, { id, ...props }])

    if (duration) {
      setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((toast) => toast.id !== id)
        )
      }, duration)
    }
  }, [])

  const dismissToast = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: string) => void
}) {
  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col p-4 space-y-2 max-h-screen overflow-hidden">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const { id, title, description, variant = "default" } = toast

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [id, onDismiss, toast.duration])

  return (
    <div
      className={`relative flex flex-col p-4 rounded-lg shadow-lg min-w-[300px] max-w-md ${variant === "destructive"
          ? "bg-red-100 text-red-900"
          : "bg-white text-gray-900"
        }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={() => onDismiss(id)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
    </div>
  )
}
