import React, { ReactNode } from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";

type PropType = {
  options?: EmblaOptionsType;
  slides: ReactNode[];
};

export const EmblaCarousel = (props: PropType) => {
  const { options, slides } = props;
  const [emblaRef] = useEmblaCarousel(options);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {slides.map((slide, index) => (
          <div className="embla__slide" key={index}>
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
};
