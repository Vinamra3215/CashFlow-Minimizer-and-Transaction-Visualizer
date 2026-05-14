export const getStepMessage = (animationSteps, currentStep) => {
  if (currentStep < 0 || currentStep >= animationSteps.length) {
    return '';
  }

  return animationSteps[currentStep].message || '';
};
