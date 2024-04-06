import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../../service/peer"
import { useSocket } from "../../context/SocketProvider"
import { MdCallEnd } from "react-icons/md";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AuthState } from "../../context/AuthProvider";
import { Notify } from "../../utils";
import { useNavigate } from "react-router-dom";

const RoomPage = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [streamButt, setstreamButt] = useState(0);
    const [callButt, setcallButt] = useState(0);
    const [caller, setCaller] = useState(0);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [peerEmailId, setpeerEmailId] = useState();
    const [myEmailId, setmyEmailId] = useState();
    const [modalShow, setModalShow] = React.useState(false);
    const { auth } = AuthState();
    const [text, setText] = useState('');
    const [peersid, setPeersid] = useState();

    const navigate = useNavigate();


  useEffect(()=>{
    const handleVisibilityChange = () => {
      socket.on("peer-changed-tab",()=>{
        console.log("got")
        Notify(peerEmailId+" has changed the Tab", "error");
      })
        if (!(document.visibilityState === "visible")) {
          // io.to(mysid).emit("get-peer-email-server", peermail)
          console.log("emitted")
        socket.emit("tab-changed-warning",{peersid:peersid});
        }
      };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    // return () => {
    //   document.removeEventListener("visibilitychange", handleVisibilityChange);
    // };
  },[])



  function MyVerticallyCenteredModal(props) {

    // const [rating , setRating] = useState(1) ;

    const [rating, setRating] = useState("");
    const [review, setReview] = useState("");

    console.log(review);
    console.log(rating);
    const handleReviewChange = (e) => {
      e.preventDefault();
      setReview(e.target.value);
    }

    const handleRatingChange = (e) => {
      e.preventDefault();
      setRating(e.target.value);
    }

    // const handleSubmit = (event) => {
    //   event.preventDefault();
    //   console.log("reached here")
    // }
    const handleClick = async () => {
      try {
        const response = await fetch('api/auth/addPointAndReview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({emailId : auth.email , point : rating , review}) 
        });
        const data = await response.json();


        if (data.success == true) {
          navigate("/")
          return Notify("Submitted Review Successfully !", "success");
        }
        else{
          return Notify("Review Submission Failed !", "warn");
        }
        
        
        // const data = await response.json();
        // console.log('Response from server:', data);
      } catch (error) {
        console.error('Error:', error);
      }
    }


    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{peerEmailId}</h4>
          <br />
          <form>
            <div className="form-group">
              <label htmlFor="exampleFormControlSelect1">Rating ?</label>
              <select name="rating" className="form-control" value={rating} onChange={handleRatingChange} id="exampleFormControlSelect1">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>
            <br />

            <div className="form-group">
              <label htmlFor="review">Reviews ?</label>
              <textarea value={review} onChange={handleReviewChange} name="review" className="form-control" id="review" rows="3"></textarea>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClick}>Submit</Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }




    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room`);
        setpeerEmailId(email)
        setCaller(1);
        setcallButt(1);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        setcallButt(0);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            setstreamButt(1);
            console.log(`Incoming Call`, from, offer);
            const ans = await peer.getAnswer(offer);
            setPeersid(from);
            socket.emit("get-peer-email", { myemail: auth.email, peersid: from });
            socket.on("get-peer-email-server", (peereid) => {
                setpeerEmailId(peereid);
            })
            socket.emit("call:accepted", { to: from, ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        setstreamButt(0);
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
    }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      setPeersid(from);
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
            const ans = await peer.getAnswer(offer);
            socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

    useEffect(()=>{
        socket.on('editor:text',(text) =>{
            
            setText(text);
        })
    },[socket])
    
    const handleChange = (e) => {
        const { value } = e.target;
        socket.emit("editor:change", { text: value, to: peersid });
        setText(value);
        console.log(value)
    }

  return (
    <div>
      <h4>{remoteSocketId ? <h6>Connected</h6> : "No one in room"}</h4>
      {(caller===0 && streamButt===1) && <button className="btn btn-primary" onClick={sendStreams}>Send Stream</button>}
      {(callButt===1 && caller===1 && remoteSocketId) && <button className="btn btn-primary" onClick={handleCallUser}>CALL</button>}

            <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', backgroundColor: '#121212' }}>
                    {remoteStream && (
                        <div style={{ flex: 1, margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#262626' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '5px', textAlign: 'center', color: '#fff' }}></h3>
                            <ReactPlayer
                                playing
                                muted
                                height="400px"
                                width="455px"
                                url={remoteStream}
                                style={{ borderRadius: '10px' }}
                            />
                        </div>
                    )}
                    {myStream && (
                        <div style={{ flex: 0.5, margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#262626' }}>
                            <h3 style={{ fontSize: '14px', marginBottom: '5px', textAlign: 'center', color: '#fff' }}>You</h3>
                            <ReactPlayer
                                playing
                                muted={true} // Assuming you want your own stream muted by default
                                height="200px"
                                width="150px"
                                url={myStream}
                                style={{ borderRadius: '10px' }}
                            />
                        </div>
                    )}
                    {myStream && (
                        <div style={{ flex: 0.5, margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'rgb(242 242 242)' }}>
                            <h3 style={{ fontSize: '14px', marginBottom: '5px', textAlign: 'center', color: 'black' }}>Editor</h3>

                            <div style={{ height: 497, borderRadius: '10px' }}>
                                <textarea name="postContent" rows={16} cols={40} onChange={handleChange} value={text} />

                            </div>
                        </div>
                    )}
                </div>
                <div className="EndCall" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', marginTop: '-105px' }}>
                    <MdCallEnd onClick={() => setModalShow(true)} style={{ color: 'white', backgroundColor: 'red', fontSize: '2rem', border: 'solid black 2px', borderRadius: '20px', width: '90px', height: '40px' }} />
                    <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)} />
                </div>

            </div>
      </div>



    );
};

export default RoomPage;
