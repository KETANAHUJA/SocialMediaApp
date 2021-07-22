import React, { useContext } from "react";
import { Link,useHistory } from "react-router-dom";
import { UserContext } from "../App";
const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/create">Create Post</Link>
        </li>,
         <li>
         <Link to="/myfollowingpost">My Following Posts</Link>
         </li>,
        <li>
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-1"
            type="submit"
            onClick={() => {
              localStorage.clear();
              dispatch({type:"CLEAR"})
              history.push("/signin");


            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">Signin</Link>
        </li>,
        <li>
          <Link to="/signup">SignUp</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div class="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} class="brand-logo">
          Instagram
        </Link>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
