import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import UserCard from "../components/UserCard";
import CodeEditor from "../components/CodeEditor";
import { useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { initSocket } from "../socket";
const Editor = () => {
  const navigate = useNavigate();
  //states
  const { roomId } = useParams();
  const location = useLocation();
  //connected users (to be linked with context)
  const [users, setUsers] = useState([
    // { socketId: 1, username: "armaan" },
    // { socketId: 1, username: "kajal" },
  ]);
  //handling copy to clipboard
  const onCopy = () => {
    toast.success("Copied to clipboard");
  };
  //handling web socket connection
  const socketRef = useRef(null);
  const init = async () => {
    //initiating a new websocket connection
    socketRef.current = await initSocket();

    //handling errors
    const handleError = (err) => {
      console.log(err);
      toast.error("Error while establishing a connection");
      navigate("/");
    };
    socketRef.current.on("connect_error", (err) => handleError(err));
    socketRef.current.on("connect_failed", (err) => handleError(err));

    //joining the server
    socketRef.current.emit("join", {
      roomId,
      username: location.state?.username,
    });

    //custom event-> receiving data from server on joining
    socketRef.current.on("joined", ({ clients, username, socketId }) => {
      username !== location.state?.username &&
        toast.success(`${username} joined`);
      setUsers(clients);
    });
    //custom event->receiving data from server on disconnecting

    socketRef.current.on("disconnected", ({ socketId, username }) => {
      toast.error(`${username} left`);
      setUsers((prev) => {
        return prev.filter((client) => client.socketId != socketId);
      });
    });
  };
  useEffect(() => {
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off();
    };
  }, []);
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
