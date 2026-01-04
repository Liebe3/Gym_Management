export const getChartOptions = (includeScales = true) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        color: "rgba(107, 114, 128, 1)",
        font: {
          size: 12,
        },
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
        grid: {
          color: "rgba(229, 231, 235, 0.3)",
        },
      },
      x: {
        ticks: {
          color: "rgba(107, 114, 128, 1)",
        },
        grid: {
          color: "rgba(229, 231, 235, 0.3)",
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
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
});

export const createRevenueChartData = (chartData) => ({
  labels: chartData.labels,
  datasets: [
    {
      label: "Revenue (₱)",
      data: chartData.data,
      borderColor: "rgb(34, 197, 94)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
});

export const createSessionStatusChartData = (chartData) => ({
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

export const createMemberStatusChartData = (chartData) => ({
  labels: chartData.labels,
  datasets: [
    {
      data: chartData.data,
      backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
      borderColor: ["rgb(34, 197, 94)", "rgb(239, 68, 68)"],
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
      backgroundColor: "rgba(59, 130, 246, 0.6)",
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 2,
    },
  ],
});
