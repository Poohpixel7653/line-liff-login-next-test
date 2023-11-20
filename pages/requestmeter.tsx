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
import ErrorHandling from "@/components/errorModal";
import { IResponse } from "@/interfaces/payload.interface";
import Loader from "@/components/loader";

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

function Requestmeter() {
  // const [form] = useForm<any>();
  const [value, setValue] = useState(1);
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [form] = Form.useForm();
  const [isFail, setFail] = useState(false);
  const [agencyList, setAgencyList] = useState<IAgency[]>([]);
  const [provinceAgency, setProvinceAgency] = useState<string | null>(null);
  const [districtAgency, setDistrictAgency] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<LngLat>(
    new LngLat(100.48334205798255, 13.768639052886414)
  );
  const [spin, setSpin] = useState(false);

  const { Option } = Select;

  const {
    dataAddress,
    selectedProvince,
    selectedAmphure,
    handleProvinceChange,
    handleAmphureChange,
    selectedProvinceData,
    selectedAmphureData,
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

  const HandleProvinceSelect = (e: any) => {
    form.resetFields(["location_district"]);
    form.resetFields(["location_subdistrict"]);
    form.resetFields(["agency_id"]);
    setProvinceAgency(e);
  };

  const HandleDistrictSelect = (e: any) => {
    form.resetFields(["location_subdistrict"]);
    form.resetFields(["agency_id"]);
    setDistrictAgency(e);
  };

  const HandleProvinceSelect2 = (e: any) => {
    form.resetFields(["district"]);
    form.resetFields(["subdistrict"]);
  };
  const HandleDistrictSelect2 = (e: any) => {
    form.resetFields(["subdistrict"]);
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
        const filterAgency: IAgency[] = listAgency?.filter((item: IAgency) => {
          return (
            item.province === provinceAgency && item.district === districtAgency
          );
        });
        console.log("filter Agency", filterAgency);
        setAgencyList(filterAgency);
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
  }, [districtAgency, provinceAgency]);

  async function ConfirmSubmit(values: any) {
    try {
      setSpin(true);
      console.log(values);
      const _location: {
        latitude: string;
        longitude: string;
      } = {
        latitude: selectedLocation.lat.toString(),
        longitude: selectedLocation.lng.toString(),
      };
      const res = await fetch(
        "https://api-aquater-test.adcm.co.th/request-form/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "th",
          },
          body: JSON.stringify({
            address: values.address,
            address2: values.address2,
            agency_id: values.agency_id,
            district: values.district,
            firstname: values.firstname,
            floor: values.floor,
            lastname: values.lastname,
            location_address: values.location_address,
            location_address2: values.location_address2,
            location_description: values.location_description,
            location_district: values.location_district,
            location_floor: values.location_floor,
            location_moo: values.location_moo,
            location_phone: values.location_phone,
            location_postcode: values.location_postcode,
            location_province: values.location_province,
            location_road: values.location_road,
            location_soi: values.location_soi,
            location_subdistrict: values.location_subdistrict,
            // location_village:values.location_village,
            meter_size: values.meter_size,
            meter_type: values.meter_type,
            moo: values.moo,
            phone: values.phone,
            privilege_id: values.privilege_id,
            province: values.province,
            road: values.road,
            soi: values.soi,
            subdistrict: values.subdistrict,
            title: values.title,
            location: _location,

            // village:values.village,
            postcode: values.postcode,
            line_uid: lineUID,
          }),
        }
      );
      const data: IResponse = await res.json();
      if (data.status === 201) {
        console.log("Succuess", data.message);
        HandleClick(values);
      } else {
        // setConsumer(null);
        if (!res.ok) {
          throw new Error(data.error?.message);
        }
      }
      //   setIsEvented(true);
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
                ตำแหน่งที่ต้องการติดตั้ง
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
                เพื่อความรวดเร็วและชัดเจนในการตรวจสอบ
                กรุณาแจ้งพื้นที่ในการติดตั้งให้ชัดเจน ขอบคุณครับ
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
              initialValues={{ remember: true, privilege_id: 1 }}
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
                      onChange={handleProvinceChange}
                      onSelect={HandleProvinceSelect}
                    >
                      {dataAddress?.provinces.map((province) => (
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
                  อำเภอ/เขต
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
                        message: "กรุณากรอกจอำเภอ/เขต",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกอำเภอ/เขต"
                      style={{ width: "100%" }}
                      onChange={handleAmphureChange}
                      onSelect={HandleDistrictSelect}
                      disabled={!selectedProvince}
                    >
                      {selectedProvinceData?.amphure.map((amphure) => (
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
                  ตำบล/แขวง
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
                        message: "กรุณากรอกจตำบล/แขวง",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกตำบล/แขวง"
                      style={{ width: "100%" }}
                      disabled={!selectedAmphure}
                    >
                      {selectedAmphureData?.tambon.map((tambon) => (
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
                  กปภ.สาขา
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
                        message: "กรุณาเลือกกปภ.สาขา",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกกปภ.สาขา"
                      style={{ width: "100%" }}
                      disabled={!selectedAmphure}
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
                    name="location_description"
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
                  ที่อยู่ที่ต้องการติดตั้ง
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
                  เลขที่
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
                        message: "กรุณากรอกเลขที่",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกเลขที่" />
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
                  อาคาร
                </Col>
                {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="location_address2">
                    <Input placeholder="กรุณากรอกอาคาร" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      ชั้น
                    </Col>
                    {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item name="location_floor">
                        <Input
                          // size='small'
                          style={{ width: "80%" }}
                          placeholder="กรุณากรอกชั้น"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      หมู่
                    </Col>
                    {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item name="location_moo">
                        <Input
                          // size="small"
                          style={{ width: "80%" }}
                          placeholder="หมู่ที่"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* <Row>
                            <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#2C74B3' }}>หมู่บ้าน
                            </Col>
                            <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="location_village">
                                    <Input
                                        placeholder="กรุณากรอกหมู่บ้าน"
                                    />
                                </Form.Item>
                            </Col>
                        </Row> */}

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  ซอย
                </Col>
                {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="location_soi">
                    <Input placeholder="กรุณากรอกซอย" />
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
                  ถนน
                </Col>
                {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="location_road">
                    <Input placeholder="กรุณากรอกถนน" />
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
                    <Input placeholder="กรุณากรอกรหัสไปรษณีย์" />
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
                  โทรศัพท์
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
                    name="location_phone"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกเบอร์โทรศัพท์",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกเบอร์โทรศัพท์" />
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
                  ตำบล/แขวง
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
                  <Form.Item name="location_subdistrict">
                    <Input disabled={true} placeholder="กรุณาตำบล/แขวง" />
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
                    <Radio value={1}>บุคคลธรรมดาทั่วไป</Radio>
                  </Col>
                  <Col span={24}>
                    <Radio value={2}>นิติบุคคล/ส่วนราชการ</Radio>
                  </Col>
                </Radio.Group>
              </Form.Item>

              <Row>
                <Col
                  span={24}
                  style={{
                    fontSize: "24px",
                    fontWeight: "Bold",
                    color: "#0A2647",
                  }}
                >
                  ข้อมูลของมิเตอร์น้ำที่ต้องการติดตั้ง
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
                    {/* <Input placeholder="กรุณาเลือกประเภทการติดตั้ง" /> */}
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกประเภทการติดตั้ง"
                      size="large"
                      style={{ minWidth: "320px" }}
                      // onChange={handleChange}

                      //   size='large'
                      options={[
                        { value: "ชั่วคราว", label: "ชั่วคราว" },
                        { value: "ถาวร", label: "ถาวร" },
                      ]}
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
                    {/* <Input placeholder="กรุณาเลือกขนาดมาตร" /> */}
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกขนาดมาตร"
                      size="large"
                      style={{ minWidth: "320px" }}
                      // onChange={handleChange}

                      //   size='large'
                      options={[
                        { value: "1/2", label: "1/2 นิ้ว" },
                        { value: "3/4", label: "3/4 นิ้ว" },
                      ]}
                    />
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
                  รายละเอียดผู้แจ้งขอ
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
                <Space wrap>
                  <Form.Item
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: "กรุณาเลือกประเภทการติดตั้ง",
                      },
                    ]}
                  >
                    <Select
                      virtual={false}
                      placeholder="กรุณาเลือกคำนำหน้า"
                      size="large"
                      style={{ minWidth: "320px" }}
                      // onChange={handleChange}

                      //   size='large'
                      options={[
                        { value: "นาย", label: "นาย" },
                        { value: "นาง", label: "นาง" },
                        { value: "นางสาว", label: "นางสาว" },
                      ]}
                    />
                  </Form.Item>
                </Space>
              </Row>

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
                    <Input placeholder="กรุณากรอกชื่อ" />
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
                    <Input placeholder="กรุณากรอกนามสกุล" />
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
                  เบอร์ติดต่อ
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
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกเบอร์ติดต่อ",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกเบอร์ติดต่อ" />
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
                  เลขที่
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
                        message: "กรุณากรอกเลขที่",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกเลขที่" />
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
                  อาคาร
                </Col>
                {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="address2">
                    <Input placeholder="กรุณากรอกอาคาร" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={12}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      ชั้น
                    </Col>
                    {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item name="floor">
                        <Input
                          // size='small'
                          style={{ width: "80%" }}
                          placeholder="กรุณากรอกชั้น"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col
                      style={{
                        fontSize: "20px",
                        fontWeight: "Bold",
                        color: "#2C74B3",
                      }}
                    >
                      หมู่
                    </Col>
                    {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item name="moo">
                        <Input
                          // size="small"
                          style={{ width: "80%" }}
                          placeholder="หมู่ที่"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* <Row>
                            <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#2C74B3' }}>หมู่บ้าน
                            </Col>
                            <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item name="village">
                                    <Input
                                        placeholder="กรุณากรอกหมู่บ้าน"
                                    />
                                </Form.Item>
                            </Col>
                        </Row> */}

              <Row>
                <Col
                  style={{
                    fontSize: "20px",
                    fontWeight: "Bold",
                    color: "#2C74B3",
                  }}
                >
                  ซอย
                </Col>
                {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="soi">
                    <Input placeholder="กรุณากรอกซอย" />
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
                  ถนน
                </Col>
                {/* <Col style={{ fontSize: '20px', fontWeight: 'Bold', color: '#E34545' }}>*
                            </Col> */}
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item name="road">
                    <Input placeholder="กรุณากรอกถนน" />
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
                  {/* <Form.Item
                  name="province"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกจังหวัด",
                    },
                  ]}
                >
                  <Input placeholder="กรุณากรอกจังหวัด" />
                </Form.Item> */}
                  <Form.Item
                    name="province"
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
                  {/* <Form.Item
                  name="district"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกอำเภอ",
                    },
                  ]}
                >
                  <Input placeholder="กรุณากรอกอำเภอ" />
                </Form.Item> */}

                  <Form.Item
                    name="district"
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
                  {/* <Form.Item
                  name="subdistrict"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอกตำบล",
                    },
                  ]}
                >
                  <Input placeholder="กรุณากรอกตำบล" />
                </Form.Item> */}

                  <Form.Item
                    name="subdistrict"
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
                    name="postcode"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสไปรษณีย์",
                      },
                    ]}
                  >
                    <Input placeholder="กรุณากรอกรหัสไปรษณีย์" />
                  </Form.Item>
                </Col>
              </Row>

              {/* <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item> */}

              {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

              <Row>
                <Col span={24}>
                  <Checkbox
                    className={styles.checkbox_color}
                    onChange={ToggleDisable}
                  >
                    ข้าพเจ้ายินยอมให้นำข้อมูลไปใช้ประกอบการแจ้งขอ ติดตั้งประปา
                    และบันทึกในระบบ
                  </Checkbox>
                </Col>
                {/* <Col span={12}></Col> */}
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
                {/* <Button className={styles.button_style}  form='test' htmlType="submit">ยืนยัน </Button> */}
              </Row>
              {/* <Form.Item >
    <Button className={styles.button_style}   htmlType="submit">ยืนยัน </Button>
    </Form.Item> */}
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
export default Requestmeter;
