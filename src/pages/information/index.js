import MainCard from 'components/MainCard';
import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Stack, IconButton, InputAdornment, InputLabel, OutlinedInput, FormHelperText, Select, MenuItem, Button} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Modal, Spin } from 'antd';
import Typography from '@mui/material/Typography';
import { Formik } from 'formik';
import axios from 'axios';

const initialValues = {
  id: '',
  name : '',
  number: '',
};
function index() {
  const [open, setOpen] = React.useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [info, setInfo] = useState({});
  const [newData, setNewData] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/get-information`, config)
      .then((res) => {
        if (res) {
          console.log(res.data);
          setInfo(res.data);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
  },[newData])

  const handleOk = async () => {
    setConfirmLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    await axios 
      .post(`${process.env.REACT_APP_BASE_API_URL}/update-information`, values ,config)
      .then((res) => {
        console.log('erasd', res)
       
      })
      .catch((error) => {
        console.log('erri', error);
      });
    setTimeout(() => {
      reloadData();
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleChange = (e) => {
    const target = e.target;
    setValues({ ...values, [target.name]: target.value });
    
  }
  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const updateInfo = (values) => {
    showModal();
    setValues({
      ...values,
      id: values.id,
      name: values.name,
      number: values.number
    });

  };

  const reloadData = () => {
    if (!newData) {
      setNewData(true);
    } else {
      setNewData(false);
    }
  };
  return (
    <MainCard>
      <Grid container alignItems="center" justifyContent="space-between" pb={2}>
        <Typography variant="h5">Payment Information</Typography>
      </Grid>
      <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="gcash"
        height="110"
        src={require('../../assets/images/icons/glogo.png')}
      />
      {Object.keys(info).length?
         <CardContent>
         <Typography variant="h5" component="div">
           {info.name}
         </Typography>
         <Typography gutterBottom variant="body1" component="div">
          {info.number}
         </Typography>
         <Typography variant="body2" color="text.secondary">
           GCash is a mobile wallet issued by Filipino telco Globe Telecom. 
           Customers can use GCash to shop online and in-store, send money, 
           top up mobile phone credits and pay bills.
         </Typography>
       </CardContent>
       :
       <CardContent sx={{display:'flex', justifyContent:'center', alignItems:'center', height: '100%'}}>
          <Spin/>
       </CardContent>
      }
     
      <CardActions>
        <Button size="small">Learn More</Button>
        <Button size="small" onClick={()=> updateInfo(info)}>Update Information</Button>
      </CardActions>
    </Card>
      <Modal title="Update Information" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Formik>
          {({}) => (
            <form noValidate>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="name">Gcash Name</InputLabel>
                    <OutlinedInput
                      id="name"
                      type="name"
                      value={values.name}
                      name="name"
                      onChange={handleChange}
                      placeholder="Enter gcash name"
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="number">Gcash Number</InputLabel>
                    <OutlinedInput
                      id="number"
                      type="name"
                      value={values.number}
                      name="number"
                      onChange={handleChange}
                      placeholder="Enter gcash number"
                      fullWidth
                    />
                  </Stack>
                </Grid>
               
              </Grid>
            </form>
          )}
        </Formik>
      </Modal>
    </MainCard>
  );
}

export default index;
