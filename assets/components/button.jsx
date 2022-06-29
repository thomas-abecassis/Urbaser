import React, { Component } from 'react';


function Button(props) {

    return (

        <button href={props.url} type="button" className="btn btn-primary btn-lg btn-block mt-5 p-3">{props.name}</button>
    )
}

export default Button;