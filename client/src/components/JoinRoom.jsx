import React, { useState } from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

export default function JoinRoom() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const handleJoin = async()=>{
    if(roomId == '' || username ==''){
      toast.error("Please fill in all option fields.");
    }
    else{
      try {

        // Fetch the public IP address
        const response = await axios.get("https://api.ipify.org?format=json");
        const ipAddress = response.data.ip;

        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/joinRoom`,{roomId:roomId,ipAddress:ipAddress})
          .then((res)=>{
            if(res.data === 'error'){
              toast.error('Invalid room ID')
            }
            else{
              toast.success('joined Room')
              navigate(`/poll/${roomId}`);
            }
          })
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <div className="join--Room rounded">
        <h4 className="fw-bold">
          Electrify<span className="text-success">Polls</span>
        </h4>
        <p>Paste invitation POLL ID</p>
        <div>
          <input
            type="text"
            name="pollId"
            placeholder="POLL ID"
            className="form-control"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <input
            type="text"
            name="username"
            placeholder="USERNAME"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <br />
        <div className="d-flex justify-content-end">
          <button className="btn btn-success col-3" onClick={handleJoin}>
            Join
          </button>
        </div>
        <p className="mt-2 text-center">
          If you don't have an invite then create <a href="/createPoll">new poll</a>
        </p>
      </div>
    </>
  );
}
