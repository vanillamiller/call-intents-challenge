import CircularProgress from '@mui/material/CircularProgress';
import { Alert, Box, Grid2 } from '@mui/material';
import VerticalPercentBarChart from '../../components/VerticalBarChart';
import { useMemo } from 'react';
import useCategories from '../../hooks/useCatategories';
import IntentsTable from '../../components/Table';

const Dashboard = () => {
  const {
    categories,
    isLoadingCategories,
    isErrorCategories,
    setCurrentCategory,
    intents,
    isErrorIntents,
    isLoadingIntents
  } = useCategories();

  const orderedCategories = useMemo(() => {
    return categories?.sort((a, b) => b.intentCount - a.intentCount) ?? [];
  }, [categories]);

  if (categories)
    return (
      <Grid2 container spacing={4} sx={{ height: "100%" }}>
        <Grid2 size={6}>
          <Box sx={{
            padding: 1,
            borderRadius: 4,
            borderStyle: "solid",
            borderColor: "#3C9A9A",
            borderWidth: 2,
            height: "600px",
            overflowY: "auto",
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(75, 192, 192, 0.8)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: 'rgba(75, 192, 192, 1)',
            },
          }}>
            <VerticalPercentBarChart data={orderedCategories} handleBarClick={setCurrentCategory} />
          </Box>
        </Grid2>
        <Grid2 size={6}>
          <Box sx={{
            padding: 1,
            borderRadius: 4,
            borderStyle: "solid",
            borderColor: "#3C9A9A",
            borderWidth: 2,
            height: "600px",
          }}>
            {intents && <IntentsTable {...{ intentResponse: intents, isErrorIntents, isLoadingIntents }} />}
          </Box>
        </Grid2>
      </Grid2>
    );

  if (isErrorCategories)
    return (
      <Alert variant="filled" severity="error">
        Error loading Categories.
      </Alert>
    );
  if (isLoadingCategories) return <CircularProgress />;
  if (!isLoadingCategories && !isErrorCategories)
    return (
      <Alert variant="filled" severity="warning">
        No Categories found.
      </Alert>
    );
};

export default Dashboard;
