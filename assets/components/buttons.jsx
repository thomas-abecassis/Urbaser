import React, { Component } from 'react';
import Button from './button.jsx'

class Buttons extends Component {

    constructor() {
        super();

        this.state = {
            loaded: false,
            buttonsArray: []
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
        fetch("/api/tools")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ loaded: true, buttonsArray: result });
                },
                (error) => {
                    console.trace(error)
                    this.setState({
                        loaded: true,
                        error
                    });
                }
            )
    }



    render() {
        return (
            this.state.loaded ?
                <div className=" d-grid gap-2">{this.state.buttonsArray.map(button => (
                    <Button key={button.name} name={button.name} url={button.url}>
                    </Button>
                ))}</div>
                :
                <div className="d-block text-primary spinner-border mx-auto" style={{ width: "5rem", height: "5rem" }} role="status" >
                    <span className="sr-only"></span>
                </div>
        )
    }
}

export default Buttons;