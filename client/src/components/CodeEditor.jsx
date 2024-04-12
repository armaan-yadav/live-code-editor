// import React, { useEffect, useRef, useState } from "react";
// // import Codemirror from "@uiw/react-codemirror";
// import CodeMirror from "codemirror";
// import { dracula } from "@uiw/codemirror-theme-dracula";
// import { javascript } from "@codemirror/lang-javascript";
// import io from "socket.io-client";
// import { initSocket } from "../socket";
// const extsnsions = [javascript({ jsx: true })];
// const CodeEditor = () => {
//   const [code, setCode] = useState("");
//   const editorRef = useRef(null);
//   // const socket = useRef(io(import.meta.env.VITE_SERVER_URL));
//   useEffect(() => {
//     const init = async () => {
//       editorRef.current.on("change", (instance, changes) => {
//         console.log("changes", instance, changes);
//       });
//     };
//     init();
//   }, []);
//   const socket = useRef(null);
//   // useEffect(() => {
//   //   const init = async () => {
//   //     socket.current = await initSocket(); // Listen for changes from the server
//   //     // socket.current.on("codeChange", (newCode) => {
//   //     //   setCode(newCode);
//   //     // });
//   //     socket.current.on("change", (instance, changes) => {
//   //       console.log("change", instance, changes);
//   //       console.log("first");
//   //     });
//   //   };
//   //   init();

//   //   return () => {
//   //     // Clean up socket connection on component unmount
//   //     socket.current.disconnect();
//   //   };
//   // }, []);

//   const editor = CodeMirror.fromTextArea(
//     document.getElementById("realtimeEditor"),
//     {
//       // mode: { name: "javascript", json: true },
//       // theme: "dracula",
//       // autoCloseTags: true,
//       // autoCloseBrackets: true,
//       // lineNumbers: true,
//     }
//   );
//   return (
//     <div className="w-full h-full ">
//       {/* <Codemirror
//         ref={editorRef}
//         className={`h-full text-[17px]`}
//         height="100%"
//         theme={dracula}
//         extensions={extsnsions}
//         value={code}
//         onChange={(val, viewUpdate) => {
//           setCode(val);
//           socket.current.emit("codeChange", val);
//         }}
//         // style={{ fontSize: "16px" }}
//         placeholder={"code likho bhaiiii"}
//       /> */}
//       <textarea id="realtimeEditor"></textarea>
//     </div>
//   );
// };

// export default CodeEditor;

import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";

function CodeEditor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);
  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      // for sync the code
      editorRef.current = editor;

      editor.setSize(null, "100%");
      editorRef.current.on("change", (instance, changes) => {
        // console.log("changes", instance ,  changes );
        const { origin } = changes;
        const code = instance.getValue(); // code has value which we write
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit("code-change", {
            roomId,
            code,
          });
        }
      });
    };

    init();
  }, []);

  // data receive from server
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("code-change", ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off("code-change");
    };
  }, [socketRef.current]);

  return (
    <div style={{ height: "600px" }}>
      <textarea id="realtimeEditor"></textarea>
    </div>
  );
}

export default CodeEditor;
