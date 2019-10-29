import React, { useState, FC, useEffect } from 'react';
import {
  EuiOverlayMask,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiSelect,
  EuiModalFooter,
  EuiButtonEmpty,
  EuiButton,
  EuiTextArea,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTitle,
  EuiText,
  EuiSpacer,
  EuiPanel
} from '@elastic/eui';
import './visualization-form.scss';
import {
  Chart,
  LineSeries,
  getAxisId,
  Axis,
  timeFormatter,
  niceTimeFormatByDay
} from '@elastic/charts';
import { debounce } from 'lodash';
import useDebounce from '../../common/useDebounce';
import UserService from '../../services/user_service';
import DashboardService from '../../services/dashboard_service';

type visualizationPropsType = {
  onClose?: any;
  dashboardId?: string;
};

const VisualizationForm: FC<visualizationPropsType> = (props: any) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [name, setName] = useState('');
  const [visualType, setVisualType] = useState();
  const [queryBody, setQueryBody] = useState('');
  const [chartDef, setChartDef] = useState<any>({});
  const [chartData, setChartData] = useState([]);
  const debouncedQueryBody = useDebounce(queryBody, 500);

  const visualTypeOptions = [
    {
      value: 'Bar',
      text: 'Bar Chart'
    },
    {
      value: 'Line',
      text: 'Line Chart'
    }
  ];

  useEffect(() => {
    if (debouncedQueryBody) {
      try {
        const body = JSON.parse(debouncedQueryBody);
        UserService.searchDataByQueryBody(body).then((resp: any) => {
          let data =
            (resp.aggregations &&
              resp.aggregations.agg_field &&
              resp.aggregations.agg_field.buckets) ||
            [];
          data = data.map((item: any) => {
            item.avg_d = item.avg_d.value;
            return item;
          });
          setChartData(data);
          if (chartDef && chartDef.data) {
            setChartDef({
              ...chartDef,
              data: [
                {
                  ...chartDef.data[0],
                  request: JSON.parse(debouncedQueryBody)
                }
              ]
            });
          }
        });
      } catch (err) {}
    }
  }, [debouncedQueryBody]);

  const onSave = () => {
    let widgets: any;
    DashboardService.getDashboard(props.dashboardId)
      .then(dashboardDetail => {
        widgets = dashboardDetail.widgets || [];
      })
      .catch(() => {
        widgets = [];
      })
      .finally(() => {
        widgets.push({
          ...chartDef,
          axis: [
            {
              id: (Math.random() * 10000000).toString(),
              position: 'bottom',
              type: 'time'
            },
            {
              id: (Math.random() * 10000000).toString(),
              position: 'left',
              type: ''
            }
          ]
        });
        DashboardService.updateDashboard(props.dashboardId, name, widgets).then(
          () => {
            props.onClose();
          }
        );
      });
    console.log('save the visualization!');
  };

  const onVisualTypeSelect = (e: any) => {
    setVisualType(e.target.value);
    setIsAvailable(true);
    setChartDef({
      ...chartDef,
      id: (Math.random() * 10000000).toString(),
      type: 'Chart',
      data: [
        {
          id: (Math.random() * 10000000).toString(),
          type: e.target.value
        }
      ]
    });
  };

  const showPreview = () => {
    if (chartDef && chartDef.data && chartDef.data.request) {
      console.log(chartDef.data.request);
    }

    if (isAvailable) {
      let series;
      let axis;
      if (chartDef && chartDef.data && chartDef.data.length) {
        const chartDataDef = chartDef.data[0];
        if (chartDataDef.type === 'Line') {
          series = (
            <LineSeries
              id={chartDataDef.id}
              data={chartData || []}
              xAccessor={'key'}
              yAccessors={['avg_d']}
              xScaleType='time'
            />
          );
          axis = (
            <>
              <Axis
                id={getAxisId('create-visual-bottom-axis')}
                position='bottom'
                tickFormat={timeFormatter(niceTimeFormatByDay(7))}
              />
              <Axis
                id={getAxisId('create-visual-left-axis')}
                position='left'
                showGridLines
              />
            </>
          );
        }
      }
      return (
        <EuiPanel>
          <Chart size={{ height: 300 }}>
            {series}
            {axis}
          </Chart>
        </EuiPanel>
      );
    } else {
      return (
        <>
          <EuiTitle size='s'>
            <h2>Select a visualization type</h2>
          </EuiTitle>
          <EuiSpacer size='s' />
          <EuiText>
            <p>
              Start creating your visualization by selecting a type for that
              visualization.
            </p>
          </EuiText>
        </>
      );
    }
  };

  return (
    <EuiOverlayMask>
      <EuiModal onClose={props.onClose} className='visualization-form'>
        <EuiModalHeader>
          <EuiModalHeaderTitle>New Visualization</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiFlexGroup>
            <EuiFlexItem grow={1}>
              <EuiForm>
                <EuiFormRow label='Title'>
                  <EuiFieldText
                    value={name}
                    placeholder='New Visualization'
                    onChange={event => {
                      setName(event.target.value);
                      setChartDef({
                        ...chartDef,
                        name: name
                      });
                    }}
                  />
                </EuiFormRow>
                <EuiFormRow>
                  <EuiSelect
                    hasNoInitialSelection={true}
                    options={visualTypeOptions}
                    value={visualType}
                    onChange={onVisualTypeSelect}
                  />
                </EuiFormRow>
                <EuiFormRow label='Description'>
                  <EuiTextArea
                    value={queryBody}
                    onChange={(e: any) => setQueryBody(e.target.value)}
                  />
                </EuiFormRow>
              </EuiForm>
            </EuiFlexItem>
            <EuiFlexItem grow={1}>{showPreview()}</EuiFlexItem>
          </EuiFlexGroup>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButtonEmpty onClick={props.onClose}>Cancel</EuiButtonEmpty>
          <EuiButton onClick={onSave} fill>
            Confirm Save
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    </EuiOverlayMask>
  );
};

export default VisualizationForm;
