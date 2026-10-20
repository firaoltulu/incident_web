import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
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
const MONTHS = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2020, month, 1))
);
const ALL_MONTHS = 'all';

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
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(ALL_MONTHS);

  const availableYears = useMemo(() => {
    const years = new Set([new Date().getFullYear()]);
    accidents.forEach((accident) => {
      const date = getAccidentDate(accident);
      if (date) {
        years.add(date.getFullYear());
      }
    });
    return [...years].sort((a, b) => b - a);
  }, [accidents]);

  const periodLabel =
    selectedMonth === ALL_MONTHS
      ? selectedYear
      : `${MONTHS[Number(selectedMonth)]} ${selectedYear}`;

  const insights = useMemo(() => {
    const year = Number(selectedYear);
    const month = selectedMonth === ALL_MONTHS ? null : Number(selectedMonth);
    const daysInMonth = month === null ? 0 : new Date(year, month + 1, 0).getDate();
    const periodLabels =
      month === null
        ? MONTHS.map((monthName) => monthName.slice(0, 3))
        : Array.from({ length: daysInMonth }, (_, index) => String(index + 1));
    const monthlyByType = {
      [INCIDENT_ACCIDENT]: Array(periodLabels.length).fill(0),
      [INCIDENT_CRIME]: Array(periodLabels.length).fill(0),
      Other: Array(periodLabels.length).fill(0),
    };
    const monthlyLossByType = {
      [INCIDENT_ACCIDENT]: Array(periodLabels.length).fill(0),
      [INCIDENT_CRIME]: Array(periodLabels.length).fill(0),
      Other: Array(periodLabels.length).fill(0),
    };
    const periodAccidents = accidents.filter((accident) => {
      const date = getAccidentDate(accident);
      return date && date.getFullYear() === year && (month === null || date.getMonth() === month);
    });
    const companyCounts = new Map();
    const companyLosses = new Map();
    const weekdayCounts = Array(7).fill(0);
    let estimatedLoss = 0;

    periodAccidents.forEach((accident) => {
      const type = getIncidentType(accident);
      const company = getCompanyName(accident);
      const loss = getEstimatedLoss(accident);
      const date = getAccidentDate(accident);

      companyCounts.set(company, (companyCounts.get(company) || 0) + 1);
      companyLosses.set(company, (companyLosses.get(company) || 0) + loss);
      estimatedLoss += loss;
      const periodIndex = month === null ? date.getMonth() : date.getDate() - 1;
      monthlyByType[type][periodIndex] += 1;
      monthlyLossByType[type][periodIndex] += loss;
      weekdayCounts[date.getDay()] += 1;
    });

    const typeCounts = countBy(periodAccidents, getIncidentType);
    const accidentRecords = periodAccidents.filter(
      (accident) => getIncidentType(accident) === INCIDENT_ACCIDENT
    );
    const crimeRecords = periodAccidents.filter(
      (accident) => getIncidentType(accident) === INCIDENT_CRIME
    );
    const causeCounts = countBy(
      accidentRecords,
      (accident) => accident.accident_cause || 'Not specified'
    );
    const injuryCounts = countBy(periodAccidents, (accident) =>
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
      total: periodAccidents.length,
      accidentCount: accidentRecords.length,
      crimeCount: crimeRecords.length,
      companyCount: companyCounts.size,
      estimatedLoss,
      typeLabels: typeCounts.map(([label]) => label),
      typeValues: typeCounts.map(([, value]) => value),
      periodLabels,
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
  }, [accidents, selectedMonth, selectedYear]);

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

        <Grid xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'stretch', sm: 'flex-end' },
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <FormControl size="small" sx={{ width: { xs: 1, sm: 'auto' }, minWidth: { sm: 150 } }}>
              <InputLabel id="overview-year-label">Year</InputLabel>
              <Select
                labelId="overview-year-label"
                id="overview-year"
                value={selectedYear}
                label="Year"
                onChange={(event) => setSelectedYear(event.target.value)}
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={String(year)}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ width: { xs: 1, sm: 'auto' }, minWidth: { sm: 180 } }}>
              <InputLabel id="overview-month-label">Month</InputLabel>
              <Select
                labelId="overview-month-label"
                id="overview-month"
                value={selectedMonth}
                label="Month"
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                <MenuItem value={ALL_MONTHS}>All months</MenuItem>
                {MONTHS.map((month, index) => (
                  <MenuItem key={month} value={String(index)}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>

        <Grid xs={12} sm={6} lg={3}>
          <SummaryMetric
            title="Total reports"
            value={accidentsLoading ? '—' : fNumber(insights.total)}
            caption={`Reports in ${periodLabel}`}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <SummaryMetric
            title="Accident reports"
            value={accidentsLoading ? '—' : fNumber(insights.accidentCount)}
            caption={`${INCIDENT_ACCIDENT} reports in ${periodLabel}`}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <SummaryMetric
            title="Crime reports"
            value={accidentsLoading ? '—' : fNumber(insights.crimeCount)}
            caption={`${INCIDENT_CRIME} reports in ${periodLabel}`}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid xs={12} sm={6} lg={3}>
          <SummaryMetric
            title="Estimated loss"
            value={accidentsLoading ? '—' : fNumber(insights.estimatedLoss)}
            caption={`${fNumber(insights.companyCount)} companies in ${periodLabel}`}
            color={theme.palette.info.main}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <InsightChartCard
            title={selectedMonth === ALL_MONTHS ? 'Monthly incident trend' : 'Daily incident trend'}
            subheader={
              selectedMonth === ALL_MONTHS
                ? `Monthly reports by type in ${selectedYear}`
                : `Daily reports by type in ${periodLabel}`
            }
            type="line"
            categories={insights.periodLabels}
            series={insights.monthlySeries}
            loading={accidentsLoading}
            ariaLabel={
              selectedMonth === ALL_MONTHS
                ? `Line chart of monthly reports by incident type in ${selectedYear}`
                : `Line chart of daily reports by incident type in ${periodLabel}`
            }
          />
        </Grid>
        <Grid xs={12} lg={4}>
          <InsightChartCard
            title="Incident type mix"
            subheader={`Share of reports in ${periodLabel}`}
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
            subheader={
              selectedMonth === ALL_MONTHS
                ? `Monthly loss estimates in ${selectedYear}`
                : `Daily loss estimates in ${periodLabel}`
            }
            type="area"
            categories={insights.periodLabels}
            series={insights.monthlyLossSeries}
            loading={accidentsLoading}
            ariaLabel={`Estimated damage loss by incident type in ${periodLabel}`}
          />
        </Grid>

        <Grid xs={12} lg={6}>
          <InsightListCard
            title="Reports by company"
            subheader={`Top 10 companies by report volume in ${periodLabel}`}
            items={insights.companyItems}
            loading={accidentsLoading}
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <InsightListCard
            title="Accident causes"
            subheader={`Cause values in ${periodLabel}`}
            items={insights.causeItems}
            loading={accidentsLoading}
          />
        </Grid>

        <Grid xs={12} lg={6}>
          <InsightListCard
            title="Reported injury outcomes"
            subheader={`Victim and injury categories in ${periodLabel}`}
            items={insights.injuryItems}
            loading={accidentsLoading}
          />
        </Grid>
        <Grid xs={12} lg={6}>
          <InsightListCard
            title="Estimated loss by company"
            subheader={`Damage estimates in ${periodLabel}`}
            items={insights.lossCompanyItems}
            loading={accidentsLoading}
          />
        </Grid>

        <Grid xs={12}>
          <InsightListCard
            title="Reports by day of week"
            subheader={`Based on incident date, report date, or record creation date in ${periodLabel}`}
            items={insights.weekdayItems}
            loading={accidentsLoading}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
