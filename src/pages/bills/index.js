import MainCard from 'components/MainCard';
import React, { useState, useEffect } from 'react';
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
  Chip,
  Pagination,
  ListItem,
  Alert,
  Snackbar,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, Modal, Tag, Image, Spin } from 'antd';
import { Formik } from 'formik';
import axios from 'axios';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';

const initialValues = {
  month: '',
  year: '',
  account: '',
  subscriber_id: ''
};
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const years = ['2020', '2021', '2023'];

const config = {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
};

function index() {
  const [open, setOpen] = React.useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [bill, setBills] = useState({});
  const [billList, setBillList] = useState([]);
  const [newData, setNewData] = useState(false);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [error , setError] = useState({});
  const [exist, setExist ] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [confirmation ,setConfirmation] = useState();

  const handleChanges = (e) => {
    const target = e.target;
    setValues({ ...values, [target.name]: target.value });
  };

  const showModal = () => {
    setError({});
    setExist(null);
    setOpen(true);
  };
  
  const handleOk = () => {
    setConfirmLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/add-bill`, values, config)
      .then((res) => {
        if (res) {
          if (res.data.status == 'failed') {
            console.log('here', res.data.message)
            setError(res.data.messages);
            setOpen(true);
          } 
          else if(res.data.status == 'exist'){
            setExist(res.data.message);
            setOpen(true);
          }
          else {
            setNewData(true);
            setOpen(false);
            setAlertOpen(true);
            setValues(initialValues);
          }
        }
        setConfirmLoading(false);
      })
      .catch((error) => {
        console.log('erri', error);
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/get-subscribers-v2`, config)
      .then((res) => {
        if (res) {
          console.log(res.data);
          setSubscribers(res.data);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/sub-bill?page=${currentPage}`, config)
      .then((res) => {
        if (res) {
          console.log('radasdsad', res.data);
          setBillList(res.data.data);
          setPage(res.data.last_page);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
  }, [newData]);

  useEffect(() => {
    (async () => {
      await axios
        .post(`${process.env.REACT_APP_BASE_API_URL}/plan-sub-info`, { user_id: values.account }, config)
        .then((res) => {
          if (res) {
            console.log('res', res);
            setBills(res.data);
            setValues({ ...values, subscriber_id: res.data.id });
          } else {
            console.log(res.data.message);
          }
        })
        .catch((error) => {
          console.log('erri', error);
        });
    })();
  }, [values.account]);

  const acceptPayment = async (id, action) => {
    setLoading(true);
    let route = 'update-bill';
    if (action === 'reject') {
      route = 'reject-bill';
    }

    await axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/${route}`, { bill_id: id }, config)
      .then((res) => {
        if (res) {
          console.log('res', res);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
    setTimeout(() => {
      if (!newData) {
        setNewData(true);
      } else {
        setNewData(false);
      }
      setLoading(false);
    }, 5000);
  };

  const getCurrentPage = async (e, value) => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/sub-bill?page=${value}`, config)
      .then((res) => {
        if (res) {
          console.log(res.data);
          setBillList(res.data.data);
          setPage(res.data.last_page);
        } else {
          console.log(res.data.message);
        }
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
  
  const deleteBill = (id) => {
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/delete-bill`, {id : id}, config)
      .then((res) => {
        if (res) {
         
        }
        setNewData(true);
        setConfirmLoading(false);
      })
      .catch((error) => {
        console.log('err', error);
      });
  };
  
  const openDeleteModal = (value) => {
    console.log(value)
    Modal.confirm({
        title: 'Confirmation',
        content: `Are you sure you want delete the bill of ${value.subscriber.user_subscriber.first_name} ${value.subscriber.user_subscriber.middle_name} ${value.subscriber.user_subscriber.last_name} for the month of ${value.month} ${value.year}?`,
        onOk() {deleteBill(value)},
        onCancel() {
          console.log('Cancel');
        },
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn/>
          </>
        ),
    })
  }
  
  return (
    <MainCard>
      <Grid container alignItems="center" justifyContent="space-between" pb={2}>
        <Typography variant="h5">Bills</Typography>
        <Button type="primary" onClick={showModal}>
          Add Bill
        </Button>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minHeight: 450 ,minWidth: 650, paddingTop: 0 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Subscriber</TableCell>
              <TableCell align="left">Month/Year</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Due Date</TableCell>
              <TableCell align="left">Bill</TableCell>
              <TableCell align="center">Proof</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billList.length ? (
              billList.map((list) => (
                <TableRow key={list.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="left">
                    {`${list.subscriber.user_subscriber.first_name} ${list.subscriber.user_subscriber.last_name}`}
                    <Typography variant="body2" sx={{color: 'gray'}}>{list.subscriber.account_no}</Typography>
                  </TableCell>
                  <TableCell align="left">{`${list.month} ${list.year}`}</TableCell>
                  <TableCell align="left">
                    {list.status == 2 ? (
                      <Tag color="green">Paid</Tag>
                    ) : list.status == 1 ? (
                      <Tag color="orange">Verying</Tag>
                    ) : list.status == 0 ? (
                      <Tag color="red">Pending</Tag>
                    ) : (
                      <Tag color="red">Rejected</Tag>
                    )}{' '}
                  </TableCell>
                  <TableCell align="left">{list.month} 30</TableCell>
                  <TableCell align="left">₱ {list.amount + '.00'}</TableCell>
                  {/* <TableCell align="center"><Button type="text"><EyeTwoTone style={{fontSize: 16}}/></Button></TableCell> */}
                  <TableCell align="center">
                    {list.formatted_image_url != null ?
                         <Image width={30} src={list.formatted_image_url} />  
                      :
                     <Typography variant="body2" sx={{color: '#c9c9c9'}}>No Image</Typography>
                    }
                 
                  </TableCell>
                  {/* <TableCell align="center"><CheckOutlined style={{color: '#1677ff', fontSize: 18}}/>&nbsp;&nbsp;&nbsp;&nbsp;<CloseOutlined  style={{color: '#1677ff',  fontSize: 18}}/> </TableCell> */}
                  <TableCell align="center">
                    {loading ? (
                      <Spin />
                    ) : (
                      <div>
                        <Button
                          disabled={list.status == '0' ? true : list.status == '2' ? true : false}
                          onClick={() => acceptPayment(list.id, 'accept')}
                          type="text"
                        >
                          <CheckOutlined style={{ fontSize: 16, color: '#1677ff' }} />
                        </Button>
                        <Button
                          disabled={list.status == '0' ? true : list.status == '3' ? true : false}
                          onClick={() => acceptPayment(list.id, 'reject')}
                          type="text"
                        >
                          <CloseOutlined style={{ fontSize: 16, color: '#1677ff' }} />
                        </Button>
                        <Button
                          // disabled={list.status == '0' ? true : list.status == '3' ? true : false}
                          onClick={() => openDeleteModal(list)}
                          type="text"
                        >
                          <DeleteOutlined style={{ fontSize: 16, color: '#1677ff' }} />
                        </Button>
                        
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
            
              <Grid container sx={{position: 'absolute', top: '50%', left: '55%'}}>
                <Grid item sx={{ textAlign: 'center' }}>
                  <Spin />
                </Grid>
              </Grid>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal title="Add Bill" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
       {Object.keys(error).length ? (
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
        {exist !== null ? (
          <Grid container>
            <Grid item>
              <ListItem
                // key={value}
                disableGutters
              >
                <Alert severity="error">{exist}!</Alert>
              </ListItem>
            </Grid>
          </Grid>
        ) : null}
        <Formik>
          {({}) => (
            <form noValidate>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="month">Month</InputLabel>
                    <Select labelId="month" id="month" name="month" value={values.month} onChange={handleChanges}>
                      {months.map((month) => {
                        return <MenuItem value={month}>{month}</MenuItem>;
                      })}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="year">Year</InputLabel>
                    <Select labelId="year" id="year" name="year" value={values.year} onChange={handleChanges}>
                      {years.map((year) => {
                        return <MenuItem value={year}>{year}</MenuItem>;
                      })}
                    </Select>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="account">Account No. - Complete Name</InputLabel>
                    <Select labelId="account" id="account" name="account" value={values.account} onChange={handleChanges}>
                      {subscribers.map((subscriber) => {
                        return (
                          <MenuItem
                            value={subscriber.user_id}
                          >{`${subscriber.account_no} - ${subscriber.user_subscriber.first_name} ${subscriber.user_subscriber.last_name}`}</MenuItem>
                        );
                      })}
                    </Select>
                  </Stack>
                </Grid>
                {Object.keys(bill).length ? (
                  <TableContainer>
                    <Table sx={{ minWidth: 250, paddingTop: 10 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell alignItems="center">Plan</TableCell>
                          <TableCell alignItems="center">Price</TableCell>
                          <TableCell alignItems="center">Discount</TableCell>
                          <TableCell alignItems="center">Remark</TableCell>
                          <TableCell alignItems="center">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow key={bill.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            {`${bill.plan_type.mbps}mbps Fiber Plan`}
                          </TableCell>
                          <TableCell alignItems="center">{bill.plan_type.price}</TableCell>
                          <TableCell alignItems="center"></TableCell>
                          <TableCell alignItems="center"></TableCell>
                          <TableCell alignItems="center">{bill.plan_type.price}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : null}
              </Grid>
            </form>
          )}
        </Formik>
      </Modal>

      
      <Grid container sx={{ display: 'flex-row', justifyContent: 'end' }}>
        <Pagination sx={{ paddingTop: '1rem' }} count={page} variant="outlined" shape="rounded" onChange={getCurrentPage} />
      </Grid>

      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right'  }} open={alertOpen} autoHideDuration={3000} onClose={handleClose}>
        <Alert severity="success" sx={{ width: '100%', backgroundColor:"#008000", color: "#ffffff" }}>
          New bill added successfully!
        </Alert>
      </Snackbar>
    </MainCard>
  );
}

export default index;
