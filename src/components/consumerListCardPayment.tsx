import {
  Card,
  Typography,
  Space,
  Col,
  Row,
  Button,
  message,
  Popconfirm,
} from "antd";
import { IConsumer } from "../interfaces/payment.interface";
import styles from "../../styles/Home.module.css";
import { QrcodeOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
import Image from "next/image";
import pay from "../../resources/pay.png";
import time from "../../resources/time.png";
import router from "next/router";
import { RestOutlined } from "@ant-design/icons";
import ErrorHandling from "@/components/errorModal";

interface ConsumersPaymentProps {
  data: IConsumer[];
}

const ConsumerListCardPayment: React.FC<ConsumersPaymentProps> = ({ data }) => {
  console.log(data);
  // const [isFail, setFail] = useState(false);

  return (
    <Space direction="vertical" size="middle">
      {data.length > 0 &&
        data.map((consumer) => (
          <Card
            style={{
              width: 360,
              borderRadius: 20,
              boxShadow: " 4px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
            key={`${consumer.id}-${consumer.meters.id}`}
          >
            <Row wrap={false} style={{ paddingTop: "1rem" }}>
              <Col
                flex="none"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Col
                  style={{
                    width: "90px",
                    height: "90px",
                    margin: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className={[styles.circle1, styles.circle_blue].join(" ")}
                  />
                  <div
                    className={[styles.circle2, styles.circle_blue_half].join(
                      " "
                    )}
                  />
                  <div
                    className={[styles.circle3, styles.circle_blue_half].join(
                      " "
                    )}
                  >
                    <div
                      style={{
                        color: "#ffffff",
                        fontSize: "32px",
                        fontWeight: "Bold",
                      }}
                    >{`${consumer.id}`}</div>
                  </div>
                </Col>
              </Col>
              <Col
                flex="auto"
                style={{ marginLeft: "2rem", textAlign: "left" }}
              >
                <Col
                  span={24}
                  style={{
                    color: "#2C74B3",
                    fontSize: "20px",
                    fontWeight: "Bold",
                  }}
                >
                  {consumer.meters?.meter_code || "ไม่ระบุ"}
                </Col>
                <Col
                  span={24}
                  style={{ fontSize: "16px", fontWeight: "Bold" }}
                >{`${consumer.firstname} ${consumer.lastname}`}</Col>
                <Col span={24} style={{ fontSize: "16px" }}>
                  {consumer?.address} {consumer?.moo}
                </Col>
                {/* <Col span={24} style={{ fontSize: "16px" }}>
                  {consumer?.subdistrict}
                </Col> */}
                <Col
                  span={24}
                  style={{ fontSize: "16px" }}
                >{`${consumer.subdistrict}, ${consumer.district}`}</Col>
                <Col span={24} style={{ fontSize: "16px" }}>{`${
                  consumer.province
                } ${consumer.phone ? `- Tel. ${consumer.phone}` : ""}`}</Col>
              </Col>
            </Row>

            <Row style={{}}>
              {/* <Col span={24}> */}
              <Col
                span={24}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {" "}
                {consumer.cost ? (
                  <>
                    <Col
                      span={12}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                      }}
                    >
                      <Text
                        style={{
                          color: "#E34545",
                          fontSize: "20px",
                          fontWeight: "Bold",
                        }}
                      >
                        {`${consumer.cost?.toFixed(2)}`} บาท
                      </Text>
                    </Col>
                    <Col
                      span={12}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                      }}
                    >
                      <Button
                        className={styles.button_payment}
                        href={
                          "payment/list/?meter_uuid=" + consumer.meters?.uuid
                        }
                        style={{}}
                      >
                        <Col span={12}>
                          <Image
                            src={pay}
                            alt="pay"
                            width={23.67}
                            height={24.17}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "5px",
                            }}
                          />
                        </Col>
                        <Col
                          span={12}
                          style={{ fontSize: "8px", marginTop: "5px" }}
                        >
                          ชำระเงิน
                        </Col>
                      </Button>
                      <Button
                        href={
                          "payment/history/?meter_uuid=" + consumer.meters?.uuid
                        }
                        className={styles.button_payment}
                      >
                        <Col span={12}>
                          <Image
                            src={time}
                            alt="time"
                            width={23.67}
                            height={24.17}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "5px",
                            }}
                          />
                        </Col>
                        <Col
                          span={12}
                          style={{ fontSize: "8px", marginTop: "5px" }}
                        >
                          ประวัติ
                        </Col>
                      </Button>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                      }}
                    >
                      <Button
                        href={
                          "payment/history/?meter_uuid=" + consumer.meters?.uuid
                        }
                        className={styles.button_payment}
                        style={{}}
                      >
                        <Col span={12}>
                          <Image
                            src={time}
                            alt="time"
                            width={23.67}
                            height={24.17}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "5px",
                            }}
                          />
                        </Col>
                        <Col
                          span={12}
                          style={{ fontSize: "8px", marginTop: "5px" }}
                        >
                          ประวัติ
                        </Col>
                      </Button>
                    </Col>
                  </>
                )}
              </Col>
            </Row>
          </Card>
        ))}

    </Space>
  );
};

export default ConsumerListCardPayment;
