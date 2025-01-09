import { ToastContainer } from "react-toastify";
import { About, Auth, Controls, Banner, Music, Footer } from "./components";

import useAuth from "./hooks/useAuth";

import "./app.scss";

const App = () => {
  const { auth, loading } = useAuth();

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
