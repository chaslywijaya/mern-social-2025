import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box // Tambahkan Box untuk padding di TabPanel
} from '@mui/material';
import FollowGrid from './FollowGrid'; // Pastikan path ini benar
import PostList from './../post/PostList'; // Sesuaikan jika nama file PostList Anda berbeda

// Ini adalah komponen helper untuk TabPanel. Pastikan ini ada di ProfileTabs.js Anda.
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// PropTypes untuk TabPanel
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

// Fungsi helper untuk accessibility props tab
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// Komponen utama ProfileTabs
export default function ProfileTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth" // Atau 'scrollable' jika banyak tab
          aria-label="profile tabs"
        >
          <Tab label="Posts" {...a11yProps(0)} />
          <Tab label="Following" {...a11yProps(1)} />
          <Tab label="Followers" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      {/* Tab Panel untuk Posts */}
      <TabPanel value={value} index={0}>
        <PostList posts={props.posts} removeUpdate={props.removePostUpdate}/>
      </TabPanel>

      {/* Tab Panel untuk Following */}
      <TabPanel value={value} index={1}>
        {/* INI ADALAH BAGIAN KRUSIAL YANG HARUS DIPASTIKAN BENAR */}
        {/* Pastikan props.user.following ada dan diteruskan ke FollowGrid */}
        {props.user && props.user.following ? (
          <FollowGrid people={props.user.following}/>
        ) : (
          <Typography variant="body1">No one followed yet.</Typography>
        )}
      </TabPanel>

      {/* Tab Panel untuk Followers */}
      <TabPanel value={value} index={2}>
        {/* PASTIKAN BAGIAN INI JUGA BENAR */}
        {/* Pastikan props.user.followers ada dan diteruskan ke FollowGrid */}
        {props.user && props.user.followers ? (
          <FollowGrid people={props.user.followers}/>
        ) : (
          <Typography variant="body1">No followers yet.</Typography>
        )}
      </TabPanel>
    </div>
  );
}

// PropTypes untuk ProfileTabs
ProfileTabs.propTypes = {
  user: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  removePostUpdate: PropTypes.func.isRequired
};