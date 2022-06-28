import React, {Component} from 'react';
    
    
function Button(props) {

        return (
            <a href={props.url} >{props.name}</a>
        )
    }
    
export default Button;