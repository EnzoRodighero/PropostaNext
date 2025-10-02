//API Route para download de PDF de propostas
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Extrair o ID da proposta da URL
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'ID da proposta é obrigatório' }, 
      { status: 400 }
    );
  }

  const endpoint = `http://localhost:8050/api/propostas-pdf/${id}/`;
  
  try {    
    console.log(`Fazendo requisição para: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf'
      }
    });

    console.log(`Status da resposta: ${response.status}`);
    console.log(`Content-Type da resposta: ${response.headers.get('content-type')}`);

    if (!response.ok) {
      let errorMessage = `Erro na requisição: ${response.status} - ${response.statusText}`;
      
      // Tentar ler o corpo da resposta para mais detalhes do erro
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - Detalhes: ${errorText}`;
        }
      } catch (readError) {
        console.error('Erro ao ler resposta de erro:', readError);
      }
      
      throw new Error(errorMessage);
    }

    // Verificar se o content-type é realmente um PDF
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('pdf')) {
      // Se não for PDF, vamos ver o que está sendo retornado
      const responseText = await response.text();
      console.error('Resposta não é PDF:', responseText.substring(0, 200));
      throw new Error(`Resposta não é um PDF. Content-Type: ${contentType}`);
    }

    // Obter o PDF como buffer
    const pdfBuffer = await response.arrayBuffer();
    
    console.log(`PDF obtido com sucesso. Tamanho: ${pdfBuffer.byteLength} bytes`);
    
    // Retornar o PDF com os headers adequados
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="proposta-${id}.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString()
      }
    });

  } catch (error) {
    console.error('Erro ao fazer download do PDF:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao fazer download do PDF', 
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        details: `Tentativa de acesso ao endpoint: ${endpoint}. Verifique se a API em localhost:8050 está funcionando`
      }, 
      { status: 500 }
    );
  }
}