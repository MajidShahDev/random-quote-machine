import { useState } from "react";

// Generate a random HSL color
const getRandomHSL = () => {
  const hue = Math.floor(Math.random() * 360);         // 0 to 359
  const saturation = 100;                               // 70% saturation for vibrancy
  const lightness = 40;                                // 50% lightness for balance
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};


export default function ColorChanger() {
  const [color, setColor] = useState(getRandomHSL());

  const changeColor = () => {
    setColor(getRandomHSL());
  };
  // Helper to convert HSL string to a slightly lighter/darker version
const adjustHSL = (hsl: string, lightnessOffset: number): string => {
  const regex = /hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/;
  const match = hsl.match(regex);

  if (!match) return hsl;

  const [, h, s, l] = match;
  const newL = Math.max(0, Math.min(100, parseInt(l) + lightnessOffset));
  return `hsl(${h}, ${s}%, ${newL}%)`;
};



  const transitionStyle = {
    transition: "all 1s ease",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 -500" style={{backgroundColor: color, ...transitionStyle}}>
      <div className="p-10 bg-white shadow-xl text-center" style={{border: `8px solid ${adjustHSL(color, 5)}`, ...transitionStyle}}>
        <h1 className="text-3xl font-bold mb-6" style={{ color, ...transitionStyle }}>
          HSL Color Changer
        </h1>
        <button
          onClick={changeColor}
          className="px-6 py-3 rounded-md transition"
          style={{
            backgroundColor: color,
            color: "white",
            border: `2px solid ${color}`, 
            ...transitionStyle,
          }}
        >
          Change Color
        </button>
      </div>
    </div>
  );
}




      // <div className="p-10 rounded-xl bg-white shadow-lg text-center border border-gray border-8"  style={{border: `1px solid ${color}`, ...transitionStyle}}>