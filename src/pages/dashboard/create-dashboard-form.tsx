import { Component } from 'react';
import React from 'react';
import {
  EuiOverlayMask,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiTextArea,
  EuiButton,
  EuiButtonEmpty
} from '@elastic/eui';
import DashboardService from '../../services/dashboard_service';

type CreateDashboardPropsType = {
  onClose?: any;
};

type CreateDashboardState = {
  name: string;
  desp: string;
};

export class CreateDashboardForm extends Component<
  CreateDashboardPropsType,
  CreateDashboardState
> {
  constructor(props: CreateDashboardPropsType) {
    super(props);

    this.onSave = this.onSave.bind(this);
  }

  state = {
    name: '',
    desp: ''
  };

  onSave() {
    DashboardService.addDashboard(this.state.name, this.state.desp).then(() => {
      this.props.onClose();
    });
  }

  render() {
    return (
      <EuiOverlayMask>
        <EuiModal onClose={this.props.onClose}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>New Dashboard</EuiModalHeaderTitle>
          </EuiModalHeader>

          <EuiModalBody>
            <EuiForm>
              <EuiFormRow label='Title'>
                <EuiFieldText
                  value={this.state.name}
                  placeholder='New Dashboard'
                  onChange={event =>
                    this.setState({ name: event.target.value })
                  }
                />
              </EuiFormRow>
              <EuiFormRow label='Description'>
                <EuiTextArea
                  value={this.state.desp}
                  onChange={event =>
                    this.setState({ desp: event.target.value })
                  }
                />
              </EuiFormRow>
            </EuiForm>
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButtonEmpty onClick={this.props.onClose}>Cancel</EuiButtonEmpty>
            <EuiButton onClick={this.onSave} fill>
              Confirm Save
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    );
  }
}
