import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { addCard } from '../../actions/board';
import { Card, CardContent, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CreateCardForm = ({ listId, setAdding }) => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();

  const formRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !listId) {
      console.error('Missing required data:', { title, listId });
      return;
    }

    const cardData = {
      title: title.trim(),
      listId: listId
    };
    console.log('Submitting card data:', cardData);

    try {
      await dispatch(addCard(cardData));
      setTitle('');
      setAdding(false);
    } catch (error) {
      console.error('Error creating card:', error);
    }
  };

  return (
    <form ref={formRef} className='create-card-form' onSubmit={onSubmit}>
      <Card>
        <CardContent className='card-edit-content'>
          <TextField
            margin='normal'
            fullWidth
            required
            label='Enter card title'
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </CardContent>
      </Card>
      <div className='card-actions'>
        <Button type='submit' variant='contained' color='primary'>
          Add Card
        </Button>
        <Button
          onClick={() => {
            setAdding(false);
            setTitle('');
          }}
        >
          <CloseIcon />
        </Button>
      </div>
    </form>
  );
};

CreateCardForm.propTypes = {
  listId: PropTypes.string.isRequired,
  setAdding: PropTypes.func.isRequired,
};

export default CreateCardForm;
