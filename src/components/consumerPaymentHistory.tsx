import { Card, Typography, Space, Row, Col } from "antd";
import { IPaymentHistory } from "../interfaces/payment_history.interface";
const { Title, Text } = Typography;

interface ConsumersPaymentHistoryProps {
  data: IPaymentHistory[];
}

const ConsumerPaymentHistory: React.FC<ConsumersPaymentHistoryProps> = ({
  data,
}) => {
  console.log(data);
  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ maxWidth: "500px", display: "flex" }}
    >
      {data.length > 0 &&
        data.map((history) => (
          <Card
            style={{
              width: 360,
              borderRadius: 20,
              boxShadow: " 4px 4px 6px rgba(0, 0, 0, 0.25)",
            }}
            key={history.bill.id}
          >
            {/* <Title level={4}>{`${history.bill.bill_number}`}</Title>

            <Text>{`${history.bill.datetime}`}</Text>

            <p>
              <Text>{`${history.status}`}</Text>{" "}
            </p>

            <p>
              usage unit
              <Text>{`${history.bill.result_object.water_usage.usage_unit}`}</Text>
            </p>
            <p>
              cost
              <Text>{`${history.bill.result_object.water_usage.total_cost}`}</Text>
            </p> */}

            {/* <Row wrap={false} style={{ paddingTop: "1rem" }}>
              <Col style={{ marginLeft: "2rem" }}>
                <Col
                  span={12}
                  style={{
                    color: "#2C74B3",
                    fontSize: "20px",
                    fontWeight: "Bold",
                  }}
                >
                  {" "}
                  จำนวน
                  {history.bill.result_object.water_usage.usage_unit}
                  ลบ.ม.
                </Col>
                <Col span={12} style={{ fontSize: "16px" }}>
                  {history.bill.result_object.water_usage.total_cost} บาท
                </Col>
              </Col>
            </Row>
            <Row wrap={false} style={{ paddingTop: "1rem" }}>
              <Col style={{ marginLeft: "2rem" }}>
                <Col
                  span={12}
                  style={{
                    color: "#2C74B3",
                    fontSize: "20px",
                    fontWeight: "Bold",
                  }}
                >
                  {new Date(history.bill.datetime).toLocaleDateString('th-TH')}{" "}
                  รอบบิล
                  {" "}{history.bill.result_object.consumption.current.period}
                </Col>
                <Col span={12} style={{ fontSize: "16px" }}>
                  สถานะ {history.status === "successful" ? "ชำระเงินเสร็จสิ้น" : "ยังไม่ได้ชำระเงิน"}
                </Col>
              </Col>
            </Row> */}

            <Row style={{ display: "flex", justifyContent: "center" }}>
              <Col span={12} style={{ fontSize: "16px" }}>
                {" "}
                จำนวน{" "}
                {history.bill.result_object.water_usage.usage_unit}{" "}
                ลบ.ม.
              </Col>
              {/* <Col span={4}></Col> */}
              <Col span={12} style={{ fontSize: "20px", fontWeight: "Bold", textAlign:"center" }}>
                {history.bill.result_object.water_usage.total_cost} บาท
              </Col>
            </Row>

            <Row style={{ display: "flex", justifyContent: "center" }}>
              <Col span={12} style={{ fontSize: "12px", color: "#A0A0A0" }}>
                {/* {new Date(history.bill.datetime).toLocaleDateString('th-TH')} */}{" "}
                รอบบิล {history.bill.result_object.consumption.current.period}
              </Col>
              {/* <Col span={2}></Col> */}

              {history.status === "successful" ? (
                <Col span={12} style={{ color: "green", fontWeight: "bold", textAlign:"center" }}>
                  {"ชำระเงินเสร็จสิ้น"}
                </Col>
              ) : (
                <Col span={12} style={{ color: "red", fontWeight: "bold", textAlign:"center" }}>
                  {"ยังไม่ได้ชำระเงิน"}
                </Col>
              )}

              {/* <Col span={12} >สถานะ {history.status === "successful" ? "ชำระเงินเสร็จสิ้น" : "ยังไม่ได้ชำระเงิน"}</Col> */}
            </Row>
          </Card>
        ))}

    </Space>
  );
};

export default ConsumerPaymentHistory;
