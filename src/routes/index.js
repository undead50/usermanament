import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '../containers/adminlayout';
import Dashboard from '../pages/Dashboard';
import CreateReport from '../pages/Report';
import Login from '../pages/Auth';

import UserApprovalForm from '../pages/UserApproval/UserApproval';
import BranchTable from '../pages/Branch';
import EmployeeTable from '../pages/Employee';
import ApplicationTable from '../pages/Application';
import RequestTable from '../pages/Request';
import RoleTable from '../pages/Role';
import ServiceTable from '../pages/Service';
import UserapprovalmasterTable from '../pages/UserApproval/index';
import ProtectedRoute from '../components/ProtectedRoute';
import Notfound from '../pages/System/404';
import UserApprovalApprovedTable from '../pages/UserApproval/UserApprovalApproved';
import UserApprovalChainTable from '../pages/UserApproval/UserApprovalChain';

function MyRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/not-found" element={<Notfound />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/create-approval" element={<UserApprovalForm />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-report" element={<CreateReport />} />
          <Route path="/approval-index" element={<UserapprovalmasterTable />} />
          {/* <Route path="/initiate-swift" element={<SwiftMessage />} />
          <Route path="/camera" element={<CameraComponent/>}/> */}
          <Route path="/branch" element={<BranchTable />} />
          <Route path="/employee" element={<EmployeeTable />} />
          <Route path="/application" element={<ApplicationTable />} />
          <Route path="/request" element={<RequestTable />} />
          <Route path="/role" element={<RoleTable />} />
          <Route path="/service" element={<ServiceTable />} />
          <Route path="/request-chain" element={<UserApprovalChainTable/>}/>
          <Route
            path="/user-approval-approved"
            element={<UserApprovalApprovedTable />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default MyRoutes;
