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
    formData.append('uploadBill', file);

    try {
      setIsUploading(true); // Set loading state
      const response = await axios.post('http://localhost:8080/users/upload', formData, {
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
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload a Copy of Your Bill</h2>
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm flex flex-col items-center space-y-4"
      >
        <input
          type="file"
          onChange={onFileChange}
          className="block w-full text-sm text-gray-600 
                     file:mr-4 file:py-2 file:px-4 
                     file:rounded-md file:border-0 
                     file:text-sm file:font-semibold 
                     file:bg-blue-50 file:text-blue-700 
                     hover:file:bg-blue-100"
        />
        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-2 px-4 text-white font-semibold rounded-md 
            ${
              isUploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition duration-200`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-sm text-green-600 font-medium">{message}</p>
      )}
    </div>
  );
}

export default UploadBill;
