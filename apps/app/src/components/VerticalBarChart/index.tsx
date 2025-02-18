import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Category } from "../../types/intent";
import { Box } from "@mui/material";
import { useMemo } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  data: Category[];
  handleBarClick: (id: number) => void;
};

const VerticalBarChart = ({ data, handleBarClick }: Props) => {
  const { chartData, options } = useMemo(() => {
    const totalIntents = data.reduce((sum, item) => sum + item.intentCount, 0);
    const percentages = data.map(item => ({
      id: item.id,
      name: item.name,
      percentage: ((item.intentCount / totalIntents) * 100).toFixed(1),
    }));

    const chartData = {
      labels: percentages.map(item => item.name),
      datasets: [
        {
          label: "Intent Percentage",
          data: percentages.map(item => parseFloat(item.percentage)),
          backgroundColor: "rgba(75, 192, 192, 0.8)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          borderRadius: 5,
          hoverBackgroundColor: "rgba(75, 192, 192, 1)",
          barThickness: 20,
        },
      ],
    };

    const options: ChartOptions<"bar"> = {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      onClick: (_, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          handleBarClick(data[index]?.id);
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: context => {
              const percentage = context.parsed.x;
              return `${percentage}% (${data[context.dataIndex].intentCount} intents)`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            display: false,
          },
          max: 100,
          position: "bottom",
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#fff",
            font: {
              size: 12,
            },
          },
        },
      },
    };

    return { totalIntents, percentages, chartData, options };
  }, [data, handleBarClick]);

  return (
    <Box
      sx={{
        height: "90%",
        width: "100%",
        padding: 1,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(75, 192, 192, 0.8)",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "rgba(75, 192, 192, 1)",
        },
      }}
    >
      <div
        style={{
          minHeight: `${data.length * 30}px`,
          width: "100%",
          height: "100%",
        }}
      >
        <Bar data={chartData} options={options} />
      </div>
    </Box>
  );
};

export default VerticalBarChart;
