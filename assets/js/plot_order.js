const legend = (legendType, bs = { xs: 12 }) => (
  {
    type: 'legend',
    bs,
    legendType,
  }
);

const context = (index, bs = { xs: 12 }) => (
  {
    type: 'context',
    index,
    bs,
  }
);

const pie = (index, pieType = 'AD') => (
  {
    type: 'plot',
    index,
    bs: { xs: 4 },
    pieType,
  }
);

const pieSet = (list, pieType = 'AD') => {
  const output = [];
  for (const idx of list) {
    output.push(pie(idx, pieType));
  }
  return output;
};

const bar = (index, options = {}, xaxis = {}) => (
  {
    type: 'plot',
    index,
    bs: { xs: 6 },
    options,
    xaxis,
  }
);

const barSet = (list, options = {}, xaxis = {}) => {
  const output = [];
  for (const idx of list) {
    output.push(bar(idx, options, xaxis));
  }
  return output;
};

export default {
  Lo: [
    pie(0, 'TF'),
    {
      type: 'plot',
      index: 1,
      bs: { xs: 8 },
    },
    legend('TF', { xs: 4 }),
    context(2),
    {
      type: 'plot',
      index: 2,
      bs: { xs: 12 },
      options: {
        autobinx: false,
        xbins: {
          start: -0.5,
          end: 90.5,
          size: 1,
        },
      },
    },
  ],
  Qu: [
    {
      type: 'plot',
      index: 0,
      bs: { xs: 12 },
      legend: false,
    },
    context(1),
    {
      type: 'plot',
      index: 1,
      bs: { xs: 12 },
      legend: false,
    },
    context(2),
    {
      type: 'plot',
      index: 2,
      bs: { xs: 12 },
      legend: false,
    },
  ],
  PE: [
    legend('AD'),
    context(0),
    ...pieSet([0, 1, 2, 3, 4, 5]),
  ],
  Va: [
    legend('AD'),
    context(0),
    pie(0),
    context(1),
    ...pieSet([1, 2]),
  ],
  Ca: [
    legend('AD'),
    context(0),
    ...pieSet([0, 1]),
    context(2),
    pie(2),
  ],
  Un: [
    legend('AD'),
    context(0),
    pie(0),
    context(1),
    ...pieSet([1, 2]),
  ],
  WL: [
    legend('AD'),
    context(0),
    pie(0),
    context(1),
    ...pieSet([1, 2]),
  ],
  So: [
    legend('AD'),
    context(0),
    ...pieSet([0, 1, 2]),
    context(3),
    ...pieSet([3, 4, 5]),
  ],
  RC: [
    legend('AD'),
    context(0),
    ...pieSet([0, 1, 2, 3]),
    context(4),
    ...pieSet([4, 5, 6, 7, 8]),
  ],
  Co: [
    legend('AD'),
    context(0),
    ...pieSet([0, 1, 2]),
  ],
  SC: [
    legend('AD'),
    context(0),
    ...pieSet([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    context(12),
    ...pieSet([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]),
    context(24),
    ...barSet([24, 25], { autobinx: false, xbins: { start: -0.5, end: 1000.5, size: 1 } }, { range: [0, 17] }),
    context(26),
    ...pieSet([26, 27, 28, 29]),
  ],
  In: [
    {
      type: 'plot',
      index: 1,
      bs: { xs: 12 },
      options: {
        autobinx: false,
        xbins: {
          start: 15.5,
          end: 90.5,
          size: 1,
        },
      },
    },
    context(0),
    pie(0, 'Gen'),
    pie(2, 'Eth'),
    {
      type: 'blank',
      bs: {
        xs: 4,
      },
    },
    legend('Gen', { xs: 4 }),
    legend('Eth', { xs: 4 }),
    context(3),
    ...pieSet([3, 7], 'TF'),
    {
      type: 'blank',
      bs: {
        xs: 4,
      },
    },
    legend('TF', { xs: 8 }),
    context(4),
    ...barSet([4, 5, 6], { autobinx: false, xbins: { start: -0.5, end: 9.5, size: 1 } }),
  ],
  Em: [
    pie(0, 'TF'),
    {
      type: 'blank',
      bs: {
        xs: 8,
      },
    },
    legend('TF', { xs: 4 }),
    context(1),
    {
      type: 'plot',
      index: 1,
      xs: 12,
      options: {
        autobinx: false,
        xbins: {
          start: -0.5,
          end: 90.5,
          size: 1,
        },
      },
    },
    context(2),
    {
      type: 'plot',
      index: 2,
      xs: 12,
      xaxis: {
        range: [0, 90000],
      },
      options: {
        autobinx: false,
        xbins: {
          start: 0,
          end: 250000000,
          size: 1000,
        },
      },
    },
    context(3),
    {
      type: 'plot',
      index: 3,
      bs: { xs: 12 },
      xaxis: {
        range: [0, 5000],
      },
      options: {
        autobinx: false,
        xbins: {
          start: 0,
          end: 50000,
          size: 50,
        },
      },
    },
  ],
  Ed: [
    context(0),
    ...pieSet([0, 1], 'Edu'),
    {
      type: 'blank',
      bs: {
        xs: 4,
      },
    },
    legend('Edu', { xs: 8 }),
    context(2),
    ...pieSet([2, 3], 'TF'),
    {
      type: 'blank',
      bs: {
        xs: 4,
      },
    },
    legend('TF', { xs: 8 }),
  ],
  Ti: [
    context(0),
    ...barSet([0, 1], { autobinx: false, xbins: { start: -0.5, end: 500.5, size: 1 } }, { range: [0, 22] }),
    context(2),
    ...barSet([2, 3, 4, 5], { autobinx: false, xbins: { start: 0, end: 1.1, size: 0.05 } }, { title: 'Fraction of total time' }),
  ],
  FF: [
    context(0),
    ...barSet([0, 1], { autobinx: false, xbins: { start: -0.5, end: 5000.5, size: 1 } }, { range: [0, 55] }),
    context(2),
    bar(2, { autobinx: false, xbins: { start: 0, end: 7000, size: 10 } }, { range: [0, 450] }),
  ],
  Re: [
    pie(0, 'TF'),
    {
      type: 'blank',
      bs: {
        xs: 8,
      },
    },
    legend('TF', { xs: 4 }),
    context(1),
    pie(1),
    {
      type: 'blank',
      bs: {
        xs: 8,
      },
    },
    legend('AD', { xs: 4 }),
  ],
};
