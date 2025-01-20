import { useQuery } from "@tanstack/react-query"
import intentsClient from "../../client";
import CircularProgress from "@mui/material/CircularProgress";
import { Category } from "../../types/intent";
import { BarChart } from "@mui/x-charts";
import { Box, Typography } from "@mui/material";
import Stack from '@mui/material/Stack';
type Props = {
    data: Pick<Category, "intentCount" | "name">[]
}

const chartSetting = {
    width: 500,
    height: 400,
};

const VerticalBarChart = ({ data }: Props) => {
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h6" gutterBottom>
                Monthly Sales Data
            </Typography>
            <BarChart
                xAxis={[{ scaleType: 'band', dataKey: "intentCount", label: "Intents" }]}
                yAxis={[{ scaleType: 'band', dataKey: "name", label: "Category" }]}
                series={[{ dataKey: "sales", label: "Sales" }]}
                dataset={data}
                layout="horizontal"
                {...chartSetting}
            />
        </Box>
    );
};
const Dashboard = () => {

    const { data, isLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await intentsClient.get<Category[]>("/categories");
            console.log(data);
            return data;
        }
    });

    return (
        <Box height={"100%"} width={"100%"}>
            <Stack direction="row" justifyContent="space-between" sx={{ width: "100%", height: "100%" }}>
                {isLoading && <CircularProgress />}
                {data && <VerticalBarChart data={data} />}
                {!data && !isLoading && <Typography>No data</Typography>}
            </Stack>
        </Box>
    )
};

export default Dashboard;