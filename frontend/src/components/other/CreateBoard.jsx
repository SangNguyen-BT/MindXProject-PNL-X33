import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addBoard } from '../../actions/board';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useStyles from '../../utils/dialogStyles';

const CreateBoard = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    const boardId = await dispatch(addBoard({ title }));
    if (boardId) {
      handleClose();
      navigate(`/board/${boardId}`);
    }
  };

  return (
    <div>
      <Button variant='contained' onClick={handleClickOpen}>
        Create Board
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <div className={classes.createBoardHeader}>
          <DialogTitle id='form-dialog-title'>Create Board</DialogTitle>
          <Button onClick={handleClose}>
            <CloseIcon />
          </Button>
        </div>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='title'
            label='Board Title'
            type='text'
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onSubmit} color='primary' variant='contained'>
            Create Board
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateBoard;
