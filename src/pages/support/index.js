import MainCard from 'components/MainCard';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import { SendOutlined } from '@ant-design/icons';
import { Button, Modal, Spin, Tag, Badge } from 'antd';
import message from 'assets/images/users/message.png';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  chatSection: {
    width: '100%',
    height: '80vh'
  },
  headBG: {
    backgroundColor: '#e0e0e0'
  },
  borderRight500: {
    borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    textAlign: 'left'
  },
  containerRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end',
    textAlign: 'right'
  },
  position: {
    backgroundColor: '#e0e0e0',
    width: 'auto',
    padding: '.5rem 1rem ',
    borderRadius: '10px'
  },
  positionRight: {
    backgroundColor: '#1890ff',
    width: 'auto',
    padding: '.5rem 1rem ',
    borderRadius: '10px',
    color: '#FFF'
  }
});

function index() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [convos, setConvo] = useState([]);
  const [input, setInput] = useState('');
  const [selectedUser, setSelectedUser] = useState({});
  const [searchInput, setSearchInput] = useState();

  useEffect(() => {
    (async () => {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      setLoading(true);
      await axios
        .post(`${process.env.REACT_APP_BASE_API_URL}/get-conversations`, {} , config)
        .then((res) => {
          console.log(res);
          setConvo(() => res.data.convos);
        })
        .catch((err) => {
          console.log('err', err);
        });
      setLoading(false);
    })();
  }, []);

  const viewMessage = async (id, convo) => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    setLoading(true);
    await axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/get-messages-ad`, { user_id: id }, config)
      .then((res) => {
        setUser(res.data.admin_id);
        setMessages(res.data.convo);
        setSelectedUser(convo);
        console.log('set', convo);
      })
      .catch((err) => {
        console.log('err', err);
      });
    setLoading(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setInput(value);
  };

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchInput(value);
  };

  const searchConvo = async (e) => {
    if (e.keyCode == 13) {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      };
      setLoading(true);
      await axios
        .post(`${process.env.REACT_APP_BASE_API_URL}/search-convo`, { search: searchInput }, config)
        .then((res) => {
          console.log(res);
          setConvo(() => res.data);
        })
        .catch((err) => {
          console.log('err', err);
        });
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
    setLoading(true);
    await axios
      .post(`${process.env.REACT_APP_BASE_API_URL}/save-message-ad`, { user_id: selectedUser.user_id, message: input }, config)
      .then((res) => {
        setMessages((messages) => [
          ...messages,
          {
            user_id: res.data.message.user_id,
            formatted_time: res.data.message.formatted_time,
            message: res.data.message.message
          }
        ]);
        setInput('');
      })
      .catch((err) => {
        console.log('err', err);
      });
    setLoading(false);
  };

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Customer Support
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            {Object.keys(selectedUser).length ? (
              <ListItem button key={selectedUser.id}>
                <ListItemIcon>
                  <Avatar
                    alt={`${selectedUser.user_subscriber.first_name}`}
                    src="https://www.flaticon.com/free-icon/user_149071?term=user+avatar&page=1&position=2&origin=tag&related_id=149071"
                  />
                </ListItemIcon>
                <Grid container sx={{ marginLeft: '.75rem' }}>
                  <Grid item xs={12}>
                    <Typography>{`${selectedUser.user_subscriber.first_name} ${selectedUser.user_subscriber.last_name}`}</Typography>
                    {/* <Typography sx={{color: '#b3b3b3'}}>{`${selectedUser.contact_number}`}</Typography> */}
                    <Tag sx={{ borderRadius: '10px' }} color="green">
                      Subscriber
                    </Tag>
                  </Grid>
                  <Grid item xs={12}></Grid>
                </Grid>
              </ListItem>
            ) : null}
          </List>
          <Divider />
          <Grid item xs={12} style={{ padding: '10px' }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              onKeyDown={searchConvo}
              onChange={handleSearchInput}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Divider />
          {convos.length ?
          <List>
           {convos.map((convo) => (
              <ListItem button key={convo.id} onClick={() => viewMessage(convo.user_id, convo)}>
                <ListItemIcon>
                  <Avatar
                    alt={`${convo.user_subscriber.first_name}`}
                    src="https://www.flaticon.com/free-icon/user_149071?term=user+avatar&page=1&position=2&origin=tag&related_id=149071"
                  />
                </ListItemIcon>
                <Grid container sx={{ marginLeft: '.75rem' }}>
                  <Grid item xs={12}>
                    <Typography>{`${convo.user_subscriber.first_name} ${convo.user_subscriber.last_name}`}</Typography>
                    <Typography sx={{ color: '#b3b3b3' }}>{`${convo.last_message}`}</Typography>
                  </Grid>
                  <Grid item xs={12}></Grid>
                </Grid>
              </ListItem>
            ))
          }
          </List>
          :
          <Grid item sx={{ textAlign: 'center', display: 'flex', height: '100%', alignItems:'center', justifyContent: 'center' }}>
            <Typography sx={{color: 'gray'}}>No conversation found!</Typography>
          </Grid>
          }
        </Grid>
        {/* {list of message} */}
        <Grid item xs={9}>
          <List className={classes.messageArea}>
            {messages.length ? (
              messages.map((message) => (
                <ListItem key={message.id}>
                  <Grid container>
                    <Grid className={message.user_id != user ? classes.container : classes.containerRight} item xs={12}>
                      <Typography className={message.user_id != user ? classes.position : classes.positionRight}>
                        {message.message}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <ListItemText align={message.user_id != user ? 'left' : 'right'} secondary={`${message.formatted_time}`} />
                    </Grid>
                  </Grid>
                </ListItem>
              ))
            ) : (
              <Grid container sx={{ alignItems: 'center', justifyContent: 'center', height: 'inherit' }}>
                <Grid item sx={{ textAlign: 'center' }}>
                  <Spin />
                  <Typography sx={{color: 'gray'}}>Inbox is empty. Please select a user to view message</Typography>
                </Grid>
              </Grid>
            )}
          </List>
          <Divider />
          <Grid container style={{ padding: '15px' }}>
            <Grid item xs={11}>
              <TextField id="outlined-basic-email" label="Enter your message" fullWidth onChange={handleChange} value={input} />
            </Grid>
            <Grid xs={1} align="center">
              <Button size="large" type="primary" icon={<SendOutlined />} loading={false} onClick={() => sendMessage()} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default index;
