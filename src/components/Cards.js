import React from 'react';
import axios from 'axios';
import {
    Card, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';

export default class Cards extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            cards: []
        }
    }

    componentDidMount() {
       this.getCollection()
    }

    getCollection = () => {
        axios.get('http://localhost:5000/api/collections')
        .then(res => {
            this.setState({ cards: res.data })
        })
    }

    goToCarddetails = (cardId , collectionCount) => {
        if(!collectionCount) {
            alert('No collections'); 
            return;
        } 
        
        this.props.history.push('/CardsDetails', { cardId: cardId })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    {
                        this.state.cards.map((person, index) =>
                            <div className="col-lg-4 px-md-5" key={index}>
                                <Card className="shadow p-3 mb-5 bg-white rounded" onClick={() => this.goToCarddetails(person._id, person.cards.length)}>
                                    <CardBody>
                                        <CardTitle><h3>{person.title}</h3></CardTitle>
                                        <CardSubtitle>Total: {person.cards.length}</CardSubtitle>
                                    </CardBody>
                                </Card>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}