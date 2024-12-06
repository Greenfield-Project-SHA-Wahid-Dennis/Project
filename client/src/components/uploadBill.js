import React, { useState } from 'react';
import axios from 'axios';

function UploadBill() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false); // Track upload status

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
     
      // Check if the file size exceeds 10MB
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage('Error: File size exceeds the 10MB limit.');
        setFile(null); // Reset file state
        e.target.value = ''; // Reset input field
      } else {
        setFile(selectedFile); // Set file state
        setMessage(''); // Clear error message
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      setIsUploading(true); // Set loading state
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message || 'File uploaded successfully!');
      console.log(response.data.file); // Log the uploaded file details
    } catch (error) {
      // Provide detailed error message if available
      const errorMessage =
        error.response?.data?.message || 'Error uploading file. Please try again.';
      setMessage(errorMessage);
      console.error(error);
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Upload a Copy of Your Bill</h2>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} />
        <button type="submit" disabled={!file || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadBill;
