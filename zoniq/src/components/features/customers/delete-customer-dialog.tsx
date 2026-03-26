'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteCustomerDialogProps {
  customerId: string
  customerName: string
  hasLinkedApps: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCustomerDialog({
  customerId,
  customerName,
  hasLinkedApps,
  open,
  onOpenChange,
}: DeleteCustomerDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    const res = await fetch(`/api/customers/${customerId}`, { method: 'DELETE' })

    if (!res.ok) {
      const json = await res.json()
      toast.error(json.error?.message || 'Failed to delete customer')
      setIsDeleting(false)
      return
    }

    toast.success('Customer deleted')
    onOpenChange(false)
    router.push('/customers')
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            {hasLinkedApps
              ? `Cannot delete "${customerName}" because it has linked apps. Remove all apps first.`
              : `Are you sure you want to delete "${customerName}"? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {!hasLinkedApps && (
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? 'Deleting...' : 'Delete Customer'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
