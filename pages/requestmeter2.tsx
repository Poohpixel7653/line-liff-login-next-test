import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "../resources/logo.png";
import warning from "../resources/warning.png";
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
  Space,
  Select,
  Checkbox,
  DatePicker,
} from "antd";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { useForm } from "antd/lib/form/Form";
import router, { useRouter } from "next/router";
import type { RadioChangeEvent } from "antd";
import { Radio } from "antd";
import mapboxgl, { LngLat, LngLatLike } from "mapbox-gl";
import LocationPicker from "@/components/locationPicker";
import errorImg from "../resources/error.png";
import useLIFF from "@/hooks/useLiff";

import useSelectAddress, { SelectData } from "@/hooks/useSelectAddress";
import encodeWithAQUA from "@/utils/encodeData";
import ErrorHandling from "@/components/errorModal";
import { IResponse } from "@/interfaces/payload.interface";
import Loader from "@/components/loader";

const { TextArea } = Input;
interface SelectComponentProps {
  data: SelectData;
}

interface IAgency {
  id: number;
  name: string;
  district: string;
  metadata: object;
  province: string;
  description: string;
}

function Requestmeter2() {
  // const [form] = useForm<any>();
  const [value, setValue] = useState(1);
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm();
  const [isFail, setFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agencyList, setAgencyList] = useState<IAgency[]>([]);
  const [provinceAgency, setProvinceAgency] = useState<string | null>(null);
  const [districtAgency, setDistrictAgency] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [spin, setSpin] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<LngLat>(
    new LngLat(100.48334205798255, 13.768639052886414)
  );

  const { Option } = Select;

  // const {
  //   dataAddress,
  //   selectedProvince,
  //   selectedAmphure,
  //   handleProvinceChange,
  //   handleAmphureChange,
  //   selectedProvinceData,
  //   selectedAmphureData,
  // } = useSelectAddress();

  const {
    dataAddress: dataAddress1,
    selectedProvince: selectedProvince1,
    selectedAmphure: selectedAmphure1,
    handleProvinceChange: handleProvinceChange1,
    handleAmphureChange: handleAmphureChange1,
    selectedProvinceData: selectedProvinceData1,
    selectedAmphureData: selectedAmphureData1,
  } = useSelectAddress();

  const {
    dataAddress: dataAddress2,
    selectedProvince: selectedProvince2,
    selectedAmphure: selectedAmphure2,
    handleProvinceChange: handleProvinceChange2,
    handleAmphureChange: handleAmphureChange2,
    selectedProvinceData: selectedProvinceData2,
    selectedAmphureData: selectedAmphureData2,
  } = useSelectAddress();

  const {
    dataAddress: dataAddress3,
    selectedProvince: selectedProvince3,
    selectedAmphure: selectedAmphure3,
    handleProvinceChange: handleProvinceChange3,
    handleAmphureChange: handleAmphureChange3,
    selectedProvinceData: selectedProvinceData3,
    selectedAmphureData: selectedAmphureData3,
  } = useSelectAddress();

  const { liffObject, liffError, profile } = useLIFF();
  // const profile = { userId: "U257c3b19eb73999c6954d7cdaa100499" };

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

  const OnChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };
  const HandleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const ToggleDisable = () => {
    setDisabled(!disabled);
  };
  const HandleClick = (e: any) => {
    // e.preventDefault();
    router.push("/requestmerter_complete/");
  };

  const HandleProvinceSelect1 = (e: any) => {
    form.resetFields(["address_district"]);
    form.resetFields(["address_subdistrict"]);
    // setProvinceAgency(e);
  };

  const HandleDistrictSelect1 = (e: any) => {
    form.resetFields(["address_subdistrict"]);
    // setDistrictAgency(e);
  };

  const HandleProvinceSelect2 = (e: any) => {
    form.resetFields(["location_district"]);
    form.resetFields(["location_subdistrict"]);
  };
  const HandleDistrictSelect2 = (e: any) => {
    form.resetFields(["location_subdistrict"]);
  };

  const HandleProvinceSelect3 = (e: any) => {
    form.resetFields(["owner_district"]);
    form.resetFields(["owner_subdistrict"]);
  };
  const HandleDistrictSelect3 = (e: any) => {
    form.resetFields(["owner_subdistrict"]);
  };

  useEffect(() => {
    const fetchAgencyData = async () => {
      try {
        setSpin(true);
        const result = await axios.get(
          "https://api-aquater-test.adcm.co.th/config/agency",
          {
            headers: {
              "Accept-Language": "th",
            },
          }
        );
        const listAgency: IAgency[] = result.data.data.config?.agency_list;
        console.log("filter Agency", listAgency);
        setAgencyList(listAgency);
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
    fetchAgencyData();
  }, []);

  async function ConfirmSubmit(values: any) {
    try {
      setSpin(true)
      console.log(values);
      const bodyObject = values;
      console.log();
      const _location: {
        latitude: string;
        longitude: string;
      } = {
        latitude: selectedLocation.lat.toString(),
        longitude: selectedLocation.lng.toString(),
      };

      bodyObject.location = _location;
      bodyObject.line_uid = lineUID;
      bodyObject.id_card_number = encodeWithAQUA(
        values.id_card_number.toString()
      );
      bodyObject.owner_id_card_number = encodeWithAQUA(
        values.owner_id_card_number.toString()
      );

      const res = await fetch(
        "https://api-aquater-test.adcm.co.th/request-form/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "th",
          },
          body: JSON.stringify(bodyObject),
        }
      );
      const data: IResponse = await res.json();
      if (data.status === 201) {
        console.log("Succuess", data.message);
        HandleClick(values);
      } else {
        if (!res.ok) {
          throw new Error(data.error?.message);
        }
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
  }

  const handleLocationSelected = (location: LngLat) => {
    console.log(location.lat, location.lng);
    setSelectedLocation(location);
  };

  const handleOk = () => {
    setFail(false);
    // setUsed(false);
  };

  const handleCancel = () => {
    setFail(false);
    // setUsed(false);
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
                แจ้งขอติดตั้งประปา
              </Col>
            </Row>
          </div>
        </header>

        <main className={styles.body}>
          <div style={{ maxWidth: "1280px", margin: "auto" }}>
            <Row>
              <Col
                span={24}
                style={{
                  fontSize: "24px",
                  fontWeight: "Bold",
                  color: "#0A2647",
                }}
              >
                หน่วยงานให้บริการการประปา
              </Col>
            </Row>

            <Row>
              <Col style={{ fontSize: "16px", color: "#A0A0A0" }}>
                <Image
                  src={warning}
                  width={20}
                  height={20}
                  style={{ color: "#A0A0A0", marginRight: "1rem" }}
                  alt="Warning"
                />
                กรุณาหน่วยงานที่ให้บริการน้ำประปาของท่าน
              </Col>
            </Row>

            <Form
              form={form}
              name="basic"
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 16 }}
              style={{
                display: "flex",
                justifyItems: "center",
                flexDirection: "column",
              }}
              initialValues={{
                remember: true,
                privilege_id: 1,
                meter_type: "ติดตั้งมาตรวัดน้ำ",
                meter_for: "ใช้เป็นน้ำดื่ม น้ำใช้ ในครัวเรือน",
                meter_size: "3/4",
              }}
              onFinish={ConfirmSubmit}
              scrollToFirstError={true}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              // style={{display:'flex',alignItems:'center',justifyItems:'center'}}
            >
              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  หน่วยงานน้ำประปา
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
                    name="agency_id"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเลือกหน่วยงาน",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกหน่วยงาน"
                      style={{ width: "100%" }}
                      defaultActiveFirstOption={true}
                      allowClear={true}
                    >
                      {agencyList?.map((agency) => (
                        <Option key={agency.id} value={agency.id}>
                          {agency.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  span={24}
                  style={{
                    fontSize: "24px",
                    fontWeight: "Bold",
                    color: "#0A2647",
                  }}
                >
                  ข้อมูลสถานที่ติดตั้ง
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  ประเภทการติดตั้ง
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
                    name="meter_type"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเลือกประเภทการติดตั้ง",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกประเภทการติดตั้ง"
                      style={{ width: "100%" }}
                      defaultActiveFirstOption={true}
                      allowClear={true}
                      // defaultValue={{ value: "ติดตั้งมาตรวัดน้ำ", label: "ติดตั้งมาตรวัดน้ำ" }}
                      options={[
                        {
                          value: "ติดตั้งมาตรวัดน้ำ",
                          label: "ติดตั้งมาตรวัดน้ำ",
                        },
                        { value: "วางท่อประปา", label: "วางท่อประปา" },
                        {
                          value: "ใช้น้ำประปาชั่วคราว",
                          label: "ใช้น้ำประปาชั่วคราว",
                        },
                      ]}
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  จุดประสงค์การใช้น้ำประปา
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
                    name="meter_for"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเลือกจุดประสงค์",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกจุดประสงค์"
                      style={{ width: "100%" }}
                      defaultActiveFirstOption={true}
                      // defaultValue={{ value: "ใช้เป็นน้ำดื่ม น้ำใช้ ในครัวเรือน", label: "ใช้เป็นน้ำดื่ม น้ำใช้ ในครัวเรือน" }}
                      allowClear={true}
                      options={[
                        {
                          value: "ใช้เป็นน้ำดื่ม น้ำใช้ ในครัวเรือน",
                          label: "ใช้เป็นน้ำดื่ม น้ำใช้ ในครัวเรือน",
                        },
                        {
                          value: "ใช้เพื่อการเกษตร",
                          label: "ใช้เพื่อการเกษตร",
                        },
                      ]}
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  ขนาดมาตร
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
                    name="meter_size"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเลือกขนาดมาตร",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกขนาดมาตร"
                      style={{ width: "100%" }}
                      defaultActiveFirstOption={true}
                      allowClear={true}
                      options={[
                        { value: "1/2", label: "1/2 นิ้ว" },
                        { value: "3/4", label: "3/4 นิ้ว" },
                        { value: "1", label: "1 นิ้ว" },
                        { value: "1 1/2", label: "1 1/2 นิ้ว" },
                        { value: "2", label: "2 นิ้ว" },
                        { value: "3", label: "3 นิ้ว" },
                        { value: "4", label: "4 นิ้ว" },
                        { value: "6", label: "6 นิ้ว" },
                        { value: "8", label: "8 นิ้ว" },
                      ]}
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ marginBottom: "10px", marginTop: 0 }} />

              <Row>
                <Col style={{ fontSize: "16px", color: "#A0A0A0" }}>
                  <Image
                    src={warning}
                    width={20}
                    height={20}
                    style={{ color: "#A0A0A0", marginRight: "1rem" }}
                    alt="Warning"
                  />
                  ระบุพิกัดที่ชัดเจน เพื่อความถูกต้องในการรับบริการ
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  สถานที่หรือจุดสังเกต
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="location_description">
                    <Input placeholder="กรุณากรอกสถานที่หรือจุดสังเกต" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  {selectedLocation && <div></div>}
                  <LocationPicker onLocationSelected={handleLocationSelected} />
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col
                  span={24}
                  style={{
                    fontSize: "24px",
                    fontWeight: "Bold",
                    color: "#0A2647",
                  }}
                >
                  ข้อมูลผู้ยื่น (ตามบัตรประชาชน)
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  คำนำหน้า
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
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเลือกคำนำหน้า",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกคำนำหน้า"
                      style={{ width: "100%" }}
                      defaultActiveFirstOption={true}
                      allowClear={true}
                      options={[
                        { value: "นาย", label: "นาย" },
                        { value: "นาง", label: "นาง" },
                        { value: "นางสาว", label: "นางสาว" },
                      ]}
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12} style={{ paddingRight: "2.5%" }}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      ชื่อ
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
                        name="firstname"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกชื่อ",
                          },
                        ]}
                      >
                        <Input
                          // size='small'
                          style={{ width: "100%" }}
                          placeholder="กรุณากรอกชื่อ"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={12}
                  style={{ alignContent: "end", paddingLeft: "2.5%" }}
                >
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      นามสกุล
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
                        name="lastname"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกนามสกุล",
                          },
                        ]}
                      >
                        <Input
                          // size="small"
                          style={{ width: "100%" }}
                          placeholder="กรุณากรอกนามสกุล"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      อายุ
                    </Col>
                  </Row>
                  <Row>
                    <Col span={22}>
                      <Form.Item name="age">
                        <Input placeholder="กรุณากรอกอายุ" type="number" />
                      </Form.Item>
                    </Col>
                    <Col
                      span={2}
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                        textAlign: "end",
                      }}
                    >
                      ปี
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col span={12} style={{ paddingRight: "2%" }}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      บ้านเลขที่
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
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกบ้านเลขที่",
                          },
                        ]}
                      >
                        <Input
                          // size='small'
                          style={{ width: "100%" }}
                          placeholder="กรุณากรอกบ้านเลขที่"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={12}
                  style={{ alignContent: "end", paddingLeft: "2%" }}
                >
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      หมู่ที่
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
                        name="address_moo"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกหมู่",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          type="number"
                          placeholder="กรุณากรอกหมู่"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  จังหวัด
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
                    name="address_province"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกจังหวัด",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกจังหวัด"
                      style={{ width: "100%" }}
                      onChange={handleProvinceChange1}
                      onSelect={HandleProvinceSelect1}
                    >
                      {dataAddress1?.provinces.map((province) => (
                        <Option key={province.id} value={province.name_th}>
                          {province.name_th}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  อำเภอ
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
                    name="address_district"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกอำเภอ",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณากรอกอำเภอ"
                      style={{ width: "100%" }}
                      onChange={handleAmphureChange1}
                      disabled={!selectedProvince1}
                      onSelect={HandleDistrictSelect1}
                    >
                      {selectedProvinceData1?.amphure.map((amphure) => (
                        <Option key={amphure.id} value={amphure.name_th}>
                          {amphure.name_th}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  ตำบล
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
                    name="address_subdistrict"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกตำบล",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณากรอกตำบล"
                      style={{ width: "100%" }}
                      disabled={!selectedAmphure1}
                    >
                      {selectedAmphureData1?.tambon.map((tambon) => (
                        <Option key={tambon.id} value={tambon.name_th}>
                          {tambon.name_th}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  รหัสไปรษณีย์
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
                    name="address_postcode"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสไปรษณีย์",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกรหัสไปรษณีย์" type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  เลขบัตรประชาชน
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
                    name="id_card_number"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกเลขบัตรประชาชน",
                      },
                    ]}
                  >
                    <Input
                      placeholder="กรุณากรอกเลขบัตรประชาชน"
                      type="number"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12} style={{ paddingRight: "2.5%" }}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      ออกบัตร ณ
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item name="id_card_place">
                        <Input
                          // size='small'
                          style={{ width: "100%" }}
                          placeholder="กรุณากรอกสถานที่ออกบัตร"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={12}
                  style={{ alignContent: "end", paddingLeft: "2.5%" }}
                >
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      บัตรหมดอายุ
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        name="id_card_expire"
                        style={{ fontFamily: "Prompt" }}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          placeholder="กรุณาเลือกวันหมดอายุ"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  ความประสงค์ขออนุญาต
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="por">
                    <TextArea placeholder="กรุณากรอกความประสงค์" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  span={24}
                  style={{
                    fontSize: "24px",
                    fontWeight: "Bold",
                    color: "#0A2647",
                  }}
                >
                  ประเภทผู้ขอใช้งาน
                </Col>
              </Row>

              <Form.Item
                name="privilege_id"
                required
                rules={[
                  {
                    required: true,
                    message: "กรุณาเลือกประเภท",
                  },
                ]}
              >
                <Radio.Group onChange={OnChange} value={value}>
                  <Col span={24}>
                    <Radio value={1}>บุคคลทั่วไป/นิติบุคคล</Radio>
                  </Col>
                  <Col span={24}>
                    <Radio value={2}>หน่วยงาน/ส่วนราชการ</Radio>
                  </Col>
                </Radio.Group>
              </Form.Item>
              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  สำหรับบ้าน/หน่วยงาน
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="location_name">
                    <Input placeholder="กรุณากรอกชื่อสถานที่" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12} style={{ paddingRight: "2.5%" }}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      บ้านเลขที่
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
                        name="location_address"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกบ้านเลขที่",
                          },
                        ]}
                      >
                        <Input
                          // size='small'
                          style={{ width: "100%" }}
                          placeholder="กรุณากรอกบ้านเลขที่"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={12}
                  style={{ alignContent: "end", paddingLeft: "2.5%" }}
                >
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      หมู่ที่
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
                        name="location_moo"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกหมู่",
                          },
                        ]}
                      >
                        <Input
                          // size="small"
                          style={{ width: "100%" }}
                          type="number"
                          placeholder="กรุณากรอกหมู่"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  จังหวัด
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
                    name="location_province"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกจังหวัด",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกจังหวัด"
                      style={{ width: "100%" }}
                      onChange={handleProvinceChange2}
                      onSelect={HandleProvinceSelect2}
                    >
                      {dataAddress2?.provinces.map((province) => (
                        <Option key={province.id} value={province.name_th}>
                          {province.name_th}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  อำเภอ
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
                    name="location_district"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกอำเภอ",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณากรอกอำเภอ"
                      style={{ width: "100%" }}
                      onChange={handleAmphureChange2}
                      disabled={!selectedProvince2}
                      onSelect={HandleDistrictSelect2}
                    >
                      {selectedProvinceData2?.amphure.map((amphure) => (
                        <Option key={amphure.id} value={amphure.name_th}>
                          {amphure.name_th}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  ตำบล
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
                    name="location_subdistrict"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกตำบล",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณากรอกตำบล"
                      style={{ width: "100%" }}
                      disabled={!selectedAmphure2}
                    >
                      {selectedAmphureData2?.tambon.map((tambon) => (
                        <Option key={tambon.id} value={tambon.name_th}>
                          {tambon.name_th}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  รหัสไปรษณีย์
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
                    name="location_postcode"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสไปรษณีย์",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกรหัสไปรษณีย์" type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  เบอร์โทรศัพท์ที่ติดต่อได้
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
                    name="address_phone"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกเบอร์โทรศัพท์",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกเบอร์โทรศัพท์" type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ marginBottom: "10px", marginTop: 0 }} />

              <Row>
                <Col
                  span={24}
                  style={{
                    fontSize: "24px",
                    fontWeight: "Bold",
                    color: "#0A2647",
                  }}
                >
                  เจ้าของสถานที่ติดตั้ง
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  คำนำหน้า
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
                    name="owner_title"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเลือกคำนำหน้า",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกคำนำหน้า"
                      style={{ width: "100%" }}
                      defaultActiveFirstOption={true}
                      allowClear={true}
                      options={[
                        { value: "นาย", label: "นาย" },
                        { value: "นาง", label: "นาง" },
                        { value: "นางสาว", label: "นางสาว" },
                      ]}
                    ></Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12} style={{ paddingRight: "2.5%" }}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      ชื่อ
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
                        name="owner_firstname"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกชื่อ",
                          },
                        ]}
                      >
                        <Input
                          // size='small'
                          style={{ width: "100%" }}
                          placeholder="กรุณากรอกชื่อ"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={12}
                  style={{ alignContent: "end", paddingLeft: "2.5%" }}
                >
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      นามสกุล
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
                        name="owner_lastname"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกนามสกุล",
                          },
                        ]}
                      >
                        <Input
                          // size="small"
                          style={{ width: "100%" }}
                          placeholder="กรุณากรอกนามสกุล"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      อายุ
                    </Col>
                  </Row>
                  <Row>
                    <Col span={22}>
                      <Form.Item name="owner_age">
                        <Input placeholder="กรุณากรอกอายุ" type="number" />
                      </Form.Item>
                    </Col>
                    <Col
                      span={2}
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                        textAlign: "end",
                      }}
                    >
                      ปี
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col span={12} style={{ paddingRight: "2%" }}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      บ้านเลขที่
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
                        name="owner_address"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกบ้านเลขที่",
                          },
                        ]}
                      >
                        <Input
                          // size='small'
                          style={{ width: "100%" }}
                          placeholder="กรุณากรอกบ้านเลขที่"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col
                  span={12}
                  style={{ alignContent: "end", paddingLeft: "2%" }}
                >
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      หมู่ที่
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
                        name="owner_moo"
                        rules={[
                          {
                            required: true,
                            message: "กรุณากรอกหมู่",
                          },
                        ]}
                      >
                        <Input
                          style={{ width: "100%" }}
                          type="number"
                          placeholder="กรุณากรอกหมู่"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  จังหวัด
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
                    name="owner_province"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกจังหวัด",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกจังหวัด"
                      style={{ width: "100%" }}
                      onChange={handleProvinceChange3}
                      onSelect={HandleProvinceSelect3}
                    >
                      {dataAddress3?.provinces.map((province) => (
                        <Option key={province.id} value={province.name_th}>
                          {province.name_th}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  อำเภอ
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
                    name="owner_district"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกอำเภอ",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณากรอกอำเภอ"
                      style={{ width: "100%" }}
                      onChange={handleAmphureChange3}
                      disabled={!selectedProvince3}
                      onSelect={HandleDistrictSelect3}
                    >
                      {selectedProvinceData3?.amphure.map((amphure) => (
                        <Option key={amphure.id} value={amphure.name_th}>
                          {amphure.name_th}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  ตำบล
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
                    name="owner_subdistrict"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกตำบล",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณากรอกตำบล"
                      style={{ width: "100%" }}
                      disabled={!selectedAmphure3}
                    >
                      {selectedAmphureData3?.tambon.map((tambon) => (
                        <Option key={tambon.id} value={tambon.name_th}>
                          {tambon.name_th}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  รหัสไปรษณีย์
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
                    name="owner_postcode"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสไปรษณีย์",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกรหัสไปรษณีย์" type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  เลขบัตรประชาชน
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
                    name="owner_id_card_number"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกเลขบัตรประชาชน",
                      },
                    ]}
                  >
                    <Input
                      placeholder="กรุณากรอกเลขบัตรประชาชน"
                      type="number"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  เบอร์โทรศัพท์ที่ติดต่อได้
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
                    name="owner_phone"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกเบอร์โทรศัพท์",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกเบอร์โทรศัพท์" type="number" />
                  </Form.Item>
                </Col>
              </Row>

              {/* <Divider style={{ marginBottom: "10px", marginTop: 0 }} /> */}
              <Row>
                <Col span={24}>
                  &nbsp; &nbsp; &nbsp;
                  ข้าพเจ้ายินดีจะให้ความสะดวกแก่เจ้าหน้าที่การประปา
                  ในการสำรวจและปฏิบัติตามระเบียบข้อบัญญัติของการประปาเกี่ยวกับการขอใช้น้ำประปาทุกประการ
                  ซึ่งเจ้าหน้าที่ได้ชี้แจงให้ข้าพเจ้าทราบแล้ว
                  ข้าพเจ้ายินดีชำระค่าบำรุงมาตรน้ำและค่าน้ำประปาตามที่การประปาเทศบาลตำบลบ้านแยงกำหนด
                  และขอรับรองจะปฏิบัติตามระเบียบการของกิจการประปาเทศบาลตำบลบ้านแยงทุกประการ
                </Col>
              </Row>

              {/* <Divider style={{ marginTop: "10px", marginBottom: "10px" }} /> */}

              <Row>
                <Col
                  span={24}
                  style={{ marginTop: "10px", marginBottom: "10px" }}
                >
                  <Checkbox
                    className={styles.checkbox_color}
                    onChange={ToggleDisable}
                  >
                    ข้าพเจ้ายินยอมให้นำข้อมูลไปใช้ประกอบการแจ้งขอ ติดตั้งประปา
                    และบันทึกในระบบ
                  </Checkbox>
                </Col>
                <Col span={24}>
                  <Form.Item>
                    {disabled ? (
                      <Button
                        className={styles.checkbox_color_disnable}
                        disabled={disabled}
                      >
                        ยืนยัน{" "}
                      </Button>
                    ) : (
                      <Button
                        className={styles.button_style}
                        style={{ width: "100%" }}
                        htmlType="submit"
                      >
                        ยืนยัน{" "}
                      </Button>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Modal
              footer={null}
              width="auto"
              onCancel={handleCancel}
              open={isFail}
              onOk={handleOk}
            >
              <div>
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
                  แจ้งขอติดตั้งประปาไม่สำเร็จ
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
    </div>
  );
}
export default Requestmeter2;
