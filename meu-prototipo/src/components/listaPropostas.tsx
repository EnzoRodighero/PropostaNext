'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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



// Componente ListaPropostas
export default function ListaPropostas() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarPropostas = async () => {
      try {
        setLoading(true);
        
        // Usa a API route que tem TODA a lógica
        const response = await fetch('/api/propostas');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erro ${response.status}`);
        }

        const dados = await response.json();
        setPropostas(dados);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    carregarPropostas();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-600 py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        Carregando propostas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8 bg-red-50 rounded-lg border border-red-200">
        <div className="text-red-500 mb-2">❌</div>
        <div className="font-semibold mb-2">Erro ao carregar propostas</div>
        <div className="text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Propostas
          </h1>
          <p className="text-gray-600">
            Visualize e gerencie todas as propostas cadastradas
          </p>
        </header>
        
        <main className="flex justify-center">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              {/* Cabeçalho da lista */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Lista de Propostas</h2>
                <p className="text-blue-100 text-sm">
                  Total: {propostas.length} {propostas.length === 1 ? 'proposta' : 'propostas'}
                </p>
              </div>

        {/* Cabeçalho das colunas */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4 font-semibold text-gray-700">
            <div className="text-sm uppercase tracking-wide">ID</div>
            <div className="text-sm uppercase tracking-wide">Título</div>
            <div className="text-sm uppercase tracking-wide">Nome do Cliente</div>
          </div>
        </div>

        {/* Conteúdo da lista */}
        <div className="divide-y divide-gray-200">
          {propostas.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="text-4xl mb-4">📋</div>
              <div className="font-medium text-gray-600 mb-2">Nenhuma proposta encontrada</div>
              <div className="text-sm text-gray-500">
                Verifique se a API está funcionando ou se há propostas cadastradas.
              </div>
            </div>
          ) : (
            propostas.map((proposta, index) => (
              <Link 
                key={proposta.id || index}
                href={`/informacoesProposta?id=${proposta.id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
              >
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-gray-900 font-medium">
                    #{proposta.id || 'N/A'}
                  </div>
                  <div className="text-gray-900">
                    {proposta.titulo || 'Sem título'}
                  </div>
                  <div className="text-gray-900">
                    {proposta.cliente || 'Cliente não informado'}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

              {/* Rodapé com informações adicionais */}
              {propostas.length > 0 && (
                <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-600 border-t border-gray-200">
                  Última atualização: {new Date().toLocaleString('pt-BR')}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}