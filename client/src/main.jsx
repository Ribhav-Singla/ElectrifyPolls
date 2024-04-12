import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Navbar from "./components/Navbar.jsx";
import JoinRoom from "./components/JoinRoom.jsx";
import Poll from "./pages/Poll.jsx";
import CreatePoll from "./pages/CreatePoll.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
 
    <BrowserRouter>
    <Navbar />
    <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/joinRoom' element={<JoinRoom/>}/>
        <Route path='/createPoll' element={<CreatePoll/>}/>
        <Route path='/poll/:roomId' element={<Poll/>}/>
      </Routes>
    </BrowserRouter>
  
);
