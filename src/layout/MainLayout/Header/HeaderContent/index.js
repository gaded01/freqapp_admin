// material-ui
import { Box, useMediaQuery } from '@mui/material';
// import { GithubOutlined } from '@ant-design/icons';
import { useRef, useState, useContext, useEffect } from 'react';

// project import
import Search from './Search';
import Profile from './Profile';
// import Notification from './Notification';
import MobileSection from './MobileSection';
import { MyUserContext } from '../../../../context/UserContext';
// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = ({}) => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));
  let { user } = useContext(MyUserContext);

  useEffect(()=> {
    console.log('user', user) 
  },[])

  return (
    <>
      {!matchesXs && <Search />}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      {/* <IconButton
        component={Link}
        href="https://github.com/codedthemes/mantis-free-react-admin-template"
        target="_blank"
        disableRipple
        color="secondary"
        title="Download Free Version"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton> */}

      {/* <Notification /> */}
      {!matchesXs && <Profile user={user} />}
      {/* {matchesXs && <MobileSection />} */}
    </>
  );
};

export default HeaderContent;
