const encodeWithAQUA = (value: string): string => {
 
    const encodedValue = Buffer.from(value).toString('base64');
    const textWithAQUA:string = `AQ${encodedValue}UA`
    const encodedTextWithAQUA = Buffer.from(textWithAQUA).toString('base64');
    return encodedTextWithAQUA;
  }

  export default encodeWithAQUA;