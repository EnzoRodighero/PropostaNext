import Image from 'next/image';

export default function footerEFA() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 relative bg-gray-200">
        {/* Container das logos EFA dentro da div do ícone */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sm:gap-0">
              {/* Logo EFA alinhado à esquerda */}
              <div className="order-1 sm:order-none">
                <Image 
                  src="/logo-efa-svg.svg" 
                  alt="Logo EFA" 
                  width={200}
                  height={80}
                  className="h-12 sm:h-16 lg:h-20 w-auto"
                />
              </div>

              {/* Info EFA alinhado à direita */}
              <div className="order-2 sm:order-none">
                <Image 
                  src="/info-efa.svg" 
                  alt="Info EFA" 
                  width={200}
                  height={80}
                  className="h-12 sm:h-16 lg:h-20 w-auto"
                />
              </div>
            </div>
        </div>
  
    </div>
  );
}