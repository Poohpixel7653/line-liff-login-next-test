import ConsumerPaymentHistory from "@/components/consumerPaymentHistory";
import { IPaymentHistory } from "@/interfaces/payment_history.interface";
import { IMeter } from "@/interfaces/meter.interface";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ConfigProvider, Row, Col, Button } from "antd";
import styles from "../../../styles/Home.module.css";
import ErrorHandling from "@/components/errorModal";
import Loader from "@/components/loader";
import Spinner from "@/components/spinner";

export default function PaymentConsumer() {
  const [consumerBills, setConsumerBills] = useState<IPaymentHistory[]>([]);
  const [consumerMeter, setConsumerMeter] = useState<IMeter | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [spin, setSpin] = useState(false);

  const router = useRouter();
  const { meter_uuid } = router.query;
  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  useEffect(() => {
    
    const fetchDataMeter = async () => {
      try {
        setSpin(true);
        const result = await axios.get(
          "https://api-aquater-test.adcm.co.th/meter/uuid/" + meter_uuid
          , {
            headers: {
              "Accept-Language": "th",
            },
          }
        );
        console.log(result.status);
        if (result.status === 200) {
          if (meter_uuid) {
            setConsumerMeter(result.data.data);
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
        setSpin(false)
      }
    };
    const fetchData = async () => {
      try {
        setSpin(true);
        const result = await axios.get(
          "https://api-aquater-test.adcm.co.th/payment/meter/" + meter_uuid
          , {
            headers: {
              "Accept-Language": "th",
            },
          }
        );
        console.log(result.status);
        if (result.status === 200) {
          if (meter_uuid) {
            setConsumerBills(result.data.data);
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
        setSpin(false)
      }
    };
    if (meter_uuid) {
      fetchData();
      fetchDataMeter();
    }
  }, [meter_uuid]);

  return (
    
    <div>
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
                  fontSize: "24px",
                  fontWeight: "Bold",
                  color: "#AED9FF",
                  padding: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ประวัติการชำระเงิน
              </Col>
            </Row>
          </div>
        </header>

        <Col
          style={{
            marginTop: "1rem",
            marginLeft: "1rem",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#FFFFFF",
          }}
        >
          ที่อยู่
        </Col>

        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // marginTop: "1rem",
            margin: "1rem",
            backgroundColor: "#AED9FF",
            borderRadius: "16px",
            lineHeight: "40px"
          }}
        >
          {consumerMeter?.consumer.address}{" "}
          {consumerMeter?.consumer.moo}{" "}
          {consumerMeter?.consumer.subdistrict}{" "}
          {consumerMeter?.consumer.district}{" "}
          {consumerMeter?.consumer.province}
        </Col>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <ConsumerPaymentHistory data={consumerBills} />
        </div>
        {/* <Button
          className={styles.button_style}
          onClick={handleClick}
          style={{ marginTop: "1rem", marginLeft: "1rem" }}
        >
          Go Home
        </Button> */}
      <ErrorHandling error={error} />

      </>
      )}
      </ConfigProvider>
    </div>
  );
}
