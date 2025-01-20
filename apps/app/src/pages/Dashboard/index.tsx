import CircularProgress from "@mui/material/CircularProgress";
import { Alert, Grid2 as Grid } from "@mui/material";
import useIntents from "../../hooks/useIntents";
import VerticalPercentBarChart from "../../components/VerticalBarChart";
import { useMemo } from "react";
import IntentsTable from "../../components/Table";


const Dashboard = () => {

  const { categories, isLoadingCategories, isErrorCategories, setCurrentCategory, intents, isLoadingIntents } = useIntents();
  const orderedCategories = useMemo(() => {
    return categories?.sort((a, b) => b.intentCount - a.intentCount) ?? [];
  }, [categories]);

  if (categories) return (<Grid spacing={2}>
    <Grid container size={{ xs: 7 }}>
      <VerticalPercentBarChart data={orderedCategories} handleBarClick={setCurrentCategory} />
    </Grid>
    <Grid container size={{ xs: 5 }}>
      {intents && !isLoadingIntents && <IntentsTable intents={intents} />}
      {isLoadingIntents && <CircularProgress />}
    </Grid>
  </Grid>)

  if(isErrorCategories) return <Alert variant="filled" severity="error">Error loading Categories.</Alert>
  if(isLoadingCategories) return  <CircularProgress />
  if(!isLoadingCategories && !isErrorCategories) return <Alert variant="filled" severity="warning">No Categories found.</Alert>
};

export default Dashboard;