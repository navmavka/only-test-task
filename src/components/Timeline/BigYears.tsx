import { gsap } from "gsap";
import {useRef, useEffect, useState} from "react";
import type {TimelineDataType} from "@/components/types/timline.ts";

export const BigYears = ({ data }: { data?: TimelineDataType }) => {
  const startRef = useRef(null);
  const endRef   = useRef(null);

  const [displayStart, setDisplayStart] = useState<number>(data?.startYear ? Number(data.startYear) : 0);
  const [displayEnd, setDisplayEnd] = useState<number>(data?.endYear ? Number(data.endYear) : 0);

  useEffect(() => {
    if (!data) return;

    gsap.to({ value: displayStart }, {
      value: Number(data.startYear),
      duration: 0.3,
      ease: "power2.inOut",
      onUpdate: function () {
        setDisplayStart(Math.round(this.targets()[0].value));
      }
    });

    gsap.to({ value: displayEnd }, {
      value: Number(data.endYear),
      duration: 0.3,
      ease: "power2.inOut",
      onUpdate: function () {
        setDisplayEnd(Math.round(this.targets()[0].value));
      }
    });
  }, [data, displayEnd, displayStart]);

  if (!data) return null;

  return (
    <div className="bigYears">
      <h2 ref={startRef}>{displayStart}</h2>
      &nbsp;&nbsp;
      <h2 ref={endRef}>{displayEnd}</h2>
    </div>
  );
};
