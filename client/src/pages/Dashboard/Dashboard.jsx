import React , {useEffect} from 'react'
import { AuthState } from "../../context/AuthProvider";


const Dashboard = () => {

  const { auth } = AuthState();
  

  useEffect(() => {
    console.log(auth)
  }, [])
  
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard