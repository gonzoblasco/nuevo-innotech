// ===================================================================
// 📁 ARCHIVO: src/app/(auth)/register/page.tsx
// ===================================================================
/**
 * Página de registro de la aplicación
 * 
 * Esta página renderiza el formulario de registro dentro del layout de autenticación.
 * Utiliza el grupo de rutas (auth) para aplicar el layout específico.
 */
import { Metadata } from 'next'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Crear Cuenta | InnoTech Solutions',
  description: 'Crea tu cuenta en InnoTech Solutions y accede a agentes conversacionales especializados'
}

export default function RegisterPage() {
  return <RegisterForm />
}