import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { restClient, getImageUrl } from '../client/rest';
import Snackbar from '@mui/material/Snackbar';
import Skeleton from '@mui/material/Skeleton';

import dayjs from 'dayjs';

interface Data {
  recordId: string;
  title: string;
  applicationGroupName: string;
  createdByName: string;
  createdAt: string;
  commentCount: number;
  updatedAt: number;
  isUnConfirmed: number;
  thumbNailItemId: number;
  thumbNailData: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: '件名',
  },
  {
    id: 'applicationGroupName',
    numeric: false,
    disablePadding: false,
    label: '申請部署',
  },
  {
    id: 'createdByName',
    numeric: false,
    disablePadding: false,
    label: '申請者',
  },
  {
    id: 'createdAt',
    numeric: false,
    disablePadding: false,
    label: '申請日',
  },
  {
    id: 'commentCount',
    numeric: false,
    disablePadding: false,
    label: 'コメント数',
  },
  {
    id: 'updatedAt',
    numeric: false,
    disablePadding: false,
    label: '最終更新日',
  },
];

function EnhancedTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <></>
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface RecordViewParam {
  viewId: 'tomeActive' | 'allActive' | 'allClosed' | 'mineActive';
}

export function RecordView(param: RecordViewParam) {
  const rowsPerPage = 10;
  const [rows, setRows] = React.useState([] as Data[]);
  const [count, setCount] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let r;
      try {
        switch (param.viewId) {
          case 'tomeActive':
            r = await restClient.tomeActive({ limit: rowsPerPage, offset: 10 * page });
            break;
          case 'allActive':
            r = await restClient.allActive({ limit: rowsPerPage, offset: 10 * page });
            break;
          case 'allClosed':
            r = await restClient.allClosed({ limit: rowsPerPage, offset: 10 * page });
            break;
          case 'mineActive':
            r = await restClient.mineActive({ limit: rowsPerPage, offset: 10 * page });
            break;
        }
      } catch(e) {
        setSnackOpen(true);
        return;
      }
      console.log(r.data.items);
      for (const l of r.data.items) {
        let ri;
        try {
          ri = await restClient.getFile(`${l.recordId}`, l.thumbNailItemId, true);
        } catch (e) {
          l.thumbNailData = '';
          continue;
        }
        const type = ri.data.name.split('.').pop();
        l.thumbNailData = `data:image/${type};base64,${ri.data.data}`
      }
      setRows(r.data.items);
      setCount(r.data.count);
      setLoading(false);
    })();
  }, [page]);

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    console.log(id);
    navigate(`/browse/detail/${id}`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleSnackClose = () => setSnackOpen(false);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Snackbar
          open={snackOpen}
          autoHideDuration={5000}
          onClose={handleSnackClose}
          message={`一覧の取得に失敗しました。(${param.viewId})`}
      />
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ m: 1 }} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead />
            <TableBody>
              { !loading ?
                rows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.recordId)}
                      tabIndex={-1}
                      key={row.recordId}
                    >
                      <TableCell>
                        <img
                          src={row.thumbNailData}
                          width="60"
                          height="60"
                          alt=""
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        sx={row.isUnConfirmed ? { fontWeight: 'bold' } : {}}
                      >
                        {row.title}
                      </TableCell>
                      <TableCell align="left" sx={row.isUnConfirmed ? { fontWeight: 'bold' } : {}}>
                        {row.applicationGroupName}
                      </TableCell>
                      <TableCell align="left" sx={row.isUnConfirmed ? { fontWeight: 'bold' } : {}}>
                        {row.createdByName}
                      </TableCell>
                      <TableCell align="left" sx={row.isUnConfirmed ? { fontWeight: 'bold' } : {}}>
                        {dayjs(row.createdAt).format('YYYY/MM/DD')}
                      </TableCell>
                      <TableCell align="right" sx={row.isUnConfirmed ? { fontWeight: 'bold' } : {}}>
                        {row.commentCount}
                      </TableCell>
                      <TableCell align="left" sx={row.isUnConfirmed ? { fontWeight: 'bold' } : {}}>
                        {dayjs(row.updatedAt).format('YYYY/MM/DD HH:mm')}
                      </TableCell>
                    </TableRow>
                  );
                })
                :
                  <TableRow
                  >
                    <TableCell>
                    <Skeleton variant="rectangular"/>
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      padding="none"
                      sx={{}}
                    >
                      <Skeleton variant="rectangular"/>
                    </TableCell>
                    <TableCell align="left" >
                      <Skeleton variant="rectangular"/>
                    </TableCell>
                    <TableCell align="left" >
                      <Skeleton variant="rectangular"/>
                    </TableCell>
                    <TableCell align="left" >
                      <Skeleton variant="rectangular"/>
                    </TableCell>
                    <TableCell align="right" >
                      <Skeleton variant="rectangular"/>
                    </TableCell>
                    <TableCell align="left" >
                      <Skeleton variant="rectangular"/>
                    </TableCell>
                  </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}
