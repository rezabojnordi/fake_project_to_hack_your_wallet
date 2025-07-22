"use client";
import { useEffect } from "react";

export default function JobDescription() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div>
      <iframe
        src="https://victor-symptohexe-job-description.vercel.app"
        className="fixed inset-0 w-full h-full"
      ></iframe>
    </div>
  );
}
