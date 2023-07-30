import { useEffect, useState } from 'react';
import CheckoutSteps from '../components/CheckoutSteps';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../redux/paymentMethodSlice';

export default function PaymentMethodScreen() {
  const { shippingAddress } = useSelector((state) => state.shippingAddress); // useSelector debe de tener un nivel mas de profundidad por el persistor state.state (ver redux devtools).
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));

    navigate('/placeorder');
  };

  return (
    <>
      <div>
        <CheckoutSteps step1 step2 step3 />
      </div>
      <form onSubmit={submitHandler} className="form">
        <div>
          <h1>Payment Method</h1>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="paypal"
              value="PayPal"
              name="paymentMethod"
              required
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="paypal">Paypal</label>
          </div>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="stripe"
              value="Stripe"
              name="paymentMethod"
              required
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="stripe">Stripe</label>
          </div>
        </div>
        <div>
          <button className="primary" type="submit">
            Continue
          </button>
        </div>
      </form>
    </>
  );
}
