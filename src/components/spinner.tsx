import React from 'react';
import { SyncLoader } from 'react-spinners';


const Spinner: React.FC = () => (
  <div
  style={{
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: "999",
  }}
>
  <div
    style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000",
    }}
  >
    <SyncLoader color="#00BFFF" size={50} />
  </div>
</div>
);

export default Spinner;