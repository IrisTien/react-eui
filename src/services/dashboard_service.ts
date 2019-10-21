import * as fs from 'fs';

class DashboardServiceProto {
  constructor() {

  }

  /***
   * Dashboards Data Example:
   * [{
   *    id: 'xxx',
   *    name: 'Dashboard Test',
   *    desp: 'Dashboard Description'
   * }]
   */
  addDashboard(name: string , desp: string) {
    const data = {
      id: Math.random() * 10000000,
      name: name,
      desp: desp
    };

    let currentData = JSON.parse(localStorage.getItem('dashboards') || "[]");
    currentData = [
      ...currentData,
      data
    ]

    localStorage.setItem('dashboards', JSON.stringify(currentData));
    return Promise.resolve('succeed');
  }

  getDashboards() {
    const currentData = JSON.parse(localStorage.getItem('dashboards') || "[]");
    return Promise.resolve(currentData);
  }

  /**
   * Dashboard Detail Example
   * [{
   *   id: 'xxx',
   *   Widgets: [
   *     {
   *       type: 'Chart' or 'Grid'
   *       data: [
   *         {
   *             type: 'Bar'
   *             request: ''
   *         }
   *       ],
   *       axises: [
   *         {
   *           id: 'xxxxx'
   *           position: 'bottom'
   *         }
   *       ]
   *     }
   *   ]
   * }]
   * @param id Dashboard ID
   */
  getDashboard(id: number) {
    const dashboardDetailList = JSON.parse(localStorage.getItem('dashboards-detail') || "[]");
    const detail = dashboardDetailList.find((item: any) => item.id === id);
    if (!detail) {
      return Promise.reject('Dashboard not exist');
    }
    Promise.resolve(detail);
  }
}

const DashboardService = new DashboardServiceProto();

export default DashboardService;