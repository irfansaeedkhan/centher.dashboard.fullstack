export async function readFileAsync(file: Blob | undefined): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("invalid file"));
    }

    const stream = new FileReader();
    stream.onerror = reject;
    stream.onload = () => {
      resolve(stream.result);
    };
    stream.readAsDataURL(file as Blob);
  });
}
