import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute() {
  const { userInfo } = useSelector((state) => state.signin);
  return <>{userInfo.name ? <Outlet /> : <Navigate to="/signin" />}</>;
}
