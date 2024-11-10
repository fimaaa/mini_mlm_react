import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
// import { loginUser } from '../../redux/actions/userActions';
import { loginUser } from '../../redux/actions/authActions.ts';
import {ViewState} from '../../model/common/ViewState.ts';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [state, setState] = useState(null);


  const handleSubmit = async (e) => {
    console.log("TAG HANDLE SUBMIT")
    e.preventDefault();
    setState({ type: 'LOADING' });
    const result = await loginUser(form);
    console.log("TAG RESULT ", result)
    setState(result);
  };

  useEffect(() => {
    handleLoadingState(state)
  }, [state]);

  const handleLoadingState = (state) => {
    Swal.close();
    switch (state?.type) {
      case 'LOADING':
        Swal.fire({
          title: 'Loading...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        break;
      case 'SUCCESS':
        window.location.href = "/home"; 
        break;
      case 'ERROR':
        break;
      default:
        break;
    }
  };

  return (
    <div className="centered-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
          className="input-field"
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="input-field"
        />
        <button type="submit" className="submit-button">Login</button>
      </form>

      {state?.type === 'ERROR' && <p style={{ textAlign: 'center', color: 'red' }}>Error: {state.msg}</p>}
    </div>
  );
};

export default LoginPage;