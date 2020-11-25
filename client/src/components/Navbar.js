import React, {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'

const NavBar = () => {
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    const renderList = () => {
        if(state){
            return [
                <li><Link key="profile" to="/profile">Profile</Link></li>,
                <li><Link key="create" to="/create">Create Post</Link></li>,
                <li>
                    <button className="btn waves-effect waves-light #e53935 red darken-1" name="action"
                            onClick={() => {
                                localStorage.clear()
                                dispatch({type:"CLEAR"})
                                history.push("/signin")
                            }}>Logout
                    </button>
                </li>
            ]
        } else {
            return [
                <li><Link key="signin" to="/signin">Signin</Link></li>,
                <li><Link key="signup" to="/signup">Signup</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo">Instagram</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar