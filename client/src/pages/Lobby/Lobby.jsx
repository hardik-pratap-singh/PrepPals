import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider"
import { AuthState } from "../../context/AuthProvider";

const LobbyScreen = () => {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");
    const {auth} = AuthState() ; 
    
    // console.log(auth)
    // setEmail(auth.email)

    const socket = useSocket();
    console.log(socket)
    const navigate = useNavigate();

    // const handleSubmitForm = useCallback(
    //     (e) => {
    //         e.preventDefault();
    //         socket.emit("room:join", { email, room });
    //     },
    //     [email, room, socket]
    // );

    const handleSubmitForm = useCallback(
        
        (e) => {
            e.preventDefault();
            socket.emit("room:join", { email, room });
        },
        [email, room, socket]
    );

    const handleJoinRoom = useCallback(
        (data) => {
            const { email, room } = data;
            navigate(`/room/${room}`);
        },
        [navigate]
    );

    useEffect(() => {
        setEmail(auth.email)
        // setEmail(auth.email) ; 
        socket.on("room:join", handleJoinRoom);
        return () => {
            socket.off("room:join", handleJoinRoom);
        };
    }, [socket, handleJoinRoom , email ]);

    return (
        <div className="card m-auto" style={{width: '18rem'}}>
            <div className="card-body">
                <h5 className="card-title">Lobby</h5>
                <form onSubmit={handleSubmitForm}>
                    {/* <div className="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email"  className="form-control" id="email" value={email} aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div> */}
                    <div className="form-group">
                        <label for="exampleInputEmail1">Room Id</label>
                        <input type="text"  className="form-control" id="room" value={room} aria-describedby="emailHelp" placeholder="Enter RoomId" onChange={(e) => setRoom(e.target.value)}/>
                    </div>
                    
                    <button className="btn btn-primary">Join</button>
                </form>
            </div>
        </div>

    );
};

export default LobbyScreen;
