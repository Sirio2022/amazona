import { useEffect, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../redux/shippingAddressSlice';
import { useNavigate } from 'react-router-dom';

export default function ShippingAddressScreen() {
  const { userInfo } = useSelector((state) => state.signin);
  const { shippingAddress } = useSelector((state) => state.shippingAddress);

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [alert, setAlert] = useState({});

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo._id) {
      navigate('/signin');
    }
  }, [userInfo, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();

    if ([fullName, address, city, postalCode, country].includes('')) {
      setAlert({
        msg: 'All fields are required',
        error: true,
      });
      setTimeout(() => {
        setAlert({});
      }, 3000);
      return;
    }

    dispatch(
      saveShippingAddress({ fullName, address, city, postalCode, country })
    );
    navigate('/payment');
  };

  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Shipping Address</h1>
        </div>
        {alert.msg && <MessageBox alert={alert}></MessageBox>}
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fulname"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="postalcode">Postal Code</label>
          <input
            type="text"
            id="postalcode"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div>
          <label />
          <button className="primary" type="submit">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
