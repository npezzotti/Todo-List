import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import logo from "../favicon.ico";
import { signout, isAuthenticated } from '../auth';

function NavBar({ history }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">
            <img src={logo} width="30" height="30" alt="Logo" />
            {" "}My Todo List
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                    <Link to="/" className="nav-link">Todos</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/create" className="nav-link">Create Todo</Link>
                </li>              
                {isAuthenticated() && (
                    <>
                        <li className="navbar-item">
                            <Link to='/settings' className="nav-link">Settings</Link>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link" style={{cursor: "pointer"}} onClick={() => signout(() => history.push('/'))}>
                                Sign out
                            </span>
                        </li>
                    </>
                )}
            </ul>
          </div>
        </nav>
    )
}

export default withRouter(NavBar)