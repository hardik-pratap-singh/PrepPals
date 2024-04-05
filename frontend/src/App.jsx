import { useState } from 'react'
import {createBrowserRouter,
  RouterProvider,} from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Landing from "./routes/Landing."
// import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Landing/>,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
