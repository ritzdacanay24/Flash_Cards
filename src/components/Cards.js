import React from 'react';
import axios from 'axios';

export default class Cards extends React.Component {
    state = {
        cards: []
    };

    componentDidMount(){
        axios.get('http://localhost:5000/api/collections')
            .then(res => {
                const cards = res.data;
                console.log(cards)
                this.setState({cards})
            })
    }
    render() {
        return (
          <ul>
          { this.state.cards.map(person => <li>{person.title}</li>)}
          </ul>
        )
      }
      
}