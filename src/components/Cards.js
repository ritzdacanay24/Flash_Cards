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

    search = () => {
        console.log('asdf')
    }
    render() {
        return (
            <div className="container">
                <select onChange={(e) => this.goToCarddetails(e.target.value, 1)} name="collectionName" className="form-control center-block" style={{ width: "400px", margin: "0 auto" }}>
                    <option defaultValue="" selected disabled>Select Collection</option>
                    {
                        this.state.cards.map((card, index) =>
                            <option key={index} value={card._id}>{card.title}</option>
                        )
                    }
                </select>
            <br></br>
                <div className="row">
                    {
                        this.state.cards.map((person, index) =>
                            <div className="col-lg-4 px-md-5" key={index}>
                                <Card className="pointer shadow p-3 mb-5 bg-white rounded" onClick={() => this.goToCarddetails(person._id, person.cards.length)}>
                                    <CardBody>
                                        <CardTitle style={{textAlign:"left"}}><h3>{person.title}</h3></CardTitle>
                                        <CardSubtitle style={{position:"absolute", right:"20px", fontSize:"70px", top:"20px"}} className="inset">{person.cards.length}</CardSubtitle>
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