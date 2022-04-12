import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Box from '@mui/material/Box';

import Toolbar from '@mui/material/Toolbar';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { RecordList } from './page/RecordList';
import { Regist } from './page/Regist';
import { Detail } from './page/Detail';
import { ImgDetail } from './page/ImgDetail';

import { MainBar } from './component/MainBar';
import { LeftMenuDrawer } from './component/LeftMenuDrawer';

const mdTheme = createTheme();



function Content() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MainBar toggleDrawer={toggleDrawer} open={open} />
      <LeftMenuDrawer toggleDrawer={toggleDrawer} open={open} />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/regist" element={<Regist />} />
          <Route path="/browse/list" element={<RecordList />} />
          <Route path="/browse/detail/:id" element={<Detail />} />
          <Route path="/browse/detail/:id/items/:itemId" element={<ImgDetail />} />
          <Route path="/regist/ok" element={<Navigate to="/regist" />} />
        </Routes>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={mdTheme}>
        <Content />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
