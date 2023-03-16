import React, { useEffect, useState } from "react";

interface loadingData {
  loading?: boolean;
  loaderDuration?: number;
}
function Loader(data: loadingData) {
  const [loading, setLoading] = useState<boolean>(
    data.loading ? data.loading : true
  );
  const [timeduration, setTimeduration] = useState(data.loaderDuration);
  var body;
  if (typeof document !== "undefined") {
    body = document.querySelector("body");

    if (data.loading) {
      body?.classList.add("stopScrolling");
    } else {
      body?.classList.remove("stopScrolling");
    }
  }
  if (timeduration) {
    setTimeout(() => {
      setLoading(false);
    }, timeduration);
  }
  return (
    <div>
      <div className={`customloaderModal ${loading && "loaderopen"}`}>
        <div className="customloaderContainer">
          <div className="flex items-center justify-center">
            <div
              className="spinner-border text-yellow-theme inline-block h-8 w-8 animate-spin rounded-full border-4"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;
