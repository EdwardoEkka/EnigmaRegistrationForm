import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome=()=>{
    const navigate=useNavigate();
    return(
        <div>
            <div style={{marginTop:"50px",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
                <h1>Welcome to Lift-Off C++ Registrations</h1>
                <h1 onClick={()=>{navigate('/form')}}>Proceed To Registrations</h1>
            </div>
        </div>
    )
}

export default Welcome;