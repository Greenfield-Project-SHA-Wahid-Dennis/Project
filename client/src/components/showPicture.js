import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Import FontAwesomeIcon component
import { faFile } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';


function ShowPicture({filepath}) {

  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate(`/file/${filepath}`);
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-[#8884d8] mb-2">Uploaded Image</h3>

      <button
       onClick= {handleNavigate}
       >
        <FontAwesomeIcon icon={faFile} />
      </button>

      <img
        src={`http://localhost:8080/users/upload/${filepath}`}
        className="rounded-md shadow-md"
      />
    
    </div>
  );
}

export default ShowPicture;


