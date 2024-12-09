import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import AttachmentButton from "./attachmentButton";
import ShowPicture from "./showPicture";

let expenseInitialValue = {
  tittle: "",
  amount: "",
  category: "",
};

function Fixed({}) {
  const [expenseData, setExpenseData] = useState(expenseInitialValue);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null); //monitors the expense in edit mode by keeping track of the ID
  const [editingExpenseData, setEditingExpenseData] = useState(expenseInitialValue); // holds the data of the expense being edited {title:, amount: etc}
  const [categoryTotal, setCategoryTotal] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const category = location.pathname.replace("/", ""); // Extract category from URL
 

  useEffect(() => {
    getExpenses();
    calculateCategoryTotal();
    setExpenseData((prev) => ({ ...prev, category })); // Resets expense data category when the category changes, ensures the category is always up to date
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value > 999999) {
      return;
    }
    setExpenseData({
      ...expenseData,
      [name]: value,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value > 999999) {
      return;
    }
    setEditingExpenseData({
      ...editingExpenseData,
      [name]: value,
    });
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && expenseData.tittle && expenseData.amount) {
      createNewExpense();
    }
  };

  async function createNewExpense() {
    try {
      const res = await axios.post(
        "https://cashoverflow.onrender.com/expenses/addNewExpense",
        expenseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExpenseData((prev) => ({ ...prev, tittle: "", amount: "" }));
      console.log(res.data);
      getExpenses();
      calculateCategoryTotal();
    } catch (error) {
      console.log(error);
    }
  }

  async function getExpenses() { //removed z as parameter
    try {
      const res = await axios.get(
        `https://cashoverflow.onrender.com/expenses/allExpenses/${category}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCategoryExpenses(res.data);
      //   const total = res.data.reduce((sum, item) => sum + item.amount, 0);
      // console.log(res.data);
      //   calculateCategoryTotal(); // Update the total after fetching expenses (I think not needed)
    } catch (error) {
      console.log(error);
    }
  }

  async function updateExpense(expenseId) {
    //this is x
    try {
      const res = await axios.put(
        `https://cashoverflow.onrender.com/expenses/updateExpense/${expenseId}`,
        editingExpenseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingExpenseId(null);
      console.log(res.data);
      setEditingExpenseData(expenseInitialValue);
      getExpenses();
      calculateCategoryTotal(); 
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteExpense(expenseId) {
    try {
      let res = await axios.delete(
        `https://cashoverflow.onrender.com/expenses/deleteExpense/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      getExpenses();
      calculateCategoryTotal(); 
    } catch (error) {
      console.log(error);
    }
  }

  //   async function deleteAllExpense() {
  //     try {
  //       let res = await axios.delete(
  //         `https://cashoverflow.onrender.com/expenses/deleteAllExpenses`
  //       );

  //       console.log(res.data);
  //       getExpenses();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  async function calculateCategoryTotal() {
    try {
      let res = await axios.get(
        `https://cashoverflow.onrender.com/expenses/allExpenses/${category}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let total = res.data.reduce((sum, item) => sum + Number(item.amount), 0);
      setCategoryTotal(total); // Update the state variable with the total amount
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  // Request a new JWT using the refresh token
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await axios.post('https://your-backend.com/auth/refresh-token', { refresh_token: refreshToken });

    // Store the new access token in localStorage or HTTP-only cookie
    localStorage.setItem('token', response.data.access_token);
    console.log('New access token:', response.data.access_token);
  } catch (error) {
    console.error('Error refreshing token:', error);
    navigate("/login"); 
  }
}

return (
  <div className="min-h-screen bg-[#F9FAFB] p-5">
    {/* Header */}
    <div className="flex items-center justify-between border-b-2 pb-3 mb-5">
      <button
        className="flex items-center text-gray-700 hover:text-gray-900 transition duration-300"
        onClick={() => navigate("/")}
      >
        <img
          src="/assets/reply-gold.svg"
          alt="Back"
          className="w-6 h-6 mr-2"
        />
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-800">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>
    </div>

    {/* Add Expense Section */}
    <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
      <input
        onChange={handleChange}
        onKeyDown={handleEnter}
        placeholder="Title"
        name="tittle"
        value={expenseData.tittle}
        className="px-3 py-2 w-40 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-500"
        maxLength="10"
      />
      <input
        onChange={handleChange}
        onKeyDown={handleEnter}
        placeholder="Amount"
        type="number"
        name="amount"
        value={expenseData.amount}
        className="px-3 py-2 w-40 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-500"
        max="99999"
      />
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
        onClick={createNewExpense}
      >
        Add Expense
      </button>
    </div>

    {/* Expense List */}
    {categoryExpenses.map((x, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg mb-3"
      >
        {editingExpenseId === x._id ? (
          <>
            <input
              onChange={handleEditChange}
              placeholder="Title"
              name="tittle"
              value={editingExpenseData.tittle}
              className="flex-1 px-2 py-1 border border-gray-300 rounded-lg"
            />
            <input
              onChange={handleEditChange}
              placeholder="Amount"
              type="number"
              name="amount"
              value={editingExpenseData.amount}
              className="flex-1 px-2 py-1 border border-gray-300 rounded-lg"
            />
            <button
              className="text-white bg-green-600 px-3 py-1 rounded-lg hover:bg-green-700 transition duration-300"
              onClick={() => updateExpense(x._id)}
            >
              Save
            </button>
            <button
              className="text-white bg-gray-600 px-3 py-1 rounded-lg hover:bg-gray-700 transition duration-300"
              onClick={() => setEditingExpenseId(null)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="flex-1 text-gray-800">{x.tittle}</div>
            <div className="flex-1 text-gray-600">{x.amount}</div>
            <div className="flex items-center space-x-2">
              
              <ShowPicture /> 
              <AttachmentButton />
            
              <button
                className="text-white bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => {
                  setEditingExpenseId(x._id);
                  setEditingExpenseData({
                    tittle: x.tittle,
                    amount: x.amount,
                    category,
                  });
                }}
              >
                Edit
              </button>
              <button
                className="text-white bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300"
                onClick={() => deleteExpense(x._id)}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    ))}

    {/* Total */}
    <div className="mt-10 text-center">
      <h2 className="text-xl font-bold text-gray-800">
        Total: <span className="text-indigo-600">{categoryTotal}</span>
      </h2>
    </div>
  </div>
);
}

export default Fixed;