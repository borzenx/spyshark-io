// options.ts

export const options = {
    responsive: true,
  
    scales: {
      x: {
        grid: {
          color: 'rgba(0,0,0,0)',
        },
      },
      y: {
        grid: {
          color: 'rgb(221,221,221)',
        },
      },
    },
  };


  export const options_tiktok = {
    responsive: true,
    scales: {
      x: {
        display: false
      },
      y: {
        grid: {
          color: 'rgb(221,221,221)',
        },
      },
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };