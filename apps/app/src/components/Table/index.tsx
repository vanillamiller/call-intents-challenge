import {
  Box,
  Typography
} from '@mui/material';
import { Intent, IntentsApiResponse } from '../../types/intent';
import { DataGrid, GridColDef } from '@mui/x-data-grid';


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
  const { intents, name } = intentResponse;

  return (
    <Box sx={{
      display: 'flex',  // Add this
      flexDirection: 'column',  // Add this
    }}>
      <Typography variant='h4' color='#3C9A9A'>{name}</Typography>
      <DataGrid rows={intents} columns={columns} disableRowSelectionOnClick
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
            backgroundColor: "black"  // Add this line
          },
          "& .MuiDataGrid-columnHeaders": {  // Add this block
            backgroundColor: "black"
          },
          "& .MuiDataGrid-footerContainer": {
            color: "white"
          },
          // Add these styles for pagination
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
        }} />
    </Box>
  );
};

export default IntentsTable;