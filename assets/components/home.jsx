import React, { Component } from 'react';
import { Route, Switch, Redirect, Link, withRouter } from 'react-router-dom';
import Buttons from './buttons.jsx'
import logo from '../../public/ressources/images/logo.png';

class Home extends Component {

    render() {
        return (
            <div className="vh-100 d-flex flex-column">
                <nav className="navbar navbar-lg navbar-light bg-light">
                    <a className="navbar-brand ms-5" href="#">
                        <img src={logo} width="50" height="50" className="d-inline-block align-top" alt="" />
                    </a>
                </nav>
                <div className="container-fluid flex-grow-1 bg-image" style={{
                    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url('https://mdbootstrap.com/img/Photos/Others/images/76.jpg')"
                }}>
                    <div className="row justify-content-md-center align-items-center h-100">
                        <div className="col col-lg-6">
                            <Buttons />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Home;