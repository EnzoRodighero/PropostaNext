//API Route para download de PDF de propostas usando parâmetros dinâmicos
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = params;
  
  if (!id) {
    return NextResponse.json(
      { error: 'ID da proposta é obrigatório' }, 
      { status: 400 }
    );
  }

  const endpoint = `http://localhost:8050/api/propostas-pdf/${id}/`;
  
  try {    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Proposta não encontrada' }, 
          { status: 404 }
        );
      }
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    // Obter o PDF como buffer
    const pdfBuffer = await response.arrayBuffer();
    
    // Retornar o PDF com os headers adequados
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="proposta-${id}.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Erro ao fazer download do PDF:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao fazer download do PDF', 
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        details: 'Verifique se a API em localhost:8050 está funcionando'
      }, 
      { status: 500 }
    );
  }
}