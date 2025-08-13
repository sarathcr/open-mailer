import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

export function AuthCarousel() {
  const images = [
    '/carousel-1.png',
    '/carousel-2.png',
    '/carousel-3.png',
    '/carousel-4.png',
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
    },
    [Autoplay({ delay: 2000 })]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((imageSrc, index) => (
            <div className="flex-[0_0_100%]" key={index}>
              <Card>
                <CardContent className="relative flex items-center justify-center">
                  <Image
                    src={imageSrc}
                    alt={`carousel-image-${index}`}
                    width={400}
                    height={400}
                    className="rounded-xl object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <ul className="dots absolute bottom-5 left-1/2 flex -translate-x-1/2 transform space-x-2">
        {images.map((_, index) => (
          <li
            key={index}
            className={`${
              activeIndex === index
                ? 'h-2 w-4 bg-primary lg:h-3 lg:w-6'
                : 'w-2 bg-gray-300 lg:h-3 lg:w-3'
            } cursor-pointer rounded-full transition-all duration-300`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </ul>
    </div>
  );
}
