import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Col, Row, ConfigProvider, Button, Divider } from "antd";
import styles from "../styles/Home.module.css";
import logo from "../resources/logo.png";
import router, { useRouter } from "next/router";
import plus from "../resources/plus.png";
import { Card, Typography, Space } from "antd";
import axios from "axios";
import ConsumerListCard from "@/components/consumerListCard";
import ConsumerListCardNew from "@/components/consumerListCardNew";
import { IConsumerNew } from "@/interfaces/consumer.interface";
import useLIFF from "@/hooks/useLiff";
const { Title, Text } = Typography;
import ErrorHandling from "@/components/errorModal";
import Loader from "@/components/loader";

interface IConsumer {
  id: number;
  uuid: string;
  firstname: string;
  lastname: string;
  address: string;
  moo: string;
  subdistrict: string;
  district: string;
  province: string;
  phone: string | null;
  picture: string | null;
  privilege_id: number;
  location: { latitude: number; longitude: number };
  meters: IMeter;
}

interface IMeter {
  id: number;
  uuid: string;
  consumer_id: number;
  meter_code: string;
  meter_type: string | null;
  meter_zone_id: number;
  disabled: boolean | null;
}

interface ConsumersProps {
  data: IConsumer[];
}

const Meterlist: React.FC<ConsumersProps> = ({ data }) => {
  const [consumerList, setConsumerList] = useState<IConsumer[]>([]);
  const [consumerListNew, setConsumerListNew] = useState<IConsumerNew[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const { liffObject, liffError, profile } = useLIFF();
  // const profile = {userId : "U257c3b19eb73999c6954d7cdaa100499"}
  const [lineUID, setLineUID] = useState<string | null>(null);
  const router = useRouter();
  const { uuid, lid } = router.query;
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    if (!lid) {
      setLineUID(profile?.userId);
    } else {
      setLineUID(lid.toString());
    }
  }, [lid, profile?.userId]);

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/addmeter/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpin(true);
        const result = await axios.get(
          "https://api-aquater-test.adcm.co.th/line/consumer/" + lineUID,
          {
            headers: {
              "Accept-Language": "th",
            },
          }
        );
        setConsumerList(result.data.data);
        setConsumerListNew(result.data.ext_data);
        if (!result.data.data.length && !result.data.ext_data.length) {
          router.push("/");
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
    if (lineUID && !error) {
      fetchData();
    }
  }, [lineUID, router, error]);

  const handleRefreshConsumer = async (check: boolean) => {
    try {
      setSpin(true);
      console.log("CONSUMER ACTION", check);
      const result = await axios.get(
        "https://api-aquater-test.adcm.co.th/line/consumer/" + lineUID,
        {
          headers: {
            "Accept-Language": "th",
          },
        }
      );
      setConsumerList(result.data.data);
      if (!result.data.data.length && !result.data.ext_data.length) {
        router.push("/");
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
              <p className={styles.title_cover}>ข้อมูลมิเตอร์น้ำ</p>
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
        <div className={styles.bgDiv}>
          {/* <Space direction="vertical" size="middle" style={{ maxWidth: "500px", display: 'flex' }}>
                    {data.length && data.map(consumer => (
                        <Card key={consumer.id}>
                            <Title level={4}>{`${consumer.id}`}</Title>
                            <Text>{`${consumer.firstname} ${consumer.lastname}`}</Text>
                            <Text>{consumer.address}</Text>
                            <Text>{`${consumer.subdistrict}, ${consumer.district}`}</Text>
                            <Text>{`${consumer.province} ${consumer.phone ? `- Tel. ${consumer.phone}` : ''}`}</Text>
                        </Card>
                    ))}
                </Space> */}
          <ConsumerListCard
            data={consumerList}
            onActionConsumer={handleRefreshConsumer}
          />

          {consumerListNew.length > 0 && (
            <>
              <Divider>รายการคำขอติดตั้ง</Divider>
              <ConsumerListCardNew data={consumerListNew} />
            </>
          )}
        </div>
      </main>
      <div style={{ height: "136px" }} />
      <footer className={styles.footer} style={{ backgroundColor: "#2c3e50" }}>
        <Row>
          <Col
            span={24}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "2rem",
              marginTop: "2rem",
            }}
          >
            <Button
              className={styles.button_style}
              style={{
                width: "382px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={handleClick}
            >
              {/* <Col span={12}> */}
              <Image
                src={plus}
                width={14}
                height={14}
                alt="Logo"
                style={{ marginRight: "1rem" }}
              />
              {/* </Col> */}
              {/* <Col span={12}> */}
              เพิ่มมิเตอร์น้ำ
              {/* </Col> */}
            </Button>
            <br></br>
          </Col>
        </Row>
      </footer>
      <ErrorHandling error={error} />
      </>
      )}
    </ConfigProvider>
  );
};

export default Meterlist;
