import MainCard from 'components/MainCard';
import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Stack, IconButton, InputAdornment, InputLabel, OutlinedInput, FormHelperText, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Button, Modal } from 'antd';
import { Formik } from 'formik';
import * as Yup from 'yup';

function index() {
  const [open, setOpen] = React.useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };



  function createBill(id, mbps, price) {
    return {id, mbps, price};
  }
  const billRows = [
   createBill('1', '50mbps Fiber Plan', '1200'),
   createBill('2', '50mbps Fiber Plan', '1200'),
  ];

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
              <TableCell>No.</TableCell>
              <TableCell>Plan Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billRows.map((row) => (
              <TableRow key={row.acc} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.mbps}</TableCell>
                <TableCell>{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal title="Add Plan" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
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
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="plan_name">Plan Name</InputLabel>
                    <OutlinedInput
                      id="plan_name"
                      type="plan_name"
                      value={values.plan_name}
                      name="plan_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter plan name"
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
                      onChange={handleChange}
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
