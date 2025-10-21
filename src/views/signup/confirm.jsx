import { useState } from "react";
import Input from "../../components/input";
import Layout from "./layout";
import Btn from "../../components/btn";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmIcon from "../../assets/images/confirm.svg";

const Confirm = () => {
  



  return (
    <Layout>
      
      <div className="d-flex flex-column align-items-center">
        <img src={ConfirmIcon} alt="confirm icon" className="w-50" />
        <h3 className="mb-5">Ton compte a bien été créé !</h3>
       <p className="body">Sur Kova, chaque coiffeur est vérifié afin de s’assurer de ses compétences. 
        Complète dès maintenant tes informations pour faire valider ton profil.</p>
      </div>
    </Layout>
  );
};

export default Confirm;
