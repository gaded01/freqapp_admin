import { useState, useEffect } from 'react';
import axios from 'axios';
//material-ui
import { Box, Button, Grid, Stack, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';

// project import
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import MainCard from 'components/MainCard';
import {Tag, Image, Spin } from 'antd';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { FormControl, InputLabel, MenuItem, Select } from '../../../node_modules/@mui/material/index';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [value, setValue] = useState('today');
  const [filterLoc, setFilterLoc] = useState(null);
  const [slot, setSlot] = useState('month');
  const [data, setData] = useState({});
  const [dueDateBill, setDueDateBill] = useState([]);
  const [paidBill, setPaidBill] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [consumption, setConsumption] = useState([]);
  const [income, setIncome] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/data-consumption`, config)
      .then((res) => {
        if (res) {
          console.log('map', res.data);
          setConsumption(res.data?.data_consumption);
          setIncome(res.data?.income);
          setData(res.data);
          setLocation(res.data.location);
          populatePlanTypes();
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
  }, []);

  
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/due-date-bill`, config)
      .then((res) => {
        if (res) {
          console.log('map222', res.data);
          setDueDateBill(res.data.bills);
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
  }, []);

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/paid-bill`, config)
      .then((res) => {
        if (res) {
          setPaidBill(res.data.paid_bills);
        }
      })
      .catch((error) => {
        console.log('erri', error);
      });
  }, []);



  const populatePlanTypes = async () => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .get(`${process.env.REACT_APP_BASE_API_URL}/get-plan-type`, config)
      .then((res) => {
        if (res) {
          console.log('plan type', res.data);
          setPlanTypes(res.data);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('err', error);  
      });
  };

  const filterSubLocation = (e) => {
    const target = e.target;
    // setFilterLoc(target.value);
    // console.log('target value', target.value)
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/filter-subsloc`, {plan_id: target.value} , config)
      .then((res) => {
        if (res) {
          console.log('result', res);
          setLocation(res.data)
          setFilterLoc(target.value);
        } else {
          console.log(res.data.message);
        }
      })
      .catch((error) => {
        console.log('err', error);
      });
  };

  const customIcon1 = new Icon({
    iconUrl: require('../../assets/images/icons/location-pin-orange.png'),
    iconSize: [35, 35]
  });
  const customIcon2 = new Icon({
    iconUrl: require('../../assets/images/icons/location-pin-blue.png'),
    iconSize: [35, 35]
  });
  const customIcon3 = new Icon({
    iconUrl: require('../../assets/images/icons/location-pin-red.png'),
    iconSize: [35, 35]
  });
  const customIcon4 = new Icon({
    iconUrl: require('../../assets/images/icons/location-pin-purple.png'),
    iconSize: [35, 35]
  });
  const customIcon5 = new Icon({
    iconUrl: require('../../assets/images/icons/location-pin-lightblue.png'),
    iconSize: [35, 35]
  });

  const position = [11.158384, 124.991888];

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Annual Income" count={'₱ ' + data?.annual_income?.amount + '.00'} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Month Income" count={'₱ ' + data?.month_income?.amount + '.00'} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Pending Bill" count={data?.pending_income} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Subscriber" count={data?.subscriber} />
      </Grid>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Average Data Usage</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} consumptions={consumption} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Monthly Income</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                This Month Income
              </Typography>
              <Typography variant="h3">₱ {data?.month_income?.amount + '.00'}</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart incomes={income} />
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={9}>
            <Typography variant="h5">Subscriber Location</Typography>
          </Grid>
          <Grid item xs={3}>
            <Stack spacing={1}>
              <FormControl fullWidth>
                <InputLabel htmlFor="plan_type_id">Filter Plan Type</InputLabel>
                <Select label="Type of Plan" id="plan_type_id" name="plan_type_id" value={filterLoc} onChange={filterSubLocation}>
                  {planTypes
                    ? planTypes.map((planType) => (
                        <MenuItem disabled={planType.status == 1 ? false : true} key={planType.id} value={planType.id}>
                          {planType.mbps} mbps plan
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { location.length
              ? location.map((loc) => {
                  return (
                    <Marker
                      position={[loc.lat, loc.lon]}
                      icon={
                        loc.user.subscriber.plan_type?.id == 15
                          ? customIcon1
                          : loc.user.subscriber.plan_type?.id == 16
                          ? customIcon2
                          : loc.user.subscriber.plan_type?.id == 17
                          ? customIcon3
                          : loc.user.subscriber.plan_type?.id == 18
                          ? customIcon4
                          : loc.user.subscriber.plan_type?.id == null
                          ? customIcon5
                          : customIcon5
                      }
                    >
                      <Popup>
                        <Typography style={{ textTransform: 'capitalize' }}>
                          {loc.user?.first_name} {loc.user?.last_name}
                        </Typography>{' '}
                        {loc.user?.subscriber.plan_type?.mbps} mbps
                      </Popup>
                    </Marker>
                  );
                })
              : null }
          </MapContainer>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Outstanding Bills</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
          <TableContainer>
            <Table sx={{ minHeight: 450 ,minWidth: 650, paddingTop: 0 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Subscriber</TableCell>
                  <TableCell align="left">Month/Year</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Due Date</TableCell>
                  <TableCell align="left">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dueDateBill.length ? (
                  dueDateBill.map((list) => (
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
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Paid Month Bills</Typography>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
          <TableContainer>
            <Table sx={{ minHeight: 450 ,minWidth: 650, paddingTop: 0 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Subscriber</TableCell>
                  <TableCell align="left">Month/Year</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Bill</TableCell>
                  <TableCell align="center">Proof</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paidBill.length ? (
                  paidBill.map((list) => (
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
          </Box>
        </MainCard>
      </Grid>
    </Grid>





  );
};
export default DashboardDefault;
