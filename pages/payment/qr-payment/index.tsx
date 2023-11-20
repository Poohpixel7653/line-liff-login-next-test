import QrPaymentCard from "@/components/consumerQrPaymentCard";
import { IData } from "@/interfaces/qr_payment.interface";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, ConfigProvider, Row, Col, message } from "antd";
import styles from "../../../styles/Home.module.css";
import ErrorHandling from "@/components/errorModal";
import Loader from "@/components/loader";

export default function QrPayment() {
  const [qrData, setQrData] = useState<IData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [spin, setSpin] = useState(false);

  const router = useRouter();
  const { bill_number } = router.query;
  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpin(true)
        const result = await axios.post(
          "https://api-aquater-test.adcm.co.th/payment/getpay/" + bill_number,{},
          {
            headers: {
              "Accept-Language": "th",
            },
          }
        );

        if (result.status === 200) {
          if (bill_number) {
            setQrData(result.data.data);
            console.log(result.data.data);
          }
        }
      } catch (error: any) {
        if (error.response) {
          console.log(error.response.data);
          setError(new Error(error.response.data.error.message));
        } else {
          console.log("Error", error.message);
          setError(new Error(error.message));
        }
      } finally {
        setSpin(false);
      }
    };
    if (bill_number && !error) {
      fetchData();
    }
  }, [bill_number, error]);

  return (
    // <div>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Prompt",
        },
      }}
    >
      <Loader isLoad={spin}/>
      {!spin && (
        <>
      <div className={styles.headershape}></div>

      <header>
        <div className={styles.header}>
          <Row>
            <Col
              span={24}
              className="text-color"
              style={{
                fontSize: "28px",
                fontWeight: "Bold",
                color: "#AED9FF",
                padding: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              QR PAYMENT PAGE
            </Col>
          </Row>
        </div>
      </header>
      <Row></Row>

      <div style={{ marginTop: "1rem", height: "100%" }}>
        <QrPaymentCard data={qrData} />
      </div>
      <ErrorHandling error={error} />
      </>
      )}
    </ConfigProvider>

    // </div>
  );
}
