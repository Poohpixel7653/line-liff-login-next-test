import { Col, Row, ConfigProvider, Button } from "antd";
import Image from "next/image";
import logo from "../resources/logo.png";
import styles from "../styles/Home.module.css";
import React, { useEffect, useState } from "react";
import success from "../resources/success.png";
import router, { useRouter } from "next/router";
import useLIFF from "@/hooks/useLiff";


export default function Logincomplete() {
  const { liffObject, liffError, profile } = useLIFF();
  // const profile = {userId : "U257c3b19eb73999c6954d7cdaa100499"}
  
  const [lineUID, setLineUID] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

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
    router.push("/meterlist/" + "?lid=" + lineUID);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Prompt",
        },
      }}
    >
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
      >
        <Row>
          <Col
            span={24}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "280px",
              height: "280px",
              margin: "5px"

            }}
          >
            {/* <Col
              style={{
                backgroundColor: "#97B67F",
                width: "186px",
                height: "186px",
                borderRadius: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            > */}
              <div className={[styles.circle1, styles.circle_green].join(" ")} />
              <div className={[styles.circle2, styles.circle_green_half].join(" ")} />
              <div className={[styles.circle3, styles.circle_green_half, styles.pulse].join(" ")}>
                <Image

                  src={success}
                  width={83.63}
                  height={64.31}
                  // style={{backgroundColor:'#2C74B3'}}
                  alt="Logo"
                />
              </div>
            {/* </Col> */}
          </Col>
        </Row>
        <Row>
          <Col
            span={24}
            className="text-color"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "Bold",
              color: "#ffffff",
            }}
          >
            ลงทะเบียนสำเร็จแล้ว
          </Col>
          <Col
            span={24}
            className="text-color"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              color: "#ffffff",
            }}
          >
            ขอบคุณที่เข้าร่วมการลงทะเบียนครับ
          </Col>
        </Row>

        <Button
          className={styles.button_style}
          style={{ width: "382px", height: "40px", marginTop: "2rem" }}
          onClick={handleClick}
        >
          ตกลง{" "}
        </Button>
      </main>
      {/* <footer style={{backgroundColor:'#2c3e50'}}>
                <Row>
                    <Col span={24} style={{display: 'flex', alignItems: 'center', justifyContent: 'center',marginBottom:'2rem'}}>
                       <Button className={styles.button_style} style={{width:'382px',height:'40px'}} onClick={handleClick}>ตกลง </Button>
                       <br></br>

                    </Col>
                </Row>

            </footer> */}

    </ConfigProvider>
  );
}
