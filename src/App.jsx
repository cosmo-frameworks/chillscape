import { ToastContainer } from "react-toastify";
import { About, Auth, Controls, Banner, Music, Footer } from "./components";

import useAuth from "./hooks/useAuth";

import "./app.scss";
import { useEffect, useState } from "react";
import { BackendClient } from "./utils/backendClient";

const App = () => {
  const client = new BackendClient();

  const { auth, loading, userIsPremium } = useAuth();

  const [purchased, setPurchased] = useState(false);

  const userId = auth._id;
  const productId = "6756208565c78e46864e6d0a";

  useEffect(() => {
    const interval = setInterval(() => {
      userIsPremium(userId, productId);
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, productId]);

  if (loading) return <p>cargando...</p>;

  return (
    <>
      {auth._id ? (
        <div className="container">
          <div className="spotify_section">
            <Music />
          </div>
          <div className="banner_section">
            <Banner />
          </div>
          <div className="info_section">
            <About />
          </div>
          <div className="buttons_section">
            <Controls />
          </div>
          <div className="footer_section">
            <Footer />
          </div>
        </div>
      ) : (
        <Auth />
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
