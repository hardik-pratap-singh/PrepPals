import React , {useEffect , useState} from 'react'
import { AuthState } from "../../context/AuthProvider";
import Card from '../Card/Card'

const Dashboard = () => {

  const { auth } = AuthState();
  const [data , setData] = useState([]) ; 
  const [points , setPoints] = useState([]) ; 
  const [reviews , setReviews] = useState([]) ; 

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/getPointsAndReviews`, {
        method : "POST" , 
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({emailId : auth.email})
      })
      console.log("response " , response)
      const datam = await response.json(); 
      const points = datam.points ; 
      const reviews = datam.reviews ;
      
      setPoints(points) ; 
      setReviews(reviews) ; 

      let data = []; 

      for(let i = 0 ; i < points.length ; i++){
        const obj = {
          sno : i+1 ,
          date  : Date.now() ,
          rating : points[i]  , 
          review : reviews[i]
        }

        data.push(obj)
      }

      setData(data) ; 
      // setData(datam) ; 
    }

    fetchDetails(); 
    console.log(points) ; 
    console.log(reviews) ;
  }, [])
  
  return (
    <div className="container">
        <br />
				<h3><center><b>Your Meetings</b></center>
					</h3><br />

				<div className="container row mx-1">
					{data.length === 0 && <h5 style={{textAlign: "center"}}>No Meetings Yet...</h5>}
				</div>

				<div className="container row row-md-2 cardclass" style={{justifyContent: "center"}}>

					{
						
						data.map((eachData) => {
							return (
								<>
                {/* <h2>{eachData.rating}</h2>
                <h2>{eachData.review}</h2> */}
                <Card no = {eachData.sno}  date = {eachData.date} point={eachData.rating} review={eachData.review}  />
								</>
							)
						})

					}

				</div>


			</div>
  )
}

export default Dashboard