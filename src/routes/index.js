import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '../containers/adminlayout';
import Dashboard from '../pages/Dashboard';
import CreateReport from '../pages/Report';
import Login from '../pages/Auth';
import SwiftMessage from '../pages/Swift';
import CameraComponent from '../pages/Test/Camera';
import UserApprovalForm from '../pages/UserApproval/UserApproval';
import BranchTable from '../pages/Branch';

function MyRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route path='/' element={<UserApprovalForm/>}/>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/create-report" element={<CreateReport />} />
          {/* <Route path="/initiate-swift" element={<SwiftMessage />} />
          <Route path="/camera" element={<CameraComponent/>}/> */}
          <Route path="/branch" element={<BranchTable/>}/>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default MyRoutes;
