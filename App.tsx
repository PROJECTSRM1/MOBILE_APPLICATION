

import React, { useState } from 'react';
import Splash from './src/screens/Splash';
import Onboarding from './src/screens/Onboarding';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const onSplashFinish = () => {
    setShowSplash(false);
    setShowOnboarding(true);
  };

  const onOnboardingDone = () => {
    setShowOnboarding(false);
  };

  if (showSplash) return <Splash onFinish={onSplashFinish} />;
  if (showOnboarding) return <Onboarding onDone={onOnboardingDone} />;

  return null;
}
