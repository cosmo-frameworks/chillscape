import { PrimaryButton } from "../PrimaryButton/PrimaryButton";

import useAuth from "../../hooks/useAuth";

import "./buy.scss";

export const Buy = () => {
  const { auth } = useAuth();

  const handlePurchase = (productId) => {
    window.electronAPI.purchaseApp(productId, auth._id, auth.email);
  };

  return (
    <PrimaryButton
      action={() => handlePurchase("6756208565c78e46864e6d0a")}
      text="premium"
    ></PrimaryButton>
  );
};
