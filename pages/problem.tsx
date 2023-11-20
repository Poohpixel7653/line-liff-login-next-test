import React, { useEffect } from "react";
import router, { useRouter } from "next/router";
import type { NextPage } from "next";
import axios from "axios";
import logo from "../resources/logo.png";
import iconcam from "../resources/iconcam.png";
import { useForm } from "antd/lib/form/Form";
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
} from "antd";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { useState } from "react";
import mapboxgl, { LngLat, LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import LocationPicker from "@/components/locationPicker";
import { UploadOutlined } from "@ant-design/icons";
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

interface FormValues {
  name: string;
  email: string;
  image: File | null;
}

function Problem() {
  const { liffObject, liffError, profile } = useLIFF();
  // const profile = { userId: "U257c3b19eb73999c6954d7cdaa100499" };

  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [form] = useForm<any>();
  const [selectedLocation, setSelectedLocation] = useState<LngLat>(
    new LngLat(100.48334205798255, 13.768639052886414)
  );
  const [isFail, setFail] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [spin, setSpin] = useState(false);

  const handleOk = () => {
    setFail(false);
    // setUsed(false);
  };

  const handleCancel = () => {
    setFail(false);
    // setUsed(false);
  };
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

  const handleLocationSelected = (location: LngLat) => {
    console.log(location.lat, location.lng);
    setSelectedLocation(location);
  };

  const handleImageChange = (file: File) => {
    if (file) {
      setUploadedImage(file);
    } else {
      setUploadedImage(null);
    }
  };

  const beforeImageUpload = (file: File) => {
    handleImageChange(file);
    return false;
  };
  const handleChange = (file: File) => {
    handleImageChange(file);
    return false;
  };

  async function handleSubmit(values: any) {
    try {
      setSpin(true);
      const report_name: string = values.consumerName;
      const phone: string = values.consumerPhone;
      const description: string = values.consumerDetail;
      const location_description: string = values.consumerLandmark;
      const _location: {
        latitude: string;
        longitude: string;
      } = {
        latitude: selectedLocation.lat.toString(),
        longitude: selectedLocation.lng.toString(),
      };
      
      const image: File = uploadedImage!;

      const location: string = JSON.stringify(_location);

      const data = new FormData();
      data.append("report_name", report_name);
      data.append("phone", phone);
      data.append("description", description);
      data.append("location", location);
      data.append("location_description", location_description);
      data.append("line_uid", lineUID!);
      data.append("image", image);
      // Add more form fields as needed
      console.log(data);
      const response = await axios.post(
        "https://api-aquater-test.adcm.co.th/issue/report/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept-Language": "th",
          },
        }
      );
      console.log(response.data); // Handle the response as needed
      if (response.status === 201) {
        message.success("ส่งข้อมูลสำเร็จ");
        router.push("/problem_complete/");
      setSpin(false);
      } else {
        setFail(true);
        message.error("ส่งข้อมูลไม่สำเร็จ");
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.data);
        setError(new Error(error.response.data.error.message));
      } else {
        console.log("Error", error.message);
        setError(new Error(error.message));
      }
      setSpin(false);

    }finally {
      setSpin(false);
    }
  }

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
    message.success("Image removed.");
  };

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
            <Col span={24} style={{ display: "flex", alignItems: "center" }}>
              <Image src={logo} width={70} height={70} alt="Logo" />
              <Col
                style={{
                  fontSize: "24px",
                  fontWeight: "Bold",
                  color: "#FFFFFF",
                }}
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
                แจ้งเหตุ/ปัญหา
              </Col>
            </Row>
          </div>
        </header>
        <main className={styles.body}>
          <div className={styles.bgDiv}>
            <Form form={form} onFinish={handleSubmit} scrollToFirstError={true}>
              <Row>
                <Col
                  span={24}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Form.Item
                    name="picture"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเพิ่มรูปภาพ",
                      },
                    ]}
                  >
                    {/* <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={beforeImageUpload}
                  >
                    <Button
                      style={{border:"none"}}
          
                      icon={<Image src={iconcam} alt="Custom Icon"></Image>}
                      disabled={uploadedImage !== null}
                    >
                    </Button>
                  </Upload>
                  {uploadedImage && (
                    <div>
                      <Image
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Preview"
                        style={{ maxWidth: "100%" }}
                      ></Image>
                      <Button onClick={handleImageRemove}>Delete Image</Button>
                    </div>
                  )} */}

                    {uploadedImage ? (
                      <div onClick={handleImageRemove}>
                        <Image
                          src={URL.createObjectURL(uploadedImage)}
                          style={{
                            objectFit: "cover",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          width={200}
                          height={200}
                          alt="Uploaded Image"
                        />
                      </div>
                    ) : (
                      <div>
                        <Upload
                          name="image"
                          accept="image/*"
                          beforeUpload={beforeImageUpload}
                        >
                          <Image src={iconcam} alt="Custom Icon"></Image>
                        </Upload>
                      </div>
                    )}
                  </Form.Item>
                </Col>
              </Row>

              <Row
              // style={{ fontSize: "20px", fontWeight: "Bold", color: "#2C74B3" }}
              >
                {/* ชื่อผู้แจ้ง{" "} */}
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  ชื่อผู้แจ้ง
                </Col>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#E34545",
                  }}
                >
                  *
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="consumerName"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกชื้อผู้แจ้ง",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกชื่อผู้แจ้ง" />
                  </Form.Item>
                </Col>
              </Row>

              <Row
              // style={{ fontSize: "20px", fontWeight: "Bold", color: "#2C74B3" }}
              >
                {/* เบอร์โทร{" "} */}
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  เบอร์โทร
                </Col>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#E34545",
                  }}
                >
                  *
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="consumerPhone"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกเบอร์โทร",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกเบอร์โทร" />
                  </Form.Item>
                </Col>
              </Row>

              <Row
                style={{
                  fontSize: "20px",
                  fontWeight: "Bold",
                  color: "#2C74B3",
                }}
              >
                รายละเอียดปัญหา{" "}
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="consumerDetail">
                    <Input placeholder="กรุณากรอกปัญหา เช่น พบท่อแตกหรือท่อรั่ว" />
                  </Form.Item>
                </Col>
              </Row>

              <Row
              // style={{ fontSize: "20px", fontWeight: "Bold", color: "#2C74B3" }}
              >
                {/* สถานที่หรือจุดสังเกต{" "} */}
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  สถานที่หรือจุดสังเกต
                </Col>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#E34545",
                  }}
                >
                  *
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="consumerLandmark"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกสถานที่หรือจุดสังเกต",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกสถานที่หรือจุดสังเกต" />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  {selectedLocation && (
                    <div>
                      {/* Selected Location: {selectedLocation.lat} {} */}
                    </div>
                  )}
                  <LocationPicker onLocationSelected={handleLocationSelected} />
                </Col>
              </Row>
              <Row>
                <Col
                  span={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "2rem",
                    marginTop: "2rem",
                  }}
                >
                  <Button
                    className={styles.button_style_cancle}
                    style={{
                      backgroundColor: "#E34545",
                      width: "188px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={handleClick}
                  >
                    ยกเลิก
                  </Button>
                  <br></br>
                </Col>
                <Col
                  span={12}
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
                      width: "188px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    htmlType="submit"
                  >
                    ยืนยันการแจ้ง
                  </Button>
                  <br></br>
                </Col>
              </Row>
            </Form>

            <Modal footer={null} width="auto" onCancel={handleCancel} open={isFail} onOk={handleOk}>
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
                  แจ้งปัญหาไม่สำเร็จ
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
        <footer>
         
        </footer>
      <ErrorHandling error={error} />
      </>
      )}
      </ConfigProvider>
    </div>
  );
}

export default Problem;
