"use client";

import Silk from "../UX/slick";
// import Squares from "../UX/squares";

export default function ClientBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 z-0">
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
        />

        {/* <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal" // up, down, left, right, diagonal
          borderColor="#fff"
          hoverFillColor="#222"
        /> */}
      </div>
    </div>
  );
}
