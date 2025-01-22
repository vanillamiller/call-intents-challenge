import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import { Intent, IntentsApiResponse } from '../../types/intent';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';


type Props = {
  intentResponse: IntentsApiResponse;
  isLoadingIntents: boolean;
  isErrorIntents: boolean;
}

const columns: GridColDef<Intent>[] = [
  { field: "intent", headerName: "Intent", flex: 2 },
  { field: "date", headerName: "Time", flex: 1 },
]

const IntentsTable = ({ intentResponse, isLoadingIntents, isErrorIntents }: Props) => {
  const { intents, name } = useMemo(() => {
    const { intents, name } = intentResponse;
    return { intents, name }
  }, [intentResponse]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      padding: 1,
    }}>
      <Typography variant='h4' color='#3C9A9A' marginBottom={4}>{name}</Typography>
      {!isLoadingIntents && !isErrorIntents && <DataGrid rows={intents} columns={columns} disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        sx={{
          color: "white",
          "& .MuiDataGrid-cell": {
            color: "white"
          },
          "& .MuiDataGrid-columnHeader": {
            color: "white",
            backgroundColor: "black"
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "black"
          },
          "& .MuiDataGrid-footerContainer": {
            color: "white"
          },
          "& .MuiTablePagination-root": {
            color: "white"
          },
          "& .MuiTablePagination-selectIcon": {
            color: "white"
          },
          "& .MuiTablePagination-actions": {
            color: "white"
          },
          "& .MuiButtonBase-root": {
            color: "white"
          }
        }} />}
        {isLoadingIntents && <CircularProgress />}
    </Box>
  );
};

export default IntentsTable;