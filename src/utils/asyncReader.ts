import { getAsset } from './prepareAssets';

export function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve: (value: ArrayBuffer) => void, reject: (reason?: unknown) => void) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function readAsDataURL(file: File): Promise<string | null> {
  return new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string | null);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function readAsPDF(file: Blob | string): Promise<{numPages: number, getPage: (page:number) => any}> {
  const pdfjsLib : {getDocument: any} = await getAsset('pdfjsLib');

  const blob = new Blob([file]);
  const url = window.URL.createObjectURL(blob);

  return pdfjsLib.getDocument(url).promise as Promise<{numPages: number, getPage: (page:number) => any}>;
}

export async function readBase64AsPDF(base64String: string) {

  const response = await fetch(base64String);
  const blob = await response.blob();

  const pdf = await readAsPDF(blob);

  console.log(pdf);
  return pdf;
}

export async function readAsBase64(file: File): Promise<string> {
  const arrayBuffer = await readAsArrayBuffer(file);
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}



  // const prefix = "data:application/pdf;base64,";
  
  // if (new RegExp(prefix, 'gi').test(base64String)) {
  //   base64String = base64String.replace(new RegExp(prefix, 'gi'), '');
  // }

  // const pdfjsLib : {getDocument: any} = await getAsset('pdfjsLib');
  // const uint8Array = new Uint8Array(atob(base64String).split('').map(char => char.charCodeAt(0)));
  // const pdfDocument = await pdfjsLib.getDocument({ data: uint8Array }).promise as Promise<unknown>;

  // return pdfDocument;