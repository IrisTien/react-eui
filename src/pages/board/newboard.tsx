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
  BarSeries,
  getSpecId,
  Axis,
  getAxisId,
  LineSeries
} from '@elastic/charts';

const NewBoard: FC = () => {
  const [optionSelected, setOptionSelected] = useState<any>({});
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
              <BarSeries
                id={getSpecId('bar-series')}
                name='Simple bar series'
                xScaleType='linear'
                yScaleType='linear'
                xAccessor='x'
                yAccessors={['y']}
                data={[{ x: 0, y: 2 }, { x: 1, y: 7 }, { x: 2, y: 3 }]}
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
              <Axis id={getAxisId('board-axis-right')} position='left' />
            </Chart>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel paddingSize='l'>
            <EuiForm>
              <EuiCheckboxGroup
                options={checkboxes}
                idToSelectedMap={optionSelected}
                onChange={(optionId: any) => {
                  setOptionSelected({
                    ...optionSelected,
                    [optionId]: !optionSelected[optionId]
                  });
                }}
              />
            </EuiForm>
          </EuiPanel>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiPanel paddingSize='l'>
            <p>option selected:</p>
            <p>{JSON.stringify(optionSelected)}</p>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPageBody>
  );
};

export default NewBoard;
