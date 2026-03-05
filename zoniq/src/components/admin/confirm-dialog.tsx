'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
  confirmVariant?: 'danger' | 'default'
  onConfirm: () => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  confirmVariant = 'default',
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={isLoading ? undefined : onCancel}
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-lg font-semibold text-[#2D1810] mb-2">{title}</h2>
        <p className="text-sm text-[#5C5C5C] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-[#5C5C5C] bg-[#F5F5F4] rounded-lg hover:bg-[#E8E4E0] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
              confirmVariant === 'danger' 
                ? 'bg-[#DC2626] hover:bg-[#B91C1C]' 
                : 'bg-[#FF6B35] hover:bg-[#E55A2B]'
            }`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

interface DeactivateConfirmDialogProps {
  isOpen: boolean
  userName: string
  onConfirm: () => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function DeactivateConfirmDialog({
  isOpen,
  userName,
  onConfirm,
  onCancel,
  isLoading,
}: DeactivateConfirmDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Deactivate User"
      message={`Are you sure you want to deactivate ${userName}? They will be immediately signed out and cannot log in again until reactivated.`}
      confirmLabel="Deactivate"
      confirmVariant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  )
}

interface ReactivateConfirmDialogProps {
  isOpen: boolean
  userName: string
  onConfirm: () => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function ReactivateConfirmDialog({
  isOpen,
  userName,
  onConfirm,
  onCancel,
  isLoading,
}: ReactivateConfirmDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="Reactivate User"
      message={`Are you sure you want to reactivate ${userName}? They will be able to log in again.`}
      confirmLabel="Reactivate"
      confirmVariant="default"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  )
}
