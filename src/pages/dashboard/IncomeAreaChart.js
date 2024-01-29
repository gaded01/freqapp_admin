import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = ({ slot, consumptions }) => {
  const theme = useTheme();

  
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const [options, setOptions] = useState(areaChartOptions);

  let months = ["Jan 2023", "Feb 2023", "Mar 2023", "Apr 2023", "May 2023", "Jun 2023", "Jul 2023", "Aug 2023", "Sep 2023", "Oct2023", "Nov 2023", "Dec 2023" , "Jan 2024"];
  
  const staticRandomNumbers = [254, 387, 472, 192, 359, 215, 418, 176, 491, 293, 167, 420, 278];
  
  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: months,
        labels: {
          style: {
            colors: secondary,
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: 11 
      },
      yaxis: {
        labels: {
          formatter: (value) => {
            return value.toFixed(1)
          },
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      }
    }));
  }, [primary, secondary, line, theme, slot, consumptions]);

  const [series, setSeries] = useState([
    {
      name: 'Sessions',
      data: [0, 43, 14, 56, 24, 105, 68]
    }
  ]);
  
  useEffect(() => {
    setSeries([
      {
        name: 'Data Consumption (Gigabyte)',
        data: staticRandomNumbers,
      }
    ]); 
  }, [slot, consumptions]);

  return <ReactApexChart options={options} series={series} type="line" height={450} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;
