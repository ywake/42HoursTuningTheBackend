import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { RecordView } from '../component/RecordView';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  let viewId: 'tomeActive' | 'allActive' | 'allClosed' | 'mineActive' = 'tomeActive';

  switch (index) {
    case 1:
      viewId = 'allActive';
      break;
    case 2:
      viewId = 'allClosed';
      break;
    case 3:
      viewId = 'mineActive';
      break;
  }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <RecordView viewId={viewId} />
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const RecordList = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
              <Tab label="自分宛" {...a11yProps(0)} />
              <Tab label="全件" {...a11yProps(1)} />
              <Tab label="クローズ済み" {...a11yProps(2)} />
              <Tab label="自分が申請" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}></TabPanel>
          <TabPanel value={value} index={1}></TabPanel>
          <TabPanel value={value} index={2}></TabPanel>
          <TabPanel value={value} index={3}></TabPanel>
        </Container>
      </Box>
    </>
  );
};
