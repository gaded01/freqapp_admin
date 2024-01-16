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
import { Stack, IconButton, InputAdornment, InputLabel, OutlinedInput, FormHelperText, Select, MenuItem , ListItem, Alert, AlertTitle,Switch} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, Modal ,Tag} from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { EditOutlined, DeleteOutlined, EyeTwoTone } from '@ant-design/icons';

const initialValues = {
  mbps: '',
  price: ''
};

function index() {
  const [open, setOpen] = React.useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [planType, setPlanType] = useState([]);
  const [values, setValues] = useState(initialValues);
  const [newData, setNewData] = useState(false);
  const [action , setAction]  = useState("Add");
  const [exists , setExists] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleChanges = (e) => {
    const target = e.target;
    setValues({ ...values, [target.name]: target.value });
  };

  const handleOk = () => {
    console.log(values);
    setConfirmLoading(true);
    let route = 'add-plan-type';
    if(action == 'Edit') route = 'edit-plan-type';
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/${route}`, values, config)
      .then((res) => {
        if(res.data.status == 'exists') {
          setExists(true);
        }
        else {
          setNewData(true);
          setOpen(false);
          setValues(initialValues);
        }
        setConfirmLoading(false);
      })
      .catch((error) => {
        console.log('erri', error);
      });
  };

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/get-plan-type`, config)
      .then((res) => {
        // setLoading(false);
        if (res) {
          console.log(res.data);
          setPlanType(res.data);
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

  const handleCancel = () => {
    setValues(initialValues);
    setExists(false);
    setAction('Add');
    console.log('Clicked cancel button');
    setOpen(false);
  };

  // const openDisableModal = (plan) => {
  //   Modal.confirm({
  //       title: 'Confirmation',
  //       content: `Are you sure you want ${plan.status == 1 ? 'disable' : 'enable'} the ${plan.mbps} mbps plan with the price of ₱${plan.price}?`,
  //       onOk() {disableType(plan.id)},
  //       onCancel() {
  //         console.log('asdasd');
  //         setNewData(true);
  //       },
  //       footer: (_, { OkBtn, CancelBtn }) => (
  //         <>
  //           <CancelBtn />
  //           <OkBtn/>
  //         </>
  //       ),
  //   })
  // }

  const disableType = (id) =>{
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
    .post(`${process.env.REACT_APP_BASE_API_URL}/disable-plan-type`, {id : id}, config)
    .then((res) => {
      if (res) {
       console.log('res', res)
      }
      reloadData();
      setConfirmLoading(false);
    })
    .catch((error) => {
      console.log('err', error);
    });

  }
  
  const editPlan = (values) =>{
    console.log(values);
    setAction('Edit');
    showModal();
    setValues({
      ...values,
      id: values.id,
      mbps: values.mbps,
      price: values.price,
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
  return (
    <MainCard>
      <Grid container alignItems="center" justifyContent="space-between" pb={2}>
        <Typography variant="h5">Plan list</Typography>
        <Button type="primary" onClick={showModal}>
          Add Plan
        </Button>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, paddingTop: 0 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Plan Name</TableCell>
              <TableCell>Price (₱)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planType.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{row.mbps} mbps plan</TableCell>
                <TableCell>{'₱'+row.price + '.00'}</TableCell>
                <TableCell>{row.status == 1 ? <Tag color="green">Available</Tag> : <Tag color="red">Unavailable</Tag>}</TableCell>
                <TableCell align="center">
                  {' '}
                  <Switch
                      onChange={() => {
                        disableType(row.id);
                      }}
                      defaultChecked={row.status == 1 ? true : false}
                  />
                  <Button
                    // disabled={list.status == '0' ? true : list.status == '2' ? true : false}
                    onClick={() => editPlan(row)}
                    type="text"
                  >
                    <EditOutlined style={{ fontSize: 16, color: '#1677ff' }} />
                  </Button>
                  {/* <Button
                    // disabled={list.status == '0' ? true : list.status == '3' ? true : false}
                    onClick={() => openDeleteModal(row)}
                    type="text"
                  >
                    <DeleteOutlined style={{ fontSize: 16, color: '#1677ff' }} />
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal title={action == 'Add' ? 'Add Plan' : 'Edit Plan'} open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
        {exists? (
            
                  <Alert severity="error">
                    Added plan already  <strong>exist!</strong>
                  </Alert>
           
          ) : null}
        <Formik
          initialValues={{
            month: '',
            year: '',
            account_no: ''
          }}
          validationSchema={Yup.object().shape({
            month: Yup.string().max(255).required('First name is required'),
            year: Yup.string().max(255).required('Last name is required'),
            account_no: Yup.string().max(255).required('Address is required')
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              submitLogin(values);
              setStatus({ success: false });
              setSubmitting(true);
            } catch (err) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="mbps">Plan Mbps</InputLabel>
                    <OutlinedInput
                      id="mbps"
                      type="number"
                      value={values.mbps}
                      name="mbps"
                      onBlur={handleBlur}
                      onChange={handleChanges}
                      placeholder="Enter plan mbps"
                      fullWidth
                      error={Boolean(touched.plan_name && errors.plan_name)}
                    />
                    {touched.plan_name && errors.plan_name && (
                      <FormHelperText error id="standard-weight-helper-text-plan_name">
                        {errors.plan_name}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="price">Price</InputLabel>
                    <OutlinedInput
                      id="price"
                      type="price"
                      value={values.price}
                      name="price"
                      onBlur={handleBlur}
                      onChange={handleChanges}
                      placeholder="Enter price"
                      fullWidth
                      error={Boolean(touched.price && errors.price)}
                    />
                    {touched.price && errors.price && (
                      <FormHelperText error id="standard-weight-helper-text-name_name">
                        {errors.price}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                {errors.submit && (
                  <Grid item xs={12}>
                    <FormHelperText error>{errors.submit}</FormHelperText>
                  </Grid>
                )}
              </Grid>
            </form>
          )}
        </Formik>
      </Modal>
    </MainCard>
  );
}

export default index;
