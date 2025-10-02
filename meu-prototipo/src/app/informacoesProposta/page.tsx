import PropostaDetalhada from '@/components/propostaDetalhada';
import { Suspense } from 'react';
import HeaderEFA from '@/components/headerEFA';
import FooterEFA from '@/components/footerEFA';
import FooterEFAII from '@/components/footerEFAII';

export default function InformacoesPropostaPage() {
  return (
    <div className="bg-blue-50 min-h-screen">
      <HeaderEFA />
        <div className="container mx-auto max-w-7xl min-h-[750px] relative">
          <img
            src="/solucaoTecnologica.webp"
            alt="Solução Tecnológica"
            className="hide-img-1252"
            style={{
              height: '900px',
              width: 'auto',
              objectFit: 'contain',
              position: 'absolute',
              top: '35px',
              left: '-15px' // Altere este valor para controlar o espaçamento
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Suspense fallback={<div>Carregando informações da proposta...</div>}>
              <PropostaDetalhada />
            </Suspense>
          </div>
        </div>
      <FooterEFA />
      <FooterEFAII />
    </div>
  );
}