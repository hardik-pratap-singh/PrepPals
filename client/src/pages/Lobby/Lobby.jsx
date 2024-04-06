import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider"
// import { Container, Row, Col, Button } from 'react-bootstrap';
import { AuthState } from "../../context/AuthProvider";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Notify } from "../../utils";

const LobbyScreen = () => {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");
    const { auth } = AuthState();


    const [isLoading, setIsLoading] = useState(true);
    const [roomsList, setRoomsList] = useState([]);

    const socket = useSocket();
    const navigate = useNavigate();  
    
    

    useEffect(() => {
        console.log(socket)
        if (socket.id) {
            socket.emit("get:rooms", socket.id);
            socket.on("send:rooms", (data) => {
                setRoomsList(data.roomsIdList);
                console.log({ "hi": data.roomsIdList });
                setIsLoading(false);
            });
        }
        else {
            console.log("Socket not connected");
        }
        // return () => {
        //     if (socket) {
        //         socket.off("send:rooms");
        //     }
        // };
    }, [socket]);

    const handleSubmitForm = useCallback(

        (e) => {
            e.preventDefault();
            // let roomId = room.trim();
            console.log(roomsList);
            if(roomsList.length === 0){
                let roomId = generateRandomRoomId();
                let temp = [roomId]
                setRoomsList(temp);
                console.log(temp);
                setRoom(roomId);
                socket.emit("room:join", { email, room: roomId, roomsList:temp });
            }
            else {
                let idx = Math.floor(Math.random()*roomsList.length);
                let roomId = roomsList[idx];
                setRoom(roomId);
                let tempList = roomsList;
                tempList.splice(idx, 1);
                setRoomsList(tempList);
                socket.emit("room:join", { email, room: roomId, roomsList:tempList });
            }
        },
        [email, room, socket, roomsList]
    );

    const generateRandomRoomId = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const roomIdLength = 6;
        let roomId = "";
        for (let i = 0; i < roomIdLength; i++) {
            roomId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return roomId;
    };

    const handleJoinRoom = useCallback(
        (data) => {
            const { email, room } = data;
            navigate(`/room/${room}`);
        },
        [navigate]
    );

    useEffect(() => {
        setEmail(auth.email)
        socket.on("room:join", handleJoinRoom);
        return () => {
            socket.off("room:join", handleJoinRoom);
        };
    }, [socket, handleJoinRoom, email]);

    return (
        <div style={{ width: "100%", display: "flex", margin: "auto" }}>

            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col md={10} className="text-left">
                        <br /><br /><br />
                        <h1 style={{ fontSize: "3rem" }}>Welcome to PrepPals !</h1>
                        <br />
                        <p style={{ fontSize: "2rem" }}>Unlock Your Potential, Ace Your Interviews</p>
                        <br />
                        <p style={{ fontSize: "1.5rem" }}>
                            Are you ready to land that dream job ? Your ultimate destination for mastering the art of interview preparation.
                        </p>

                        <p>
                            <form onSubmit={handleSubmitForm}>
                                <br />
                                <br />
                                <button className="btn btn-primary" style={{ fontSize: "1.5rem" }}>Join Interview</button>
                            </form>
                        </p>
                    </Col>
                </Row>

                {/* Earlier Code */}
                {/* <div className="card " style={{ width: '18rem' }}>
                    <div className="card-body">
                        <h5 className="card-title">Lobby</h5>
                        <form onSubmit={handleSubmitForm}>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Room Id</label>
                                <input type="text" className="form-control" id="room" value={room} aria-describedby="emailHelp" placeholder="Enter RoomId" onChange={(e) => setRoom(e.target.value)} />
                            </div>

                            <button className="btn btn-primary">Join</button>
                        </form>
                    </div>
                </div> */}


            </Container>

        </div>
    );
};

export default LobbyScreen;
