import * as fs from 'fs';

class DashboardServiceProto {
  constructor() {}

  /***
   * Dashboards Data Example:
   * [{
   *    id: 'xxx',
   *    name: 'Dashboard Test',
   *    desp: 'Dashboard Description'
   * }]
   */
  addDashboard(name: string, desp: string) {
    const data = {
      id: (Math.random() * 10000000).toString(),
      name: name,
      desp: desp
    };

    let currentData = JSON.parse(localStorage.getItem('dashboards') || '[]');
    currentData = [...currentData, data];

    localStorage.setItem('dashboards', JSON.stringify(currentData));
    return Promise.resolve('succeed');
  }

  getDashboards() {
    const currentData = JSON.parse(localStorage.getItem('dashboards') || '[]');
    return Promise.resolve(currentData);
  }

  /**
   * Dashboard Detail Example
   * [{
   *   id: 'xxx',
   *   name: 'ddd',
   *   widgets: [
   *     {
   *       id: 'widgetId',
   *       type: 'Chart' or 'Grid',
   *       data: [
   *         {
   *             id: 'panel1data1',
   *             type: 'Bar',
   *             request: '',
   *             x: 'xField',
   *             y: 'yField'
   *         }
   *       ],
   *       axises: [
   *         {
   *           id: 'xxxxx',
   *           position: 'bottom',
   *           type: 'time'
   *         }
   *       ]
   *     }
   *   ]
   * }]
   * @param id Dashboard ID
   */
  getDashboard(id?: string) {
    const dashboardDetailList = JSON.parse(
      localStorage.getItem('dashboards-detail') || '[]'
    );
    if (id) {
      const detail = dashboardDetailList.find((item: any) => item.id === id);
      if (!detail) {
        return Promise.reject('Dashboard not exist');
      }
      return Promise.resolve(detail);
    }
    return Promise.resolve();
  }

  updateDashboard(id: string, name: string, widgets: any) {
    const dashboardDetailList = JSON.parse(
      localStorage.getItem('dashboards-detail') || '[]'
    );
    const detail = dashboardDetailList.find((item: any) => item.id === id);

    if (!detail) {
      dashboardDetailList.push({
        id: id,
        name: name,
        widgets: widgets
      });
    } else {
      detail.widgets = widgets;
    }
    localStorage.setItem(
      'dashboards-detail',
      JSON.stringify(dashboardDetailList)
    );
    return Promise.resolve('succeed');
  }
}

const DashboardService = new DashboardServiceProto();

export default DashboardService;
