import ConsumerListCardPayment from "@/components/consumerListCardPayment";
import { IConsumer } from "@/interfaces/payment.interface";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Row, ConfigProvider, Button } from "antd";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import logo from "../../resources/logo.png";
import useLIFF from "@/hooks/useLiff";
import ErrorHandling from "@/components/errorModal";
import Loader from "@/components/loader";

export default function History() {
  const [consumerList, setConsumerList] = useState<IConsumer[]>([]);

  const { liffObject, liffError, profile } = useLIFF();
  // const profile = {userId : "U257c3b19eb73999c6954d7cdaa100499"}
  const [lineUID, setLineUID] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [spin, setSpin] = useState(false);

  const router = useRouter();
  const { uuid, lid } = router.query;

  useEffect(() => {
    if (!lid) {
      setLineUID(profile?.userId);
    } else {
      setLineUID(lid.toString());
    }
  }, [lid, profile?.userId]);

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpin(true)
        const result = await axios.get(
          "https://api-aquater-test.adcm.co.th/line/consumer/payment/" + lineUID,
          {
            headers: {
              "Accept-Language": "th",
            },
          }
        );
        if (lineUID) {
          setConsumerList(result.data.data);
          if (!result.data.data.length) {
            router.push("/");
          }
          console.log(lineUID, result.data.data);
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
    if (lineUID) {
      fetchData();
    }
  }, [lineUID, router]);

  return (
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
          <Col span={24} style={{ display: "flex", alignItems: "center" }}>
            <Image src={logo} width={70} height={70} alt="Logo" />
            <Col
              style={{ fontSize: "24px", fontWeight: "Bold", color: "#FFFFFF" }}
            >
              Aquater
            </Col>
          </Col>
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
              ตรวจสอบค่าน้ำประปา
            </Col>
          </Row>
        </div>
      </header>
      <main
        className={styles.body}
        style={{
          display: "grid",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.bgDiv2}>
          <ConsumerListCardPayment data={consumerList} />
        </div>
      </main>
      <ErrorHandling error={error} />
      </>
      )}
    </ConfigProvider>
  );
}
