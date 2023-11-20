import { Card, Typography, Space, Col, Row, Popconfirm, message } from "antd";
import Image from "next/image";
const { Title, Text } = Typography;
import { RestOutlined } from "@ant-design/icons";
import { IResponse } from "@/interfaces/payload.interface";
import { useRouter } from "next/router";
import { useState } from "react";
import { IConsumerNew } from "@/interfaces/consumer.interface";
import styles from "./../../styles/Home.module.css";

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
  meters: IMeter[];
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
  data: IConsumerNew[];
};


// typp object key straig and value string
type statusColor = {
  [key: string]: string;
};


const ConsumerListCardNew: React.FC<ConsumersProps> = ({ data }) => {
  const [error, setError] = useState<Error | null>(null);
 
    const statusColor:statusColor= {
      created: "#A0A0A0",
      received: "#DB9E00",
      processing: "#2C74B3",
      done: "#97B67F",
    }
    const statusText:statusColor = {
      created: "ส่งคำขอ",
      received: "รับทราบคำขอ",
      processing: "กำลังดำเนินการ",
      done: "เสร็จสิ้น",
    }



    //create status return text function 
   
  
  
    // const listOfStatus = ["created", "received", "processing", "done"];
 //create if condition to change color and text 

    // if (status === "created") {
    //   setStatusColor("#111111")
    //   setColorAndText({color: "#111111", text: "ส่งคำขอ"})
    // } else if (status === "received") {
    //   setStatusColor("#222222")
    //   setColorAndText({color: "#222222", text: "รับทราบคำขอ"})
    // } else if (status === "processing") {
    //   setStatusColor("#333333")
    //   setColorAndText({color: "#333333", text: "กำลังดำเนินการ"})
    // } else if (status === "done") {
    //   setStatusColor("#444444")
    //   setColorAndText({color: "#444444", text: "เสร็จสิ้น"})
    // } else {
    //   setStatusColor("#A0A0A0")
    //   setColorAndText({color: "#A0A0A0", text: "---"})

 
  return (
    <Space direction="vertical" size="middle">
      {data.length > 0 &&
        data.map((consumer) => (
          <Card style={{ width: 360, borderRadius:20, boxShadow:" 4px 4px 6px rgba(0, 0, 0, 0.25)"}} key={consumer.id}>
            <Row wrap={false} style={{}}>
            <Col
                  span={24}
                  style={{
                    backgroundColor: statusColor[`${consumer.status as string}`],
                    color: "#FFFFFF",
                    fontSize: "20px",
                    fontWeight: "Bold",
                    borderRadius: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "40px",
                  }}
                >
                  {statusText[`${consumer.status as string}`]}
                </Col>
            </Row>
            <Row wrap={false} style={{ paddingTop: "1rem" }}>
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
              <div className={[styles.circle1, styles.circle_gray].join(" ")} />
              <div className={[styles.circle2, styles.circle_gray_half].join(" ")} />
              <div className={[styles.circle3, styles.circle_gray_half].join(" ")}>
                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: "32px",
                        fontWeight: "Bold",
                      }}
                    >!</div>
                  </div>
                </Col>
              </Col>
              <Col flex="auto" style={{ marginLeft: "2rem" }}>
                {/* <Col
                  span={24}
                  style={{
                    backgroundColor: statusColor[`${consumer.status as string}`],
                    color: "#2C74B3",
                    fontSize: "20px",
                    fontWeight: "Bold",
                  }}
                >
                  {statusText[`${consumer.status as string}`]}
                </Col> */}
                <Col 
                  span={24}
                  style={{ fontSize: "16px", fontWeight: "Bold" }}
                >{`${consumer.firstname} ${consumer.lastname}`}</Col>
                <Col span={24} style={{ fontSize: "16px" }}>
                  {consumer?.location_address}{" "} {" "}{consumer?.location_moo}
                </Col>
                <Col
                  span={24}
                  style={{ fontSize: "16px" }}
                >{`${consumer.location_subdistrict}, ${consumer.location_district}`}</Col>
                <Col span={24} style={{ fontSize: "16px" }}>
                 {consumer.location_province}</Col>
                 {consumer.location_phone ? (
                    <Col span={24} style={{ fontSize: "16px" }}>
                    Tel.{" "}{consumer.location_phone}</Col>
                 ) : ("")}
              </Col>
            </Row>
          </Card>
        ))}

    </Space>
  );
};

export default ConsumerListCardNew;
