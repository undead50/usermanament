import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, FlushUserData } from '../../store';


export default function ProtectedRoute({ children }) {

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  console.log(userInfo)
   // Handle logout logic here
  //  dispatch(
  //   setUser({
  //     userName: null,
  //     solId: null,
  //     email: null,
  //     departmentName: null,
  //     token: null,
  //   })
  // );
  // dispatch(FlushUserData());
   
  // if(userInfo.userName === null || userInfo.userName == ""){
   
  //   return  <Navigate to={'/'} replace />
  // }
  return <>{children}</>;
}