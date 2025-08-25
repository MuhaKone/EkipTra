import React from "react";
import Routes from "./Routes";
import OfflineIndicator from "./components/ui/OfflineIndicator";
import { attachAutoFlush } from "./lib/offlineQueue";

// Initialize offline queue auto-flush
if (typeof window !== 'undefined') {
  attachAutoFlush();
}

function App() {
  return (
    <>
      <Routes />
      <OfflineIndicator />
    </>
  );
}

export default App;
