// ===================================================================
// 📁 ARCHIVO: src/app/(auth)/login/page.tsx
// ===================================================================
/**
 * Página de login de la aplicación
 * 
 * Esta página renderiza el formulario de login dentro del layout de autenticación.
 * Utiliza el grupo de rutas (auth) para aplicar el layout específico.
 */
import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar Sesión | InnoTech Solutions',
  description: 'Inicia sesión en InnoTech Solutions para acceder a tu catálogo de agentes especializados'
}

export default function LoginPage() {
  return <LoginForm />
}