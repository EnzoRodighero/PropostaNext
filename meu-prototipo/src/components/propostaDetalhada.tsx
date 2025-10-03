'use client'

// Removido import Link

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

// Interface para definir o tipo de uma proposta
interface Proposta {
  id: number;
  titulo: string;
  dt_proposta?: string;
  validade?: string;
  cliente?: string;
  apresentacao?: string;
  escopo?: string;
  req_funcional?: string;
  req_nao_funcional?: string;
  investimento?: string;
  condicao_comercial?: string;
  garantia?: string;
}

export default function PropostaDetalhada() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [proposta, setProposta] = useState<Proposta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para converter data para formato por extenso
  const formatarDataPorExtenso = (data: string) => {
    if (!data) return 'Não informado'
    
    try {
      // Assumindo formato DD/MM/AAAA
      const [dia, mes, ano] = data.split('/')
      
      const meses = [
        'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
        'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
      ]
      
      const mesIndex = parseInt(mes) - 1
      const nomeMes = meses[mesIndex] || 'mês inválido'
      
      return `${dia} de ${nomeMes} de ${ano}`
    } catch (error) {
      return data // Retorna a data original se houver erro
    }
  }

  // Função para formatar data no formato DD/M/AAAA
  const formatarDataSimples = (data: string) => {
    if (!data) return 'Não informado'
    
    try {
      // Verifica se é formato ISO (2025-09-24T14:06:26.385171-03:00)
      if (data.includes('T')) {
        const dateObj = new Date(data)
        const dia = dateObj.getDate()
        const mes = dateObj.getMonth() + 1 // getMonth() retorna 0-11
        const ano = dateObj.getFullYear()
        
        return `${dia}/${mes}/${ano}`
      }
      
      // Se for formato DD/MM/AAAA
      const [dia, mes, ano] = data.split('/')
      
      // Remove o zero à esquerda do mês se houver
      const mesFormatado = parseInt(mes).toString()
      
      return `${dia}/${mesFormatado}/${ano}`
    } catch (error) {
      return 'Data inválida'
    }
  }

  useEffect(() => {
    const carregarProposta = async () => {
      try {
        const response = await fetch('/api/propostas')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar propostas')
        }

        const propostas: Proposta[] = await response.json()
        const propostaEncontrada = propostas.find((p: Proposta) => p.id === parseInt(id || '0'))
        
        setProposta(propostaEncontrada || null)
      } catch (error) {
        console.error('Erro ao carregar proposta:', error)
        setError('Erro ao carregar dados da proposta')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      carregarProposta()
    } else {
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando proposta...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro</h1>
            <p className="text-gray-600 mb-6">{error}</p>
              <a href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                ← Voltar para lista de propostas
              </a>
          </div>
        </div>
      </div>
    )
  }

  if (!proposta) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-yellow-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Proposta não encontrada</h1>
            <p className="text-gray-600 mb-6">A proposta solicitada não existe.</p>
              <a href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                ← Voltar para lista de propostas
              </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:p-8">
      <div className="bg-white rounded-lg shadow max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="rounded-t-lg p-4 sm:p-6 mb-6 relative" style={{backgroundColor: '#042160'}}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Proposta Comercial:</h1>
              <p className="text-white text-lg sm:text-xl lg:text-2xl mb-2 break-words">{proposta.titulo}</p>
              <p className="text-white text-base sm:text-lg lg:text-xl">Cliente: {proposta.cliente || 'Não informado'}</p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-white text-sm sm:text-base">Data: {formatarDataSimples(proposta.dt_proposta || '')}</p>
            </div>
          </div>
          
          {/* Botão PDF */}
          <div className="absolute bottom-4 right-4">
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={async () => {
                if (!proposta?.id) {
                  alert('ID da proposta não encontrado');
                  return;
                }

                try {
                  console.log(`Fazendo download do PDF da proposta ${proposta.id}...`);
                  
                  const response = await fetch(`/api/propostas/pdf?id=${proposta.id}`);
                  
                  if (!response.ok) {
                    // Tentar ler a resposta como texto primeiro
                    let errorMessage = 'Erro ao baixar PDF';
                    try {
                      const contentType = response.headers.get('content-type');
                      if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                      } else {
                        const errorText = await response.text();
                        errorMessage = errorText || `Erro ${response.status}: ${response.statusText}`;
                      }
                    } catch {
                      errorMessage = `Erro ${response.status}: ${response.statusText}`;
                    }
                    throw new Error(errorMessage);
                  }

                  // Verificar se a resposta é realmente um PDF
                  const contentType = response.headers.get('content-type');
                  if (!contentType || !contentType.includes('application/pdf')) {
                    throw new Error('A resposta não é um arquivo PDF válido');
                  }

                  // Converter a resposta em blob
                  const blob = await response.blob();
                  
                  // Criar URL para download
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `proposta-${proposta.id}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  
                  // Limpar recursos
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  
                  console.log('Download do PDF concluído com sucesso');
                } catch (error) {
                  console.error('Erro ao baixar PDF:', error);
                  
                  // Mensagem de erro mais específica baseada no tipo de erro
                  let errorMessage = 'Erro desconhecido ao baixar PDF';
                  
                  if (error instanceof Error) {
                    if (error.message.includes('fetch')) {
                      errorMessage = 'Erro de conexão. Verifique se o servidor está rodando.';
                    } else if (error.message.includes('JSON')) {
                      errorMessage = 'Erro no formato da resposta do servidor.';
                    } else if (error.message.includes('PDF')) {
                      errorMessage = 'A resposta do servidor não é um arquivo PDF válido.';
                    } else {
                      errorMessage = error.message;
                    }
                  }
                  
                  alert(`Erro ao baixar PDF: ${errorMessage}`);
                }
              }}
              disabled={!proposta?.id}
            >
              <img 
                src="/downloadpng.png" 
                alt="Download PDF" 
                className="w-4 h-4"
              />
              <span className="text-blue-800 font-medium text-sm">PDF</span>
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          {/* Apresentação */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Apresentação</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{proposta.apresentacao || 'Não informado'}</p>
          </div>

          {/* Escopo */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Escopo do Projeto</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{proposta.escopo || 'Não informado'}</p>
          </div>

          {/* Requisitos Funcionais */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Requisitos Funcionais</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{proposta.req_funcional || 'Não informado'}</p>
          </div>

          {/* Requisitos Não Funcionais */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Requisitos Não Funcionais</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{proposta.req_nao_funcional || 'Não informado'}</p>
          </div>

          {/* Condições Comerciais */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Condições Comerciais</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{proposta.condicao_comercial || 'Não informado'}</p>
          </div>

          {/* Garantia */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Garantia</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{proposta.garantia || 'Não informado'}</p>
          </div>

          {/* Investimento */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Investimento</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{proposta.investimento || 'Não informado'}</p>
          </div>

          {/* Validade */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Validade</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{formatarDataPorExtenso(proposta.validade || '')}</p>
          </div>
        </div>

      </div>
    </div>
  )
}