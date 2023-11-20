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
import ErrorHandling from "@/components/errorModal";
import Loader from "@/components/loader";

interface IResponse {
  type: string;
  status: number;
  message: string;
  data: any;
  error?: {
    message?: string;
  };
}

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

function Addmeter() {
  const [form] = useForm<any>();
  const [loading, setLoading] = useState(false);
  const [consumer, setConsumer] = useState<IConsumer | null>(null);
  const [isEvented, setIsEvented] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consumerList, setConsumerList] = useState<IConsumer[]>([]);
  const [isFail, setFail] = useState(false);
  const [isUsed, setUsed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [spin, setSpin] = useState(false);

  const { liffObject, liffError, profile } = useLIFF();
  // const profile = {userId : "U257c3b19eb73999c6954d7cdaa100499"}
  
  const [lineUID, setLineUID] = useState<string | null>(null);
  const router = useRouter();
  const { uuid, lid } = router.query;
  useEffect(() => {
    if (!lid) {
      setLineUID(profile?.userId);
    } else {
      setLineUID(lid.toString());
    }
  }, [lid, profile?.userId]);

  async function handleSubmit(values: any) {
    try {
      setSpin(true)
      const consumerID: string = values.consumerId;
      const consumerName: string = values.consumerName;
      setLoading(true);
      console.log("val", consumerID);
      const res = await fetch(
        "https://api-aquater-test.adcm.co.th/line/consumer/check/" +
          consumerID +
          "?name=" +
          consumerName +
          "&lineUID=" +
          lineUID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "th"
          },
        }
      );
      const data: IResponse = await res.json();
      console.log("RES", res);
      console.log("data TOP", data);
      if (res.ok) {
        if (data.status === 200) {
          console.log(data?.data);

          const consumerObj: IConsumer = data.data;
          setConsumer(consumerObj);
          console.log("CONSUMER", consumerObj);
          handleClick(consumerObj);
        } else {
          setFail(true);
          setConsumer(null);
          console.log("other", data);
        }
      } else {
        if (res.status === 400) {
          // ! this line and consumer already registed
          setUsed(true);
          console.log("ERROR: ", data.error?.message);
          // message.warning(data.error.message);
        } else if (res.status === 404) {
          // ! consumer not found
          setFail(true);
          // console.log("ERROR: ", data.error.message);
          // message.warning(data.error.message);
        } else {
          throw new Error(data.error?.message);
        }
      }

      setIsEvented(true);
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
        setError(new Error(error.response.data.error.message));
      } else {
        console.log("Error", error.message);
        setError(new Error(error.message));
      }
    } finally {
      setLoading(false);
      setSpin(false);
    }
  }

  const handleOk = () => {
    setFail(false);
    setUsed(false);
  };

  const handleCancel = () => {
    setFail(false);
    setUsed(false);
  };

  const handleClick = (e: any) => {
    // e.preventDefault();

    console.log(e, "e----->");
    router.push("/checkinfo/" + "?uuid=" + e.uuid + "&lid=" + lineUID);
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
    <div className={styles.headershape_full}></div>

      <header>
        <div className={styles.header_nocolor}>

          <Col span={24} style={{ display: "flex", alignItems: "center" }}>
            <Image src={logo} width={70} height={70} alt="Logo" />
            {/* <Col style={{ fontSize: '24px', fontWeight: 'Bold', color: '#FFFFFF' }}>Aquater</Col> */}
          </Col>
          <Row>
            {/* <Col span={24} className='text-color' style={{ fontSize: '28px', fontWeight: 'Bold', color: '#AED9FF', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ข้อมูลมิเตอร์น้ำ</Col> */}
          </Row>
        </div>
      </header>
      <main className={styles.main} style={{marginTop:"15vw"}}>
        <div style={{maxWidth:'1280px', margin:"auto",minHeight:"100vh"}}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Row> */}
          <Image src={logo} width={70} height={70} alt="Logo" />
          <Col
            className="text-color"
            style={{ fontSize: "40px", fontWeight: "Bold" }}
          >
            Aquater
          </Col>
          {/* </Row> */}
        </div>
        <Row style={{ display: "flex", justifyContent: "center" }}>
          <Col
            style={{ color: "#2C74B3", fontSize: "28px", fontWeight: "Bold" }}
          >
            เพิ่ม
          </Col>
          <Col
            style={{ color: "#0A2647", fontSize: "28px", fontWeight: "Bold" }}
          >
            มิเตอร์น้ำ
          </Col>
        </Row>

        <Form
          form={form}
          onFinish={handleSubmit}
          scrollToFirstError={true}
          // labelCol={{ span: 4 }}
          // wrapperCol={{ span: 24 }}
          // layout="inline"
          // style={{display:'flex',alignItems:'center',justifyItems:'center'}}
        >
          <Row style={{ fontSize: "20px", fontWeight: "Bold" }}>
            เลขผู้ใช้น้ำ{" "}
          </Row>
          {/* <Row>
            <Col span={24}>
            <Form.Item
            rules={[{ required: true, message: 'กรุณากรอกเลขผู้ใช้น้ำ' }]}
            name="consumerId"
            >
                <Input 
                        
                        placeholder="กรุณากรอกเลขผู้ใช้น้ำ เช่น 123456" 
                        />
                        
            </Form.Item>
            </Col>
            </Row> */}
          <Row>
            <Col span={24} style={{textAlign:"start"}}>
              <Form.Item name="consumerId" rules={[{ required: true, message: 'กรุณากรอกเลขผู้ใช้น้ำ' }]}>
                <Input
                  // 
                  // name="consumerId"
                  placeholder="กรุณากรอกเลขผู้ใช้น้ำ เช่น 123456"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ fontSize: "20px", fontWeight: "Bold" }}>
            ชื่อผู้ใช้น้ำ{" "}
          </Row>
          {/* <Form.Item
            rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้น้ำ' }]}
            name="consumer_name"
            >
                <Input 
                        
                        placeholder="กรุณากรอกชื่อผู้ใช้น้ำ เช่น คนดี คนเดิม" 
                        />
            </Form.Item> */}
          <Row>
            <Col span={24}  style={{textAlign:"start"}}>
              <Form.Item name="consumerName" rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้น้ำ' }]}>
                <Input
                  // name=''
                  placeholder="กรุณากรอกชื่อผู้ใช้น้ำ เช่น คนดี คนเดิม"
                />
              </Form.Item>
            </Col>
          </Row>
          <br></br>
          {/* <Row> */}
          {/* <Col span={24}> */}
          {/* <Form.Item> */}
          {/* <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button> */}
          <Button
            className={styles.button_style}
            style={{ width: "158px", height: "40px" }}
            htmlType="submit"
            loading={loading}
          >
            ตกลง
          </Button>

          {/* </Form.Item> */}
          {/* </Col> */}
          {/* </Row> */}
        </Form>

        <Modal footer={null} width="auto" onCancel={handleCancel} open={isFail}>
          <div>
            {/* <Row> */}
            {/* <Col span={24} style={{ display: 'flex', alignItems: 'center'}}> */}

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
              ไม่พบข้อมูลผู้ใช้น้ำในฐานข้อมูล
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
              กรุณาตรวจสอบข้อมูลให้ละเอียด และถูกต้องอีกครั้งครับ
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
                htmlType="submit"
                loading={loading}
                onClick={handleOk}
              >
                ตกลง
              </Button>
            </div>
          </div>
        </Modal>
        <Modal footer={null} width="auto" open={isUsed} onCancel={handleCancel} onOk={handleOk}>
          <div>
            {/* <Row> */}
            {/* <Col span={24} style={{ display: 'flex', alignItems: 'center'}}> */}

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
              คุณเคยเพิ่มมิเตอร์น้ำเลขนี้แล้ว
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
              กรุณาตรวจสอบข้อมูลให้ละเอียด และถูกต้องอีกครั้งครับ
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
                htmlType="submit"
                loading={loading}
                onClick={handleOk}
              >
                ตกลง
              </Button>
            </div>
          </div>
        </Modal>

        </div>
       
      </main>
      <ErrorHandling error={error} />
      </>
      )}
    </ConfigProvider>
  );
}

export default Addmeter;
