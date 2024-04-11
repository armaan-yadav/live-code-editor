import React, { useState } from "react";
import Avatar from "react-avatar";
import UserCard from "../components/UserCard";
import CodeEditor from "../components/CodeEditor";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
const Editor = () => {
  const { roomId } = useParams();

  const [users, setUsers] = useState([
    { socketId: 1, username: "armaan" },
    { socketId: 1, username: "kajal" },
  ]);
  const onCopy = () => {
    toast.success("Copied to clipboard");
  };
  return (
    <div className="h-full w-full flex gap-2">
      <div className="h-full  w-[300px] flex flex-col">
        <p className="w-full text-center text-lg">Live Code Editor</p>
        <div className="flex flex-col gap-2 h-full">
          <div className="flex-1 flex flex-col gap-3">
            {users?.map((user, index) => (
              <UserCard username={user?.username} key={index} />
            ))}
          </div>
          <CopyToClipboard text={roomId} onCopy={onCopy}>
            <button className="btn btn-success btn-md">Copy Room Id</button>
          </CopyToClipboard>
          <button className="btn btn-error btn-md">Leave Room</button>
        </div>
      </div>
      <div className="h-full w-full bg-red-900">
        <CodeEditor />
      </div>
    </div>
  );
};

export default Editor;
