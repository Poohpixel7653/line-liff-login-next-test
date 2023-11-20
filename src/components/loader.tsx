import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

interface LoadingProps {
  isLoad: boolean | false;
}
const Loader: React.FC<LoadingProps> = ({ isLoad }) => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    console.log("IS LOAD ", isLoad);
    if (isLoad == true) {
      console.log(" set load ", isLoad);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isLoad]);
  return (
    <>
      {visible && (
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
      )}
    </>
  );
};

export default Loader;
