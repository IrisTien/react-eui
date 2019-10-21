import HttpService from './http_service';
import { DataGenerator } from '@elastic/charts';

class UserAPI {
  getInfo() {
    return HttpService.get('/xxx').then((data) => {
      return 'sample';
    }).catch(err => {
      const dg = new DataGenerator();
      return dg.generateGroupedSeries(20, 5);
    });
  }

  getLineChartData() {
    return HttpService.get('/xxx').then((data) => {
      return 'sample';
    }).catch(err => {
      const dg = new DataGenerator();
      return dg.generateGroupedSeries(20, 1);
    })
  }
}

const UserService = new UserAPI();
export default UserService;