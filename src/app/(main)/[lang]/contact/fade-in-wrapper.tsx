// src/app/(main)/[lang]/contact/fade-in-wrapper.tsx
"use client";
import { useEffect } from "react";

export default function FadeInWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const faders = document.querySelectorAll('.fade-in-on-scroll');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.2 });
    faders.forEach(fader => observer.observe(fader));
  }, []);

  return <>{children}</>;
}