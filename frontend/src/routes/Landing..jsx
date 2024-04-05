import React, { useState, useEffect } from 'react';

function Landing() {
    const [micAllowed, setMicAllowed] = useState(true);
    const [camAllowed, setCamAllowed] = useState(true);
    const [mediaStream, setMediaStream] = useState(null);
    const [roomCode, setRoomCode] = useState('');

    useEffect(() => {
        const mediaConstraints = { video: true, audio: true };
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localstream => {
                setMediaStream(localstream);
            })
            .catch(error => {
                console.error('Error accessing media devices:', error);
            });

        // Clean up function to stop media stream when component unmounts
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        };
    }, []);

    function uuidv4() {
        return 'xxyxyxxyx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const handleCreateRoom = () => {
        const room = uuidv4();
        setRoomCode(room);
        // You can navigate to the room using React Router instead of location.href
        // Example: history.push(`/room/${room}`);
        window.location.href = `/room.html?room=${room}`;
    };

    const handleJoinRoom = () => {
        if (roomCode.trim() === "") {
            // Handle empty room code error
            return;
        }
        // You can navigate to the room using React Router instead of location.href
        // Example: history.push(`/room/${roomCode}`);
        window.location.href = `/room.html?room=${roomCode}`;
    };

    const toggleMic = () => {
        setMicAllowed(!micAllowed);
    };

    const toggleCam = () => {
        setCamAllowed(!camAllowed);
    };

    return (
        <div>
            <navbar>
                <div className="logo">QuickMeet</div>
            </navbar>

            <div className="main">
                <div className="create-join">
                    <div className="text">
                        <div className="head">Create Video Meetings in one-click.</div>
                        <div className="subtext">No sign ups required. Open Source platform.</div>
                    </div>
                    <button onClick={handleCreateRoom} className="createroom-butt unselectable">Create Room</button><br />
                    <input type="text" name="room" spellCheck="false" placeholder="Enter Room Code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} className="roomcode" /><br />
                    <div onClick={handleJoinRoom} className="joinroom unselectable">Join Room</div>
                </div>
                <div className="video-cont">
                    <video className="video-self" autoPlay muted playsInline ref={(videoRef) => { if (videoRef && mediaStream) videoRef.srcObject = mediaStream; }}></video>
                    <div className="settings">
                        <div className={`device ${micAllowed ? '' : 'nodevice'}`} id="mic" onClick={toggleMic}>
                            <i className="fas fa-microphone"></i>
                        </div>
                        <div className={`device ${camAllowed ? '' : 'nodevice'}`} id="webcam" onClick={toggleCam}>
                            <i className="fas fa-video"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;
