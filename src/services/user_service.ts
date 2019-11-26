import HttpService from './http_service';
import { DataGenerator } from '@elastic/charts';
import { AxiosRequestConfig } from 'axios';
import EnvService from './env_service';

// const BASE_URL = '/session-data-v1/_search';
const BASE_URL = 'https://exp.cms-958587118673.com/session-data-v1/_search';

const DEFAULT_CONFIG: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
};

const generateConfig = () => {
  const config = { ...DEFAULT_CONFIG };
  config.headers.Authorization = `Bearer ${EnvService.token}`;
  return config;
};

class UserAPI {
  getInfo() {
    return HttpService.get('/xxx')
      .then(data => {
        return 'sample';
      })
      .catch(err => {
        const dg = new DataGenerator();
        return dg.generateGroupedSeries(20, 5);
      });
  }

  getLineChartData() {
    return HttpService.get('/xxx')
      .then(data => {
        return 'sample';
      })
      .catch(err => {
        const dg = new DataGenerator();
        return dg.generateGroupedSeries(20, 1);
      });
  }

  getDiskBpsTrend(from: number, to: number) {
    const aggreDataField = 'sessions_over_time';
    const body = {
      query: {
        bool: {
          filter: {
            range: {
              '@timestamp': {
                gte: from,
                lte: to,
                format: 'epoch_millis'
              }
            }
          }
        }
      },
      aggs: {
        [aggreDataField]: {
          date_histogram: {
            field: '@timestamp',
            interval: '1h'
          },
          aggs: {
            avg_d: {
              avg: {
                field: 'd_bps'
              }
            }
          }
        }
      }
    };
    return HttpService.post(BASE_URL, body, generateConfig());
  }

  searchDataByQueryBody(query: any) {
    let to = Date.now();
    let from = to - 30 * 24 * 60 * 60 * 1000;
    query = {
      ...query,
      query: {
        bool: {
          filter: {
            range: {
              '@timestamp': {
                gte: from,
                lte: to,
                format: 'epoch_millis'
              }
            }
          }
        }
      }
    };
    return HttpService.post(BASE_URL, query, generateConfig());
  }

  searchData(query: any) {
    return HttpService.post(BASE_URL, query, generateConfig());
  }
}

const UserService = new UserAPI();
export default UserService;
