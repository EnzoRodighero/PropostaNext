import Image from 'next/image';

export default function HeaderEFA() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 relative">
      {/* Div do ícone como container pai que contém as outras */}
      <div className="relative">
        {/* Container das logos EFA dentro da div do ícone */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sm:gap-0">
              {/* Logo EFA alinhado à esquerda */}
              <div className="order-1 sm:order-none">
                  <Image 
                    src="/logo-effa.webp" 
                    alt="Logo EFA" 
                    width={200}
                    height={80}
                    className="h-12 sm:h-16 lg:h-20 w-auto"
                  />
              </div>

              {/* Info EFA alinhado à direita */}
                <div className="order-2 sm:order-none hidden sm:block">
                  <Image 
                    src="/inf-eefffaaa.webp" 
                    alt="Info EFA" 
                    width={200}
                    height={80}
                    className="h-12 sm:h-16 lg:h-20 w-auto"
                  />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}