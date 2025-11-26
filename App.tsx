import React, { useState } from "react";

import Splash from "./src/screens/splashscreen";
import Onboarding from "./src/screens/onboardingscreen";
import Signup from "./src/screens/Signup";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";

export default function App() {
  const [screen, setScreen] = useState("Splash");  // default screen

  const handleSplashFinish = () => setScreen("Onboarding");
  const handleOnboardingDone = () => setScreen("Signup");
  const handleSignupDone = () => setScreen("Home");
  const goToLogin = () => setScreen("Login");
  const handleLoginDone = () => setScreen("Home");

  switch (screen) {
    case "Splash":
      return <Splash onFinish={handleSplashFinish} />;

    case "Onboarding":
      return <Onboarding onDone={handleOnboardingDone} />;

    case "Signup":
      return (
        <Signup
          onSignupDone={handleSignupDone}
          onGoToLogin={goToLogin}
        />
      );

    case "Login":
      return (
        <Login
          onLoginDone={handleLoginDone}
          onGoToSignup={() => setScreen("Signup")}
        />
      );

    case "Home":
      return <Home />;

    default:
      return null;
  }
}
