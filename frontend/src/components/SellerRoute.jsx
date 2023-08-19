import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function SellerRoute() {
  const { userInfo } = useSelector((state) => state.signin);
  return (
    <>
      {userInfo.name && userInfo.isSeller ? (
        <Outlet />
      ) : (
        <Navigate to="/signin" />
      )}
    </>
  );
}
