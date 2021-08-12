import React, { useEffect, useRef } from "react";

export function Tooltip({ content = "" }) {
  const container = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (container.current?.style) {
      const { pageX: x, pageY: y } = e;
      container.current.style.transform = `translate(${x + 10}px,${y + 10}px)`;
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={container}
      className={`absolute top-0 left-0 pointer-events-none px-1 bg-white border-2 border-black rounded-sm`}
      style={{ transform: `translate(-999px,-999px)` }}
    >
      {content}
    </div>
  );
}
