import React, { useState, FC } from 'react';
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
  EuiButton
} from '@elastic/eui';
import './visualization-form.scss';
import { EuiFlexGroup } from '@elastic/eui';
import { EuiFlexItem } from '@elastic/eui';
import { EuiTitle } from '@elastic/eui';
import { EuiText } from '@elastic/eui';
import { EuiSpacer } from '@elastic/eui';

type visualizationPropsType = {
  onClose?: any;
};

const VisualizationForm: FC<visualizationPropsType> = (props: any) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [visualType, setVisualType] = useState();
  const [chartDef, setChartDef] = useState<any>({});
  const [chartData, setChartData] = useState();

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

  const onSave = () => {
    console.log('save the visualization!');
  };

  const onVisualTypeSelect = (e: any) => {
    setVisualType(e.target.value);
    setIsAvailable(true);
    setChartDef({
      ...chartDef,
      data: [
        {
          type: e.target.value
        }
      ]
    });
  };

  const showPreview = () => {
    if (isAvailable) {
      return <h1>Preview</h1>;
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
                    value={chartDef.name}
                    placeholder='New Visualization'
                    onChange={event =>
                      setChartDef({
                        ...chartDef,
                        name: event.target.value
                      })
                    }
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
