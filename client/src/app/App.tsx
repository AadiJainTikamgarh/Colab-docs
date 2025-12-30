import { useEffect } from "react";
import Router from "./router";
import { useAuthStore } from "../store/auth.store";

function App() {
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Only validate session if user appears to be authenticated
    // This reduces unnecessary API calls
    if (isAuthenticated) {
      fetchMe();
    } else {
      // Mark as loaded without API call
      useAuthStore.setState({ isLoading: false });
    }
  }, []); // Only run once on mount

  return (
    <>
      <Router />
    </>
  );
}

export default App;
