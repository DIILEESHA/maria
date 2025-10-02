import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/rsvp/AdminDashboard";
import Home from "../Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
