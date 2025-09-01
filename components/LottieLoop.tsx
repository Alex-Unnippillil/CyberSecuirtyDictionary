import React, { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import type { AnimationImport } from './attackChainAnimations';

interface LottieLoopProps {
  loadAnimation: AnimationImport;
}

const LottieLoop: React.FC<LottieLoopProps> = ({ loadAnimation }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    let mounted = true;
    loadAnimation().then((mod) => {
      if (!mounted || !containerRef.current) return;
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: mod.default,
      });

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          animationRef.current?.play();
        } else {
          animationRef.current?.pause();
        }
      });
      observer.observe(containerRef.current);

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === ' ' || e.key === 'Enter') {
          if (animationRef.current?.isPaused) {
            animationRef.current.play();
          } else {
            animationRef.current?.pause();
          }
        }
      };
      window.addEventListener('keydown', handleKey);

      return () => {
        window.removeEventListener('keydown', handleKey);
        observer.disconnect();
        animationRef.current?.destroy();
      };
    });

    return () => {
      mounted = false;
    };
  }, [loadAnimation]);

  return <div ref={containerRef} aria-label="lottie-loop" />;
};

export default React.memo(LottieLoop);
