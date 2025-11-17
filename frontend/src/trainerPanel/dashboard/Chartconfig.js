export const getChartOptions = (includeScales = true) => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "rgba(107, 114, 128, 1)",
      },
    },
  },
  ...(includeScales && {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(107, 114, 128, 1)",
        },
      },
      x: {
        ticks: {
          color: "rgba(107, 114, 128, 1)",
        },
      },
    },
  }),
});

export const createMonthlyChartData = (chartData) => ({
  labels: chartData.labels,
  datasets: [
    {
      label: "Sessions per Month",
      data: chartData.data,
      borderColor: "rgb(16, 185, 129)",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
});

export const createStatusChartData = (chartData) => ({
  labels: chartData.labels,
  datasets: [
    {
      data: chartData.data,
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(34, 197, 94, 0.8)",
        "rgba(239, 68, 68, 0.8)",
      ],
      borderColor: [
        "rgb(59, 130, 246)",
        "rgb(34, 197, 94)",
        "rgb(239, 68, 68)",
      ],
      borderWidth: 2,
    },
  ],
});

export const createWeeklyChartData = (chartData) => ({
  labels: chartData.labels,
  datasets: [
    {
      label: "Sessions",
      data: chartData.data,
      backgroundColor: "rgba(16, 185, 129, 0.6)",
      borderColor: "rgba(16, 185, 129, 1)",
      borderWidth: 2,
    },
  ],
});
