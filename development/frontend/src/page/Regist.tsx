import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { restClient } from '../client/rest';

import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect } from 'react';

const theme = createTheme();

interface FileInfo {
  fileId: string;
  thumbFileId: string;
  name: string;
}

export const Regist = () => {
  const [categories, setCategories] = React.useState({ loading: { name: '読み込み中' } });
  const [modalOpen, setModalOpen] = React.useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState('loading');

  const [fileList, setFileList] = React.useState([] as FileInfo[]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const r = await restClient.getCategories();
      if (r.status !== 200) {
        return;
      }
      setCategories(r.data?.items);
    })();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log(data);

    const categoryIdNum = Number(categoryId);

    if (categoryId === 'loading' || Number.isNaN(categoryId)) {
      setSnackOpen(true);
      return;
    }

    const param = {
      title: `${data.get('title')}`,
      detail: `${data.get('detail')}`,
      categoryId: categoryIdNum,
      fileIdList: fileList.map((e) => {
        return {
          fileId: e.fileId,
          thumbFileId: e.thumbFileId,
        };
      }),
    };

    console.log(param);

    try {
      await restClient.postRecords(param);
    } catch(e) {
      setSnackOpen(true);
      return;
    }

    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate('/regist/ok');
  };

  const handleSnackClose = () => setSnackOpen(false);

  const handleChange = (event: any) => {
    setCategoryId(event.target.value);
  };

  const handleChangeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target === null || event.target.files === null || event.target.files.length === 0) {
      return;
    }
    console.log(event.target.files.length);

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      if (!reader.result) {
        return;
      }
      const dataBase64 = (reader.result as string).split(',')[1];
      console.log(dataBase64);

      let r;
      try {
        r = await restClient.postFiles({ name: file.name, data: dataBase64 });
      } catch(e) {
        setSnackOpen(true);
        return;
      }

      const newFileId = r.data.fileId;
      const newThumbFileId = r.data.thumbFileId;
      setFileList([
        ...fileList,
        { fileId: newFileId, name: file.name, thumbFileId: newThumbFileId },
      ]);

      console.log(newFileId);
      console.log(reader.result);
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              申請が完了しました。
            </Typography>
          </Box>
        </Modal>
        <Snackbar
          open={snackOpen}
          autoHideDuration={5000}
          onClose={handleSnackClose}
          message="文書登録に失敗しました。"
        />
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField required fullWidth id="title" label="件名" name="title" />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">カテゴリーを選択</InputLabel>
                  {(() => {
                    const menuItems: JSX.Element[] = [];
                    console.log(categories);
                    for (const key of Object.keys(categories)) {
                      menuItems.push(
                        <MenuItem key={key} value={key}>{`${categories[key].name}`}</MenuItem>,
                      );
                    }
                    return (
                      <Select
                        required
                        id="categoryId"
                        value={categoryId}
                        label="カテゴリーを選択"
                        onChange={handleChange}
                      >
                        {menuItems}
                      </Select>
                    );
                  })()}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  id="detail"
                  label="詳細"
                  name="detail"
                  rows={5}
                />
              </Grid>
              <Grid item xs={12}>
                {fileList.map((e) => {
                  return (
                    <Typography variant="caption">
                      {e.name}
                      <br />
                    </Typography>
                  );
                })}
                <Button component="label" fullWidth variant="outlined">
                  画像を添付
                  <Box sx={{ display: 'none' }}>
                    <input accept="image/*" type="file" onChange={handleChangeFile} />
                  </Box>
                </Button>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item xs={12} sm={2}>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  申請
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
