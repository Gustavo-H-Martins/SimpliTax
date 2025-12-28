/**
 * 🎨 Logo SimpliTax - Conceito "Conector Ágil"
 * 
 * Logo moderna baseada na identidade visual LM Tech:
 * - Azul Profundo (#0F172A) - Confiança e Base
 * - Ciano Elétrico (#00B4D8) - Tecnologia e Agilidade
 * - Design minimalista com "nós de rede" conectados
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

import React from 'react'

interface LogoProps {
  size?: number
  showText?: boolean
  variant?: 'full' | 'icon'
  className?: string
}

export default function Logo({ 
  size = 40, 
  showText = true, 
  variant = 'full',
  className = '' 
}: LogoProps) {
  
  if (variant === 'icon') {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Círculos de conexão (nós da rede) */}
        <circle cx="20" cy="50" r="8" fill="#00B4D8" />
        <circle cx="50" cy="30" r="8" fill="#0F172A" />
        <circle cx="80" cy="50" r="8" fill="#00B4D8" />
        <circle cx="50" cy="70" r="8" fill="#0F172A" />
        
        {/* Linhas conectoras formando "S" estilizado */}
        <path 
          d="M 20 50 Q 35 30 50 30" 
          stroke="#00B4D8" 
          strokeWidth="4" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M 50 30 Q 65 30 80 50" 
          stroke="#0F172A" 
          strokeWidth="4" 
          fill="none"
          strokeLinecap="round"
        />
        <path 
          d="M 80 50 Q 65 70 50 70" 
          stroke="#00B4D8" 
          strokeWidth="4" 
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Seta de crescimento */}
        <path 
          d="M 75 25 L 85 15 L 85 25 Z" 
          fill="#00B4D8"
        />
        <line 
          x1="50" 
          y1="50" 
          x2="85" 
          y2="20" 
          stroke="#00B4D8" 
          strokeWidth="2"
          strokeDasharray="4 2"
        />
      </svg>
    )
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Ícone */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circular sutil */}
          <circle cx="50" cy="50" r="48" fill="#0F172A" opacity="0.05" />
          
          {/* Círculos de conexão */}
          <circle cx="20" cy="50" r="6" fill="#00B4D8" />
          <circle cx="50" cy="30" r="6" fill="#0F172A" />
          <circle cx="80" cy="50" r="6" fill="#00B4D8" />
          <circle cx="50" cy="70" r="6" fill="#0F172A" />
          
          {/* Linhas conectoras */}
          <path 
            d="M 20 50 Q 35 30 50 30" 
            stroke="#00B4D8" 
            strokeWidth="3" 
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M 50 30 Q 65 30 80 50" 
            stroke="#0F172A" 
            strokeWidth="3" 
            fill="none"
            strokeLinecap="round"
          />
          <path 
            d="M 80 50 Q 65 70 50 70" 
            stroke="#00B4D8" 
            strokeWidth="3" 
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Seta de crescimento */}
          <path 
            d="M 78 22 L 88 12 L 88 22 Z" 
            fill="#00B4D8"
          />
          <line 
            x1="55" 
            y1="45" 
            x2="88" 
            y2="17" 
            stroke="#00B4D8" 
            strokeWidth="2"
            strokeDasharray="3 2"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* Texto */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span 
            className="font-black tracking-tight"
            style={{ 
              fontSize: size * 0.5,
              background: 'linear-gradient(135deg, #0F172A 0%, #00B4D8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            SimpliTax
          </span>
          <span 
            className="text-gray-500 font-medium"
            style={{ fontSize: size * 0.2 }}
          >
            powered by LM Tech
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Logo alternativa - Conceito "Check Minimalista"
 */
export function LogoCheck({ size = 40, showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* L estilizado que vira check */}
          <path 
            d="M 20 20 L 20 80 L 45 80 L 50 75 L 85 40"
            stroke="#0F172A" 
            strokeWidth="8" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Check em destaque */}
          <path 
            d="M 40 65 L 50 75 L 85 40"
            stroke="#00B4D8" 
            strokeWidth="10" 
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Ponto de energia */}
          <circle cx="85" cy="40" r="5" fill="#00B4D8">
            <animate 
              attributeName="opacity" 
              values="1;0.3;1" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span 
            className="font-black tracking-tight"
            style={{ 
              fontSize: size * 0.5,
              color: '#0F172A'
            }}
          >
            SimpliTax
          </span>
          <span 
            className="font-medium"
            style={{ 
              fontSize: size * 0.2,
              color: '#00B4D8'
            }}
          >
            ✓ Problema Resolvido
          </span>
        </div>
      )}
    </div>
  )
}
