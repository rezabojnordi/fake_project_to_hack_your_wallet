"use client";
import { useEffect } from "react";

export default function WhitePaper() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div>
      <iframe
        src="https://victor-symptohexe-white-paper.vercel.app"
        className="fixed inset-0 w-full h-full"
      ></iframe>
    </div>
  );
}
