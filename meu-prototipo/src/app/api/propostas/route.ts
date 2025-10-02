//API Route para buscar propostas
import { NextResponse } from 'next/server';

export async function GET() {
  const endpoint = 'http://localhost:8050/api/propostas';
  
  try {    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    const propostas = await response.json();
    return NextResponse.json(propostas);

  } catch (error) {
    console.error('Erro ao buscar propostas:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar propostas', 
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        details: 'Verifique se a API em localhost:8050 está funcionando'
      }, 
      { status: 500 }
    );
  }
}