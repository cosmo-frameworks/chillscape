import { Icon } from "semantic-ui-react";

import useAuth from "../../hooks/useAuth";

import "./about.scss";

export const About = () => {
  const { closeSession } = useAuth();

  return (
    <>
      <div className="container-about">
        <div className="container-about__content">
          <div className="container-about__content__privacity">
            <span>
              <button onClick={closeSession}>
                <Icon name="log out" />
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
