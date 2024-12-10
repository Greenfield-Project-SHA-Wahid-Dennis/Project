import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon component
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function ShowPicture({ filepath }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/file/${filepath}`);
  };
  
  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_API_URL_LOCAL //for npm start coming for react tool
      : process.env.REACT_APP_API_URL_PROD; // for build
  console.log("Using API URL:", API_URL);

  return (
    <div className=" flex justify-center items-center">
      <button onClick={handleNavigate}>
        <FontAwesomeIcon icon={faFile} />
      </button>

      <h3 className="text-lg font-medium text-[#8884d8] ">
        Uploaded Image
      </h3>
      
      <img
        src={`${API_URL}/users/upload/${filepath}`}
        className="rounded-md shadow-md"
      />
    </div>
  );
}

export default ShowPicture;
