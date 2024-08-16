import { useEffect, useState } from "react";
import PollOption from "../components/PollOption";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

export default function CreatePoll() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Add a new PollOption when the component mounts
    addOption();
    addOption();
  }, []);

  const addOption = () => {
    if (options.length == 4) {
      toast.info("can create upto 4 options");
      return;
    }
    // Add a new PollOption when the button is clicked
    setOptions((prevOptions) => [
      ...prevOptions,
      { id: prevOptions.length + 1, value: "" ,vote:0},
    ]);
  };

  const deleteOption = (index) => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions.splice(index, 1);
      return newOptions;
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].value = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if username and poll question are empty
    if (!username || !pollQuestion) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check if any option is empty
    if (options.some((option) => !option.value)) {
      toast.error("Please fill in all option fields.");
      return;
    }

    // Prepare data to send to the server
    const pollData = {
      username,
      question: pollQuestion,
      options: options.map((option) => ({ option: option.value, vote: option.vote })),
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/createpoll`, pollData).then((res) => {
        if (res.data.message === "success") {
          const roomId = res.data.roomId;
          const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
          // Connect to the Socket.IO server
          socket.on("connect", () => {
            // Emit 'joinRoom' event with roomId and pollData
            socket.emit("joinRoom", { roomId, pollData });
            
            socket.disconnect();

            navigate(`/poll/${roomId}`);
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
        <div className="col-sm-8 col-md-7 col-lg-6">
          <h3 className="fw-bold">Create a poll</h3>
          <p className="text-secondary fw-semibold">
            Complete the below fields to create your poll
          </p>
          <div>
            <label
              htmlFor="username"
              className="fw-bold text-secondary form-label"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form-control fs-5"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <label
              htmlFor="pollQuestion"
              className="fw-bold text-secondary form-label"
            >
              Poll question
            </label>
            <input
              type="text"
              name="pollQuestion"
              placeholder="Eg. What is your favorite color?"
              className="form-control fs-5"
              required
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
            />
          </div>
          {options.map((option, index) => (
            <PollOption
              key={option.id}
              index={index}
              value={option.value}
              onChange={handleOptionChange}
              onDelete={() => deleteOption(index)} // Pass onDelete prop
            />
          ))}
          <br />
          <div className="d-flex gap-3">
            <button
              className="btn col-3"
              style={{ background: "#3bbd6c", color: "white" }}
              onClick={handleSubmit}
            >
              Create your Poll
            </button>
            <button
              className="btn"
              style={{ width: "100%", background: "#3bbd6c", color: "white" }}
              onClick={addOption}
            >
              + Add an option
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
