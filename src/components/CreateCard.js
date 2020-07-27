
import React, { useState } from "react";
import API from '../api';
import {
    Card, CardBody,
    Toast, ToastBody, ToastHeader
} from 'reactstrap';

const CreateCard = () => {

    let fields = { word: "", definition: "" };
    const [inputList, setInputList] = useState([fields]);
    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);
    let setTitle = React.createRef();

    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, fields]);
    };

    const submit = async () => {

        //set the collection title
        let obj = {
            title: setTitle.current.value
        }

        //Need to ensure we get the collection id before continuing.
        const response = await API.post('api/collections', obj);

        //Get collection id so it can be used to create cards.
        const collectionId = response.data._id;

        //loop through each card because api end point does not accept arrays
        for (let i = 0; i < inputList.length; i++) {

            //Ensure each card is added to the collection.
            //If await is not used, only the last index will be posted. 
            await API.post('api/collections/' + collectionId + '/cards', {
                word: inputList[i].word,
                definition: inputList[i].definition
            })
        }

        //clear input when completed
        setInputList([fields]);

        //show success message
        toggle()
    }

    return (

        <div class="d-flex justify-content-center align-items-center container">
            <Card className="shadow p-3 mb-5 bg-white rounded">
                <Toast isOpen={show} className="toast" fade={true}>
                    <ToastHeader toggle={toggle} icon="success">Success!</ToastHeader>
                    <ToastBody> Successfully submitted! </ToastBody>
                </Toast>

                <CardBody>
                    <h3>Create Collection</h3>

                    <input
                        name="title"
                        placeholder="Enter collection title"
                        className="form-control"
                        ref={setTitle}
                    />
                    <br />

                    <h4>Create Cards</h4>
                    {inputList.map((x, i) => {
                        return (
                            <div>
                                <div class="input-group mb-3">
                                    <input
                                        name="word"
                                        placeholder="Enter word"
                                        value={x.word}
                                        className="form-control"
                                        onChange={e => handleInputChange(e, i)}
                                    />
                                    <input
                                        className="ml10"
                                        name="definition"
                                        className="form-control"
                                        placeholder="Enter definition"
                                        value={x.definition}
                                        onChange={e => handleInputChange(e, i)}
                                    />
                                    {inputList.length - 1 === i && <button class="btn btn-primary" type="button" onClick={handleAddClick}>Add More</button>}
                                    {inputList.length !== 1 && <div class="input-group-append">
                                            <button className="mr10" onClick={() => handleRemoveClick(i)} class="btn btn-outline-danger">Remove</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        );
                    })}
                    <button class="btn btn-outline-success" onClick={() => submit()}>Submit</button>
                </CardBody>
            </Card>
        </div>
    );
}

export default CreateCard;
