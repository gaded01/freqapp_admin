import MainCard from 'components/MainCard';
import React, { useState, useEffect} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Stack, IconButton, InputAdornment, InputLabel, OutlinedInput, FormHelperText, Select, MenuItem, Chip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, Modal, Tag, Image,Spin } from 'antd';
import { Formik } from 'formik';
import axios from 'axios';
import {
  CheckOutlined,
  CloseOutlined,
  EyeTwoTone
} from '@ant-design/icons';


const initialValues = {
  month: '',
  year: '',
  account: '',
  subscriber_id : ''
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
  const [billList , setBillList] = useState([]);
  const [newData, setNewData] = useState(false);
  

  const handleChanges = (e) => {
    const target = e.target;
    setValues({ ...values, [target.name]: target.value });
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    axios.post(`${process.env.REACT_APP_BASE_API_URL}/add-bill`, values,  config)
    .then((res) => {
      if (res) {
        console.log('res', res)
      } else {
        console.log(res.data.message);
      }
    })
    .catch((error) => {
      console.log('erri', error);
    });
    setTimeout(() => {
      if(!newData){
        setNewData(true)
      }
      else{
        setNewData(false)
      }
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  function createData(acc, name, number, status, due_date, bill, address) {
    return { acc, name, number, status, due_date, bill, address };
  }

  const rows = [
    createData('20230000001', 'Kenneth Dela Cruz', '09568278192', '1', 'Oct 30', '1200', 'Tanauan Leyte'),
    createData('20230000002', 'Japeth Lopez', '09568270000', '1', 'Oct 30', '1200', 'Tanauan Leyte'),
    createData('20230000003', 'Lily Tana', '09568271231', '1', 'Oct 30', '1200', 'Tanauan Leyte'),
    createData('20230000004', 'Jimmy Fernandez', '09568270123', '1', 'Oct 30', '1200', 'Tanauan Leyte'),
    createData('20230000005', 'Jane Cordero', '09568270442', '1', 'Oct 30', '1200', 'Tanauan Leyte')
  ];

  useEffect(()=> {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/get-subscribers`, config)
    .then((res) => {
      if (res) {
        console.log(res.data)
        setSubscribers( res.data);
      } else {
        console.log(res.data.message);
  
      }
    })
    .catch((error) => {
      console.log('erri', error);
    });
  },[]);

  useEffect(()=> {
    axios.get(`${process.env.REACT_APP_BASE_API_URL}/sub-bill`, config)
    .then((res) => {
      if (res) {
        console.log('radasdsad', res.data)
        setBillList(res.data);
      } else {
        console.log(res.data.message);
  
      }
    })
    .catch((error) => {
      console.log('erri', error);
    });
  },[newData]);

  

  useEffect(()=> {
    (async()=> {
      await axios.post(`${process.env.REACT_APP_BASE_API_URL}/plan-sub-info`, { user_id: values.account},  config)
      .then((res) => {
        if (res) {
          console.log('res', res)
          setBills(res.data);
          setValues({ ...values, subscriber_id: res.data.id});
        } else {
          console.log(res.data.message);
    
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
    })()
  },[values.account]);
  
  
  const acceptPayment = async(id, action) => {
    setLoading(true);
    let route = 'update-bill';
    if(action === "reject") {
      route = 'reject-bill';
    }
     
    await axios.post(`${process.env.REACT_APP_BASE_API_URL}/${route}`, { bill_id: id},  config)
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
      if(!newData){
        setNewData(true)
       
      }
      else{
        setNewData(false)
       
      }
      setLoading(false)
    }, 5000);
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
        <Table sx={{ minWidth: 650, paddingTop: 0 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Account No.</TableCell>
              <TableCell>Fullname</TableCell>
              <TableCell>Month/Year</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Bill</TableCell>
              <TableCell align="center">Proof</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billList.map((list) => (
              <TableRow key={list.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {list.subscriber.account_no}
                </TableCell>
                <TableCell>{`${list.subscriber.user_subscriber.first_name} ${list.subscriber.user_subscriber.last_name}`}</TableCell>
                <TableCell>{`${list.month} ${list.year}`}</TableCell>
                <TableCell>{list.status == 2 ? <Tag color="green">Paid</Tag> : list.status == 1 ? <Tag color="orange">Verying</Tag> : list.status == 0?  <Tag color="red">Pending</Tag> :  <Tag color="red">Rejected</Tag>} </TableCell>
                <TableCell>{list.month} 30</TableCell>
                <TableCell>₱ {list.amount}</TableCell>
                {/* <TableCell align="center"><Button type="text"><EyeTwoTone style={{fontSize: 16}}/></Button></TableCell> */}
                <TableCell align="center"> 
                  <Image
                    width={30}
                    src={list.formatted_image_url}
                  />
                </TableCell>
                {/* <TableCell align="center"><CheckOutlined style={{color: '#1677ff', fontSize: 18}}/>&nbsp;&nbsp;&nbsp;&nbsp;<CloseOutlined  style={{color: '#1677ff',  fontSize: 18}}/> </TableCell> */}
                <TableCell align="center"> 
                  {loading?    
                    <Spin/> 
                    : 
                    <div>
                      <Button disabled={list.status == "0" ? true : list.status == "2"? true : false} onClick={()=> acceptPayment(list.id, 'accept')}type="text"><CheckOutlined style={{fontSize: 16, color: '#1677ff'}}/></Button>
                      <Button disabled={list.status == "0" ? true : list.status == "3"? true : false} onClick={()=> acceptPayment(list.id, 'reject')} type="text"><CloseOutlined  style={{fontSize: 16, color: '#1677ff'}}/></Button>
                    </div>
                  }
               
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal title="Add Bill" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
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
                          return <MenuItem value={subscriber.user_id}>{`${subscriber.account_no} - ${subscriber.user_subscriber.first_name} ${subscriber.user_subscriber.last_name}`}</MenuItem>;
                        })}
                      </Select>
                  </Stack>
                </Grid>
                { Object.keys(bill).length? 
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
                : 
                null
              }
                
              </Grid>
            </form>
          )}
        </Formik>
      </Modal>
 
    </MainCard>
  );
}

export default index;
