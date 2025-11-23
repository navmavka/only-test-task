import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

import "swiper/swiper-bundle.css";
import type {InfoType} from "@/components/types/timline.ts";


interface CardSliderProps {
  info?: InfoType[];
}

export const CardSlider = ({ info = [] }: CardSliderProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(true);

  const handleSlideChange = (swiper: SwiperType) => {
    setCanSlidePrev(!swiper.isBeginning);
    setCanSlideNext(!swiper.isEnd);
  };

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper;
    setCanSlidePrev(!swiper.isBeginning);
  };

  // Проверка ширины экрана
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    if (swiperRef.current) {
      setCanSlidePrev(!swiperRef.current.isBeginning);
      setCanSlideNext(!swiperRef.current.isEnd);
    }
    return () => window.removeEventListener("resize", checkMobile);
  }, [canSlideNext, canSlidePrev, info]);

  return (
    <div className="card-slider">
      {!isMobile && (
        <>
          {canSlidePrev && (
            <button
              className="slider-prev"
              onClick={() => swiperRef.current?.slidePrev()}
            />
          )}
          {canSlideNext && (
            <button
              className="slider-next"
              onClick={() => swiperRef.current?.slideNext()}
            />
          )}
        </>
      )}

      <Swiper
        slidesPerView={isMobile ? 1.5 : 3}
        spaceBetween={isMobile ? 30 : 80}
        onSwiper={handleSwiperInit}
        onSlideChange={handleSlideChange}
        allowTouchMove={true}
      >
        {info.map((item) => (
          <SwiperSlide>
            <div className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};