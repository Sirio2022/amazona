import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute() {
  const { userInfo } = useSelector((state) => state.signin);
  return (
    <>
      {userInfo.name && userInfo.isAdmin ? (
        <Outlet />
      ) : (
        <Navigate to="/signin" />
      )}
    </>
  );
}
