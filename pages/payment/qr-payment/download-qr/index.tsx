import { IData } from '@/interfaces/qr_payment.interface';
import { useEffect, useRef } from 'react';
interface QrPaymentProps {
    data: IData | null;
  }

const ImageCreatorPage: React.FC<QrPaymentProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const createNewImage = () => {
      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;

      // Load the existing image
      const existingImage = new Image();
      existingImage.src = data?.payment_detail.qr_image || "";
      existingImage.onload = () => {
        // Set canvas size based on the loaded image dimensions
        canvas.width = existingImage.width;
        canvas.height = existingImage.height;

        // Draw the existing image on the canvas
        context.drawImage(existingImage, 0, 0);

        // Create a new image on the canvas
        context.font = 'bold 24px Arial';
        context.fillText('New Image Text', 50, 50);
      };
    };

    createNewImage();
  }, [data]);

  const downloadImage = () => {
    const canvas = canvasRef.current!;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'new-image.png';
    link.click();
  };

  return (
    <div>
      <h1>Create Image and Download</h1>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={downloadImage}>Download Image</button>
    </div>
  );
};

export default ImageCreatorPage;
