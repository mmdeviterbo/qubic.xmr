import { isValidValue } from "./transformers";

export const formatLargeInteger = (value: number) => {
  if (!isValidValue(value)) {
    return "-";
  }

  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2).replace(/\.0$/, "") + " GH/s";
  }
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2).replace(/\.0$/, "") + " MH/s";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(2).replace(/\.0$/, "") + " KH/s";
  }
  return value?.toFixed(2).toLocaleString().concat(" H/s");
};

export const base64ToIntArray = (base64String: string) => {
  const binaryString = atob(base64String);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray;
};

export const float64ToDecimalArray = (base64String: string): number => {
  try {
    const decodedBase64String = atob(base64String);
    const len = decodedBase64String.length;
    const buffer = new ArrayBuffer(len);
    const uint8 = new Uint8Array(buffer);

    for (let i = 0; i < len; i++) {
      uint8[i] = decodedBase64String.charCodeAt(i);
    }

    const view = new DataView(buffer);
    const result: number[] = [];

    for (let i = 0; i < buffer.byteLength; i += 8) {
      result.push(view.getFloat64(i, true));
    }

    // convert to million
    return result[result.length - 1] * 1000000;
  } catch (error) {
    return -1;
  }
};
