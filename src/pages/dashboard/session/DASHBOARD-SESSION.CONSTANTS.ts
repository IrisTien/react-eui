export const POOL_POD_MAP = [
  {
    cmstenantid: 'zrsjti894l8h2jkdt0tlyjlm7ls',
    poolid: '1003-5bb367cd-4419-4c19-b139-865c7a02318f',
    pool: 'Win10Desktop',
    product: 'enzo',
    deployment: 'azure',
    smartnodeid: '5bb367cd-4419-4c19-b139-865c7a02318f'
  },
  {
    cmstenantid: 'zrsjti894l8h2jkdt0tlyjlm7ls',
    poolid: '1005-5bb367cd-4419-4c19-b139-865c7a02318f',
    pool: 'Win2016Desktop',
    product: 'enzo',
    deployment: 'azure',
    smartnodeid: '5bb367cd-4419-4c19-b139-865c7a02318f'
  },
  {
    cmstenantid: 'zrsjti894l8h2jkdt0tlyjlm7ls',
    poolid: '1006-5bb367cd-4419-4c19-b139-865c7a02318f',
    pool: 'APPFarm',
    product: 'enzo',
    deployment: 'azure',
    smartnodeid: '5bb367cd-4419-4c19-b139-865c7a02318f'
  },
  {
    cmstenantid: 'zrsjti894l8h2jkdt0tlyjlm7ls',
    poolid: '1009-5bb367cd-4419-4c19-b139-865c7a02318f',
    pool: 'test',
    product: 'enzo',
    deployment: 'azure',
    smartnodeid: '5bb367cd-4419-4c19-b139-865c7a02318f'
  }
];

export const TENANT_ID = 'zrsjti894l8h2jkdt0tlyjlm7ls';

export const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export const RESOURCE_FIELD_MAP: any = {
  CPU: 'c_total_mhz',
  MEMORY: 'm_total',
  DISK: 'd_iops'
};

export const THRESHOLDS = {
  BLAST_LATENCY: 'latency-blast'
};

export const AUTH = {
  HYDRA_AUTH_TOKEN: 'hydra-auth-token'
};
