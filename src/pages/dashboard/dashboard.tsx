import React, { FC, useState, useEffect } from 'react';
import {
  EuiPageBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiPageContent,
  EuiFlexItem
} from '@elastic/eui';
import { DemoBarChart } from './demo-bar-chart';
import { useParams } from 'react-router';
import DashboardService from '../../services/dashboard_service';
import {
  BarSeries,
  Axis,
  timeFormatter,
  niceTimeFormatByDay,
  Chart,
  LineSeries
} from '@elastic/charts';
import { EuiPanel } from '@elastic/eui';
import { EuiFlexGroup } from '@elastic/eui';
import { EuiSpacer } from '@elastic/eui';
import UserService from '../../services/user_service';
import { EuiButton } from '@elastic/eui';
import './dashboard.scss';
import VisualizationForm from './create-visualization-form';

const Dashboard: FC = () => {
  let { id } = useParams();

  const [dashboardId, setDashboardId] = useState(id);
  const [title, setTitle] = useState();
  const [chartDef, setChartDef] = useState([]);
  const [chartData, setChartData] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    DashboardService.getDashboard(Number(dashboardId)).then(detail => {
      if (detail) {
        setTitle(detail.name || '');
        if (detail.widgets && detail.widgets.length) {
          detail.widgets.forEach((widget: any) => {
            if (widget.type === 'Chart') {
              setChartDef(chartDef.concat(widget));
            }
            widget.data.forEach((dataItem: any) => {
              if (dataItem.request) {
                UserService.searchDataByQueryBody(dataItem.request).then(
                  (resp: any) => {
                    let data =
                      (resp.aggregations &&
                        resp.aggregations.agg_field &&
                        resp.aggregations.agg_field.buckets) ||
                      [];
                    data = data.map((item: any) => {
                      item.avg_d = item.avg_d.value;
                      return item;
                    });
                    setChartData({
                      ...chartData,
                      [dataItem.id]: data
                    });
                  }
                );
              }
            });
          });
        }
      }
    });
    return () => {
      setDashboardId(dashboardId);
      setTitle('');
      setChartDef([]);
      setChartData({});
    };
  }, [dashboardId]);

  const renderChartWidgets = () => {
    return chartDef.map((widget: any) => {
      if (widget.data) {
        let series = widget.data.map((item: any) => {
          if (item.type === 'Line') {
            return (
              <LineSeries
                id={item.id}
                data={chartData[item.id] || []}
                xAccessor={'key'}
                yAccessors={['avg_d']}
                xScaleType='time'
              />
            );
          }
        });
        let axis = widget.axis.map((item: any) => {
          if (item.type === 'time') {
            return (
              <Axis
                id={item.id}
                position={item.position}
                tickFormat={timeFormatter(niceTimeFormatByDay(7))}
              />
            );
          } else {
            return <Axis id={item.id} position={item.position} showGridLines />;
          }
        });
        return (
          <EuiFlexItem key={widget.id}>
            <EuiPanel>
              <Chart size={{ height: 200 }}>
                {series}
                {axis}
              </Chart>
            </EuiPanel>
          </EuiFlexItem>
        );
      }
    });
  };

  const closeVisualizationCreateModal = () => {
    setIsModalVisible(false);
  };

  const renderModal = () => {
    if (isModalVisible) {
      return (
        <VisualizationForm
          onClose={closeVisualizationCreateModal}
        ></VisualizationForm>
      );
    }
  };

  return (
    <>
      <EuiPageBody>
        <EuiPageHeader>
          <EuiPageHeaderSection className='dashboard-header'>
            <EuiFlexGroup alignItems='center'>
              <EuiFlexItem>
                <EuiTitle size='l'>
                  <h1>{title}</h1>
                </EuiTitle>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButton fill onClick={() => setIsModalVisible(true)}>
                  New Visualization
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiFlexGroup>{renderChartWidgets()}</EuiFlexGroup>
        <EuiSpacer />
        <EuiFlexGroup>
          <EuiFlexItem key={'panelItems'}>
            {/* <EuiPanel onClick={() => window.alert('Panel clicked')}>
                <p>Hover me to see my hover state.</p>
              </EuiPanel> */}
            <EuiPanel>
              <DemoBarChart />
            </EuiPanel>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPageBody>
      {renderModal()}
    </>
  );
};

export default Dashboard;
