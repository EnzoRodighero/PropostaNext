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
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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

    // Verificar se o content-type é compatível com PDF
    const contentType = response.headers.get('content-type');
    console.log(`Content-Type recebido: ${contentType}`);
    
    // Aceitar vários tipos de content-type que podem ser PDFs
    const isValidPDF = !contentType || contentType && (
      contentType.includes('pdf') || 
      contentType.includes('application/octet-stream') ||
      contentType.includes('binary') ||
      contentType === 'application/force-download' ||
      contentType.includes('attachment')
    );
    
    if (!isValidPDF) {
      // Tentar ler como texto para debug, mas não falhar se for binário
      try {
        const responseText = await response.text();
        console.error('Resposta inesperada:', responseText.substring(0, 200));
        throw new Error(`Content-Type inesperado: ${contentType}. Conteúdo: ${responseText.substring(0, 100)}`);
      } catch (textError) {
        // Se não conseguir ler como texto, pode ser binário válido
        console.log('Não foi possível ler como texto, tentando como binário...');
      }
    }

    // Obter o conteúdo como buffer (independente do content-type)
    const pdfBuffer = await response.arrayBuffer();
    
    console.log(`Arquivo obtido com sucesso. Tamanho: ${pdfBuffer.byteLength} bytes`);
    
    // Verificar se o buffer não está vazio
    if (pdfBuffer.byteLength === 0) {
      throw new Error('Arquivo recebido está vazio');
    }
    
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