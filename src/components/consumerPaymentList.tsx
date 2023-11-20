import {
  Card,
  Typography,
  Space,
  Row,
  Col,
  Button,
  Modal,
  ConfigProvider,
} from "antd";
import { IPaymentHistory } from "../interfaces/payment_history.interface";
import { useState } from "react";
import styles from "../../styles/Home.module.css";
const { Title, Text } = Typography;
const ended_status = ["created", "unknown", "pending"];
import errorImg from "../../resources/error.png";
import Image from "next/image";

interface ConsumersPaymentListProps {
  data: IPaymentHistory[];
}

const ConsumerPaymentList: React.FC<ConsumersPaymentListProps> = ({ data }) => {
  console.log(data);
  const [isAlert, setAlert] = useState(false);

  const handleCancel = () => {
    setAlert(false);
  };
  const handleSubmit = () => {
    setAlert(true);
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
        <Space
          direction="vertical"
          size="middle"
          style={{ maxWidth: "500px", display: "flex" }}
        >
          {data.length > 0 &&
            data.map(
              (list) =>
                list.status !== "successful" && (
                  <Card
                    style={{
                      width: 360,
                      borderRadius: 20,
                      boxShadow: " 4px 4px 6px rgba(0, 0, 0, 0.25)",
                    }}
                    key={list.bill.id}
                  >
                    <Row style={{ display: "flex", justifyContent: "center" }}>
                      <Col span={12} style={{ fontSize: "16px" }}>
                        {" "}
                        เลขใบแจ้งหนี้
                      </Col>
                      {/* <Col span={4}></Col> */}
                      <Col
                        span={12}
                        style={{ fontSize: "20px", fontWeight: "Bold" }}
                      >
                        {list.bill.bill_number}
                      </Col>
                    </Row>

                    <Row style={{ display: "flex", justifyContent: "center" }}>
                      <Col span={12} style={{ fontSize: "16px" }}>
                        {" "}
                        จำนวน {
                          list.bill.result_object.water_usage.usage_unit
                        }{" "}
                        ลบ.ม.
                      </Col>
                      {/* <Col span={4}></Col> */}
                      <Col
                        span={12}
                        style={{ fontSize: "20px", fontWeight: "Bold" }}
                      >
                        {list.bill.result_object.water_usage.total_cost} บาท
                      </Col>
                    </Row>

                    <Row style={{ display: "flex", justifyContent: "center" }}>
                      <Col
                        span={12}
                        style={{ fontSize: "12px", color: "#A0A0A0" }}
                      >
                        {" "}
                        รอบบิล{" "}
                        {list.bill.result_object.consumption.current.period}
                      </Col>
                      {/* <Col span={2}></Col> */}
                      <Col span={12}>
                        สถานะ{" "}
                        {list.status === "successful"
                          ? "ชำระเงินเสร็จสิ้น"
                          : "ยังไม่ได้ชำระเงิน"}
                      </Col>
                    </Row>
                    <Row style={{ display: "flex", justifyContent: "end" }}>
                      <Col
                        span={6}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                        }}
                      >
                        <Button 
                        // onClick={handleSubmit}
                          href={"qr-payment/?bill_number=" + list.bill.bill_number}
                          style={{ height: "fit-content" }}
                        >
                          {/* <Col span={12}>
                        <Image src={pay} alt="pay" width={23.67} height={24.17} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5px' }} />
                      </Col> */}
                          <Col
                            span={12}
                            style={{
                              fontSize: "16px",
                              marginTop: "5px",
                            }}
                          >
                            ชำระเงิน
                          </Col>
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                )
            )}
        </Space>

        <Modal
          footer={null}
          width="auto"
          onCancel={handleCancel}
          open={isAlert}
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
              บริการนี้ยังไม่เปิดใช้งาน
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
              กรุณาติดต่อหน่วยงานที่ให้บริการ เพื่อใช้บริการดังกล่าว
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
                onClick={handleCancel}
              >
                ตกลง
              </Button>
            </div>
          </div>
        </Modal>
      </ConfigProvider>
      
    </div>
  );
};

export default ConsumerPaymentList;
