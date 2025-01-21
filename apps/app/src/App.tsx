import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Box from '@mui/material/Box';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Box
        sx={{
          backgroundColor: 'black',
          minHeight: '100vh',
          padding: 8,
          margin: 0,
        }}
      >
          <Dashboard />
      </Box>
    </QueryClientProvider>
  );
}

export default App;
