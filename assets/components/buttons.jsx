import React, { Component } from 'react';
import Button from './button.jsx'

class Buttons extends Component {

    constructor() {
        super();

        this.state = {
            loaded: false,
            buttonsArray: {}
        }
    }

    getButtons() {
        return [
            {
                name: 'test1',
                url: 'exemple.com'
            },
            {
                name: 'test2',
                url: 'exemple.com'
            },
            {
                name: 'test3',
                url: 'exemple.com'
            },
        ];
    }


    componentDidMount() {
        //à changer en production
        fetch("localhost:8000/api/tools")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ loaded: true, buttonsArray: result });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }


    componentDidMount() {
        console.log("hello")

    }


    render() {
        return (
            this.state.loaded ?
                <div className="d-grid gap-2">{this.state.buttonsArray.map(button => (
                    <Button key={button.name} name={button.name} url={button.url}>
                    </Button>
                ))}</div>
                :
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
        )
    }
}

export default Buttons;