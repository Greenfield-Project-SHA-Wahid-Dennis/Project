import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShowPicture from "./showPicture";


const API_URL =
process.env.NODE_ENV === "development"
  ? process.env.REACT_APP_API_URL_LOCAL //for npm start coming for react tool
  : process.env.REACT_APP_API_URL_PROD; // for build
console.log("Using API URL:", API_URL);

function UploadBill() {
  const [file, setFile] = useState({});
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const [uploadedFileUrl, setUploadedFileUrl] = useState(); // State use for taking data from backend and rendering it when needed

  const navigate = useNavigate();

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
  
      if (selectedFile.size > 10 * 1024 * 1024) {
        setMessage("Error: File size exceeds the 10MB limit.");
        setFile(null); 
        e.target.value = ""; 
        
      } else {
        setFile(selectedFile); // Set file state
        console.log(file);
        setMessage(""); // Clear error message
      }
    }

  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("uploadBill", file);

    try {
      setIsUploading(true); // Set loading state
      const response = await axios.post(
        `${API_URL}/users/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message || "File uploaded successfully!");
      console.log(response.data);
      console.log(response.data.file);
      // const image = response.data.file;
      console.log(response.data.file.path);

      const imageUrl = response.data.file.path;
      console.log(imageUrl);
      setUploadedFileUrl(imageUrl);
      console.log(uploadedFileUrl)

      // setTimeout(() => navigate(-1), 2000);
      // navigate(`/file/${response.data.file.path}`);
      
    } catch (error) {
      // Provide detailed error message if available
      const errorMessage =
        error.response?.data?.message ||
        "Error uploading file. Please try again.";
      setMessage(errorMessage);
      console.error(error);
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[white]">
      <div className="flex flex-col items-center p-6 bg-[#212830] rounded-md shadow-md w-80">
        <h2 className="text-lg font-semibold text-[#8884d8] mb-4 text-center">
          Upload a Copy of Your Bill
        </h2>
        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col items-center space-y-4"
        >
          <input
            type="file"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-300 
                       file:mr-4 file:py-2 file:px-4 
                       file:rounded-md file:border-0 
                       file:text-sm file:font-semibold 
                       file:bg-[#151B23] file:text-[#8884d8] 
                       hover:file:bg-[#212830]"
          />
          <button
            type="submit"
            disabled={!file || isUploading}
            className={`w-full py-2 px-4 text-white font-semibold rounded-md transition duration-200
              ${
                isUploading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#151B23] hover:bg-[#8884d8]"
              }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-green-400 font-medium">{message}</p>
        )}
        {<ShowPicture filepath={uploadedFileUrl} />}
      </div>
    </div>
  );
}

export default UploadBill;
