import { FC, useState } from 'react';
import React from 'react';
import {
  EuiPageBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiPanel,
  EuiCode,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCard,
  EuiIcon,
  EuiSpacer,
  EuiForm,
  EuiText,
  EuiFieldText,
  EuiCheckboxGroup,
  EuiRadioGroup,
  EuiButton
} from '@elastic/eui';
import {
  Chart,
  Settings,
  BarSeries,
  getSpecId,
  Axis,
  getAxisId,
  LineSeries
} from '@elastic/charts';
import ResultPanel from './board-result-panel';

const DashboardBoard: FC = () => {
  const checkboxes = [
    {
      id: `option0`,
      label: 'Option one'
    },
    {
      id: `option1`,
      label: 'Option two is checked by default'
    },
    {
      id: `option2`,
      label: 'Option three'
    }
  ];

  const [checkboxSelected, setCheckboxSelected] = useState<any>({
    option1: true
  });

  const renderCards = () => {
    const icons = ['Beats', 'Cloud', 'Logging', 'Kibana'];
    return icons.map(function(item, index) {
      return (
        <EuiFlexItem key={index}>
          <EuiCard
            icon={<EuiIcon size='xxl' type={`logo${item}`} />}
            title={`Elastic ${item}`}
            isDisabled={item === 'Kibana' ? true : false}
            description="Example of a card's description. Stick to one or two sentences."
            onClick={() => window.alert('Card clicked')}
          />
        </EuiFlexItem>
      );
    });
  };

  return (
    <EuiPageBody>
      <EuiPageHeader>
        <EuiPageHeaderSection>
          <EuiTitle size='l'>
            <h1>Board</h1>
          </EuiTitle>
        </EuiPageHeaderSection>
      </EuiPageHeader>
      <EuiFlexGroup>{renderCards()}</EuiFlexGroup>
      <EuiSpacer size='l' />
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel paddingSize='l'>
            <Chart size={{ height: 300 }}>
              <Settings showLegend />
              <BarSeries
                id={getSpecId('board-bar')}
                xScaleType='linear'
                yScaleType='linear'
                xAccessor='x'
                yAccessors={['y']}
                data={[{ x: 0, y: 2 }, { x: 1, y: 8 }, { x: 2, y: 9 }]}
              />
              <LineSeries
                id={getSpecId('board-line')}
                xScaleType='linear'
                yScaleType='linear'
                xAccessor='x'
                yAccessors={['y']}
                data={[{ x: 0, y: 5 }, { x: 1, y: 6 }, { x: 2, y: 7 }]}
              />
              <Axis
                id={getAxisId('board-axis-bottom')}
                position='bottom'
                title='Bottom Axis'
              />
              <Axis
                id={getAxisId('board-axis-left')}
                position='left'
                title='Bar Axis'
              />
            </Chart>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel paddingSize='l'>
            <EuiForm>
              <EuiFieldText
                placeholder='Placeholder text'
                value=''
                onChange={() => {}}
                aria-label='Use aria labels when no actual label is in use'
              />
              <EuiSpacer />
              <EuiCheckboxGroup
                options={checkboxes}
                idToSelectedMap={checkboxSelected}
                onChange={(optionId: any) => {
                  const selectionMap = {
                    ...checkboxSelected,
                    ...{
                      [optionId]: !checkboxSelected[optionId]
                    }
                  };
                  setCheckboxSelected(selectionMap);
                  console.log(selectionMap);
                }}
              />
              <EuiSpacer />
              <EuiRadioGroup
                options={checkboxes}
                idSelected={checkboxes[0].id}
                onChange={() => {}}
                disabled
              />
              <EuiSpacer />
              <EuiButton type='submit' fill>
                Save form
              </EuiButton>
            </EuiForm>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <ResultPanel checkboxSelected={checkboxSelected} />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageBody>
  );
};

export default DashboardBoard;
