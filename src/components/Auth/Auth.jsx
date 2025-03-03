import { useState } from "react";

import { LoginForm } from "../LoginForm";
import { AuthOptions } from "../AuthOptions";
import { RegisterForm } from "../RegisterForm/RegisterForm";

import video from "../../assets/videos/background.mp4";
import "./auth.scss";

export const Auth = () => {
  const [typeForm, setTypeForm] = useState(null);

  const openLogin = () => setTypeForm("login");
  const openRegister = () => setTypeForm("register");
  const goBack = () => setTypeForm(null);

  const renderForm = () => {
    if (typeForm === "login") {
      return <LoginForm openRegister={openRegister} goBack={goBack} />;
    }

    if (typeForm === "register") {
      return <RegisterForm openLogin={openLogin} goBack={goBack} />;
    }

    return <AuthOptions openLogin={openLogin} openRegister={openRegister} />;
  };

  return (
    <div className="auth">
      <video
        className="auth__video"
        src={video}
        autoPlay
        loop
        muted
        playsInline
      ></video>
      <div className="auth__content">{renderForm()}</div>
    </div>
  );
};
