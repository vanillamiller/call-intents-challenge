import CircularProgress from "@mui/material/CircularProgress";
import { Alert, Box, Grid2 as Grid } from "@mui/material";
import useIntents from "../../hooks/useIntents";
import VerticalPercentBarChart from "../../components/VerticalBarChart";
import { useMemo } from "react";


const Dashboard = () => {

  const { categories, isLoadingCategories, isErrorCategories } = useIntents();
  const orderedCategories = useMemo(() => {
    return categories?.sort((a, b) => b.intentCount - a.intentCount) ?? [];
  }, [categories]);

  return (
    <Box sx={{ backgroundColor: "black", minHeight: '100vh', padding: 0, margin: 0 }}>
      {categories && <Grid container spacing={2}>
        <Grid size={7}>
          <VerticalPercentBarChart data={orderedCategories} />
        </Grid>
      </Grid>}
      {isErrorCategories && <Alert variant="filled" severity="error">Error loading Categories.</Alert>}
      {isLoadingCategories && <CircularProgress />}
      {!categories?.length && !isLoadingCategories && !isErrorCategories && <Alert variant="filled" severity="warning">No Categories found.</Alert>}
    </Box>
  )
};

export default Dashboard;