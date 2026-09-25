import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import CreateOrder from "./pages/CreateOrder";
import OrderDetails from "./pages/OrderDetails";

function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/create-order"
          element={<CreateOrder />}
        />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;