import React from "react";
import Svg, { Circle, G } from "react-native-svg";

const Ring = ({ size = 96, strokeWidth = 10, progress = 0.65, color = "#34F3CE", bg = "#23303B" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  return (
    <Svg width={size} height={size}>
      <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
        <Circle cx={size/2} cy={size/2} r={radius} stroke={bg} strokeWidth={strokeWidth} fill="transparent" />
        <Circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
        />
      </G>
    </Svg>
  );
};

export default Ring;
