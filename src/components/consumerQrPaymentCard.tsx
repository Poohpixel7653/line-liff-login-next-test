import { IData } from "@/interfaces/qr_payment.interface";
import { Card, Space,Image,ConfigProvider, Button, Row, Col } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

interface QrPaymentProps {
  data: IData | null;
}



const QrPaymentCard: React.FC<QrPaymentProps> = ({ data }) => {
  const downloadImage = (url: string) => {

    saveAs(url, "image.jpg"); // Put your image url here.
  };
  const coverntFiletoBlobAndDownload = async (file:string, name:string) => {
    const blob = await fetch(file).then(r => r.blob())
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = name // add custom extension here
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    // Remove "a" tag from the body
    a.remove()
  }

  const [qrData, setQrData] = useState<IData | null>(null);

  const router = useRouter();
  const { bill_number } = router.query;
  const handleClick = (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <ConfigProvider theme={{
      token: {
          fontFamily: 'Prompt',
      },
  }}>

<Space
      direction="vertical"
      size="large"
      style={{ display: "flex",justifyContent:"center",alignItems:"center" }}
    >
      {data && (
        <Card
        
          // extra={
            
          // }
        >
          <Row>
          <Col span={8}>
          {/* <Button style={{
        background: "linear-gradient(90deg, #2C74B3 0%, #0A2647 100%)",
        // boxShadow:"0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "20px",
        // borderColor:"#2c3e50",
        color: "#ffffff",
        // marginTop: "1rem",
        width:"100%"
      }}
        onClick={
          handleClick
        }>
        Go Home
      </Button> */}
    </Col>
    <Col span={8}>
      
    </Col>
    <Col span={8} >
    <Button
              // type="button"
              // className="styles.button_style"
              style={{
                background: "linear-gradient(90deg, #2C74B3 0%, #0A2647 100%)",
                // boxShadow:"0px 4px 4px rgba(0, 0, 0, 0.25)",
                borderRadius:"20px",
                // borderColor:"#2c3e50",
                color:"#ffffff",
                width:"100%"
              }}
              onClick={() => {
                // coverntFiletoBlobAndDownload(data.payment_detail.qr_image,"qr-payment.png")
                downloadImage(data.payment_detail.qr_image);
              }}
            >
              Save
            </Button>
    </Col>
          </Row>


          
          
          <div id="qrcard" style={{display:"flex",alignItems:"center",justifyItems:"center",flexDirection:"column"}}>
            <p>Status : {data.status}</p>
            <Image
              // width={200}  
              // preview={false}
              alt=""
              src={data.payment_detail.qr_image}
            ></Image>
            <p>
              กรุณาชำระก่อน วันที่
              {new Date(data.payment_detail.expires_at).toLocaleString(
                "th-TH",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour12: false,
                }
              )}{" "}
              น.
            </p>
          </div>
          {/* <a href={data.payment_detail.qr_image} target="_blank" download="qr-payment.png">SAVE</a> */}
        </Card>
      )}

    </Space>

    </ConfigProvider>
    
  );
};

export default QrPaymentCard;
