import type Liff from "@line/liff";
// import { useLoadScript } from '@react-google-maps/api';
import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  Spin,
  Form,
  Button,
  Input,
  Card,
  Typography,
  message,
  Divider,
  Row,
  Col,
  Modal,
  ConfigProvider,
  Skeleton,
} from "antd";
const { Title, Text } = Typography;
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { StaticGoogleMap, Marker, Path } from "react-static-google-map";
import { useRouter } from "next/router";
import ConsumerListCard from "@/components/consumerListCard";
import logo from "../resources/logo.png";
import errorImg from "../resources/error.png";
import Image from "next/image";
import useLIFF from "@/hooks/useLiff";
import Spinner from "@/components/spinner";
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

const mapZoom: string = "10";

const Home: NextPage = () => {
  const { liffObject, liffError, profile } = useLIFF();
  // const profile = {userId : "U257c3b19eb73999c6954d7cdaa100499"}
  const [checkedList, setCheckedList] = useState(false);
  const [form] = useForm<any>();
  const [loading, setLoading] = useState(false);
  const [consumer, setConsumer] = useState<IConsumer | null>(null);
  const [isEvented, setIsEvented] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [consumerList, setConsumerList] = useState<IConsumer[]>([]);
  const [isFail, setFail] = useState(false);
  const [isUsed, setUsed] = useState(false);
  const router = useRouter();
  const [lineUID, setLineUID] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    setLineUID(profile?.userId);
  }, [profile?.userId]);

  const handleClick = (e: any) => {
    // const lineUID: string = profile?.userId;

    // e.preventDefault();
    console.log(e, "e----->");
    router.push("/policy/" + "?uuid=" + e.uuid + "&lid=" + lineUID);
    // e.preventDefault();
    // router.push("/meterlist/?lid=" + "lineUID");
    // liffProfile.userId);
  };

  const handleTestConsumerList = (e: any) => {
    // e.preventDefault();
    // console.log(e,"e----->")
    // router.push("/policy/"+"?uuid="+e.uuid+ "&lineUID=" + "Uf9915e1416c18423b351f870a76372fd"
    // );
    // const lineUID: string = profile?.userId;

    e.preventDefault();
    router.push("/meterlist/?lid=" + lineUID);
    // liffProfile.userId);
  };

  const handleTestPaymentClick = (e: any) => {
    e.preventDefault();
    // const lineUID: string = profile?.userId;

    router.push("/payment/?lid=" + lineUID);
    // liffProfile.userId);
  };

  async function handleSubmit(values: any) {
    try {
      setSpin(true);
      console.log("VALUE ---> ", values);
      const consumerID: string = values.consumerId;
      const consumerName: string = values.consumerName;
      // const lineUID: string = profile?.userId;

      setLoading(true);
      console.log("val", consumerID);
      const res = await fetch(
        "https://api-aquater-test.adcm.co.th/line/consumer/check/" +
          values.consumerId +
          "?name=" +
          values.consumerName +
          "&lineUID=" +
          lineUID,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "th",
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
        } else if (res.status === 404) {
          // ! consumer not found
          setFail(true);
        } else {
          throw new Error(data.error?.message);
        }
      }

      setIsEvented(true);
    } catch (error) {
      console.error(error);
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

  // async function confirmSubmit(consumer: IConsumer, liffProfile: any) {
  //   try {
  //     setSpin(true)
  //     const consumerID: number = consumer.id;
  //     const lineUID: string = liffProfile.userId;
  //     setLoading(true);
  //     console.log("check value", consumer, liffProfile);
  //     const res = await fetch("https://api-aquater-test.adcm.co.th/line/consumer/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Accept-Language": "th",
  //       },
  //       body: JSON.stringify({
  //         lineUID: lineUID,
  //         consumerID: consumerID,
  //       }),
  //     });
  //     const data: IResponse = await res.json();
  //     if (data.status === 200) {
  //       console.log(data.data);

  //       const consumerObj: IConsumer = data.data;
  //       setConsumer(consumerObj);
  //       console.log("CONSUMER", consumerObj);
  //     } else {
  //       setConsumer(null);
  //       if(!res.ok) {
  //         throw new Error(data.error?.message)
  //       }
  //     }

  //     setIsEvented(true);
  //   } catch (error:any) {
  //     if (error.response) {
  //       console.log(error.response.data);
  //       setError(new Error(error.response.data.error.message));
  //     } else {
  //       console.log("Error", error.message);
  //       setError(new Error(error.message));
  //     }
  //   } finally {
  //     setLoading(false);
  //     setSpin(false)

  //   }
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSpin(true);
        const result = await axios.get(
          "https://api-aquater-test.adcm.co.th/line/consumer/" + lineUID,
          // ?+ liffProfile.userId
          {
            headers: {
              "Accept-Language": "th",
            },
          }
        );
        setConsumerList(result.data.data);
        if (result.data.data.length > 0 || result.data.ext_data.length > 0) {
          router.push("/meterlist/?lid=" + lineUID);
        } else {
          setCheckedList(true);
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

  function temp(forceRestart: boolean): void {
    throw new Error("Function not implemented.");
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
      {/* <div> */}
      {/* <Head>
          <title>Aquater Line Service</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link rel="icon" href="/logo.svg" />
        </Head> */}
      {/* <div> */}
      {/* <> */}
      <div className={styles.headershape_full}></div>
      <header>
        <div className={styles.header_nocolor}>
          <Col span={24} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ height: "70px" }}></div>
            {/* <Col style={{ fontSize: '24px', fontWeight: 'Bold', color: '#FFFFFF' }}>Aquater</Col> */}
          </Col>
          <Row>
            {/* <Col span={24} className='text-color' style={{ fontSize: '28px', fontWeight: 'Bold', color: '#AED9FF', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>ข้อมูลมิเตอร์น้ำ</Col> */}
          </Row>
        </div>
      </header>

      <main className={styles.main} style={{ marginTop: "15vw" }}>
        <div style={{ maxWidth: "1280px", margin: "auto", minHeight: "100vh" }}>
          {!checkedList ? (
            <Spinner />
          ) : (
            <div>
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
                  style={{
                    color: "#2C74B3",
                    fontSize: "28px",
                    fontWeight: "Bold",
                  }}
                >
                  ลงทะเบียน
                </Col>
                <Col
                  style={{
                    color: "#0A2647",
                    fontSize: "28px",
                    fontWeight: "Bold",
                  }}
                >
                  เข้าใช้งาน
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

                <Row>
                  <Col span={24} style={{ textAlign: "start" }}>
                    <Form.Item
                      name="consumerId"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกเลขผู้ใช้น้ำ",
                        },
                      ]}
                    >
                      <Input
                        // rules={[{ required: true, message: 'กรุณากรอกเลขผู้ใช้น้ำ' }]}
                        // name="consumerId"
                        placeholder="กรุณากรอกเลขผู้ใช้น้ำ เช่น 123456"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ fontSize: "20px", fontWeight: "Bold" }}>
                  ชื่อผู้ใช้น้ำ{" "}
                </Row>
                <Row>
                  <Col span={24} style={{ textAlign: "start" }}>
                    <Form.Item
                      name="consumerName"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกชื่อผู้ใช้น้ำ",
                        },
                      ]}
                    >
                      <Input
                        // rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้น้ำ' }]}
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
                  htmlType="submit"
                  loading={loading}
                  // onClick={handleSubmit}
                >
                  ลงทะเบียนเข้าใช้งาน
                </Button>
                {/* </Form.Item> */}
                {/* </Col> */}
                {/* </Row> */}
              </Form>

              <Modal
                footer={null}
                width="auto"
                onCancel={handleCancel}
                open={isFail}
                onOk={handleOk}
              >
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
              <Modal
                footer={null}
                width="auto"
                onCancel={handleCancel}
                open={isUsed}
                onOk={handleOk}
              >
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
          )}
        </div>
      </main>
      {/* </>
        </div>
      </div> */}
      <ErrorHandling error={error} />

      </>
      )}
    </ConfigProvider>
  );
};

export default Home;
