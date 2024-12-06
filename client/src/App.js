  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import Homepage from "./components/homepage";
  import ProtectedRoute from "./hooks/ProtectedRoute";
  import Fixed from "./components/fixed";
  import Login from "./components/pages/login";
  import Register from "./components/pages/register";
  import UploadBill from "./components/uploadBill";

  function App() {
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/core"
              element={
                <ProtectedRoute>
                  <Fixed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flow"
              element={
                <ProtectedRoute>
                  <Fixed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/overflow"
              element={
                <ProtectedRoute>
                  <Fixed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/income"
              element={
                <ProtectedRoute>
                  <Fixed />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/upload" 
              element={
              <ProtectedRoute>
                <UploadBill />
              </ProtectedRoute>
                } 
            />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }

  export default App;
