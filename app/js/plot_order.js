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

export const plotOrder = {
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

// include optional legend param for each question
// get layout & legend in top level quesitonView since it never changes
export const numberOrder = {
  1: { layout: plotOrder.Lo[0], legend: legend('TF') },
  2: { layout: plotOrder.Lo[1] },
  3: { layout: plotOrder.Lo[3] },
  4: { layout: plotOrder.PE[2], legend: legend('AD') },
  5: { layout: plotOrder.PE[3], legend: legend('AD') },
  6: { layout: plotOrder.PE[4], legend: legend('AD') },
  11: { layout: plotOrder.PE[5], legend: legend('AD') },
  12: { layout: plotOrder.PE[6], legend: legend('AD') },
  13: { layout: plotOrder.PE[7], legend: legend('AD') },
  7: { layout: plotOrder.Va[2], legend: legend('AD') },
  28: { layout: plotOrder.Va[4], legend: legend('AD') },
  29: { layout: plotOrder.Va[5], legend: legend('AD') },
  8: { layout: plotOrder.Ca[2], legend: legend('AD') },
  9: { layout: plotOrder.Ca[3], legend: legend('AD') },
  21: { layout: plotOrder.Ca[5], legend: legend('AD') },
  10: { layout: plotOrder.Un[2], legend: legend('AD') },
  18: { layout: plotOrder.Un[4], legend: legend('AD') },
  19: { layout: plotOrder.Un[5], legend: legend('AD') },
  14: { layout: plotOrder.WL[2], legend: legend('AD') },
  33: { layout: plotOrder.WL[4], legend: legend('AD') },
  34: { layout: plotOrder.WL[5], legend: legend('AD') },
  15: { layout: plotOrder.So[2], legend: legend('AD') },
  16: { layout: plotOrder.So[3], legend: legend('AD') },
  17: { layout: plotOrder.So[4], legend: legend('AD') },
  25: { layout: plotOrder.So[6], legend: legend('AD') },
  26: { layout: plotOrder.So[7], legend: legend('AD') },
  27: { layout: plotOrder.So[8], legend: legend('AD') },
  20: { layout: plotOrder.RC[2], legend: legend('AD') },
  22: { layout: plotOrder.RC[3], legend: legend('AD') },
  23: { layout: plotOrder.RC[4], legend: legend('AD') },
  24: { layout: plotOrder.RC[5], legend: legend('AD') },
  35: { layout: plotOrder.RC[7], legend: legend('AD') },
  36: { layout: plotOrder.RC[8], legend: legend('AD') },
  37: { layout: plotOrder.RC[9], legend: legend('AD') },
  38: { layout: plotOrder.RC[10], legend: legend('AD') },
  39: { layout: plotOrder.RC[11], legend: legend('AD') },
  30: { layout: plotOrder.Co[2], legend: legend('AD') },
  31: { layout: plotOrder.Co[3], legend: legend('AD') },
  32: { layout: plotOrder.Co[4], legend: legend('AD') },
  40: { layout: plotOrder.SC[2], legend: legend('AD') },
  41: { layout: plotOrder.SC[3], legend: legend('AD') },
  42: { layout: plotOrder.SC[4], legend: legend('AD') },
  43: { layout: plotOrder.SC[5], legend: legend('AD') },
  44: { layout: plotOrder.SC[6], legend: legend('AD') },
  45: { layout: plotOrder.SC[7], legend: legend('AD') },
  46: { layout: plotOrder.SC[8], legend: legend('AD') },
  47: { layout: plotOrder.SC[9], legend: legend('AD') },
  48: { layout: plotOrder.SC[10], legend: legend('AD') },
  49: { layout: plotOrder.SC[11], legend: legend('AD') },
  50: { layout: plotOrder.SC[12], legend: legend('AD') },
  51: { layout: plotOrder.SC[13], legend: legend('AD') },
  52: { layout: plotOrder.SC[15], legend: legend('AD') },
  53: { layout: plotOrder.SC[16], legend: legend('AD') },
  54: { layout: plotOrder.SC[17], legend: legend('AD') },
  55: { layout: plotOrder.SC[18], legend: legend('AD') },
  56: { layout: plotOrder.SC[19], legend: legend('AD') },
  57: { layout: plotOrder.SC[20], legend: legend('AD') },
  58: { layout: plotOrder.SC[21], legend: legend('AD') },
  59: { layout: plotOrder.SC[22], legend: legend('AD') },
  60: { layout: plotOrder.SC[23], legend: legend('AD') },
  61: { layout: plotOrder.SC[24], legend: legend('AD') },
  62: { layout: plotOrder.SC[25], legend: legend('AD') },
  63: { layout: plotOrder.SC[26], legend: legend('AD') },
  64: { layout: plotOrder.SC[28] },
  65: { layout: plotOrder.SC[29] },
  66: { layout: plotOrder.SC[31], legend: legend('AD') },
  67: { layout: plotOrder.SC[32], legend: legend('AD') },
  68: { layout: plotOrder.SC[33], legend: legend('AD') },
  69: { layout: plotOrder.SC[34], legend: legend('AD') },
  70: { layout: plotOrder.Qu[0] },
  71: { layout: plotOrder.Qu[2] },
  72: { layout: plotOrder.Qu[4] },
  74: { layout: plotOrder.In[0] },
  73: { layout: plotOrder.In[2], legend: legend('Gen') },
  75: { layout: plotOrder.In[3], legend: legend('Eth') },
  76: { layout: plotOrder.In[8], legend: legend('TF') },
  80: { layout: plotOrder.In[9], legend: legend('TF') },
  77: { layout: plotOrder.In[13] },
  78: { layout: plotOrder.In[14] },
  79: { layout: plotOrder.In[15] },
  81: { layout: plotOrder.Em[0], legend: legend('TF') },
  82: { layout: plotOrder.Em[4] },
  83: { layout: plotOrder.Em[6] },
  97: { layout: plotOrder.Em[8] },
  84: { layout: plotOrder.Ed[1], legend: legend('Edu') },
  85: { layout: plotOrder.Ed[2], legend: legend('Edu') },
  86: { layout: plotOrder.Ed[6], legend: legend('TF') },
  87: { layout: plotOrder.Ed[7], legend: legend('TF') },
  88: { layout: plotOrder.Ti[1] },
  89: { layout: plotOrder.Ti[2] },
  90: { layout: plotOrder.Ti[4] },
  91: { layout: plotOrder.Ti[5] },
  92: { layout: plotOrder.Ti[6] },
  93: { layout: plotOrder.Ti[7] },
  94: { layout: plotOrder.FF[1] },
  95: { layout: plotOrder.FF[2] },
  96: { layout: plotOrder.FF[4] },
  98: { layout: plotOrder.Re[0], legend: legend('TF') },
  99: { layout: plotOrder.Re[4], legend: legend('AD') },
};
