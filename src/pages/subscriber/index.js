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
import {
  Stack,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Select,
  MenuItem,
  Pagination,
  FormControl,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListSubheader,
  ListItemIcon,
  Alert,
  Snackbar
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, Modal, Tag, Spin } from 'antd';
import { Formik } from 'formik';
import axios from 'axios';
import { EditOutlined } from '@ant-design/icons';
import PlaceIcon from '@mui/icons-material/Place';

const initialState = {
  id: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  address: '',
  lat: '',
  lon: '',
  contact_number: '',
  plan_type_id: ''
};

function index() {
  const [open, setOpen] = React.useState(false);
  const [subscriber, setSubscriber] = useState([]);
  const [newData, setNewData] = useState(false);
  const [planTypes, setPlanTypes] = useState([]);
  const [modalText, setModalText] = useState('Content of the modal');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [values, setValues] = useState(initialState);
  const [action, setAction] = useState('Add');
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [validate, setValidate] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [autocompelete, setAutoComplete] = useState([]);

  const showModal = () => {
    setValidate({});
    setOpen(true);
    populatePlanTypes();
  };

  const searchAddress = () => {
    console.log(values.address);
    setAutoComplete([])
    axios
      .get('https://api.geoapify.com/v1/geocode/autocomplete', {
        params: {
          text: values.address,
          apiKey: '124a6fb19cab481cabeb3eb096fa944c'
        }
      })
      .then(function (response) {
        response.data.features.map((feature) => {
          setAutoComplete((autocomplete) => [...autocomplete, feature]);
        });
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };


  const handleOk = () => {
    let route = 'subs-registration';

    setConfirmLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    if (action == 'Edit') route = 'edit-subscriber';
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/${route}`, values, config)
      .then((res) => {
        if (res) {
          if (res.data.status == 'failed') {
            setValidate(res.data.messages);
            console.log('valueasdasdasdasdasdasdasdasds', values);
            setOpen(true);
          } else {
            setNewData(true);
            setOpen(false);
            setAlertOpen(true);
            setValues(initialState);
          }
        }
        setConfirmLoading(false);
      })
      .catch((error) => {
        console.log('erri', error);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };

  const editSubscriber = (values) => {
    console.log(values);
    setAction('Edit');
    showModal();
    setValues({
      ...values,
      id: values.id,
      first_name: values.user_subscriber.first_name,
      middle_name: values.user_subscriber.middle_name,
      last_name: values.user_subscriber.last_name,
      address: values.user_subscriber.address,
      contact_number: values.user_subscriber.contact_number,
      plan_type_id: values.plan_type_id
    });
  };

  const handleChanges = (e) => {
    const target = e.target;
    setValues({ ...values, [target.name]: target.value });
  };

  const handleNameChanges = (e) => {
    const target = e.target;
    if(isNaN(+target.value)){
      setValues({ ...values, [target.name]: target.value });
    }
  }

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setAction('Add');
    setOpen(false);
  };

  const populatePlanTypes = async () => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/get-plan-type`, config)
      .then((res) => {
        if (res) {
          console.log(res.data);
          setPlanTypes(res.data);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('err', error);
      });
  };

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/get-subscribers?page=${currentPage}`, config)
      .then((res) => {
        // setLoading(false);
        if (res) {
          console.log(res.data);
          setSubscriber(res.data.data);
          setPage(res.data.last_page);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        // setLoading(false);
        console.log('erri', error);
      });
  }, [newData]);

  const getCurrentPage = async (e, value) => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/get-subscribers?page=${value}`, config)
      .then((res) => {
        if (res) {
          console.log(res.data);
          setSubscriber(res.data.data);
          setCurrentPage(value);
          setPage(res.data.last_page);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
  };

  const disableUser = async (id) => {
    console.log(id);
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/disable-user`, { id: id }, config)
      .then((res) => {
        if (res) {
          reloadData();
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
  };

  const reloadData = () => {
    if (!newData) {
      setNewData(true);
    } else {
      setNewData(false);
    }
    setLoading(false);
  };
  const selectPlace = (place) => {
    setValues({ ...values, address: place.properties.formatted, lon: place.properties.lon, lat: place.properties.lat });
    setAutoComplete([]);
  }
  return (
    <MainCard>
      <Grid container alignItems="center" justifyContent="space-between" pb={2}>
        <Typography variant="h5">Subscriber</Typography>
        <Button type="primary" onClick={showModal}>
          Add Subscriber
        </Button>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minHeight: 400, minWidth: 650, paddingTop: 0 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Account No.</TableCell>
              <TableCell>Fullname</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Subscriber Plan</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriber.length ? (
              subscriber.map((row) => (
                <TableRow key={row.account_no} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.account_no}
                  </TableCell>
                  <TableCell style={{textTransform: 'capitalize'}}>{`${row.user_subscriber.first_name} ${row.user_subscriber.middle_name} ${row.user_subscriber.last_name}`}</TableCell>
                  <TableCell>{row.user_subscriber.contact_number}</TableCell>
                  <TableCell>{row.plan_type ? row.plan_type.mbps + ' Mbps Plan' : 'No Plan' }</TableCell>
                  <TableCell>{row.status == 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}</TableCell>
                  <TableCell align="center">
                    <Switch
                      onChange={() => {
                        disableUser(row.id);
                      }}
                      defaultChecked={row.status == 1 ? true : false}
                    />
                    <Button
                      // disabled={list.status == '0' ? true : list.status == '2' ? true : false}
                      onClick={() => editSubscriber(row)}
                      type="text"
                    >
                      <EditOutlined style={{ fontSize: 16, color: '#1677ff' }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <Grid container sx={{ position: 'absolute', top: '50%', left: '55%' }}>
                <Grid item sx={{ textAlign: 'center' }}>
                  <Spin />
                </Grid>
              </Grid>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Pagination sx={{paddingTop: "1rem"}} count={10} variant="outlined" shape="rounded" /> */}

      <Modal
        title={`${action == 'Add' ? 'Add Subscriber' : 'Edit Subscriber'}`}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        {Object.keys(validate).length ? (
          <Grid container>
            <Grid item>
              <ListItem
                // key={value}
                disableGutters
              >
                <Alert severity="error">Kindly input the required fields — check it out!</Alert>
              </ListItem>
            </Grid>
          </Grid>
        ) : null}

        <Formik>
          {({}) => (
            <form noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="first_name">First Name</InputLabel>
                    <OutlinedInput
                      id="first_name"
                      type="text"
                      value={values.first_name}
                      name="first_name"
                      onChange={handleNameChanges}
                      placeholder="Enter first name"
                      required
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="middle_name">Middle Name</InputLabel>
                    <OutlinedInput
                      id="middle_name"
                      type="text"
                      value={values.middle_name}
                      name="middle_name"
                      onChange={handleNameChanges}
                      placeholder="Enter middle name"
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="last_name">Last Name</InputLabel>
                    <OutlinedInput
                      id="last_name"
                      type="text"
                      value={values.last_name}
                      name="last_name"
                      onChange={handleNameChanges}
                      placeholder="Enter last name"
                      fullWidth
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} style={{position: 'relative'}}>
                  <Stack spacing={1} >
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
                  <Button
                    style={{position: 'absolute', zIndex: '2', right: '.5rem', top: '3.55rem'}}
                    onClick={() => searchAddress()}
                    type="primary"
                  >
                      Search
                  </Button>
                  {autocompelete.length? 
                     <List
                     sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                     component="nav"
                     aria-labelledby="nested-list-subheader"
                     subheader={
                       <ListSubheader component="div" id="nested-list-subheader">
                        Search List
                       </ListSubheader>
                     }
                   >
                  {autocompelete.map((search) => {
                   return (
                     <ListItemButton onClick={()=> selectPlace(search)}>
                       <ListItemIcon style={{marginRight:".5rem"}}><PlaceIcon/></ListItemIcon>
                       <ListItemText primary={search.properties.formatted} > </ListItemText>
                     </ListItemButton>
                
                   );
                 })}
                    </List>
                    :
                    <Typography style={{color:"gray", textAlign: 'center', paddingTop: '2rem'}}>No place found. Try searching places to find your address.</Typography>
                  }
                 
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
                    <FormControl fullWidth>
                      <InputLabel htmlFor="plan_type_id">Type of Plan</InputLabel>
                      <Select
                        label="Type of Plan"
                        id="plan_type_id"
                        name="plan_type_id"
                        value={values.plan_type_id}
                        onChange={handleChanges}
                      >
                        {/* <MenuItem hidden>Select Gender</MenuItem>  */}
                        {planTypes
                          ? planTypes.map((planType) => (
                              <MenuItem disabled={planType.status == 1 ? false : true} key={planType.id} value={planType.id}>
                                {planType?.mbps} mbps plan
                              </MenuItem>
                            ))
                          : null
                        }
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Modal>

      <Grid container sx={{ display: 'flex-row', justifyContent: 'end' }}>
        <Pagination sx={{ paddingTop: '1rem' }} count={page} variant="outlined" shape="rounded" onChange={getCurrentPage} />
      </Grid>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={alertOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="success" sx={{ width: '100%', backgroundColor: '#008000', color: '#ffffff' }}>
          New subscriber added successfully!
        </Alert>
      </Snackbar>
    </MainCard>
  );
}

export default index;
