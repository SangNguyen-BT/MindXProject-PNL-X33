import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: 20,
  },
  moveListTop: {
    display: 'flex',
  },
  moveListBottom: {
    display: 'flex',
    flexDirection: 'column',
  },
  moveListButton: {
    marginTop: 20,
  },
}));

export default useStyles;
