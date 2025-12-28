/**
 * 🔐 Módulo de Criptografia para Dados Sensíveis
 * 
 * Implementa criptografia AES-256 no front-end para proteger dados fiscais
 * durante simulações. Garante que informações sensíveis não fiquem expostas
 * no localStorage em texto plano.
 * 
 * @author LMartins (Product Manager) - SimpliTax
 */

import CryptoJS from 'crypto-js'

// Chave de criptografia (em produção, usar variável de ambiente)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'SimpliTax2026@LMTech$ecure'

/**
 * Criptografa dados fiscais sensíveis
 */
export function encryptData(data: any): string {
  try {
    const jsonString = JSON.stringify(data)
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
    return encrypted
  } catch (error) {
    console.error('Erro ao criptografar dados:', error)
    throw new Error('Falha na criptografia')
  }
}

/**
 * Descriptografa dados fiscais
 */
export function decryptData(encryptedData: string): any {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    
    if (!decryptedString) {
      throw new Error('Dados corrompidos ou chave inválida')
    }
    
    return JSON.parse(decryptedString)
  } catch (error) {
    console.error('Erro ao descriptografar dados:', error)
    throw new Error('Falha na descriptografia')
  }
}

/**
 * Salva dados criptografados no localStorage
 */
export function saveSecureData(key: string, data: any): void {
  if (typeof window === 'undefined') return
  
  try {
    const encrypted = encryptData(data)
    localStorage.setItem(`secure_${key}`, encrypted)
  } catch (error) {
    console.error('Erro ao salvar dados seguros:', error)
  }
}

/**
 * Carrega e descriptografa dados do localStorage
 */
export function loadSecureData(key: string): any | null {
  if (typeof window === 'undefined') return null
  
  try {
    const encrypted = localStorage.getItem(`secure_${key}`)
    if (!encrypted) return null
    
    return decryptData(encrypted)
  } catch (error) {
    console.error('Erro ao carregar dados seguros:', error)
    return null
  }
}

/**
 * Remove dados seguros do localStorage
 */
export function removeSecureData(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(`secure_${key}`)
  } catch (error) {
    console.error('Erro ao remover dados seguros:', error)
  }
}

/**
 * Valida integridade dos dados criptografados
 */
export function validateSecureData(key: string): boolean {
  try {
    const data = loadSecureData(key)
    return data !== null
  } catch {
    return false
  }
}

/**
 * Gera hash seguro para senha/PIN
 */
export function hashPassword(password: string): string {
  return CryptoJS.SHA256(password).toString()
}

/**
 * Verifica se hash de senha corresponde
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
