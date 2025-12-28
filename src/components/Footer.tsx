/**
 * 🦶 Footer - Rodapé Universal do SimpliTax
 * 
 * Componente reutilizável com logo da LM Tech Consulting
 * para usar em todas as páginas do sistema.
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

'use client'

export default function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-gray-300 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center gap-4 pb-6">
          <a 
            href="https://grupolmtech.com.br/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://grupolmtech.com.br/images/logo_sem_bg.png" 
              alt="LM Tech Consulting" 
              className="h-12 object-contain"
            />
          </a>
          <p className="text-sm text-gray-600 text-center">
            Desenvolvido por{' '}
            <a 
              href="https://grupolmtech.com.br/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              LM Tech Consulting
            </a>
          </p>
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} SimpliTax. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
