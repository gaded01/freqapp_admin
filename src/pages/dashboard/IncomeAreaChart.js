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


  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: consumptions?.map((data) => data.month),
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
        data: consumptions?.map((data) => data.consumption),
      }
    ]); 
  }, [slot, consumptions]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

IncomeAreaChart.propTypes = {
  slot: PropTypes.string
};

export default IncomeAreaChart;
