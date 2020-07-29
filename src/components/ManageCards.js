import React from 'react';
import API from '../api';
import { Card, CardBody } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { NotificationManager } from 'react-notifications';

class ManageCards extends React.Component {

    constructor(props) {
        super(props);

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
    }

    componentDidMount() {
        this.createCardSubmit = this.createCardSubmit.bind(this);
        this.updateCardSubmit = this.updateCardSubmit.bind(this);
        this.getAllCollections();
    }

    getAllCollections = () => {
        API.get('api/collections/')
            .then(res => {
                const details = res.data;
                this.setState({ details })

            }, function () {
                NotificationManager.error('Something went wrong', 'Error');
            })
    }


    selectCollection = (e) => {
        let { value } = e.target;

        API.get(`api/collections/${value}/cards`)
            .then(res => {
                this.setState({ collectionId: value, cards: res.data })
            }, function () {
                NotificationManager.error('Something went wrong', 'Error');
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
        API.post('api/collections/' + this.state.collectionId + '/cards', cardsInfo)
            .then(res => {
                let cards = [...this.state.cards];
                cardsInfo._id = res.data._id
                cards.push(cardsInfo);
                this.setState({
                    add: this.collectionFields,
                    cards: cards
                })
                NotificationManager.success('Added successfully', 'Success');
            }, function () {
                NotificationManager.error('Something went wrong', 'Error');
            })
    }

    updateCardSubmit() {
        let cardId = this.state.add._id;
        delete this.state.add._id
        API.put(`api/collections/${this.state.collectionId}/cards/${cardId}`, this.state.add)
            .then(res => {
                NotificationManager.success('Updated successfully', 'Success');
            }, function () {
                NotificationManager.error('Something went wrong', 'Error');
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
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this card? This cannot be undone!',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    API.delete(`api/collections/${this.state.collectionId}/cards/${cardId}`)
                    .then(res => {
                        let cards = this.state.cards;
                        cards.splice(index, 1);
                        this.setState({ cards });
                        NotificationManager.success('Deleted successfully', 'Success');

                    }, function () {
                        alert('Something went wrong')
                    })
                }
              },
              {
                label: 'No'
              }
            ]
          });
    }

    deleteCollection = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete this collection? This cannot be undone!',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    API.delete(`api/collections/${this.state.collectionId}`)
                    .then(res => {
                        window.location.reload();

                    }, function () {
                        NotificationManager.error('Something went wrong', 'Error');
                    })
                }
              },
              {
                label: 'No'
              }
            ]
          });
    }

    render() {
        return (
            <div className="d-flex justify-content-center align-items-center container">
                
                <Card className="shadow p-3 mb-5 bg-white rounded">
                    <CardBody>
                        <select onChange={this.selectCollection} name="collectionName" className="form-control center-block" style={{ width: "400px", margin: "0 auto" }}>
                            <option value="Select Collection" disabled selected>Select Collection</option>
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
                                            autocomplete="off"
                                        />
                                        <input
                                            name="definition"
                                            className="form-control"
                                            placeholder="Enter new definition"
                                            onChange={this.createChange}
                                            type="text"
                                            autocomplete="off"
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-success" type="reset" onClick={this.createCardSubmit}>Add</button>
                                        </div>
                                    </div>
                                </form>
                                <br />

                                {!this.state.cards.length ? <p>No cards found.</p> : <p>Modify cards below</p>} 

                                <div style={{ height: "calc(75vh - 230px)", overflow: "auto" }}>
                                    {
                                        this.state.cards.map((card, index) => {
                                            return (
                                                <div className="input-group mb-3 p-1" key={card._id}>
                                                    <input
                                                        name='word'
                                                        placeholder="Enter word"
                                                        defaultValue={card.word}
                                                        className="form-control"
                                                        autocomplete="off"
                                                        onChange={(e) => this.updateChange(e, card)}
                                                    />
                                                    <input
                                                        name='definition'
                                                        className="form-control"
                                                        placeholder="Enter definition"
                                                        defaultValue={card.definition}
                                                        autocomplete="off"
                                                        onChange={(e) => this.updateChange(e, card)}
                                                    />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-outline-danger" onClick={() => this.removeCardById(index, card._id)}>Remove</button>
                                                        <button className="btn btn-outline-info" onClick={this.updateCardSubmit}>Update</button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        }
                        {this.state.collectionId && <button  className="btn btn-danger" type="reset" onClick={this.deleteCollection}>Delete Collection</button>}
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default ManageCards