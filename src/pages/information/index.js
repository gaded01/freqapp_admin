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


  function createBill(id, bank, number, name) {
    return {id, bank, number ,name};
  }
  const billRows = [
   createBill('1', 'GCash', '09569189201', 'Karl Requerta'),
   createBill('2', 'Paymaya', '09569189123', 'Rose Marie Agaron'),
  ];

  return (
    <MainCard>
      <Grid container alignItems="center" justifyContent="space-between" pb={2}>
        <Typography variant="h5">Payment Information</Typography>
        <Button type="primary" onClick={showModal}>
          Add Payment
        </Button>
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, paddingTop: 0 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Bank/Wallet Name</TableCell>
              <TableCell>Account Number</TableCell>
              <TableCell>Name of the Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billRows.map((row) => (
              <TableRow key={row.acc} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.bank}</TableCell>
                <TableCell>{row.number}</TableCell>
                <TableCell>{row.name}</TableCell>
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
                <Grid item xs={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="first_name">First Name</InputLabel>
                    <OutlinedInput
                      id="first_name"
                      type="first_name"
                      value={values.first_name}
                      name="first_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      fullWidth
                      error={Boolean(touched.first_name && errors.first_name)}
                    />
                    {touched.first_name && errors.first_name && (
                      <FormHelperText error id="standard-weight-helper-text-first_name">
                        {errors.first_name}
                      </FormHelperText>
                    )}
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
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      fullWidth
                      error={Boolean(touched.last_name && errors.last_name)}
                    />
                    {touched.last_name && errors.last_name && (
                      <FormHelperText error id="standard-weight-helper-text-name_name">
                        {errors.last_name}
                      </FormHelperText>
                    )}
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
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                    />
                    {touched.address && errors.address && (
                      <FormHelperText error id="standard-weight-helper-text-address">
                        {errors.address}
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
