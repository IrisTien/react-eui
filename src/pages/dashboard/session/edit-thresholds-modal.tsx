import { FC, useState, useEffect } from 'react';
import React from 'react';
import {
  EuiOverlayMask,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiForm,
  EuiSpacer,
  EuiModalFooter,
  EuiButtonEmpty,
  EuiButton,
  EuiFormControlLayoutDelimited
} from '@elastic/eui';
import { map } from 'lodash';
import DashboardService from '../../../services/dashboard_service';
import { THRESHOLDS } from './DASHBOARD-SESSION.CONSTANTS';

type EditThresholdsModalPropTypes = {
  onClose: any;
  onSave?: any;
};

const EditThresholdsModal: FC<EditThresholdsModalPropTypes> = props => {
  const [ranges, setRanges] = useState<any>({
    0: {
      from: undefined,
      to: 100
    },
    1: {
      from: 100,
      to: 150
    },
    2: {
      from: 150,
      to: 200
    },
    3: {
      from: 200,
      to: 250
    },
    4: {
      from: 250,
      to: undefined
    }
  });

  // useEffect(() => {
  //   DashboardService.getThresholds(THRESHOLDS.BLAST_LATENCY).then(
  //     (thresholdsItem: any) => {
  //       if (!thresholdsItem || !thresholdsItem.thresholds) {
  //         setRanges(thresholdsItem.thresholds);
  //       }
  //     }
  //   );
  //   return () => {};
  // });

  const onRangeSet = (value: number, key: number, field: string) => {
    let newRange: any = {
      [field]: value
    };
    if (field === 'from') {
      newRange.to = ranges[key].to;
    } else {
      newRange.from = ranges[key].from;
    }

    const newRangeList = {
      ...ranges,
      [key]: newRange
    };
    setRanges(newRangeList);
  };

  const onSave = () => {
    DashboardService.updateThresholds(THRESHOLDS.BLAST_LATENCY, ranges);
    props.onClose();
  };

  const renderRangesFields = () => {
    const fields = map(ranges, (item: any, key: number) => {
      const space = key !== 0 ? <EuiSpacer size='m' /> : <></>;
      return (
        <>
          {space}
          <EuiFormControlLayoutDelimited
            key={key}
            startControl={
              <input
                type='number'
                placeholder='0'
                className='euiFieldNumber'
                value={item.from}
                onChange={(e: any) => onRangeSet(e.target.value, key, 'from')}
              />
            }
            endControl={
              <input
                type='number'
                placeholder='0'
                className='euiFieldNumber'
                value={item.to}
                onChange={(e: any) => onRangeSet(e.target.value, key, 'to')}
              />
            }
          />
        </>
      );
    });
    return fields;
  };
  return (
    <EuiOverlayMask>
      <EuiModal onClose={props.onClose}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>Thresholds</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiForm>{renderRangesFields()}</EuiForm>
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

export default EditThresholdsModal;
