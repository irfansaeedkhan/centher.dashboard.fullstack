export const copyText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard && navigator.permissions) {
      navigator.clipboard.writeText(text).then(resolve);
    } else if (document.queryCommandSupported("copy")) {
      const ele = document.createElement("textarea");
      ele.value = text;
      document.body.appendChild(ele);
      ele.select();
      document.execCommand("copy");
      document.body.removeChild(ele);
      resolve();
    } else {
      // Resolve anyway because there is no way to copy text
      resolve();
    }
  });
};
