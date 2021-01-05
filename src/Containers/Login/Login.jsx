import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './Login.scss';
import { Input } from 'antd';
import { connect } from 'react-redux';
import { LOGIN } from '../../Redux/types';


const Login = ({ dispatch }) => {
    const history = useHistory();
    const clickLogin = async (event) => {
        event.preventDefault();
        try {
            
            const body = {
                email: event.target.email.value,
                password: event.target.password.value
            }
            let res = await axios.post('https://wisdomshare.herokuapp.com/user/login', body);
            dispatch({ type: LOGIN, payload: res.data })
            history.push('/homepage')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="mainlogin">
            <div></div>
        <div className="loginBox">
             <div className="titleLogin"><h2>Welcome to WisdomShare</h2>
            <div><h3> For the sake of learn</h3></div>
             <div><h3> For the sake of care</h3></div>
             ¡Share your wisdom!</div>
            <form className="registerForm" onSubmit={clickLogin}>
                <Input className="inputLogin" type="email" name="email" placeholder="Correo electrónico"/>
                <Input className="inputLogin" type="password" name="password" placeholder="Contraseña"/>

                <button className="buttonLogin" type="submit"><h3>Let's start!</h3></button>
            </form>
        </div>
        <div></div>
        </div>

    )
}


export default connect()(Login);