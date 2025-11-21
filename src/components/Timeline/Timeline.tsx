import CirclePoints from "@/components/Timeline/CirclePoints.tsx";
import '@/styles/timeline.sass'
import {useState} from "react";
import { TimelineData } from "@/components/Timeline/TimelineData.ts";
import {BigYears} from "@/components/Timeline/BigYears.tsx";
import {CardSlider} from "@/components/Timeline/CardSlider.tsx";


export const Timeline = () => {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const activeData = TimelineData.find(item => item.id === activeIndex)
  return (
    <div className="Timeline">
      <CirclePoints
        points={TimelineData.length}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        names={TimelineData.map(i => i.name)}
      />
      <BigYears data={activeData} />
      <CardSlider info={activeData?.info} />
    </div>
  )
}