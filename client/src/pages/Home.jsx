import { Navigate } from "react-router-dom";
import ChatApp from "../component/Sidebar";
import Logout from "../component/Navbar";

export default function Home() {
  // Only logged-in users can see the chat page
  const user = localStorage.getItem("chat-user");
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Logout />
      <ChatApp />
    </div>
  );
}
