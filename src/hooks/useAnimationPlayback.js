import { useCallback, useEffect, useRef, useState } from 'react';

export const useAnimationPlayback = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSteps, setAnimationSteps] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const intervalRef = useRef(null);
  const completionTimeoutRef = useRef(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
  }, []);

  const resetAnimation = useCallback(() => {
    clearTimers();
    setCurrentStep(-1);
    setIsAnimating(false);
    setShowResults(false);
    setAnimationSteps([]);
  }, [clearTimers]);

  const prepareAnimation = useCallback(() => {
    clearTimers();
    setIsAnimating(true);
    setShowResults(false);
    setCurrentStep(-1);
  }, [clearTimers]);

  const playAnimation = useCallback((steps, speed) => {
    setAnimationSteps(steps);

    let nextStep = -1;
    intervalRef.current = setInterval(() => {
      nextStep += 1;
      setCurrentStep(nextStep);

      if (nextStep >= steps.length - 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        completionTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          setShowResults(true);
        }, 1000);
      }
    }, speed);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  return {
    currentStep,
    isAnimating,
    animationSteps,
    showResults,
    prepareAnimation,
    playAnimation,
    resetAnimation
  };
};
