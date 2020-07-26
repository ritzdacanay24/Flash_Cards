import React from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';

class ManageCards extends React.Component {

    constructor(props) {
        super(props);
        this.getAllCollections();
        this.state = {
            details: []
        }
    }

    getAllCollections = () => {

        axios.get('http://localhost:5000/api/collections/')
            .then(res => {
                const details = res.data;
                this.setState({ details })

            }, function () {
                alert('Something went wrong')
            })
    }

    render() {
        return (
            <div class="container">
                {
                    this.state.details.map((card, index) =>
                        <Table className="text-left" responsive bordered>
                            <thead>

                                {
                                    index == 0 ?
                                        <tr>
                                            <th>Card</th>
                                        </tr>
                                        : null
                                }

                                <tr>
                                    <th scope="row" className="pl-4">{card.title}</th>
                                </tr>
                            </thead>

                            {card.cards.map((c, i) => (
                                <tbody key={i}>
                                    <tr>
                                        <td  className="pl-5">{c.word}</td>
                                    </tr>
                                </tbody>
                            ))}

                        </Table>
                    )
                }
            </div>
        )
    }

}

export default ManageCards