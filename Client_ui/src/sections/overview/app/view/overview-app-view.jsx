import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fNumber } from 'src/utils/format-number';

import { useGetAccident } from 'src/actions/accident';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { Chart, useChart } from 'src/components/chart';

import { useAuthContext } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';

const INCIDENT_ACCIDENT = 'አደጋ';
const INCIDENT_CRIME = 'ወንጀል';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getAccidentDate(accident) {
  const dateValues = [
    accident.incident_date,
    accident.report_date,
    accident.AddedDate,
    ...(Array.isArray(accident.ModifiedDate) ? accident.ModifiedDate.slice(-1) : []),
  ];

  return (
    dateValues
      .filter(Boolean)
      .map((dateValue) => new Date(dateValue))
      .find((date) => !Number.isNaN(date.getTime())) || null
  );
}

function getIncidentType(accident) {
  if (accident.incident_type === INCIDENT_ACCIDENT || accident.incident_type === INCIDENT_CRIME) {
    return accident.incident_type;
  }

  return 'Other';
}

function getCompanyName(accident) {
  return (
    accident.company?.Name ||
    accident.company?.name ||
    accident.organization_name ||
    'Unknown company'
  );
}

function toAmount(value) {
  const amount = Number(String(value ?? '').replace(/,/g, '').trim());
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function getEstimatedLoss(accident) {
  if (getIncidentType(accident) === INCIDENT_ACCIDENT) {
    return (
      toAmount(accident.accident_property_damage_estimated_value) +
      toAmount(accident.accident_ip_damage_estimated_value)
    );
  }

  return (
    toAmount(accident.damaged_property_estimated_value) +
    toAmount(accident.ip_damage_estimated_value)
  );
}

function countBy(items, getLabel) {
  const counts = new Map();

  items.forEach((item) => {
    const label = String(getLabel(item) || 'Not specified').trim();
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function SummaryMetric({ title, value, caption, color }) {
  return (
    <Card
      sx={{
        height: '100%',
        p: 3,
        borderTop: 3,
        borderColor: color,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h3" sx={{ mt: 1.5, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {caption}
      </Typography>
    </Card>
  );
}

function InsightListCard({ title, subheader, items, loading = false, valueFormatter = fNumber }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} sx={{ pb: 1 }} />
      {loading ? (
        <Box role="status" sx={{ px: 3, py: 4, color: 'text.secondary' }}>
          Loading accident insights…
        </Box>
      ) : items.length ? (
        <Box
          component="ol"
          sx={{ listStyle: 'none', m: 0, p: 3, pt: 1, display: 'grid', gap: 2 }}
        >
          {items.map((item) => (
            <Box component="li" key={item.label} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 0.75,
                }}
              >
                <Typography variant="body2" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                  {item.label}
                </Typography>
                <Typography variant="subtitle2" sx={{ flexShrink: 0 }}>
                  {item.displayValue ?? valueFormatter(item.value)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.value > 0 ? (item.value / maxValue) * 100 : 0}
                aria-label={`${item.label}: ${item.displayValue ?? valueFormatter(item.value)}`}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box role="status" sx={{ px: 3, py: 4, color: 'text.secondary' }}>
          No accident data available yet.
        </Box>
      )}
    </Card>
  );
}

function InsightChartCard({
  title,
  subheader,
  type = 'bar',
  series,
  categories,
  labels,
  stacked = false,
  loading = false,
  height = 340,
  ariaLabel,
}) {
  const theme = useTheme();
  const chartColors = [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
    theme.palette.primary.dark,
    theme.palette.warning.dark,
  ];
  const hasData = type === 'donut'
    ? series.length > 0 && series.some((value) => value > 0)
    : series.some((item) => item.data?.some((value) => value > 0));

  const chartOptions = useChart({
    chart: { stacked },
    colors: chartColors,
    labels,
    xaxis: categories ? { categories } : undefined,
    yaxis: { labels: { formatter: (value) => fNumber(value) } },
    legend: {
      show: type === 'donut' || series.length > 1,
      position: 'bottom',
      horizontalAlign: 'left',
    },
    tooltip: {
      y: {
        formatter: (value) => fNumber(value),
      },
    },
    dataLabels: {
      enabled: type === 'donut',
      formatter: (value) => `${Math.round(value)}%`,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '55%',
      },
      pie: {
        donut: {
          size: '68%',
        },
      },
    },
    stroke: {
      width: type === 'line' || type === 'area' ? 3 : 0,
      curve: 'smooth',
    },
    grid: {
      padding: { left: 12, right: 16 },
    },
  });

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} sx={{ pb: 0 }} />
      {loading ? (
        <Box
          role="status"
          sx={{ height, display: 'grid', placeItems: 'center', color: 'text.secondary' }}
        >
          Loading accident insights…
        </Box>
      ) : hasData ? (
        <Chart
          aria-label={ariaLabel}
          role="img"
          type={type}
          series={series}
          options={chartOptions}
          height={height}
          sx={{ p: 2 }}
        />
      ) : (
        <Box
          role="status"
          sx={{ height, display: 'grid', placeItems: 'center', color: 'text.secondary' }}
        >
          No accident data available for this chart yet.
        </Box>
      )}
    </Card>
  );
}

export function OverviewAppView() {
  const { user } = useAuthContext();
  const theme = useTheme();
  const { accidents = [], accidentsLoading } = useGetAccident();

  const insights = useMemo(() => {
    const now = new Date();
    const recentMonths = Array.from({ length: 12 }, (_, index) =>
      new Date(now.getFullYear(), now.getMonth() - 11 + index, 1)
    );
    const monthIndexByKey = new Map(
      recentMonths.map((date, index) => [`${date.getFullYear()}-${date.getMonth()}`, index])
    );
    const monthLabels = recentMonths.map((date) =>
      new Intl.DateTimeFormat('en', { month: 'short', year: '2-digit' }).format(date)
    );
    const monthlyByType = {
      [INCIDENT_ACCIDENT]: Array(recentMonths.length).fill(0),
      [INCIDENT_CRIME]: Array(recentMonths.length).fill(0),
      Other: Array(recentMonths.length).fill(0),
    };
    const monthlyLossByType = {
      [INCIDENT_ACCIDENT]: Array(recentMonths.length).fill(0),
      [INCIDENT_CRIME]: Array(recentMonths.length).fill(0),
      Other: Array(recentMonths.length).fill(0),
    };
    const companyCounts = new Map();
    const companyLosses = new Map();
    const weekdayCounts = Array(7).fill(0);
    let estimatedLoss = 0;

    accidents.forEach((accident) => {
      const type = getIncidentType(accident);
      const company = getCompanyName(accident);
      const loss = getEstimatedLoss(accident);
      const date = getAccidentDate(accident);

      companyCounts.set(company, (companyCounts.get(company) || 0) + 1);
      companyLosses.set(company, (companyLosses.get(company) || 0) + loss);
      estimatedLoss += loss;

      if (date) {
        const monthIndex = monthIndexByKey.get(`${date.getFullYear()}-${date.getMonth()}`);
        if (monthIndex !== undefined) {
          monthlyByType[type][monthIndex] += 1;
          monthlyLossByType[type][monthIndex] += loss;
        }
        weekdayCounts[date.getDay()] += 1;
      }
    });

    const typeCounts = countBy(accidents, getIncidentType);
    const accidentRecords = accidents.filter(
      (accident) => getIncidentType(accident) === INCIDENT_ACCIDENT
    );
    const crimeRecords = accidents.filter(
      (accident) => getIncidentType(accident) === INCIDENT_CRIME
    );
    const causeCounts = countBy(
      accidentRecords,
      (accident) => accident.accident_cause || 'Not specified'
    );
    const injuryCounts = countBy(accidents, (accident) =>
      getIncidentType(accident) === INCIDENT_ACCIDENT
        ? accident.accident_victim_injury || 'Not specified'
        : accident.human_injury_on_person || 'Not specified'
    );
    const topCompanies = [...companyCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const topCompaniesByLoss = [...companyLosses.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    const weekdayEntries = WEEKDAYS.map((day, index) => [day, weekdayCounts[index]]);

    return {
      total: accidents.length,
      accidentCount: accidentRecords.length,
      crimeCount: crimeRecords.length,
      companyCount: companyCounts.size,
      estimatedLoss,
      typeLabels: typeCounts.map(([label]) => label),
      typeValues: typeCounts.map(([, value]) => value),
      monthLabels,
      monthlySeries: Object.entries(monthlyByType).map(([name, data]) => ({ name, data })),
      monthlyLossSeries: Object.entries(monthlyLossByType).map(([name, data]) => ({ name, data })),
      companyItems: topCompanies.map(([label, value]) => ({ label, value })),
      lossCompanyItems: topCompaniesByLoss.map(([label, value]) => ({
        label,
        value,
        displayValue: value > 0 ? fNumber(value) : 'No estimate recorded',
      })),
      causeItems: causeCounts.map(([label, value]) => ({ label, value })),
      injuryItems: injuryCounts.map(([label, value]) => ({ label, value })),
      weekdayItems: weekdayEntries.map(([label, value]) => ({ label, value })),
    };
  }, [accidents]);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.FirstName || ''}`}
            description="Midroc Investment Group Accident Management System."
            img={<SeoIllustration hideBackground />}
          />
        </Grid>

        <Grid xs={12} sm={6} lg={3}>
          <SummaryMetric
            title="Total reports"
            value={accidentsLoading ? '—' : fNumber(insights.total)}
            caption="All recorded incident reports"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <SummaryMetric
            title="Accident reports"
            value={accidentsLoading ? '—' : fNumber(insights.accidentCount)}
            caption={INCIDENT_ACCIDENT}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <SummaryMetric
            title="Crime reports"
            value={accidentsLoading ? '—' : fNumber(insights.crimeCount)}
            caption={INCIDENT_CRIME}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <SummaryMetric
            title="Estimated loss"
            value={accidentsLoading ? '—' : fNumber(insights.estimatedLoss)}
            caption={`Across ${fNumber(insights.companyCount)} companies`}
            color={theme.palette.info.main}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <InsightChartCard
            title="Monthly incident trend"
            subheader={`Monthly reports by type — last 12 months (${insights.monthLabels[0]} to ${insights.monthLabels[11]})`}
            type="line"
            categories={insights.monthLabels}
            series={insights.monthlySeries}
            loading={accidentsLoading}
            ariaLabel="Line chart of monthly reports by incident type over the last 12 months"
          />
        </Grid>
        <Grid xs={12} lg={4}>
          <InsightChartCard
            title="Incident type mix"
            subheader="Share of all recorded reports"
            type="donut"
            labels={insights.typeLabels}
            series={insights.typeValues}
            loading={accidentsLoading}
            height={360}
            ariaLabel="Donut chart comparing accident and crime report counts"
          />
        </Grid>
        <Grid xs={12}>
          <InsightChartCard
            title="Estimated loss trend"
            subheader={`Monthly property and intellectual-property estimates — last 12 months (${insights.monthLabels[0]} to ${insights.monthLabels[11]})`}
            type="area"
            categories={insights.monthLabels}
            series={insights.monthlyLossSeries}
            loading={accidentsLoading}
            ariaLabel="Area chart of estimated damage loss by incident type over the last 12 months"
          />
        </Grid>

        <Grid xs={12} lg={6}>
          <InsightListCard
            title="Reports by company"
            subheader="Top 10 companies by report volume"
            items={insights.companyItems}
            loading={accidentsLoading}
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <InsightListCard
            title="Accident causes"
            subheader="Cause values from the accident report form"
            items={insights.causeItems}
            loading={accidentsLoading}
          />
        </Grid>

        <Grid xs={12} lg={6}>
          <InsightListCard
            title="Reported injury outcomes"
            subheader="Victim and injury categories from submitted reports"
            items={insights.injuryItems}
            loading={accidentsLoading}
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <InsightListCard
            title="Estimated loss by company"
            subheader="Property and intellectual-property damage estimates"
            items={insights.lossCompanyItems}
            loading={accidentsLoading}
          />
        </Grid>

        <Grid xs={12}>
          <InsightListCard
            title="Reports by day of week"
            subheader="Based on incident date, report date, or record creation date"
            items={insights.weekdayItems}
            loading={accidentsLoading}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
