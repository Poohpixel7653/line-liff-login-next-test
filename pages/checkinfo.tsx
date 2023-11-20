import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../resources/logo.png";
import styles from "../styles/Home.module.css";
import {
  Col,
  Row,
  ConfigProvider,
  Checkbox,
  Button,
  Space,
  message,
  Divider,
} from "antd";
import Head from "next/head";
import circle from "../resources/circle.png";
import branch from "../resources/branch.png";
import wather from "../resources/wather.png";
import people from "../resources/people.png";
import address from "../resources/address.png";
import router, { useRouter } from "next/router";
import axios from "axios";
import useLIFF from "@/hooks/useLiff";
import ErrorHandling from "@/components/errorModal";
import { IResponse } from "@/interfaces/payload.interface";
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
  meters: IMeter[];
  agency: any;
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

function Checkinfo() {
  // const [consumerList, setConsumerList] = useState<IConsumer[]>([]);
  const [consumer, setConsumer] = useState<IConsumer | null>(null);
  const { liffObject, liffError, profile } = useLIFF();
  // const profile = { userId: "U257c3b19eb73999c6954d7cdaa100499" };

  const [lineUID, setLineUID] = useState<string | null>(null);
  const [meterStr, setMeterStr] = useState<string | null>(null);
  const [meterLen, setMeterLen] = useState<number | 0>(0);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpin(true)
        const result = await axios.get(
          "https://api-aquater-test.adcm.co.th/consumer/uuid/" +
            uuid +
            "?lid=" +
            lineUID,
          {
            headers: {
              "Accept-Language": "th",
            },
          }
        );
        // setConsumerList(result.data.data);
        const consumer: IConsumer = result.data.data;
        setConsumer(consumer);
        if (consumer.meters.length > 0) {
          const str_meters: string =
            consumer.meters.length == 1
              ? (consumer.meters[0].meter_code || "ไม่ระบุ") +
                (consumer.meters[0].disabled == true ? " (ปิดใช้งาน)" : "")
              : consumer.meters
                  .map(
                    (m) =>
                      (m.meter_code || "ไม่ระบุ") +
                      (m.disabled == true ? " (ปิดใช้งาน)" : "")
                  )
                  .join(", ");
          setMeterStr(str_meters);
          setMeterLen(consumer.meters.length);
        }
        console.log(consumer, "data---->");
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

    if (lineUID && lineUID != undefined && !error) {
      fetchData();
    }
  }, [lineUID, uuid,error]);

  async function confirmSubmit() {
    try {
      setSpin(true)
      console.log("check value", consumer?.id, lineUID);
      if (!lineUID || lineUID == null || lineUID == undefined) {
        message.error("line UID undefined");
      } else {
        const res = await fetch(
          "https://api-aquater-test.adcm.co.th/line/consumer/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept-Language": "th",
            },
            body: JSON.stringify({
              lineUID: lineUID,
              // lineUID: "Uf9915e1416c18423b351f870a76372fd",
              consumerID: consumer?.id,
            }),
          }
        );
        const data: IResponse = await res.json();

        if (data.status === 201) {
          console.log(data.data);

          // const consumerObj: IConsumer = data.data;
          // setConsumer(consumerObj);
          // console.log("CONSUMER", consumerObj);

          router.push("/logincomplete/" + "?uuid=" + uuid + "&lid=" + lineUID);
        } else {
          if(!res.ok) {
            throw new Error(data.error?.message)
          }
        }
      }

      // setIsEvented(true);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
        setError(new Error(error.response.data.error.message));
      } else {
        console.log("Error", error.message);
        setError(new Error(error.message));
      }
    }finally {
      setSpin(false);
    }
  }

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
              ข้อมูลลงทะเบียน
            </Col>
          </Row>
        </div>
      </header>
      <main className={styles.body}>
        <div className={styles.bgDiv2}>
          {/* <Row>
                    <Image
                        src={circle}
                    />
                    <Col style={{color:'#2C74B3',fontSize:'20px'}}>สาขาผู้ใช้น้ำ</Col>
                    <Col >ข้อมูล</Col>
                </Row>
                <Row>
                    <Col span={24}>col</Col>
                </Row>
                <Row>
                    <Col span={24}>col</Col>
                </Row>
                <Row>
                    <Col span={24}>col</Col>
                </Row> */}

          <Row style={{ paddingTop: "1rem" }}>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Col
                style={{
                  backgroundColor: "#2C74B3",
                  width: "32px",
                  height: "32px",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src={branch}
                  width={20}
                  height={15}
                  // style={{backgroundColor:'#2C74B3'}}
                  alt="Logo"
                />
              </Col>
            </Col>
            <Col span={12} style={{ marginLeft: "2rem" }}>
              <Col span={24} style={{ color: "#2C74B3", fontSize: "20px" }}>
                สาขาผู้ใช้น้ำ
              </Col>
              <Col span={24} style={{ fontSize: "16px" }}>
                {consumer?.agency?.name}
              </Col>
            </Col>
          </Row>

          <Divider style={{ margin: "10px 0" }} />

          <Row style={{ paddingTop: "1rem" }}>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Col
                style={{
                  backgroundColor: "#2C74B3",
                  width: "32px",
                  height: "32px",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image src={wather} width={14} height={19} alt="Logo" />
              </Col>
            </Col>
            <Col span={12} style={{ marginLeft: "2rem" }}>
              <Col span={24} style={{ color: "#2C74B3", fontSize: "20px" }}>
                เลขผู้ใช้น้ำ
              </Col>
              <Col span={24} style={{ fontSize: "16px" }}>
                {consumer?.id}
              </Col>
            </Col>
          </Row>

          <Divider style={{ margin: "10px 0" }} />

          <Row style={{ paddingTop: "1rem" }}>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Col
                style={{
                  backgroundColor: "#2C74B3",
                  width: "32px",
                  height: "32px",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image src={people} width={16} height={16} alt="Logo" />
              </Col>
            </Col>
            <Col span={12} style={{ marginLeft: "2rem" }}>
              <Col span={24} style={{ color: "#2C74B3", fontSize: "20px" }}>
                ชื่อผู้ใช้น้ำ
              </Col>
              <Col span={24} style={{ fontSize: "16px" }}>
                {consumer?.firstname} {consumer?.lastname}
              </Col>
            </Col>
          </Row>

          <Divider style={{ margin: "10px 0" }} />

          <Row style={{ paddingTop: "1rem" }}>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Col
                style={{
                  backgroundColor: "#2C74B3",
                  width: "32px",
                  height: "32px",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image src={address} width={16} height={16} alt="Logo" />
              </Col>
            </Col>
            <Col span={12} style={{ marginLeft: "2rem" }}>
              <Col span={24} style={{ color: "#2C74B3", fontSize: "20px" }}>
                ที่อยู่
              </Col>
              <Col span={24} style={{ fontSize: "16px" }}>
                {consumer?.address} {consumer?.moo} {consumer?.subdistrict} {consumer?.district}{" "}
                {consumer?.province}
              </Col>
            </Col>
          </Row>

          <Divider style={{ margin: "10px 0" }} />

          <Row style={{ paddingTop: "1rem" }}>
            <Col
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Col
                style={{
                  backgroundColor: "#2C74B3",
                  width: "32px",
                  height: "32px",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image src={address} width={16} height={16} alt="Logo" />
              </Col>
            </Col>
            <Col span={12} style={{ marginLeft: "2rem" }}>
              <Col span={24} style={{ color: "#2C74B3", fontSize: "20px" }}>
                รายการมาตรน้ำทั้งหมด
              </Col>
              <Col span={24} style={{ width: "100%", fontSize: "16px" }}>
                จำนวนมาตรน้ำ: {meterLen} รหัสบนมาตรน้ำ: {meterStr}
              </Col>
            </Col>
          </Row>

          <Divider style={{ margin: "10px 0" }} />

          <Row style={{ paddingTop: "1rem" }}>
            <Col span={24} style={{ textAlign: "end" }}>
              <Button className={styles.button_style} onClick={confirmSubmit}>
                ยืนยันข้อมูลลงทะเบียน{" "}
              </Button>
            </Col>
          </Row>
        </div>
      </main>
      <ErrorHandling error={error} />

      {/* <footer style={{ padding: "2rem", maxWidth:"1280px" }}>
        <Row>
          <Col span={12}></Col>
          <Col span={12}>
            <Button className={styles.button_style} onClick={confirmSubmit}>
              ยืนยันข้อมูลลงทะเบียน{" "}
            </Button>
          </Col>
        </Row>
      </footer> */}

</>
      )}
    </ConfigProvider>
  );
}

export default Checkinfo;
