// ===================================================================
// 📁 ARCHIVO: src/app/(dashboard)/layout.tsx
// ===================================================================
/**
 * Layout principal para todas las rutas protegidas del dashboard
 * 
 * Características:
 * - Utiliza el componente DashboardLayout
 * - Aplica metadata específica del dashboard
 * - Integra verificación de autenticación
 */
import { Metadata } from 'next'
import DashboardLayout from '@/components/layout/DashboardLayout'

export const metadata: Metadata = {
  title: 'Dashboard | InnoTech Solutions',
  description: 'Tu centro de control para agentes conversacionales especializados'
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: DashboardLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>
}