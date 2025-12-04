import React, { useEffect } from "react";
import IphoneList from "../IphoneList/IphoneList";
import ModelSlider3D from "../ModelSlider3D/ModelSlider3D";

function HomePage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <React.Fragment>
      <ModelSlider3D />
      <IphoneList />
    </React.Fragment>
  );
}

export default HomePage;
