import React, { useState } from "react";
import Codemirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";

const extsnsions = [javascript({ jsx: true })];
const CodeEditor = () => {
  const [code, setCode] = useState("");
  return (
    <div className="w-full h-full ">
      <Codemirror
        className={`h-full text-[17px]`}
        height="100%"
        theme={dracula}
        extensions={extsnsions}
        value={code}
        onChange={(val, viewUpdate) => {
          setCode(val);
        }}
        // style={{ fontSize: "16px" }}
        placeholder={"code likho bhaiiii"}
      />
    </div>
  );
};

export default CodeEditor;
