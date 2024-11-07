import SignupPage from "./pages/SignupPage";
import {Routes,Route} from "react-router-dom"
import Compose from "./compose/Compose";
import LoginPage from "./components/Auth/LoginForm";
import { useSelector } from "react-redux";
import MainPage from "./pages/MainPage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function App() {
  const isLoggedIn=useSelector(state=>state.auth.isLoggedIn);
  const navigate=useNavigate();

  
  return (
   <>
   <Routes>
    <Route path="/"  element={<LoginPage/>}></Route>
    <Route path="/signup" element={<SignupPage/>}></Route>
    <Route path="/compose" element={<Compose/>}></Route>
    <Route path="/home" element={<MainPage/>}></Route>
   </Routes>
   
   </>
  );
}

export default App;
