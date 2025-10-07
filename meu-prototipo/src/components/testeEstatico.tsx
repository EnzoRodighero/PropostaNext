"use client";

import { useState } from "react";
import Link from "next/link";

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

export default function TesteEstatico() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          setPropostas(data);
        } else {
          setPropostas([data]);
        }
      } catch (err) {
        setError("Erro ao ler o arquivo: " + (err instanceof Error ? err.message : "Erro desconhecido"));
        setPropostas([]);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Erro ao ler o arquivo.");
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Propostas (Arquivo Local)
          </h1>
          <p className="text-gray-600 mb-4">
            Selecione um arquivo JSON para visualizar as propostas
          </p>
          <label htmlFor="file-upload" className="inline-block mb-4">
            <span className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg cursor-pointer transition-colors duration-150 border-2 border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Selecionar arquivo JSON
            </span>
            <input
              id="file-upload"
              type="file"
              accept="application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </header>
        <main className="flex justify-center">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4">
                <h2 className="text-xl font-bold">Lista de Propostas</h2>
                <p className="text-blue-100 text-sm">
                  Total: {propostas.length} {propostas.length === 1 ? "proposta" : "propostas"}
                </p>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-4 font-semibold text-gray-700">
                  <div className="text-sm uppercase tracking-wide">ID</div>
                  <div className="text-sm uppercase tracking-wide">Título</div>
                  <div className="text-sm uppercase tracking-wide">Nome do Cliente</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="px-6 py-12 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    Carregando propostas...
                  </div>
                ) : error ? (
                  <div className="px-6 py-12 text-center text-red-600 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-red-500 mb-2">❌</div>
                    <div className="font-semibold mb-2">Erro ao carregar propostas</div>
                    <div className="text-sm">{error}</div>
                  </div>
                ) : propostas.length === 0 ? (
                  <div className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-4">📋</div>
                    <div className="font-medium text-gray-600 mb-2">Nenhuma proposta encontrada</div>
                    <div className="text-sm text-gray-500">
                      Selecione um arquivo JSON válido contendo propostas.
                    </div>
                  </div>
                ) : (
                  propostas.map((proposta, index) => (
                    <div key={proposta.id || index} className="block px-6 py-4 border-b hover:bg-gray-50 transition-colors duration-150 cursor-pointer">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="text-gray-900 font-medium">
                          #{proposta.id || "N/A"}
                        </div>
                        <div className="text-gray-900">
                          {proposta.titulo || "Sem título"}
                        </div>
                        <div className="text-gray-900">
                          {proposta.cliente || "Cliente não informado"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {propostas.length > 0 && (
                <>
                  <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-600 border-t border-gray-200">
                    Última atualização: {new Date().toLocaleString("pt-BR")}
                  </div>
                  <div className="bg-gray-100 px-6 py-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold mb-2 text-gray-800">Conteúdo do arquivo JSON carregado:</h3>
                    <pre className="bg-white rounded p-4 text-xs text-gray-800 overflow-x-auto max-h-96 border border-gray-200">
                      {JSON.stringify(propostas, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
