import React, { useState } from "react";

import Splash from "./src/screens/splashscreen";
import Onboarding from "./src/screens/onboardingscreen";
import Auth from "./src/screens/Auth";
import Login from "./src/screens/login";
import Signup from "./src/screens/signup";
import Home from "./src/screens/home";

export default function App() {
  const [screen, setScreen] = useState("Splash");

  const navigateTo = (page: string) => setScreen(page);

  switch (screen) {
    case "Splash":
      return <Splash onFinish={() => navigateTo("Onboarding")} />;

    case "Onboarding":
      return <Onboarding onDone={() => navigateTo("Auth")} />;

    case "Auth":
      return (
        <Auth
          onGoToLogin={() => navigateTo("Login")}
          onGoToSignup={() => navigateTo("Signup")}
        />
      );

    case "Login":
      return (
        <Login
          onLoginDone={() => navigateTo("Home")}
          onGoToSignup={() => navigateTo("Signup")}
          onBack={() => navigateTo("Auth")}
        />
      );

    case "Signup":
      return (
        <Signup
          onSignupDone={() => navigateTo("Home")}
          onGoToLogin={() => navigateTo("Login")}
          onBack={() => navigateTo("Auth")}
        />
      );

    case "Home":
      return <Home />;

    default:
      return null;
  }
}
