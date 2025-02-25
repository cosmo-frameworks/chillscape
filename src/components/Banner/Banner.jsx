import logo from "../../assets/img/logo/cosmoframeworks.png";

import "./banner.scss";

export const Banner = () => {
  const n = 80;
  const ha = Math.PI / n;

  // Generar estilos dinámicos y las "spikes"
  const spikes = Array.from({ length: n }, (_, i) => {
    const index = n - i - 1; // Invertir el índice para coincidir con `while n--`
    return <div key={index} className="spike" style={{ "--i": index }} />;
  });

  return (
    <div className="container-banner">
      <div className="container-banner__content">
        <a href="https://cosmoframeworks.shakarzr.com">
          <div>
            <style>
              {`
                :root {
                  --n: ${n};
                  --f: ${Math.tan(ha)};
                }
              `}
            </style>
            {spikes}
          </div>
          <img src={logo} alt="banner" />
        </a>
      </div>
    </div>
  );
};
