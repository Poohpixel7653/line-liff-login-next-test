import {
  Button,
  Col,
  ConfigProvider,
  Form,
  Input,
  Modal,
  Row,
  message,
} from "antd";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import logo from "../resources/logo.png";
import { useForm } from "antd/lib/form/Form";
import { useRouter } from "next/router";
import errorImg from "../resources/error.png";
import useLIFF from "@/hooks/useLiff";
import axios from "axios";
import Loader from "@/components/loader";

function SendBackImage() {
  const { liffObject, liffError, profile } = useLIFF();
  // const profile = {userId : "U257c3b19eb73999c6954d7cdaa100499"}

  const [lineUID, setLineUID] = useState<string | null>(null);
  const [spin, setSpin] = useState(false);

  const router = useRouter();
  const { image_uuid, lid } = router.query;

  useEffect(() => {
    if (!lid) {
      setLineUID(profile?.userId);
    } else {
      setLineUID(lid.toString());
    }
    setSpin(true);

    const callback = async () => {
      const result = await axios.get(
        "https://api-aquater-test.adcm.co.th/line/picture/" +
          image_uuid +
          "?lid=" +
          lineUID
          , {
            headers: {
              "Accept-Language": "th",
            },
          }
        );
    };
    if (lineUID) {
      callback().then(() => {
        setSpin(false)
        liffObject.closeWindow();
      });
    }
  }, [image_uuid, lid, liffObject, lineUID, profile?.userId]);

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
      <header>
        <div className={styles.header} style={{backgroundColor:"#0A2647"}}>
          <Col span={24} style={{ display: "flex", alignItems: "center" }}>
            <Image src={logo} width={70} height={70} alt="Logo" />
            <Col
              style={{ fontSize: "24px", fontWeight: "Bold", color: "#FFFFFF" }}
            >
              Aquater
            </Col>
          </Col>
          <Row>
            {/* <Col span={24} className='text-color' style={{ fontSize: '28px', fontWeight: 'Bold', color: '#AED9FF', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ข้อมูลลงทะเบียน</Col> */}
          </Row>
        </div>
      </header>
      <main
        className={styles.full_height}
        style={{ backgroundColor: "#0A2647" }}
      ></main>
      </>
      )}
    </ConfigProvider>
  );
}

export default SendBackImage;
