import { useEffect, useState } from "react";
import "./signup.scss";
import Logo from "../../assets/images/logo.svg";
import Return from "../../assets/images/return.svg";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate=useNavigate()
  return (
    <div className="sign-up">
 <div className="container ">
<div className="row ">

<div className="col-md-6 col-xs-12 left-side">
  
  <img src={Logo} alt="logo" />
</div>
<div className="col-lg-6 col-md-6 col-xs-12 box-signup text-start">
<div onClick={()=>navigate(-1)}><img src={Return} alt="return icon" className="mb-5"  />
</div>  
  {children}</div>
</div>
    </div>
    </div>
   
    
  );
};
export default Layout;
