import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

// Manage Page
function Manage() {
  // define dropdown list items
  const tableNames = ["admin", "game", "tournament", "venue", "player", "pair"];

  // add states
  const [auth, setAuth] = useState(false);

  // for navigate programmatically
  const navigate = useNavigate();

  // function - navigate to login page
  const handleLoginNavigate = () => {
    navigate("/login");
  };

  // cross-site Access-Control requests with credentials
  axios.defaults.withCredentials = true;

  // side effect
  useEffect(() => {
    // api call for authentication
    axios
      .get(`${process.env.REACT_APP_AUTHENTICATION_API_URL}`)
      .then((res) => {
        if (res.data.success === 1) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => {
        setAuth(false);
        console.log(err);
      });
  }, []);

  // render
  return (
    <React.Fragment>
      {auth ? (
        <div>
          <DropdownButton
            className="m-2"
            id="dropdown-basic-button"
            title="Database Tables"
          >
            {tableNames.map((name) => (
              <Dropdown.Item key={name} href={`/manage/${name}`}>
                {name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
          <Outlet />
        </div>
      ) : (
        <div className="vh-100 bg-grey-1">
          <div className="d-flex justify-content-center p-5 bg-grey-1">
            <div className="p-5 mb-5 rounded-3 bg-grey-2">
              <h1>You are not Logged In</h1>
              <div className="p-2 d-flex justify-content-center">
                <Button variant="success" onClick={handleLoginNavigate}>
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Manage;
