import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

export function AppAreaInstalled({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const hasSeries = Array.isArray(chart.series) && chart.series.length > 0;
  const [selectedSeries, setSelectedSeries] = useState(
    hasSeries ? chart.series[chart.series.length - 1]?.name : ''
  );

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const chartOptions = useChart({
    chart: { stacked: true },
    colors: chartColors,
    stroke: { width: 0 },
    xaxis: { categories: chart.categories },
    tooltip: { y: { formatter: (value) => fNumber(value) } },
    plotOptions: { bar: { columnWidth: '40%' } },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);
  }, []);

  const currentSeries = hasSeries
    ? chart.series.find((i) => i.name === selectedSeries)
    : undefined;

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          hasSeries ? (
            <ChartSelect
              options={chart.series.map((item) => item.name)}
              value={selectedSeries}
              onChange={handleChangeSeries}
            />
          ) : null
        }
        sx={{ mb: 3 }}
      />

      {hasSeries && chart.series[0]?.data ? (
        <ChartLegends
          colors={chartOptions?.colors}
          labels={chart.series[0].data.map((item) => item.name)}
          sx={{
            px: 3,
            gap: 3,
          }}
        />
      ) : null}

      {hasSeries && currentSeries?.data ? (
        <Chart
          key={selectedSeries}
          type="bar"
          series={currentSeries.data}
          options={chartOptions}
          height={320}
          sx={{ py: 2.5, pl: 1, pr: 2.5 }}
        />
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: theme.palette.text.secondary }}>
          No chart data available.
        </div>
      )}
    </Card>
  );
}
