import React from "react";
import Script from "next/script";

const ScriptTags = () => {
  return (
    <>
      <Script src="https://unpkg.com/flowbite@1.5.3/dist/flowbite.js"></Script>
      <link
        rel="stylesheet"
        href="https://unpkg.com/flowbite@1.5.3/dist/flowbite.min.css"
      />
      <Script src="https://cdn.jsdelivr.net/npm/tw-elements/dist/js/index.min.js"></Script>
    </>
  );
};

export default ScriptTags;
