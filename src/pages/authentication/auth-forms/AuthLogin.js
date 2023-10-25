import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
// project import
import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useUserContext } from 'context/UserContext';
import RedirectToHome from 'middleware/RedirecToHome';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const { setUser } = useUserContext()
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    if (localStorage.getItem('token')) {
        navigate('/dashboard')
    };
  },[])

  const submitLogin = (values) => {
    // setLoading(true);
    axios.post(`${process.env.REACT_APP_BASE_API_URL}/user-login`, values)
      .then((res) => {
        // setLoading(false);
        if (res.data.status !== "failed") {
          setUser( res.data.user.id);
          localStorage.setItem('token', res.data.access_token);
          if(res.data.user.role == "1") {
            navigate('/dashboard');
          }
          else {
            navigation.navigate("Drawer");
          }
          
        } else {
          alert(res.data.message);
          console.log(REACT_APP_BASE_API_URL);
        }
      })
      .catch((error) => {
        // setLoading(false);
        console.log('erri', error);
      });
  };

  return (
    <>
      <Formik
        initialValues={{
          contact_number: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          contact_number: Yup.string().max(255).required('Contact number is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            submitLogin(values)
            setStatus({ success: false });
            setSubmitting(true);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="contact_number-login">Contact Number</InputLabel>
                  <OutlinedInput
                    id="contact_number-login"
                    type="contact_number"
                    value={values.contact_number}
                    name="contact_number"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    fullWidth
                    error={Boolean(touched.contact_number && errors.contact_number)}
                  />
                  {touched.contact_number && errors.contact_number && (
                    <FormHelperText error id="standard-weight-helper-text-contact_number-login">
                      {errors.contact_number}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
