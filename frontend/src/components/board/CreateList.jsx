import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addList } from '../../actions/board';
import { TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CreateList = () => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board.board);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !board?._id) {
      console.error('Missing required data:', { title, boardId: board?._id });
      return;
    }

    try {
      await dispatch(addList({ 
        title: title.trim(),
        boardId: board._id
      }));
      setTitle('');
      setAdding(false);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  return (
    <div className='create-list-button'>
      {!adding ? (
        <Button variant='contained' onClick={() => setAdding(true)}>
          + Add a List
        </Button>
      ) : (
        <form onSubmit={onSubmit}>
          <TextField
            variant='outlined'
            fullWidth
            required
            label='Enter list title'
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className='create-list-actions'>
            <Button type='submit' variant='contained' color='primary'>
              Add List
            </Button>
            <Button onClick={() => {
              setAdding(false);
              setTitle('');
            }}>
              <CloseIcon />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateList;
