import React from "react";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer autoClose={1750} />
      <div className="h-screen w-screen ">
        <Routes>
          <Route index element={<Home />} path="/" />
          <Route element={<Editor />} path="/editor/:roomId" />
        </Routes>
      </div>
    </>
  );
};

export default App;
