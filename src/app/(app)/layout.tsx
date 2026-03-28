import { AppLayout } from '@/components/layout/AppLayout'
import { PasswordGate } from '@/components/layout/PasswordGate'

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <PasswordGate>
      <AppLayout>{children}</AppLayout>
    </PasswordGate>
  )
}
