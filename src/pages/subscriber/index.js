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
import { Stack, IconButton, InputAdornment, InputLabel, OutlinedInput, FormHelperText, Select, MenuItem, Pagination} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, Modal,Tag } from 'antd';
import { Formik } from 'formik';
import axios from 'axios';
const initialState = {
  first_name: '',
  last_name: '',
  address: '',
  contact_number: '',
  plan_type_id: ''
}
function index() {
  const [open, setOpen] = React.useState(false);
  const [subscriber, setSubscriber] = useState([]);
  const [newData, setNewData] = useState(false)
  const [modalText, setModalText] = useState('Content of the modal');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [values, setValues] = useState(initialState)

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    console.log(values)
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios.post(`${process.env.REACT_APP_BASE_API_URL}/subs-registration`, values, config)
    .then((res) => {
      if (res) {
        console.log(res.data)
      
      } else {
        console.log(res.data.message);
  
      }
      
    })
    .catch((error) => {
      console.log('erri', error);
    });
    setTimeout(() => {
      setOpen(false);
      setNewData(true);
      setValues(initialState)
      setConfirmLoading(false);
    }, 2000);
  };

  const handleChanges = (e) => {
    const target = e.target;
    setValues({ ...values, [target.name]: target.value });
  };
  

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  function createData(acc, name, number, type, status) {
    return { acc, name, number, type, status };
  }
  const rows = [
    createData('20230000001', 'Kenneth Dela Cruz', '09568278192', '50mbps', '1'),
    createData('20230000002', 'Japeth Lopez', '09568270000', '50mbps', '1'),
    createData('20230000003', 'Lily Tana', '09568271231', '100mbps', '1'),
    createData('20230000004', 'Jimmy Fernandez', '09568270123', '100mbps', '1'),
    createData('20230000005', 'Jane Cordero', '09568270442', '50mbps', '1')
  ];

  useEffect(()=> {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/get-subscribers`, config)
    .then((res) => {
      // setLoading(false);
      if (res) {
        console.log(res.data)
        setSubscriber( res.data);
      } else {
        console.log(res.data.message);
  
      }
    })
    .catch((error) => {
      // setLoading(false);
      console.log('erri', error);
    });
  },[newData])
  
  return (
    <MainCard>
      <Grid container alignItems="center" justifyContent="space-between" pb={2}>
        <Typography variant="h5">Subscriber</Typography>
        <Button type="primary" onClick={showModal}>
          Add Subscriber
        </Button>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, paddingTop: 0 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Account No.</TableCell>
              <TableCell>Fullname</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Subscriber Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriber.map((row) => (
              <TableRow key={row.account_no} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.account_no}
                </TableCell>
                <TableCell>{row.user_subscriber.first_name}</TableCell>
                <TableCell>{row.user_subscriber.contact_number}</TableCell>
                <TableCell>{row.plan_type.mbps} Mbps Plan</TableCell>
                <TableCell>{row.status == 1 ? <Tag color="green">Active</Tag> :  <Tag color="red">Inactive</Tag> }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
     
      {/* <Pagination sx={{paddingTop: "1rem"}} count={10} variant="outlined" shape="rounded" /> */}
    
      <Modal title="Add Subscriber" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Formik
        >
          {({}) => (
            <form noValidate>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="first_name">First Name</InputLabel>
                    <OutlinedInput
                      id="first_name"
                      type="first_name"
                      value={values.first_name}
                      name="first_name"
                      onChange={handleChanges}
                      placeholder="Enter first name"
                      fullWidth
                    />
                    
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="last_name">Last Name</InputLabel>
                    <OutlinedInput
                      id="last_name"
                      type="last_name"
                      value={values.last_name}
                      name="last_name"
                      onChange={handleChanges}
                      placeholder="Enter last name"
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="address">Complete Address</InputLabel>
                    <OutlinedInput
                      fullWidth
                      id="address"
                      value={values.address}
                      name="address"
                      onChange={handleChanges}
                      placeholder="Enter complete address"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="contact_number">Contact Number</InputLabel>
                    <OutlinedInput
                      id="contact_number"
                      type="contact_number"
                      value={values.contact_number}
                      name="contact_number"
                      onChange={handleChanges}
                      placeholder="Enter contact number"
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="plan_type_id">Plan</InputLabel>
                    <Select
                        labelId="plan_type_id"
                        id="plan_type_id"
                        name="plan_type_id"
                        value={values.plan_type_id}
                        onChange={handleChanges}

                    >
                    <MenuItem hidden>Select Gender</MenuItem>
                    <MenuItem value={1}>Ten</MenuItem>
                    <MenuItem value={1}>Twenty</MenuItem>
                    <MenuItem value={1}>Thirty</MenuItem>
                  </Select>
                  
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
