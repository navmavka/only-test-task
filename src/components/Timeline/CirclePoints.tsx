import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import {useIsMobile} from "@/components/Hooks/useIsMobile.tsx";


interface CirclePointsProps {
  points: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  names?: string[];
}

export const CirclePoints = ({points, activeIndex, setActiveIndex, names} : CirclePointsProps) => {
  const angleStep = 360 / points;
  const isMobile = useIsMobile();
  const circleRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef({ value: 0 });
  const [rotation, setRotation] = useState<number>(1.5);
  const pointsRef = useRef<HTMLButtonElement[]>([]);
  const offsetAngle = 26;
  const [displayIndex, setDisplayIndex] = useState<number>(activeIndex + 1);
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);
  const isPrevDisabled = activeIndex === 1;
  const isNextDisabled = activeIndex === points;
  const displayIndexRef = useRef<number>(displayIndex)
  const dotsRef = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    gsap.to(prevButtonRef.current, {
      opacity: isPrevDisabled ? 0.5 : 1,
      duration: 0.3,
      ease: "power1.out",
    });

    gsap.to(nextButtonRef.current, {
      opacity: isNextDisabled ? 0.5 : 1,
      duration: 0.3,
      ease: "power1.out",
    });

    if (isMobile) {
      dotsRef.current.forEach((dot, id) => {
        if (!dot) return;
        gsap.to(dot, {
          opacity: id === activeIndex ? 1 : 0.5,
          duration: 0.3,
          ease: "power1.out",
        });
      });
    }
  }, [isPrevDisabled, isNextDisabled, isMobile, activeIndex]);

  const radius = 530 / 2 + 6 * 2 - 1;

  const handlePointClick = (index: number) => {
    if (index === activeIndex) return;

    let deltaIndex = index - activeIndex;
    if (deltaIndex > points / 2) deltaIndex -= points;
    if (deltaIndex < -points / 2) deltaIndex += points;

    const rotationDelta = -deltaIndex * angleStep;
    const newRotation = rotationRef.current.value + rotationDelta;


    setActiveIndex(index);
    gsap.killTweensOf(rotationRef.current);

    gsap.to(rotationRef.current, {
      value: newRotation,
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: function () {
        const v = rotationRef.current.value + 1.5;
        if (circleRef.current) gsap.set(circleRef.current, { rotation: v });
        pointsRef.current.forEach((btn, i) => {
          if (!btn) return;
          const angle = i * angleStep + offsetAngle;
          gsap.set(btn, { rotation: -(v + angle) });
        });
        setRotation(v);
      },
      onComplete: () => {
        rotationRef.current.value = newRotation;
      }
    });
    gsap.to({ value: displayIndexRef.current }, {
      value: index,
      duration: 0.7,
      ease: "power2.inOut",
      onUpdate: function () {
        const val = this.targets()[0].value;
        setDisplayIndex(Math.round(val));
      },
      onComplete: () => {
        displayIndexRef.current = index;
      }
    });
  };

  return (
    <div className="circle-wrapper">
      {!isMobile && (
        <div className="circle-container">
          <div
            className="circle"
            ref={circleRef}
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {Array.from({ length: points }).map((_, i) => {
              const id = i + 1;
              const angle = (id - 1) * angleStep + offsetAngle;
              const wrapperTransform = `rotate(${angle}deg) translateY(-${radius}px)`;

              const initialButtonRotation = -angle;

              const isActive = id === activeIndex;

              return (
                <div
                  key={i}
                  className="point-wrapper"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 0,
                    height: 0,
                    transform: wrapperTransform,
                    transformOrigin: "center center",
                  }}
                >
                  <button
                    className={`point ${isActive ? "active" : "inactive"}`}
                    ref={(el) => {
                      if (el) pointsRef.current[i] = el;
                    }}
                    type="button"
                    onClick={() => handlePointClick(id)}
                    onMouseDown={(e) => e.preventDefault()}
                    aria-label={`Point ${id}`}
                    style={{ transform: `rotate(${initialButtonRotation}deg)` }}
                  >
                    <span className="dot">
                      <span className="num">{id}</span>
                    </span>
                    {names && isActive && (
                      <div className="circle-label">
                        {names[activeIndex - 1]}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="navigation-info">
        {String(activeIndex).padStart(2, "0")}/{String(points).padStart(2, "0")}
      </div>
      <div className="navigation">
        <button
          className='prev'
          ref={prevButtonRef}
          type="button"
          onClick={() => handlePointClick((activeIndex - 1 + points) % points)}
          disabled={isPrevDisabled}
        />
        <button
          className='next'
          ref={nextButtonRef}
          type="button"
          onClick={() => handlePointClick(activeIndex + 1)}
          disabled={isNextDisabled}
        />
      </div>
      {isMobile && (
        <div className="navDots">
          {Array.from({ length: points }).map((_, i) => {
            const id = i + 1;
            return (
              <button
                ref={(el) => {
                  if (el) dotsRef.current[id] = el;
                }}
                className="navDot"
                onClick={() => handlePointClick(id)}
                key={id}
              />
              )
            })
          }
        </div>
      )}
    </div>
  );
};
export default CirclePoints;
