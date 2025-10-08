import type { Metadata } from 'next'
import '@/globals.css'
export const metadata: Metadata = {
  title: 'PagueAqui - Sistema de Folha de Pagamento',
  description: 'Sistema de gestão de folha de pagamento para auxiliar empresas no cálculo de salários, benefícios, encargos e descontos.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  )
}