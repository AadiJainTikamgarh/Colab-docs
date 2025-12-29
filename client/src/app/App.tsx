import { useEffect } from "react";
import Router from "./router";
import { useAuthStore } from "../store/auth.store";

function App() {
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    console.log(user);
  });
  return (
    <>
      <Router />
    </>
  );
}

export default App;
