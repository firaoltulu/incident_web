import { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { useGetUsers } from 'src/actions/user';
// import { useGetCompanies } from 'src/actions/product';
import { useGetAccident } from 'src/actions/accident';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { useAuthContext } from 'src/auth/hooks';

import { AppWelcome } from '../app-welcome';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useAuthContext();

  const theme = useTheme();


  const { users } = useGetUsers();
  // const { companies } = useGetCompanies();
  const { accidents } = useGetAccident({ index: 0, step: 0 });


  // const [activeUsers, setActiveUsers] = useState([]);
  const [groupAccidents, setGroupAccidents] = useState([]);
  const [groupAccidentsByYear, setGroupAccidentsByYear] = useState([]);

  useEffect(() => {

    // const acitve_users = users.filter((row) => {
    //   if (row.IsActive) {
    //     return row;
    //   }
    //   return null;

    // });

    function groupCompanies(arr) {
      const map = new Map();

      arr.forEach(item => {
        const { _id, Name } = item.company;

        if (!map.has(_id)) {
          map.set(_id, { label: Name, value: 0 });
        }

        map.get(_id).value += 1;
      });

      return Array.from(map.values());
    };

    function groupAccidentsByYearCompanyMonth(arr) {
      const result = {};

      arr.forEach(item => {
        const date = new Date(item.date_of_report);
        const year = date.getFullYear();
        const month = date.getMonth();
        const companyId = item.company._id;
        const companyName = item.company.Name;

        if (!result[year]) {
          result[year] = {};
        }

        if (!result[year][companyId]) {
          result[year][companyId] = {
            name: companyName,
            data: new Array(12).fill(0)
          };
        }

        result[year][companyId].data[month] += 1;
      });

      return Object.keys(result).map(year => ({
        name: year,
        data: Object.values(result[year])
      }));
    };

    const group_accidents = groupCompanies(accidents);
    const group_accidents_by_year = groupAccidentsByYearCompanyMonth(accidents);

    setGroupAccidents(group_accidents);
    setGroupAccidentsByYear(group_accidents_by_year);

  }, [users, accidents]);


  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.FirstName}`}
            description="Midroc Investment Group Accident Management System."
            img={<SeoIllustration hideBackground />}
          />
        </Grid>

        {/* <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total active users"
            percent={2.6}
            total={activeUsers.length}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total companies"
            percent={0.2}
            total={companies.length}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={12}>
          <AppWidgetSummary
            title="Total accidents"
            percent={-0.1}
            total={accidents.length}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Company Accident"
            subheader="Accident by Company"
            chart={{
              series: groupAccidents,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Accidents By Year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: groupAccidentsByYear,
            }}
          />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
