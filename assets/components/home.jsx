import React, {Component} from 'react';
import {Route, Switch,Redirect, Link, withRouter} from 'react-router-dom';
import Buttons from './buttons.jsx'
    
class Home extends Component {
    
    render() {
        return (
            <div><Buttons></Buttons></div>
        )
    }
}
    
export default Home;