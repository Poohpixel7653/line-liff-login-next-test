import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Space,
  Row,
  Col,
  Button,
  Modal,  
  ConfigProvider,
} from "antd";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import errorImg from "../../resources/error.png";

interface ErrorHandlingProps {
  error: Error | null;
}

const ErrorHandling: React.FC<ErrorHandlingProps> = ({ error }) => {
  console.log("MODAL ERROR", error, error?.message);
  const router = useRouter();

  const [visible, setVisible] = useState<boolean>(false);

  const handleModalClose = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error]);
  console.log("MODAL ON", visible);
  return (
    // <Modal
    //   title="Error"
    //   open={visible}
    //   onCancel={handleModalClose}
    //   onOk={handleModalClose}
    //   footer={null}
    // >
    //   {error && <p>{error.message}</p>}
    //   <button type="button" onClick={() => router.back()}>
    //   Click here to go back
    // </button>
    // </Modal>

    <Modal
      open={visible}
      onCancel={handleModalClose}
      onOk={handleModalClose}
      footer={null}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={errorImg}
            width={126}
            height={126}
            alt="Error"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </div>
        {/* </Col> */}

        <Col
          span={24}
          style={{
            fontSize: "24px",
            fontWeight: "Bold",
            color: "#E34545",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          มีข้อผิดพลาดในระบบ
        </Col>
        <Col
          span={24}
          style={{
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {error && <p>{error.message}</p>}
        </Col>

        {/* </Row> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            className={styles.button_style}
            style={{ width: "158px", height: "40px" }}
            onClick={() => router.back()}
          >
            กลับไปยังเมนูก่อนหน้า
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ErrorHandling;
