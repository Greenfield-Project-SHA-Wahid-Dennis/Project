import React from 'react';
import { useNavigate } from 'react-router-dom'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';


function AttachmentButton() {
  
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate('/upload');
    };

    return (
        <div>
          <button onClick={handleClick} style={{ background: 'transparent', border: 'none' }}>
            <FontAwesomeIcon 
              icon={faPaperclip} 
              style={{
                color: '#151B23', 
                fontSize: '40px', 
                padding: '5px', 
                margin: '5px',
                borderRadius: '50%'
              }} 
            />
          </button>
        </div>
      );
    }
    
    export default AttachmentButton;