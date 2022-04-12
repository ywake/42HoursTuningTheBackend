import * as React from 'react';
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import Box from '@mui/material/Box';

import { useNavigate, useParams } from 'react-router-dom';

import { useEffect } from 'react';
import { restClient } from '../client/rest';

export function ImgDetail() {
  const recordId = useParams().id;
  const itemId = useParams().itemId;
  const [src, setSrc] = React.useState('');
    const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const iId = Number(itemId);
      const ri = await restClient.getFile(`${recordId}`, iId, false);
      const type = ri.data.name.split('.').pop();
      setSrc(`data:image/${type};base64,${ri.data.data}`);
    })();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Button onClick={() => handleBack()}>
        <ArrowBackIosIcon />
        文書詳細に戻る
      </Button>
      <img src={src} alt=""></img>
  </>)
}