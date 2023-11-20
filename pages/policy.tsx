import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  ConfigProvider,
  Checkbox,
  Button,
  Space,
  Divider,
} from "antd";
import Head from "next/head";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import logo from "../resources/logo.png";
import router, { useRouter } from "next/router";
import useLIFF from "@/hooks/useLiff";

const onChange = (e: CheckboxChangeEvent) => {
  console.log(`checked = ${e.target.checked}`);
};

const Policy: NextPage = () => {
  const [checked, setChecked] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/checkinfo/" + "?uuid=" + uuid + "&lid=" + lineUID);
  };

  const toggleDisable = () => {
    setDisabled(!disabled);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Prompt",
        },
      }}
    >
      {/* <header>

                <Row>
                    <Col span={24}>
                        <div className={styles.header} style={{ display: 'flex', alignItems: 'center' }}>
                            <Image
                                src={logo}
                                width={70}
                                height={70}
                                alt="Logo"
                            />
                            <Col style={{ fontSize: '24px', fontWeight: 'Bold', color: '#FFFFFF' }}>Aquater</Col>
                        </div>
                    </Col>
                </Row>

                <Col span={24} className='text-color' style={{ fontSize: '28px', fontWeight: 'Bold', color: '#AED9FF', padding: '2rem' }}>ข้อตกลงในการยินยอมให้เก็บข้อมูลและเปิดเผยข้อมูล</Col>
            </header> */}
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
              ข้อตกลงในการยินยอมให้เก็บข้อมูลและเปิดเผยข้อมูล
            </Col>
          </Row>
        </div>
      </header>

      <main className={styles.body}>
        <div style={{ maxWidth: "1280px", margin: "auto" }}>
          <Row>
            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              นโยบายความเป็นส่วนตัวสำหรับลูกค้า
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              บริษัท เอดีซี ไมโครซิสเต็มส์ จำกัด
              ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของคุณ
              โดยนโยบายความเป็นส่วนตัวฉบับนี้ได้อธิบายแนวปฏิบัติเกี่ยวกับการเก็บรวบรวม
              ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล รวมถึงสิทธิต่าง ๆ
              ของเจ้าของข้อมูลส่วนบุคคล ตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              การเก็บรวบรวมข้อมูลส่วนบุคคล
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราจะเก็บรวบรวมข้อมูลส่วนบุคคลที่ได้รับโดยตรงจากคุณผ่านช่องทาง
              ดังต่อไปนี้
            </Col>
            <ul>
              <li>การสมัครสมาชิก</li>
              <li>โทรศัพท์</li>
              <li>อีเมล</li>
            </ul>

            <p></p>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              ประเภทข้อมูลส่วนบุคคลที่เก็บรวบรวม
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <p>
                <b>ข้อมูลส่วนบุคคล</b> เช่น ชื่อ นามสกุล อายุ วันเดือนปีเกิด
                สัญชาติ เลขประจำตัวประชาชน หนังสือเดินทาง เป็นต้น
              </p>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <p>
                <b>ข้อมูลการติดต่อ</b> เช่น ที่อยู่ หมายเลขโทรศัพท์ อีเมล
                เป็นต้น
              </p>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <p>
                <b>ข้อมูลบัญชี</b> เช่น บัญชีผู้ใช้งาน ประวัติการใช้งาน เป็นต้น
              </p>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <p>
                <b>ข้อมูลการทำธุรกรรมและการเงิน</b> เช่น ประวัติการสั่งซื้อ
                รายละเอียดบัตรเครดิต บัญชีธนาคาร เป็นต้น
              </p>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <p>
                <b>ข้อมูลทางเทคนิค</b> เช่น IP address, Cookie ID,
                ประวัติการใช้งานเว็บไซต์ (Activity Log) เป็นต้น
              </p>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <p>
                <b>ข้อมูลอื่น ๆ</b> เช่น รูปภาพ ภาพเคลื่อนไหว
                และข้อมูลอื่นใดที่ถือว่าเป็นข้อมูลส่วนบุคคลตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล
              </p>
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              ผู้เยาว์
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              หากคุณมีอายุต่ำกว่า 20 ปีหรือมีข้อจำกัดความสามารถตามกฎหมาย
              เราอาจเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณ
              เราอาจจำเป็นต้องให้พ่อแม่หรือผู้ปกครองของคุณให้ความยินยอมหรือที่กฎหมายอนุญาตให้ทำได้
              หากเราทราบว่ามีการเก็บรวบรวมข้อมูลส่วนบุคคลจากผู้เยาว์โดยไม่ได้รับความยินยอมจากพ่อแม่หรือผู้ปกครอง
              เราจะดำเนินการลบข้อมูลนั้นออกจากเซิร์ฟเวอร์ของเรา
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              วิธีการเก็บรักษาข้อมูลส่วนบุคคล
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณในรูปแบบเอกสารและรูปแบบอิเล็กทรอนิกส์
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราเก็บรักษาข้อมูลส่วนบุคคลของคุณ ดังต่อไปนี้
            </Col>

            <ul>
              <li>ผู้ให้บริการเซิร์ฟเวอร์ในประเทศไทย</li>
            </ul>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              การประมวลผลข้อมูลส่วนบุคคล
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราจะเก็บรวบรวม ใช้
              หรือเปิดเผยข้อมูลส่วนบุคคลของคุณเพื่อวัตถุประสงค์ดังต่อไปนี้
            </Col>
            <ul>
              <li>เพื่อสร้างและจัดการบัญชีผู้ใช้งาน</li>
              <li>เพื่อจัดส่งสินค้าหรือบริการ</li>
              <li>เพื่อปรับปรุงสินค้า บริการ หรือประสบการณ์การใช้งาน</li>
              <li>เพื่อการบริหารจัดการภายในบริษัท</li>
              <li>เพื่อการบริการหลังการขาย</li>
              <li>เพื่อรวบรวมข้อเสนอแนะ</li>
              <li>เพื่อชำระค่าสินค้าหรือบริการ</li>
              <li>เพื่อปฏิบัติตามข้อตกลงและเงื่อนไข (Terms and Conditions)</li>
              <li>เพื่อปฏิบัติตามกฎหมายและกฎระเบียบของหน่วยงานราชการ</li>
            </ul>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              การเปิดเผยข้อมูลส่วนบุคคล
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราอาจเปิดเผยข้อมูลส่วนบุคคลของคุณให้แก่ผู้อื่นภายใต้ความยินยอมของคุณหรือที่กฎหมายอนุญาตให้เปิดเผยได้
              ดังต่อไปนี้
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>การบริหารจัดการภายในองค์กร</b>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราอาจเปิดเผยข้อมูลส่วนบุคคลของคุณภายในบริษัทเท่าที่จำเป็นเพื่อปรับปรุงและพัฒนาสินค้าหรือบริการของเรา
              เราอาจรวบรวมข้อมูลภายในสำหรับสินค้าหรือบริการต่าง ๆ
              ภายใต้นโยบายนี้เพื่อประโยชน์ของคุณและผู้อื่นมากขึ้น
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>ผู้ให้บริการ</b>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราอาจเปิดเผยข้อมูลส่วนบุคคลของคุณบางอย่างให้กับผู้ให้บริการของเราเท่าที่จำเป็นเพื่อดำเนินงานในด้านต่าง
              ๆ เช่น การชำระเงิน การตลาด การพัฒนาสินค้าหรือบริการ เป็นต้น
              ทั้งนี้ ผู้ให้บริการมีนโยบายความเป็นส่วนตัวของตนเอง
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>พันธมิตรทางธุรกิจ</b>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราอาจเปิดเผยข้อมูลบางอย่างกับพันธมิตรทางธุรกิจเพื่อติดต่อและประสานงานในการให้บริการสินค้าหรือบริการ
              และให้ข้อมูลเท่าที่จำเป็นเกี่ยวกับความพร้อมใช้งานของสินค้าหรือบริการ
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>การบังคับใช้กฎหมาย</b>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              ในกรณีที่มีกฎหมายหรือหน่วยงานราชการร้องขอ
              เราจะเปิดเผยข้อมูลส่วนบุคคลของคุณเท่าที่จำเป็นให้แก่หน่วยงานราชการ
              เช่น ศาล หน่วยงานราชการ เป็นต้น
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              ระยะเวลาจัดเก็บข้อมูลส่วนบุคคล
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราจะเก็บรักษาข้อมูลส่วนบุคคลของคุณไว้ตามระยะเวลาที่จำเป็นในระหว่างที่คุณเป็นลูกค้าหรือมีความสัมพันธ์อยู่กับเราหรือตลอดระยะเวลาที่จำเป็นเพื่อให้บรรลุวัตถุประสงค์ที่เกี่ยวข้องกับนโยบายฉบับนี้
              ซึ่งอาจจำเป็นต้องเก็บรักษาไว้ต่อไปภายหลังจากนั้น
              หากมีกฎหมายกำหนดไว้ เราจะลบ ทำลาย
              หรือทำให้เป็นข้อมูลที่ไม่สามารถระบุตัวตนของคุณได้
              เมื่อหมดความจำเป็นหรือสิ้นสุดระยะเวลาดังกล่าว
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              สิทธิของเจ้าของข้อมูลส่วนบุคคล
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              ภายใต้กฎหมายคุ้มครองข้อมูลส่วนบุคคล
              คุณมีสิทธิในการดำเนินการดังต่อไปนี้
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>สิทธิขอถอนความยินยอม (right to withdraw consent)</b>{" "}
              หากคุณได้ให้ความยินยอม เราจะเก็บรวบรวม ใช้
              หรือเปิดเผยข้อมูลส่วนบุคคลของคุณ
              ไม่ว่าจะเป็นความยินยอมที่คุณให้ไว้ก่อนวันที่กฎหมายคุ้มครองข้อมูลส่วนบุคคลใช้บังคับหรือหลังจากนั้น
              คุณมีสิทธิที่จะถอนความยินยอมเมื่อใดก็ได้ตลอดเวลา
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>สิทธิขอเข้าถึงข้อมูล (right to access)</b>{" "}
              คุณมีสิทธิขอเข้าถึงข้อมูลส่วนบุคคลของคุณที่อยู่ในความรับผิดชอบของเราและขอให้เราทำสำเนาข้อมูลดังกล่าวให้แก่คุณ
              รวมถึงขอให้เราเปิดเผยว่าเราได้ข้อมูลส่วนบุคคลของคุณมาได้อย่างไร
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>สิทธิขอถ่ายโอนข้อมูล (right to data portability)</b>{" "}
              คุณมีสิทธิขอรับข้อมูลส่วนบุคคลของคุณในกรณีที่เราได้จัดทำข้อมูลส่วนบุคคลนั้นอยู่ในรูปแบบให้สามารถอ่านหรือใช้งานได้ด้วยเครื่องมือหรืออุปกรณ์ที่ทำงานได้โดยอัตโนมัติและสามารถใช้หรือเปิดเผยข้อมูลส่วนบุคคลได้ด้วยวิธีการอัตโนมัติ
              รวมทั้งมีสิทธิขอให้เราส่งหรือโอนข้อมูลส่วนบุคคลในรูปแบบดังกล่าวไปยังผู้ควบคุมข้อมูลส่วนบุคคลอื่นเมื่อสามารถทำได้ด้วยวิธีการอัตโนมัติ
              และมีสิทธิขอรับข้อมูลส่วนบุคคลที่เราส่งหรือโอนข้อมูลส่วนบุคคลในรูปแบบดังกล่าวไปยังผู้ควบคุมข้อมูลส่วนบุคคลอื่นโดยตรง
              เว้นแต่ไม่สามารถดำเนินการได้เพราะเหตุทางเทคนิค
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>สิทธิขอคัดค้าน (right to object)</b>{" "}
              คุณมีสิทธิขอคัดค้านการเก็บรวบรวม ใช้
              หรือเปิดเผยข้อมูลส่วนบุคคลของคุณในเวลาใดก็ได้ หากการเก็บรวบรวม ใช้
              หรือเปิดเผยข้อมูลส่วนบุคคลของคุณที่ทำขึ้นเพื่อการดำเนินงานที่จำเป็นภายใต้ประโยชน์โดยชอบด้วยกฎหมายของเราหรือของบุคคลหรือนิติบุคคลอื่น
              โดยไม่เกินขอบเขตที่คุณสามารถคาดหมายได้อย่างสมเหตุสมผลหรือเพื่อดำเนินการตามภารกิจเพื่อสาธารณประโยชน์
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>สิทธิขอให้ลบหรือทำลายข้อมูล (right to erasure/destruction)</b>{" "}
              คุณมีสิทธิขอลบหรือทำลายข้อมูลส่วนบุคคลของคุณหรือทำให้ข้อมูลส่วนบุคคลเป็นข้อมูลที่ไม่สามารถระบุตัวคุณได้
              หากคุณเชื่อว่าข้อมูลส่วนบุคคลของคุณถูกเก็บรวบรวม ใช้
              หรือเปิดเผยโดยไม่ชอบด้วยกฎหมายที่เกี่ยวข้องหรือเห็นว่าเราหมดความจำเป็นในการเก็บรักษาไว้ตามวัตถุประสงค์ที่เกี่ยวข้องในนโยบายฉบับนี้
              หรือเมื่อคุณได้ใช้สิทธิขอถอนความยินยอมหรือใช้สิทธิขอคัดค้านตามที่แจ้งไว้ข้างต้นแล้ว
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>
                สิทธิขอให้ระงับการใช้ข้อมูล (right to restriction of processing)
              </b>{" "}
              คุณมีสิทธิขอให้ระงับการใช้ข้อมูลส่วนบุคคลชั่วคราวในกรณีที่เราอยู่ระหว่างตรวจสอบตามคำร้องขอใช้สิทธิขอแก้ไขข้อมูลส่วนบุคคลหรือขอคัดค้านของคุณหรือกรณีอื่นใดที่เราหมดความจำเป็นและต้องลบหรือทำลายข้อมูลส่วนบุคคลของคุณตามกฎหมายที่เกี่ยวข้องแต่คุณขอให้เราระงับการใช้แทน
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>สิทธิขอให้แก้ไขข้อมูล (right to rectification)</b>{" "}
              คุณมีสิทธิขอแก้ไขข้อมูลส่วนบุคคลของคุณให้ถูกต้อง เป็นปัจจุบัน
              สมบูรณ์ และไม่ก่อให้เกิดความเข้าใจผิด
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>สิทธิร้องเรียน (right to lodge a complaint)</b>{" "}
              คุณมีสิทธิร้องเรียนต่อผู้มีอำนาจตามกฎหมายที่เกี่ยวข้อง
              หากคุณเชื่อว่าการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของคุณ
              เป็นการกระทำในลักษณะที่ฝ่าฝืนหรือไม่ปฏิบัติตามกฎหมายที่เกี่ยวข้อง
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              คุณสามารถใช้สิทธิของคุณในฐานะเจ้าของข้อมูลส่วนบุคคลข้างต้นได้
              โดยติดต่อมาที่เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของเราตามรายละเอียดท้ายนโยบายนี้
              เราจะแจ้งผลการดำเนินการภายในระยะเวลา 30 วัน
              นับแต่วันที่เราได้รับคำขอใช้สิทธิจากคุณ
              ตามแบบฟอร์มหรือวิธีการที่เรากำหนด ทั้งนี้
              หากเราปฏิเสธคำขอเราจะแจ้งเหตุผลของการปฏิเสธให้คุณทราบผ่านช่องทางต่าง
              ๆ เช่น ข้อความ (SMS) อีเมล โทรศัพท์ จดหมาย เป็นต้น
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              การรักษาความมั่งคงปลอดภัยของข้อมูลส่วนบุคคล
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราจะรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคลของคุณไว้ตามหลักการ
              การรักษาความลับ (confidentiality) ความถูกต้องครบถ้วน (integrity)
              และสภาพพร้อมใช้งาน (availability) ทั้งนี้ เพื่อป้องกันการสูญหาย
              เข้าถึง ใช้ เปลี่ยนแปลง แก้ไข หรือเปิดเผย
              นอกจากนี้เราจะจัดให้มีมาตรการรักษาความมั่นคงปลอดภัยของข้อมูลส่วนบุคคล
              ซึ่งครอบคลุมถึงมาตรการป้องกันด้านการบริหารจัดการ (administrative
              safeguard) มาตรการป้องกันด้านเทคนิค (technical safeguard)
              และมาตรการป้องกันทางกายภาพ (physical safeguard)
              ในเรื่องการเข้าถึงหรือควบคุมการใช้งานข้อมูลส่วนบุคคล (access
              control)
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              การแจ้งเหตุละเมิดข้อมูลส่วนบุคคล
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              ในกรณีที่มีเหตุละเมิดข้อมูลส่วนบุคคลของคุณเกิดขึ้น
              เราจะแจ้งให้สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคลทราบโดยไม่ชักช้าภายใน
              72 ชั่วโมง นับแต่ทราบเหตุเท่าที่สามารถกระทำได้
              ในกรณีที่การละเมิดมีความเสี่ยงสูงที่จะมีผลกระทบต่อสิทธิและเสรีภาพของคุณ
              เราจะแจ้งการละเมิดให้คุณทราบพร้อมกับแนวทางการเยียวยาโดยไม่ชักช้าผ่านช่องทางต่าง
              ๆ เช่น เว็บไซต์ ข้อความ (SMS) อีเมล โทรศัพท์ จดหมาย เป็นต้น
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              การแก้ไขเปลี่ยนแปลงนโยบายความเป็นส่วนตัว
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              เราอาจแก้ไขเปลี่ยนแปลงนโยบายนี้เป็นครั้งคราว
              โดยคุณสามารถทราบข้อกำหนดและเงื่อนไขนโยบายที่มีการแก้ไขเปลี่ยนแปลงนี้ได้ผ่านทางเว็บไซต์ของเรา
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              นโยบายนี้แก้ไขล่าสุดและมีผลใช้บังคับตั้งแต่วันที่ 09 พฤษภาคม 2566
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              นโยบายความเป็นส่วนตัวของเว็บไซต์อื่น
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              นโยบายความเป็นส่วนตัวฉบับนี้ใช้สำหรับการเสนอสินค้า บริการ
              และการใช้งานบนเว็บไซต์สำหรับลูกค้าของเราเท่านั้น
              หากคุณเข้าชมเว็บไซต์อื่นแม้จะผ่านช่องทางเว็บไซต์ของเรา
              การคุ้มครองข้อมูลส่วนบุคคลต่าง ๆ
              จะเป็นไปตามนโยบายความเป็นส่วนตัวของเว็บไซต์นั้น
              ซึ่งเราไม่มีส่วนเกี่ยวข้องด้วย
            </Col>

            <Col
              span={24}
              className="text-color"
              style={{ fontSize: "28px", fontWeight: "Bold" }}
            >
              รายละเอียดการติดต่อ
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              หากคุณต้องการสอบถามข้อมูลเกี่ยวกับนโยบายความเป็นส่วนตัวฉบับนี้
              รวมถึงการขอใช้สิทธิต่าง ๆ
              คุณสามารถติดต่อเราหรือเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคลของเราได้
              ดังนี้
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>ผู้ควบคุมข้อมูลส่วนบุคคล</b>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              บริษัท เอดีซี ไมโครซิสเต็มส์ จำกัด
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              36/10 หมู่ที่ 10 วัดจันทร์ เมืองพิษณุโลก พิษณุโลก 65000
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              อีเมล pacharaphon@adcm.co.th
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              <b>เจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล</b>
            </Col>
            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              ทีม DPO และ DEV
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              36/10 หมู่ที่ 10 วัดจันทร์ เมืองพิษณุโลก พิษณุโลก 65000
            </Col>

            <Col span={24} className="text-color" style={{ fontSize: "16px" }}>
              อีเมล pacharaphon@adcm.co.th
            </Col>
            <p></p>
          </Row>
          <Divider style={{ margin: "10px 0" }} />
          <Row style={{ paddingTop: "2rem" }}>
            <Col span={24}>
              <Checkbox
                className={styles.checkbox_color}
                onChange={toggleDisable}
              >
                ยินยอมและยอมรับในข้อตกลง
              </Checkbox>
            </Col>
            <Col span={24} style={{ textAlign: "end" }}>
              {disabled ? (
                <Button
                  className={styles.checkbox_color_disnable}
                  style={{ width: "fit-content" }}
                  disabled={disabled}
                >
                  ลงทะเบียนเข้าใช้งาน{" "}
                </Button>
              ) : (
                <Button
                  className={styles.button_style}
                  style={{ width: "fit-content" }}
                  onClick={handleClick}
                >
                  ลงทะเบียนเข้าใช้งาน{" "}
                </Button>
              )}
            </Col>
          </Row>
        </div>
      </main>

      {/* <footer style={{ padding: '2rem' }}>
                <Row>
                    <Col span={24}><Checkbox className={styles.checkbox_color} onChange={toggleDisable}>ยินยอมและยอมรับในข้อตกลง</Checkbox></Col>
                    <Col span={12}></Col>
                    <Col span={12}>
                        {disabled ? (<Button className={styles.checkbox_color_disnable} style={{width:"fit-content"}} disabled={disabled}>ลงทะเบียนเข้าใช้งาน </Button>) : (<Button className={styles.button_style} style={{width:"fit-content"}} onClick={handleClick}>ลงทะเบียนเข้าใช้งาน </Button>)}

                    </Col>
                </Row>

            </footer> */}

    </ConfigProvider>
  );
};

export default Policy;
