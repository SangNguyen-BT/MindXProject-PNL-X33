import axios from 'axios';
import { setAlert } from './alert';
import {
  CLEAR_BOARD,
  GET_BOARDS,
  GET_BOARD,
  ADD_BOARD,
  BOARD_ERROR,
  RENAME_BOARD,
  GET_LIST,
  ADD_LIST,
  RENAME_LIST,
  ARCHIVE_LIST,
  GET_CARD,
  ADD_CARD,
  EDIT_CARD,
  MOVE_CARD,
  ARCHIVE_CARD,
  DELETE_CARD,
  GET_ACTIVITY,
  ADD_MEMBER,
  MOVE_LIST,
  ADD_CARD_MEMBER,
  ADD_CHECKLIST_ITEM,
  EDIT_CHECKLIST_ITEM,
  COMPLETE_CHECKLIST_ITEM,
  DELETE_CHECKLIST_ITEM,
} from './types';

// Tạo config chung cho tất cả requests
const getConfig = () => ({
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': localStorage.getItem('token')
  }
});

// Get boards
export const getBoards = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_BOARD });
    const res = await axios.get('/api/boards', getConfig());
    dispatch({
      type: GET_BOARDS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error',
        status: err.response?.status || 500
      },
    });
  }
};

// Get board
export const getBoard = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/boards/${id}`, getConfig());

    if (res) {
      axios.defaults.headers.common['boardId'] = id;
    } else {
      delete axios.defaults.headers.common['boardId'];
    }

    dispatch({
      type: GET_BOARD,
      payload: { ...res.data, listObjects: [], cardObjects: [] },
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error',
        status: err.response?.status || 500
      },
    });
  }
};

// Add board
export const addBoard = (formData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/boards', formData, getConfig());

    dispatch({
      type: ADD_BOARD,
      payload: res.data,
    });

    dispatch(setAlert('Board Created', 'success'));
    
    return res.data._id;

  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { 
        msg: err.response?.statusText || 'Server Error',
        status: err.response?.status || 500
      },
    });

    dispatch(setAlert('Error creating board', 'error'));
    return null;
  }
};

// Rename board
export const renameBoard = (boardId, formData) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/boards/rename/${boardId}`, formData, getConfig());

    dispatch({
      type: RENAME_BOARD,
      payload: res.data,
    });

    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get list
export const getList = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/lists/${id}`);

    dispatch({
      type: GET_LIST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add list
export const addList = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      }
    };

    console.log('Creating list:', formData);

    const res = await axios.post('/api/lists', formData, config);

    dispatch({
      type: ADD_LIST,
      payload: res.data
    });

    dispatch(getActivity());
  } catch (err) {
    console.error('Error creating list:', err.response?.data || err.message);
    dispatch({
      type: BOARD_ERROR,
      payload: { 
        msg: err.response?.data?.msg || 'Server Error',
        status: err.response?.status || 500
      }
    });
  }
};

// Rename list
export const renameList = (listId, formData) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/lists/rename/${listId}`, formData, getConfig());

    dispatch({
      type: RENAME_LIST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Archive/Unarchive list
export const archiveList = (listId, archive) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/lists/archive/${archive}/${listId}`);

    dispatch({
      type: ARCHIVE_LIST,
      payload: res.data,
    });

    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get card
export const getCard = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/cards/${id}`);

    dispatch({
      type: GET_CARD,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add card
export const addCard = (formData) => async (dispatch) => {
  try {
    console.log('Adding card with data:', formData);

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No auth token found');
    }

    const boardId = axios.defaults.headers.common['boardId'];
    if (!boardId) {
      throw new Error('BoardId not found in headers');
    }

    // Đơn giản hóa request
    const res = await axios({
      method: 'post',
      url: 'http://localhost:3000/api/cards',
      data: {
        title: formData.title,
        listId: formData.listId
      },
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
        'boardId': boardId
      }
    });

    console.log('Server response:', res.data);

    if (res.data) {
      // Chỉ dispatch ADD_CARD, không gọi getBoard
      dispatch({
        type: ADD_CARD,
        payload: {
          card: res.data,
          listId: formData.listId
        }
      });
    }
  } catch (err) {
    console.error('Error in addCard action:', err);
    dispatch({
      type: BOARD_ERROR,
      payload: { 
        msg: err.response?.data?.msg || err.message || 'Server Error',
        status: err.response?.status || 500
      }
    });
  }
};

// Edit card
export const editCard = (cardId, formData) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/cards/edit/${cardId}`, formData, getConfig());

    dispatch({
      type: EDIT_CARD,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Move card
export const moveCard = (cardId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.patch(`/api/cards/move/${cardId}`, body, getConfig());

    dispatch({
      type: MOVE_CARD,
      payload: res.data,
    });

    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Archive/Unarchive card
export const archiveCard = (cardId, archive) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/cards/archive/${archive}/${cardId}`);

    dispatch({
      type: ARCHIVE_CARD,
      payload: res.data,
    });

    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete card
export const deleteCard = (listId, cardId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/cards/${listId}/${cardId}`);

    dispatch({
      type: DELETE_CARD,
      payload: res.data,
    });

    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get activity
export const getActivity = () => async (dispatch) => {
  try {
    const boardId = axios.defaults.headers.common['boardId'];

    const res = await axios.get(`/api/boards/activity/${boardId}`);

    dispatch({
      type: GET_ACTIVITY,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add member
export const addMember = (userId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/boards/addMember/${userId}`);

    dispatch({
      type: ADD_MEMBER,
      payload: res.data,
    });

    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Move list
export const moveList = (listId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.patch(`/api/lists/move/${listId}`, body, getConfig());

    dispatch({
      type: MOVE_LIST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add card member
export const addCardMember = (formData) => async (dispatch) => {
  try {
    const { add, cardId, userId } = formData;

    const res = await axios.put(`/api/cards/addMember/${add}/${cardId}/${userId}`);

    dispatch({
      type: ADD_CARD_MEMBER,
      payload: res.data,
    });

    dispatch(getActivity());
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add checklist item
export const addChecklistItem = (cardId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.post(`/api/checklists/${cardId}`, body, getConfig());

    dispatch({
      type: ADD_CHECKLIST_ITEM,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Edit checklist item
export const editChecklistItem = (cardId, itemId, formData) => async (dispatch) => {
  try {
    const body = JSON.stringify(formData);

    const res = await axios.patch(`/api/checklists/${cardId}/${itemId}`, body, getConfig());

    dispatch({
      type: EDIT_CHECKLIST_ITEM,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Complete/Uncomplete checklist item
export const completeChecklistItem = (formData) => async (dispatch) => {
  try {
    const { cardId, complete, itemId } = formData;

    const res = await axios.patch(`/api/checklists/${cardId}/${complete}/${itemId}`);

    dispatch({
      type: COMPLETE_CHECKLIST_ITEM,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete checklist item
export const deleteChecklistItem = (cardId, itemId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/checklists/${cardId}/${itemId}`);

    dispatch({
      type: DELETE_CHECKLIST_ITEM,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: BOARD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
