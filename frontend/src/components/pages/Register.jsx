// https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates/sign-up

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Copyright from '../other/Copyright';
import useStyles from '../../utils/formStyles';

const Register = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;

  useEffect(() => {
    document.title = 'TrelloClone | Sign Up';
  }, []);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setAlert('Passwords do not match', 'error'));
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  if (isAuthenticated) {
    return <Navigate to='/dashboard' replace />;
  }

  return (
    <Container component='main' maxWidth='xs' className={classes.container}>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component='h1' variant='h4'>
          TrelloClone
        </Typography>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={(e) => onSubmit(e)}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Name'
            name='name'
            autoComplete='name'
            autoFocus
            value={name}
            onChange={(e) => onChange(e)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Email Address'
            name='email'
            autoComplete='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            value={password}
            onChange={(e) => onChange(e)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password2'
            label='Confirm Password'
            type='password'
            value={password2}
            onChange={(e) => onChange(e)}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link href='/login' variant='body2'>
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Register;
