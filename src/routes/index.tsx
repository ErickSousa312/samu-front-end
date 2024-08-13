
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from '../pages/login';
import DashboardPage from '../pages/dashboard';
import Orders from '../pages/orders';



const Routers = () => {
  return (
 
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<Orders />} />
          {/* <PrivateRoute path="/driver" roles={['admin', 'driver']} element={<DriverDashboard />} />
          <PrivateRoute path="/orders" roles={['admin', 'driver', 'user']} element={<UserOrders />} /> */}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

  );
};

export default Routers;
