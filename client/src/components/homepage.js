import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [coreTotal, setCoreTotal] = useState(0);
  const [flowTotal, setFlowTotal] = useState(0);
  const [overflowTotal, setOverflowTotal] = useState(0);

  //logic for % chart with bars + Pie
  //

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff7f50"]; // Colors for pie chart sections
  const total = incomeTotal + coreTotal + flowTotal + overflowTotal;
  const saved = Math.max(0, incomeTotal - (coreTotal + flowTotal + overflowTotal)); // Ensure saved is not negative

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

  useEffect(() => {
    fetchCategoryTotals();
  }, []);

  async function fetchCategoryTotals() {
    try {
      const coreRes = await axios.get(
        "https://cashoverflow.onrender.com/expenses/allExpenses/core",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const flowRes = await axios.get(
        "https://cashoverflow.onrender.com/expenses/allExpenses/flow",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const overflowRes = await axios.get(
        "https://cashoverflow.onrender.com/expenses/allExpenses/overflow",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const incomeRes = await axios.get(
        "https://cashoverflow.onrender.com/expenses/allExpenses/income",
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
    <div className="h-screen min-h-screen w-screen max-w-screen  bg-[#151B23]">
      <header className="h-[20%] flex justify-between ">
        <h1 className="text-[#D1D7E0] text-3xl sm:text-4xl pl-5 pt-5 ">
          Cash Overflow
        </h1>
        <div className="h-[170px] overflow-hidden">
          <img
            className="w-[300px] h-[200px] object-cover object-center"
            src="/assets/Cash.png"
          />
        </div>
        <button
          onClick={handleLogOut}
          className=" justify-end text-md sm:text-xl lg:text-xl font-bold  text-[#D1D7E0] hover:text-white pr-5"
        >
          Logout
        </button>
      </header>

      {/* <h1 className="flex justify-center pt-5 sm:pt-0 font-bold text-[#C6B796] whitespace-nowrap ">
          <span className="text-6xl sm:text-7xl   px-1">
            Cash
            <span className="inline-block h-[45px] w-[45px] sm:w-[57px] sm:h-[57px]  mx-1 overflow-hidden rounded-full scale-110">
              <img
                src="/assets/Logo1.webp"
                alt="logo"
                className="w-full h-full object-cover object-center"
              />
            </span>
            ver
          </span>
          <span className="  transform ml-[-20px] sm:ml-[-25px] pt-12 sm:pt-16 text-xl font-bold text-[#FAEAB6] ">
            F<span className="text-white">L</span>O
            <span className="text-white">W</span>
          </span>
        </h1> */}
      <div className="h-[80%] w-[90%] mx-auto  mb-5 bg-[#212830] shadow-sm rounded-lg pt-10 ">
        <main className=" w-[100%] h-[25%] text-[#D1D7E0]  flex justify-around   mx-auto    ">
          <div
            className=" w-[20%]  flex justify-center items-center rounded-xl bg-[#151B23] hover:text-white  hover:scale-110 "
            onClick={() => handleRedirect("/income")}
          >
            <h4 className=" ">Income: </h4>
            {incomeTotal}
          </div>

          <div
            onClick={() => handleRedirect("/core")}
            className=" w-[20%] flex justify-center items-center rounded-lg bg-[#151B23] hover:text-white  hover:scale-110"
          >
            <h4 className="">Core: {coreTotal}</h4>
          </div>

          <div
            onClick={() => handleRedirect("/flow")}
            className=" w-[20%]  flex justify-center items-center rounded-lg bg-[#151B23] hover:text-white  hover:scale-110"
          >
            <h4 className=" ">Flow: {flowTotal}</h4>
          </div>

          {/* #974E4E // max-w-[350px] sm:max-w-[500px]*/}
          <div
            onClick={() => handleRedirect("/overflow")}
            className=" w-[20%]  flex justify-center items-center rounded-lg bg-[#151B23] hover:text-white  hover:scale-110"
          >
            <h4 className="">Overflow: {overflowTotal}</h4>
          </div>
        </main>

        <div className="">
          <div className=" w-[80%] mx-auto flex justify-around mt-28">
            <BarChart width={400} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="1 1" stroke="" />
              <XAxis dataKey="name" tick={true} />
              <YAxis />
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
                label={({ name }) => name}
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
              <div className="flex items-center text-[12px]" key={entry.name}>
                <div
                  className="w-[10px] h-[10px] "
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
    </div>
  );
}

export default Homepage;
