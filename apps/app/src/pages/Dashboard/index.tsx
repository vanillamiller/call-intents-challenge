import CircularProgress from "@mui/material/CircularProgress";
import { Alert, Box, Grid2, Typography } from "@mui/material";
import VerticalPercentBarChart from "../../components/VerticalBarChart";
import useCategories from "../../hooks/useCatategories";
import IntentsTable from "../../components/Table";

const Dashboard = () => {
  const {
    orderedCategories,
    isLoadingCategories,
    isErrorCategories,
    setCurrentCategoryId,
    intents,
    isErrorIntents,
    isLoadingIntents,
  } = useCategories();

  if (orderedCategories)
    return (
      <Grid2 container spacing={4} sx={{ height: "100%" }}>
        <Grid2 size={6}>
          <Box
            sx={{
              padding: 1,
              borderRadius: 4,
              borderStyle: "solid",
              borderColor: "#3C9A9A",
              borderWidth: 2,
              height: "600px",
              overflow: "hidden"
            }}
          >
            <Typography variant="h4" color="#3C9A9A" marginBottom={4}>
              Intent Categories
            </Typography>
            <VerticalPercentBarChart
              data={orderedCategories}
              handleBarClick={id => setCurrentCategoryId(id)}
            />
          </Box>
        </Grid2>
        <Grid2 size={6}>
          <Box
            sx={{
              padding: 1,
              borderRadius: 4,
              borderStyle: "solid",
              borderColor: "#3C9A9A",
              borderWidth: 2,
              height: "600px",
            }}
          >
            {intents && (
              <IntentsTable {...{ intentResponse: intents, isErrorIntents, isLoadingIntents }} />
            )}
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
