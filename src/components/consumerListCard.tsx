import { Card, Typography, Space, Col, Row, Popconfirm, message } from "antd";
import Image from "next/image";
const { Title, Text } = Typography;
import { RestOutlined } from "@ant-design/icons";
import { IResponse } from "@/interfaces/payload.interface";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./../../styles/Home.module.css";
import useLIFF from "@/hooks/useLiff";
import ErrorHandling from "@/components/errorModal";

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
}

type ConsumersProps = {
  data: IConsumer[];
  onActionConsumer: (forceRestart: boolean) => void;
};

const ConsumerListCard: React.FC<ConsumersProps> = ({
  data,
  onActionConsumer,
}) => {
  console.log("check, ", data);
  // const [consumerList, setConsumerList] = useState<IConsumer[]>(data);

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

  const confirm = async (consumer: IConsumer) => {
    try {
      setSpin(true);
      const res = await fetch("https://api-aquater-test.adcm.co.th/line/unlink/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "th",
        },
        body: JSON.stringify({
          consumerID: consumer.id,
          lineUID: lineUID,
        }),
      });
      if (res.ok) {
        // ! DELETE OK REFRESH DATA LIST
        onActionConsumer(true);
      } else {
        const data: IResponse = await res.json();
        throw new Error(data.error?.message);
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
    // message.success("Click on Yes");
  };

  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    // message.error("Click on No");
  };
  return (
    <Space direction="vertical" size="middle">
      {data.length > 0 &&
        data.map((consumer) => (
          <Card
            style={{
              width: 360,
              borderRadius: 20,
              boxShadow: " 4px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
            key={`${consumer.id}-${consumer.meters.id}`}
          >
            {/* <Row>ยกเลิกการเชื่อมต่อ</Row> */}
            {consumer.id && (
              <>
                <Row style={{ justifyContent: "end" }}>
                  <Popconfirm
                    title="ยกเลิกการเชื่อมต่อ"
                    description="คุณต้องการยกเลิกการเชื่อมต่อกับผู้ใช้น้ำบัญชีนี้ใช่หรือไม่?"
                    onConfirm={() => {
                      confirm(consumer);
                    }}
                    onCancel={() => {
                      cancel;
                    }}
                    okText="ใช่"
                    cancelText="ไม่"
                  >
                    <RestOutlined style={{ color: "red" }} />
                  </Popconfirm>
                </Row>
              </>
            )}

            <Row wrap={false} style={{}}>
              <Col
                flex="none"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Col
                  style={{
                    width: "90px",
                    height: "90px",
                    margin: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className={[styles.circle1, styles.circle_blue].join(" ")}
                  />
                  <div
                    className={[styles.circle2, styles.circle_blue_half].join(
                      " "
                    )}
                  />
                  <div
                    className={[styles.circle3, styles.circle_blue_half].join(
                      " "
                    )}
                  >
                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: "32px",
                        fontWeight: "Bold",
                      }}
                    >{`${consumer.id}`}</div>
                  </div>
                </Col>
              </Col>
              <Col flex="auto" style={{ marginLeft: "2rem" }}>
                <Col
                  span={24}
                  style={{
                    color: "#2C74B3",
                    fontSize: "20px",
                    fontWeight: "Bold",
                  }}
                >
                  {consumer.meters?.meter_code || "ไม่ระบุ"}
                </Col>
                <Col
                  span={24}
                  style={{ fontSize: "16px", fontWeight: "Bold" }}
                >{`${consumer.firstname} ${consumer.lastname}`}</Col>
                <Col span={24} style={{ fontSize: "16px" }}>
                  {consumer?.address} {consumer?.moo} 
                </Col>
                <Col span={24} style={{ fontSize: "16px" }}>
                </Col>
                <Col
                  span={24}
                  style={{ fontSize: "16px" }}
                >{`${consumer.subdistrict}, ${consumer.district}`}</Col>
                <Col span={24} style={{ fontSize: "16px" }}>{`${
                  consumer.province
                } ${consumer.phone ? `- Tel. ${consumer.phone}` : ""}`}</Col>
              </Col>
            </Row>
          </Card>
        ))}
      <ErrorHandling error={error} />
    </Space>
  );
};

export default ConsumerListCard;
