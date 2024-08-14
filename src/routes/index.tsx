
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { DashboardPage, DriversPage, LabelsPage, LoginPage, LogisticPage, Orders, RegisterClientPage, RegisterDriverPage } from '../pages';



const Routers = () => {
  return (
 
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="orders" element={<Orders />} />
          <Route path="logistic" element={<LogisticPage />} />
          <Route path='drivers' element={<DriversPage />} />
          <Route path='labels' element={ <LabelsPage />} />
          <Route path='registerdriver' element={<RegisterDriverPage />} />
          <Route path='registerclient' element={<RegisterClientPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>

  );
};

export default Routers;
