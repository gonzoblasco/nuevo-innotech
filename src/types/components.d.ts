// ===================================================================
// 📁 ARCHIVO: src/types/components.d.ts
// ===================================================================
/**
 * Declaraciones de tipos para componentes del dashboard
 * 
 * Este archivo resuelve problemas de TypeScript con las importaciones
 * de componentes personalizados y librerías externas.
 */

// Declaraciones para componentes del dashboard
declare module '@/components/dashboard/WelcomeSection' {
  interface User {
    id: string
    email: string | null
    full_name: string | null
    avatar_url: string | null
    created_at: string
  }

  interface WelcomeSectionProps {
    user: User | null
  }

  const WelcomeSection: React.FC<WelcomeSectionProps>
  export default WelcomeSection
}

declare module '@/components/dashboard/UsageStats' {
  interface UsageStatsProps {
    messagesUsed: number
    messagesLimit: number
    currentPlan: string
    sessionsCompleted: number
  }

  const UsageStats: React.FC<UsageStatsProps>
  export default UsageStats
}

declare module '@/components/dashboard/AgentCard' {
  const AgentCard: React.FC
  export default AgentCard
}

declare module '@/components/dashboard/RecentSessions' {
  interface Session {
    id: string
    agentName: string
    title: string
    lastMessage: string
    timestamp: Date
    status: 'active' | 'completed'
  }

  interface RecentSessionsProps {
    sessions: Session[]
  }

  const RecentSessions: React.FC<RecentSessionsProps>
  export default RecentSessions
}

// Declaraciones para componentes de layout
declare module '@/components/layout/DashboardLayout' {
  interface DashboardLayoutProps {
    children: React.ReactNode
  }

  const DashboardLayout: React.FC<DashboardLayoutProps>
  export default DashboardLayout
}

declare module '@/components/layout/Sidebar' {
  import { User } from '@supabase/supabase-js'

  interface SidebarProps {
    user: User
    isOpen: boolean
    onClose: () => void
  }

  const Sidebar: React.FC<SidebarProps>
  export default Sidebar
}

// Declaración para lucide-react si hay problemas
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  
  export interface LucideProps extends Partial<Omit<SVGProps<SVGSVGElement>, "ref">> {
    size?: string | number
    absoluteStrokeWidth?: boolean
  }

  export const Menu: FC<LucideProps>
  export const X: FC<LucideProps>
  export const LayoutDashboard: FC<LucideProps>
  export const MessageSquare: FC<LucideProps>
  export const History: FC<LucideProps>
  export const User: FC<LucideProps>
  export const Settings: FC<LucideProps>
  export const LogOut: FC<LucideProps>
  export const Sparkles: FC<LucideProps>
  export const Clock: FC<LucideProps>
  export const Calendar: FC<LucideProps>
  export const CreditCard: FC<LucideProps>
  export const Activity: FC<LucideProps>
  export const Trophy: FC<LucideProps>
  export const Brain: FC<LucideProps>
  export const ArrowRight: FC<LucideProps>
  export const Star: FC<LucideProps>
  export const CheckCircle: FC<LucideProps>
  export const Play: FC<LucideProps>
  export const Eye: FC<LucideProps>
}