import { useEffect, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import MessageBox from '../components/MessageBox';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../redux/shippingAddressSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ShippingAddressScreen() {
  const { userInfo } = useSelector((state) => state.signin);
  const { shippingAddress } = useSelector((state) => state.shippingAddress);
  //const { address: addressMap } = useSelector((state) => state.map);

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [lat, setLat] = useState(shippingAddress.lat || '');
  const [lng, setLng] = useState(shippingAddress.lng || '');
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

    const newLat = addressMap ? addressMap.lat : lat;
    const newLng = addressMap ? addressMap.lng : lng;

    if (addressMap) {
      setLat(newLat);
      setLng(newLng);
    } else {
      if (!lat || !lng) {
        setAlert({
          msg: 'Please select your address on map',
          error: true,
        });
        setTimeout(() => {
          setAlert({});
        }, 3000);
        return;
      }
    }

    let moveOn = true;
    if (!newLat || !newLng) {
      moveOn = Swal.fire({
        title: 'Are you sure?',
        text: 'You have not selected your address on map',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, I want to continue',
        cancelButtonText: 'No, I want to select my address on map',
      }).then((result) => {
        if (result.isConfirmed) {
          return true;
        } else {
          return false;
        }
      });

      if (moveOn) {
        navigate('/payment');
      }
    }

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
      saveShippingAddress({
        fullName,
        address,
        city,
        postalCode,
        country,
        lat: newLat,
        lng: newLng,
      })
    );
    navigate('/payment');
  };

  const chooseOnMap = () => {
    dispatch(
      saveShippingAddress({
        fullName,
        address,
        city,
        postalCode,
        country,
        lat,
        lng,
      })
    );
    navigate('/map');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 />
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
          <label htmlFor="chooseOnMap">Location</label>
          <button type="button" onClick={chooseOnMap}>
            Choose On Map
          </button>
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
