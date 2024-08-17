import PollItem from "../components/PollItem";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function Poll() {
  const { roomId } = useParams();
  const bgcolor = ["#3bbd6c", "blue", "red", "orange"];

  // using socketio logic here
  const [roomState, setRoomState] = useState(undefined);
  console.log(roomState);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(`${import.meta.env.VITE_BACKEND_URL}`);
    // Join the room
    socketRef.current.emit("joinRoom", { roomId });
    // Listen for updates to the room state
    socketRef.current.emit("getState", roomId);
    // logic for updating the state as and when received from the server
    socketRef.current.on("updateState", (state) => {
      setRoomState(state);
    });
    // logic for handling multiple votes as figured by the server
    socketRef.current.on("multipleVotes", () => {
      toast.error('You have already voted');
    })
  }, [roomId]);

  // logic for select vote
  const [isSelected, setIsSelected] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmitVote = async () => {
    if (!isSelected) {
      toast.error("Nothing selected!");
      return;
    }
    try {
      // Fetch the public IP address using Cloudflare's IP detection service
      const response = await axios.get("https://www.cloudflare.com/cdn-cgi/trace");
        
      // Extract the IP address from the response data
      const ipAddress = response.data.match(/ip=(.*)/)[1];
      console.log('ipcheck: ',response.data);

      // Emit vote with public IP address
      socketRef.current.emit("sendVote", { isSelected, roomId, ipAddress });
      setIsSubmit(true);
    } catch (error) {
      console.log("Failed to retrieve IP address");
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center gap-5 flex-wrap mt-3 mb-3">
        <div className="col-sm-8 col-md-7 col-lg-6">
          <span className="badge text-bg-primary mt-3">POLL ID: {roomId}</span>
          <h2 className="fw-semibold mt-2">
            {roomState && roomState.question}
          </h2>
          <p className="">
            Asked by{" "}
            <span className="fw-bold">{roomState && roomState.username}</span>
          </p>
          <div>
            {roomState &&
              roomState.options.map((obj, idx) => {
                return (
                  <PollItem
                    key={idx}
                    option={obj.option}
                    vote={obj.vote}
                    bgcolor={bgcolor[idx]}
                    isSelected={isSelected}
                    setIsSelected={setIsSelected}
                    totalVotes={roomState.totalVotes}
                  />
                );
              })}
          </div>
        </div>

        <div className="col-sm-2">
          <button
            className="btn p-2"
            style={{ background: "#3bbd6c", color: "white", width: "100%" }}
            onClick={handleSubmitVote}
            disabled={isSubmit}
          >
            Submit your vote
          </button>
          <div className="bg-white rounded p-3 mt-3">
            <p>Votes</p>
            <h2 className="fw-semibold">{roomState && roomState.totalVotes}</h2>
          </div>
        </div>
      </div>
    </>
  );
}
