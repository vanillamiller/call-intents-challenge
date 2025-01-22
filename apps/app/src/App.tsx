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
          padding: 1,
          margin: 0,
        }}
      >
        <h1 style={{ color: 'white' }}>Call Intents Challenge</h1>
        <Dashboard />
      </Box>
    </QueryClientProvider>
  );
}

export default App;
