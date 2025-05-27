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
  return value?.toLocaleString().concat(" H/s");
};

export const base64ToIntArray = (base64String: string) => {
  const binaryString = atob(base64String);
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }
  return byteArray;
};

// export const float64ToDecimalArray = (base64String: string) => {
//   const binaryString = atob(base64String);
//   const byteArray = new Float64Array(binaryString.length);
//   for (let i = 0; i < binaryString.length; i++) {
//     byteArray[i] = binaryString.charCodeAt(i);
//   }
//   return byteArray;
// };
