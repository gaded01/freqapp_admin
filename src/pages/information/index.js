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
import { Stack, IconButton, InputAdornment, InputLabel, OutlinedInput, FormHelperText, Select, MenuItem, Button } from '@mui/material';
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
  name: '',
  number: '',
};
function index() {
  const [open, setOpen] = React.useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [infos, setInfos] = useState({});
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
          console.log('res', res.data);
          setInfos(res.data);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
  }, [newData])

  const handleOk = async () => {
    setConfirmLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    await axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/update-information`, values, config)
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
      {infos.length ?
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="gcash"
              height="110"
              src={require('../../assets/images/icons/glogo.png')}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Kenneth Lopez
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                09596818283
              </Typography>
              <Typography variant="body2" color="text.secondary">
                GCash is a Filipino mobile payments service owned and operated by Globe Fintech Innovations, Inc., and operated by its wholly-owned subsidiary, G-Xchange, Inc
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
              {/* <Button size="small" onClick={() => updateInfo(info)}>Update Information</Button> */}
            </CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="gcash"
              height="110"
              src={require('../../assets/images/icons/maya.png')}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Kenneth Lopez
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                09596818283
              </Typography>
              <Typography variant="body2" color="text.secondary">
              Maya Wallet, powered by Maya Philippines, Inc. and commonly still referred to as PayMaya, allows money transfers between Maya users; send money to other local banks; pay recurring bills.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
              {/* <Button size="small" onClick={() => updateInfo(info)}>Update Information</Button> */}
            </CardActions>
          </Card>
        </Grid>
        <Grid item>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="gcash"
              height="110"
              width="50"
              src={require('../../assets/images/icons/master.png')}
            />
            <CardContent>
              <Typography variant="h5" component="div">
               Bank Account
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                9485-293-321
              </Typography>
              <Typography variant="body2" color="text.secondary">
              Mastercard Inc. is an American multinational payment card services corporation headquartered in Purchase, New York. It offers a range of payment transaction processing and other related-payment services.
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
              {/* <Button size="small" onClick={() => updateInfo(info)}>Update Information</Button> */}
            </CardActions>
          </Card>
          </Grid>
        </Grid>
        :
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin />
        </CardContent>
      }
      <Modal title="Update Information" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Formik>
          {({ }) => (
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
