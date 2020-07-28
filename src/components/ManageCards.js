import React from 'react';
import API from '../api';
import { Card, CardBody } from 'reactstrap';

class ManageCards extends React.Component {

    constructor(props) {
        super(props);
        this.getAllCollections();

        this.collectionFields = {
            word: "",
            definition: ""
        };

        this.state = {
            details: [],
            cards: [],
            add: this.collectionFields,
            updateCardInfo: {},
            collectionId: null
        }

        this.createCardSubmit = this.createCardSubmit.bind(this);
        this.updateCardSubmit = this.updateCardSubmit.bind(this);
    }

    getAllCollections = () => {
        API.get('http://localhost:5000/api/collections/')
            .then(res => {
                const details = res.data;
                this.setState({ details })

            }, function () {
                alert('Something went wrong')
            })
    }


    selectCollection = (e) => {
        let { value } = e.target;

        API.get(`http://localhost:5000/api/collections/${value}/cards`)
            .then(res => {
                this.setState({ collectionId: value, cards: res.data })
            }, function () {
                alert('Something went wrong')
            })
    }

    createChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({
            add: {
                ...this.state.add,
                [nam]: val
            }
        })
    }

    createCardSubmit(event) {
        let cardsInfo = this.state.add;
        API.post('http://localhost:5000/api/collections/' + this.state.collectionId + '/cards', cardsInfo)
            .then(res => {
                let cards = [...this.state.cards];
                cardsInfo._id = res.data._id
                cards.push(cardsInfo);
                this.setState({
                    add: this.collectionFields,
                    cards: cards
                })
            }, function () {
                alert('Something went wrong')
            })
    }

    updateCardSubmit() {
        let cardId = this.state.add._id;
        delete this.state.add._id
        API.put(`http://localhost:5000/api/collections/${this.state.collectionId}/cards/${cardId}`, this.state.add)
            .then(res => {
                console.log(res)
            }, function () {
                alert('Something went wrong')
            })
    }

    updateChange = (e, card) => {
        let nam = e.target.name;
        let val = e.target.value;
        this.setState({
            add: {
                ...card,
                [nam]: val
            }
        })
    }

    removeCardById = (index, cardId) => {
        API.delete(`http://localhost:5000/api/collections/${this.state.collectionId}/cards/${cardId}`)
            .then(res => {
                let cards = this.state.cards;
                cards.splice(index, 1);
                this.setState({ cards });

            }, function () {
                alert('Something went wrong')
            })
    }

    render() {
        return (
            <div className="d-flex justify-content-center align-items-center container">
                <Card className="shadow p-3 mb-5 bg-white rounded">
                    <CardBody>
                        <select onChange={this.selectCollection} name="collectionName" className="form-control center-block" style={{ width: "400px", margin: "0 auto" }}>
                            <option defaultValue="" selected disabled>Select Collection</option>
                            {
                                this.state.details.map((card, index) =>
                                    <option key={index} value={card._id}>{card.title}</option>
                                )
                            }
                        </select>
                        <br></br>

                        {this.state.collectionId &&
                            <div>
                                <form>
                                    <div className="input-group mb-3">
                                        <input
                                            name="word"
                                            placeholder="Enter new word"
                                            className="form-control"
                                            onChange={this.createChange}
                                            type="text"
                                        />
                                        <input
                                            name="definition"
                                            className="form-control"
                                            placeholder="Enter new definition"
                                            onChange={this.createChange}
                                            type="text"
                                        />
                                        <div className="input-group-append">
                                            <button className="mr10" className="btn btn-outline-success" type="reset" onClick={this.createCardSubmit}>Add</button>
                                        </div>
                                    </div>
                                </form>
                                <br />

                                <p>Modify cards below</p>
                                <div style={{ height: "calc(80vh - 230px)", overflow: "auto" }}>
                                    {
                                        this.state.cards.map((card, index) => {
                                            return (
                                                <div className="input-group mb-3 pr-1" key={card._id}>
                                                    <input
                                                        name='word'
                                                        placeholder="Enter word"
                                                        defaultValue={card.word}
                                                        className="form-control"
                                                        onChange={(e) => this.updateChange(e, card)}
                                                    />
                                                    <input
                                                        name='definition'
                                                        className="form-control"
                                                        placeholder="Enter definition"
                                                        defaultValue={card.definition}
                                                        onChange={(e) => this.updateChange(e, card)}
                                                    />
                                                    <div className="input-group-append">
                                                        <button className="mr10" className="btn btn-outline-danger" onClick={() => this.removeCardById(index, card._id)}>Remove</button>
                                                        <button className="mr10" className="btn btn-outline-success" onClick={this.updateCardSubmit}>Update</button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        }
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default ManageCards