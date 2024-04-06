import React from 'react'

const Card = ({point , review , no , date}) => {


    return (
        <>


            <div className="card my-3 mx-3 col-md-3" style={{ width: "18rem"  }}>
                {/* <Update ref = {modalref} /> */}
                <div className="card-body" style={{backgroundColor : "white"}}>
                    {/* <h6 className="card-title">{note._id}</h6> */}
                    {/* isi id ko delete and update karna hai  */}
                    <h5 className="card-title" style={{textDecoration : "underline"}}>Meeting : {no}</h5>
                    {/* <h6 className="card-subtitle mb-2 text-muted">@</h6> */}
                    <p className="card-text">Rating : {point}/5 </p>
                    <p className="card-text">Review : {review} </p>
                    
                </div>
            </div>
        </>
    )
}

export default Card
