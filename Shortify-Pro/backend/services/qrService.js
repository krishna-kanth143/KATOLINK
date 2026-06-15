import QRCode from 'qrcode';

export const generateQrCode = async (url) => {
  try {
    return await QRCode.toDataURL(url);
  } catch (error) {
    throw new Error('QR code generation failed');
  }
};
