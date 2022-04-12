import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useNavigate, useParams } from 'react-router-dom';
import { restClient, getImageUrl } from '../client/rest';
import { useEffect, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';

import dayjs from 'dayjs';

const lbToBr = (txt) => {
  return txt.split(/(\n)/g).map((t) => (t === '\n' ? <br /> : t));
};

export const Comment = (comment: Comment) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="body2">
        {comment.createdByName}({comment.createdByPrimaryGroupName})
      </Typography>
      <Typography variant="caption">
        {dayjs(comment.createdAt).format('YYYY/MM/DD HH:mm')}
      </Typography>
      <Typography variant="body2">{lbToBr(comment.value)}</Typography>
    </Box>
  );
};

interface Record {
  recordId: string;
  status: string;
  title: string;
  detail: string;
  categoryId: string;
  categoryName: string;
  applicationGroup: number;
  applicationGroupName: string;
  createdBy: number;
  createdByName: string;
  createdByPrimaryGroupName: string;
  createdAt: string;
  updatedAt: string;
  files: {
    itemId: number;
    name: string;
    data: string;
  }[];
}

interface Comment {
  commentId: string;
  value: string;
  createdBy: string;
  createdByName: string;
  createdByPrimaryGroupName: string;
  createdAt: string;
}

export const Detail = () => {
  const recordId = useParams().id;
  const [record, setRecord] = React.useState(undefined as Record | undefined);
  const [commentList, setCommentList] = React.useState([] as Comment[]);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [state, setState] = React.useState(0);

  const inputRef = useRef(undefined as any);

  useEffect(() => {
    (async () => {
      let r;
      try {
        r = await restClient.getRecord(`${recordId}`);
      } catch(e) {
        console.log('文書の取得に失敗しました');
        return;
      }

      for (const e of r.data.files) {
        try {
          const ri = await restClient.getFile(`${recordId}`, e.itemId, false);
          const type = e.name.split('.').pop();
          e.data = `data:image/${type};base64,${ri.data.data}`
        } catch (e) {
          console.log('添付ファイルの取得に失敗しました。')
          continue;
        }
      }
      setRecord(r.data);
      r = await restClient.getComments(`${recordId}`);
      if (r.status !== 200) {
        return;
      }
      setCommentList(r.data.items);
    })();
  }, [state]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const r = await restClient.postComments(`${recordId}`, { value: `${data.get('value')}` });
    } catch (e) {
      setSnackOpen(true);
      return;
    }
    inputRef.current.value = '';
    setState((prev) => prev + 1);
  };

  const handleClickClose = async () => {
    try {
      await restClient.updateRecord(`${recordId}`, { status: 'closed' });
    } catch (e) {
      setSnackOpen(true);
      return;
    }
    navigate(-1);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    console.log(id);
    navigate(`/browse/detail/${recordId}/items/${id}`);
  };

  const handleSnackClose = () => setSnackOpen(false);

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Button onClick={() => handleBack()}>
        <ArrowBackIosIcon />
        一覧に戻る
      </Button>
      <Container component="main" maxWidth="lg">
        {record === undefined ? (
          <></>
        ) : (
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Snackbar
              open={snackOpen}
              autoHideDuration={5000}
              onClose={handleSnackClose}
              message="文書更新に失敗しました。"
            />
            <Grid container justifyContent="flex-end">
              <Grid item xs={12} sm={3}>
                <Typography variant="h6" gutterBottom>
                  申請日: {dayjs(record.createdAt).format('YYYY年MM月DD日')}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="h4" gutterBottom>
              {record.title}
            </Typography>
            <Typography variant="overline">カテゴリ: {record.categoryName}</Typography>
            <Typography variant="overline">
              申請者: {record.createdByName}({record.createdByPrimaryGroupName})
            </Typography>
            <Typography variant="overline">申請部署: {record.applicationGroupName}</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" gutterBottom>
                    {lbToBr(record.detail)}
                  </Typography>
                </Grid>
                {record === undefined ? (
                  <></>
                ) : (
                  record.files.map((e) => {
                    return (
                      <Grid item xs={12}>
                        <img
                          src={e.data}
                          height="480"
                          width="auto"
                          alt=""
                          key={e.itemId}
                          onClick={(event) => handleClick(event, e.itemId)}
                        />
                      </Grid>
                    );
                  })
                )}
                <Grid item xs={12}>
                  <Box sx={{ mt: 3 }}>
                    <Grid container justifyContent="flex-end">
                      <Grid item xs={12} sm={2}>
                        {record.status === 'open' ? (
                          <Button
                            type="button"
                            onClick={handleClickClose}
                            fullWidth
                            variant="contained"
                            sx={{ mt: 6, mb: 2 }}
                          >
                            クローズ
                          </Button>
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    コメント
                  </Typography>
                </Grid>
                <Divider />
                <Grid item xs={11}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    id="value"
                    label="コメントを記入"
                    name="value"
                    rows={3}
                    inputRef={inputRef}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button type="submit" fullWidth variant="outlined">
                    発信
                  </Button>
                </Grid>
                {commentList.map((comment: Comment) => {
                  return (
                    <Grid key={comment.commentId} item xs={12}>
                      <Comment {...comment} />
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <Box sx={{ mt: 8 }}></Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
};
