// data.ts

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: '',
      data: [650, 590, 80, 814, 5236, 535, 420],
      borderColor: 'rgb(40,100,252)',
      backgroundColor: 'rgba(40,100,252,0.5)',
      lineTension: 0.3,
    },
  ],
};
