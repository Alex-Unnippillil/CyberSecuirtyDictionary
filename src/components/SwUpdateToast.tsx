import React, { useEffect, useState } from "react";

const SwUpdateToast: React.FC = () => {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onUpdate = (
      event: Event | CustomEvent<ServiceWorkerRegistration>,
    ) => {
      const reg = (event as CustomEvent<ServiceWorkerRegistration>).detail;
      if (sessionStorage.getItem("sw-update-deferred")) return;
      setWaitingWorker(reg.waiting);
      setVisible(true);
    };

    window.addEventListener("swUpdated", onUpdate as EventListener);
    return () => {
      window.removeEventListener("swUpdated", onUpdate as EventListener);
    };
  }, []);

  const refresh = () => {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    sessionStorage.removeItem("sw-update-deferred");
    window.location.reload();
  };

  const defer = () => {
    sessionStorage.setItem("sw-update-deferred", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="toast sw-update-toast" role="status" aria-live="polite">
      <span>Update available</span>
      <button onClick={refresh}>refresh now</button>
      <button onClick={defer}>remind later</button>
    </div>
  );
};

export default SwUpdateToast;
