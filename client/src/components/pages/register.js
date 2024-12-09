import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({});

  function handleChange(e) {
    try {
      e.preventDefault();
      let { value, name } = e.target;
      setNewUser({ ...newUser, [name]: value });
      // console.log(`Updated ${name}: ${value}`);
    } catch (error) {
      console.log(`Error updating input: ${error}`);
    }
  }


  const handleEnter = (e) => {
    if (e.key === "Enter") {
       register();
    }
  };
 


  const register = async () => {
    try {
      const { firstName, lastName, email, password, password2 } = newUser;

      if (!firstName || !lastName || !email || !password || !password2) {
        return alert("front: All fields are required");
      }
      if (password !== password2) {
        return alert("Both passwords don't match");
      }
      let response = await axios.post("https://cashoverflow.onrender.com/users/register", {
        firstName,
        lastName,
        email,
        password,
      });
      //   console.log(response);

      if (response.status === 200 || response.status === 201) {
        // console.log("Registration successful:", response.data);
        localStorage.setItem("token", response.data.token);
        alert(response.data.message);
      } else {
        console.warn("Unexpected navigating error response:", response);
      }

      navigate("/");
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200
        console.error(
          "Server responded with error:",
          error.response.data.message
        );
        alert(error.response.data.message); // Show the backend error message
      } else {
        // Other errors (e.g., network issues)
        console.error("Unexpected error from handling register:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };
  return (

    <div className="min-w-screen min-h-screen ">
      <header className="h-[15%] ">
        <div className="h-[100%]  overflow-hidden pt-2">
          <video
            className="w-[400px] h-[140px] object-cover object-center mx-auto"
            src="/assets/Cash (1).mp4"
            autoPlay
            muted
            onTimeUpdate={(e) => {
              if (e.target.currentTime >= 3) {
                e.target.pause();
              }
            }}
          />
        </div>
        </header>
      <div className=" w-[300px] sm:w-[400px] lg:w-[450px]  h-[400px] sm:h-[500px] lg:h-[550px] flex flex-col items-center justify-center gap-5 mx-auto mt-10 p-5 bg-[#2C2D32] rounded ">
      <h2 className="sm:text-2xl lg:text-3xl text-white">Register</h2>

      <input
        type="text"
        name="firstName"
        value={newUser.firstName}
        placeholder="First name"
        onChange={handleChange}

        onKeyDown={handleEnter}
        className="bg-[]  border border-[]  sm:text-xl lg:text-2xl"

      />
      <input
        type="text"
        name="lastName"
        value={newUser.lastName}
        placeholder="Last name"
        onChange={handleChange}

        onKeyDown={handleEnter}
        className="bg-[]  border border-[#1] sm:text-xl lg:text-2xl "

      />
      <input
        type="email"
        name="email"
        value={newUser.email}
        placeholder="Email"
        onChange={handleChange}

        onKeyDown={handleEnter}
        className="bg-[]  border border-[] sm:text-xl lg:text-2xl "

      />
      <input
        type="password"
        name="password"
        value={newUser.password}
        placeholder="Password"
        onChange={handleChange}

        onKeyDown={handleEnter}
        className="bg-[]  border border-[] sm:text-xl lg:text-2xl "

      />
      <input
        type="password"
        name="password2"
        value={newUser.password2}
        placeholder="Confirm password"
        onChange={handleChange}

        onKeyDown={handleEnter}
        className="bg-[]  border border-[] sm:text-xl lg:text-2xl "
      />
      <button className="w-[195px] sm:w-[245px] lg:w-[294px] bg-[white] text-[] sm:text-xl lg:text-2xl hover:scale-105" onClick={register}>Register</button>
      <p className="font-light text-xs sm:text-base lg:text-lg italic text-white">
       Already have an account?{" "}
        <button className="text-[white]  text-base sm:text-lg lg:text-xl font-bold italic hover:scale-110" onClick={() => navigate("/login")} >
          Log In
        </button>
      </p>
    </div>
    <footer className="w-[100%] h-[15%]">
        <div className="flex justify-center">
          <video
            className=" object-cover object-center"
            src="/assets/SaveSpendBig.mp4"
            autoPlay
            muted
            onTimeUpdate={(e) => {
              if (e.target.currentTime >= 3) {
                // Set to the desired time in seconds
                e.target.pause();
              }
            }}
          />
        </div>
      </footer>
    </div>
  );
}

export default Register;

