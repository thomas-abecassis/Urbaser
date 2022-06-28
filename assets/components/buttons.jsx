import React, {Component} from 'react';
import Button from './button.jsx'
    
class Buttons extends Component {

    constructor() {
        super();
        
        this.state = {
            loaded: false,
            buttonsArray:{}
        }
    }

    getButtons(){
        return[
            {name: 'test1',
            url: 'exemple.com'},
            {name: 'test2',
            url: 'exemple.com'},
            {name: 'test3',
            url: 'exemple.com'},
        ];
    }

    componentDidMount(){
        console.log("hello")
        this.setState({loaded: true, buttonsArray : this.getButtons()});
    }
    
    
    render() {
        return (
            this.state.loaded ?
             <div className='buttons'>{this.state.buttonsArray.map(button => (
                <Button key={button.name} name={button.name} url={button.url}>
                </Button>
              ))}</div>
              :
              <div className='buttons'> en chargement </div> 
        )
    }
}
    
export default Buttons;