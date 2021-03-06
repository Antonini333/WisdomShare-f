import React from 'react';
import axios from 'axios';
import { useHistory} from 'react-router-dom';
import './UpdateProfile.scss'
import { connect } from 'react-redux';
import { UPDATE } from '../../Redux/types';
import { Input } from 'antd';


const UpdateProfile = ({ dispatch, user }) => {
    const history = useHistory();

    const clickUpdate = async (event) => {
        event.preventDefault();
        try {
            const options = { headers: { Authorization: `Bearer ${user.token}` } };
            const body = {
                name: event.target.name.value,
                surname: event.target.surname.value,
                age: event.target.age.value,
                address: event.target.address.value,
                bio: event.target.bio.value,
                photo: event.target.photo.value,
            }
           await axios.put('https://wisdomshare.herokuapp.com/user/update', body, options);
           let res = await axios.get('https://wisdomshare.herokuapp.com/user', options);
            dispatch({ type: UPDATE, payload: res.data })
            
           history.push('/homepage')
        } catch (error) {
            console.log(error);
        }
    }

    const clickDelete = async (event) => {
        
        try{
            const options = { headers: { Authorization: `Bearer ${user.token}` } };
            axios.delete('https://wisdomshare.herokuapp.com/user/delete', options)
            history.push('/')
        }catch (error){
         console.log(error);
        }
    }

    return (
        <div className="mainupdate">
            <div></div>
        <div className="updateBox">
             <div className="updateRegister"><h2>Welcome to your profile</h2> <em>"There is nothing permanent except change"</em></div>
            <form className="updateForm" onSubmit={clickUpdate} >
                <Input className="updateinputText" type="name" name="name" defaultValue={user.name}/>
                <Input className="updateinputText" type="surname" name="surname" defaultValue={user.surname}/>
                <Input className="updateinputText" type="age" name="age" defaultValue={user.age}/>
                <Input className="updateinputText" type="address" name="address" defaultValue={user.address}/>
                <Input className="updateinputText" type="bio" name="bio" defaultValue={user.bio}/>
                <Input className="updateinputText" type="photo" name="photo" defaultValue={user.photo}/>
                <button className="buttonUpdate" type="submit"><h3>Update your profile</h3></button>
                <button className="buttonUpdate" onClick={(event) => { clickDelete() }}><h3>Delete Account</h3></button>
            </form>
        </div>
        <div></div>
        </div>

    )
}

const mapStateToProps = state => {

    return {
        user: state.user
    }
}


export default connect(mapStateToProps)(UpdateProfile);
