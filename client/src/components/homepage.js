import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Use named import
import axios from "axios";
import EmojiPicker from "emoji-picker-react"; // Import emoji picker
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";


function Homepage() {
  const [firstName, setFirstName] = useState(""); 
  const [icon, setIcon] = useState("😊"); // Default emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("😊"); // Store the selected emoji

  const [incomeTotal, setIncomeTotal] = useState(0);
  const [coreTotal, setCoreTotal] = useState(0);
  const [flowTotal, setFlowTotal] = useState(0);
  const [overflowTotal, setOverflowTotal] = useState(0);


  const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_LOCAL //for npm start coming for react tool
    : process.env.REACT_APP_API_URL_PROD; // for build
console.log("Using API URL:", API_URL);

  useEffect(() => {
    // Decode token to retrieve the first name
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setFirstName(decoded.firstName); // Set the first name from the token
        setIcon(decoded.icon || "😊"); // Use default emoji if none is set
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }

    fetchCategoryTotals();
  }, []);

  const handleEmojiClick = (emojiData) => {
    setSelectedEmoji(emojiData.emoji); // Update selected emoji
    setIcon(emojiData.emoji); // Update icon state for immediate UI feedback
    setShowEmojiPicker(false); // Close emoji picker
    saveIconToBackend(emojiData.emoji); // Save to backend
  };

  const saveIconToBackend = async (emoji) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      console.log("Icon being sent to backend:", emoji);
      await axios.put(
        `${API_URL}/users/updateUser/${decoded.id}`,
        {icon: emoji},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the token in localStorage with the new icon value
    const updatedToken = { ...decoded, icon: emoji };
    
    localStorage.setItem("token", JSON.stringify(updatedToken))
      alert("Icon updated successfully!");
    } catch (error) {
      console.error("Failed to update icon:", error);
      alert("Failed to update icon. Please try again.");
    }
  };


  //logic for % chart with bars + Pie
  //
  // const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff7f50"];
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#D2649A"]; // Colors for pie chart sections
  const total = incomeTotal + coreTotal + flowTotal + overflowTotal;
  const saved = Math.max(
    0,
    incomeTotal - (coreTotal + flowTotal + overflowTotal)
  ); // Ensure saved is not negative

  //value is used in Pie chart
  const chartData = [
    {
      name: "Income",
      value: incomeTotal,
      CategoryTotal: total > 0 ? (incomeTotal / total) * 100 : 0,
    },
    {
      name: "Core",
      value: coreTotal,
      CategoryTotal: total > 0 ? (coreTotal / total) * 100 : 0,
    },
    {
      name: "Flow",
      value: flowTotal,
      CategoryTotal: total > 0 ? (flowTotal / total) * 100 : 0,
    },
    {
      name: "Overflow",
      value: overflowTotal,
      CategoryTotal: total > 0 ? (overflowTotal / total) * 100 : 0,
    },
    {
      name: "Saved",
      value: saved,
      CategoryTotal: total > 0 ? (saved / total) * 100 : 0,
    },
  ];

  //logic for % chart with bars + Pie
  //pie


  async function fetchCategoryTotals() {
    try {
      const coreRes = await axios.get(
        `${API_URL}/expenses/allExpenses/core`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const flowRes = await axios.get(
        `${API_URL}/expenses/allExpenses/flow`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const overflowRes = await axios.get(
        `${API_URL}/expenses/allExpenses/overflow`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const incomeRes = await axios.get(
        `${API_URL}/expenses/allExpenses/income`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const coreTotal = coreRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      const flowTotal = flowRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      const overflowTotal = overflowRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      const incomeTotal = incomeRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      setCoreTotal(coreTotal);
      setFlowTotal(flowTotal);
      setOverflowTotal(overflowTotal);

      setIncomeTotal(incomeTotal);
    } catch (error) {
      console.log(error);
    }
  }

  //   const handleIncomeChange = (e) => {
  //     setIncome(e.target.value);
  //   };

  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  //   const updateCategoryTotal = (category, total) => {
  //     setTotals((prev) => ({ ...prev, [category]: total }));
  //   };
  
  return (
    <div className="h-screen min-h-screen w-screen max-w-screen  bg-white">
      {/* bg-[#151B23] */}
      <header className="h-[15%] flex justify-between ">
        <div className="h-[100%] overflow-hidden pt-2">
          <video
            className="w-[300px] h-[110px] object-cover object-center"
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
        <div className="flex  gap-3 font-bold  mr-5">
          <div>
          <h3 className="text-[#151B23] lg:text-2xl lg:mt-1 font-extrabold">{firstName}</h3>
          </div>
         
          <div
            className="lg:text-2xl lg:mt-1 cursor-pointer mr-5 hover:scale-105"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            {icon}
          </div>
          {/* emoji dropdown */}
          {showEmojiPicker && (
            <div className="absolute top-16 right-20 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
         
          {/* <div>
          <h3 className="text-[#151B23]">Setting</h3>
          </div> */}
        <h1
          onClick={handleLogOut}
          className=" justify-end lg:mt-2 text-[#151B23] hover:scale-105 cursor-pointer"
        >
          Logout
        </h1>
        </div>
      </header>
      
      
      <div className="h-[70%] w-[80%] mx-auto bg-[#212830] rounded-lg pt-8 "
      >
        <main className=" w-[100%] h-[25%] text-[#D1D7E0]  flex justify-around   mx-auto    ">
          <div
            className=" w-[17%] grid justify-center items-center content-center rounded-xl bg-[#151B23] hover:text-white  hover:scale-110 cursor-pointer"
            onClick={() => handleRedirect("/income")}
            style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
          >
            <h2 className="text-lg sm:text-xl lg:text-3xl mx-auto mb-2">Income </h2>
            <h3 className="lg:text-3xl mx-auto ">{incomeTotal} </h3>
          </div>

          <div
            onClick={() => handleRedirect("/core")}
            className=" w-[17%] grid justify-center items-center content-center rounded-lg bg-[#151B23] hover:text-white  hover:scale-110 cursor-pointer"
            style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
          >
            <h2 className="text-lg sm:text-xl lg:text-3xl mx-auto mb-2">Core</h2>
            <h3 className="lg:text-3xl mx-auto ">{coreTotal}</h3>
          </div>

          <div
            onClick={() => handleRedirect("/flow")}
            className=" w-[17%]  grid justify-center items-center content-center rounded-lg bg-[#151B23] hover:text-white  hover:scale-110 cursor-pointer"
            style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
          >
            <h2 className="text-lg sm:text-xl lg:text-3xl mx-auto mb-2">Flow</h2>
            <h3 className="lg:text-3xl mx-auto ">{flowTotal}</h3>
          </div>

          {/* #974E4E // max-w-[350px] sm:max-w-[500px]*/}
          <div
            onClick={() => handleRedirect("/overflow")}
            className=" w-[17%]  grid justify-center items-center content-center rounded-lg bg-[#151B23] hover:text-white  hover:scale-110 cursor-pointer"
            style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
          >
            <h2 className="text-lg sm:text-xl lg:text-3xl mx-auto mb-2">Overflow</h2>
            <h3 className="lg:text-3xl mx-auto ">{overflowTotal}</h3>
          </div>
        </main>

        <div className="">
          <div className=" w-[80%] mx-auto flex justify-around mt-10">
            <BarChart width={400} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="1 1" stroke="" />
              <XAxis dataKey="name" tick={false} />
              <YAxis tick={false} />
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
              {/* {chartData.map((entry, index) => (
                <Bar
                  key={entry.name}
                  dataKey={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  barSize={10}
                  activeBar={{ stroke: 'black', strokeWidth: 2 }}
                  
                />
              ))} */}
              <Bar
                dataKey="CategoryTotal" // Assuming 'value' is the field representing the bar values
                barSize={35} // Adjust this value to control the bar width
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>

            <PieChart className="" width={400} height={300}>
              <Pie
                data={chartData}
                dataKey="CategoryTotal" // what you visualize
                cx="50%" // 0% -> center of the circle on left border, 100% -> right
                cy="50%" // 0% -> center of the circle on top border, 100% ->  bottom
                outerRadius={110} // Chart size (pixel I suppose)
                // label={({ name }) => name}
              >
                {/* Dynamic colors from COLORS array */}
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
            </PieChart>
          </div>
          {/* Shared Legend */}
          <div className=" w-[50%] mx-auto flex justify-center gap-5 ">
            {chartData.map((entry, index) => (
              <div
                className="flex items-center text-[12px] text-xl font-bold text-white "
                key={entry.name}
              >
                <div
                  className="w-[15px] h-[15px] mr-1 mt-[-2px] "
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                ></div>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="w-[100%] h-[15%]">
        <div className=" flex justify-end">
          <video
            className="w-[300px] h-[110px] object-cover object-center"
            src="/assets/give.mp4"
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

export default Homepage;
