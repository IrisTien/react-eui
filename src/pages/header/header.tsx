import React, { Component } from 'react';

import {
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink
} from '@elastic/eui';

export class AppHeader extends Component {
  state = {
    isAppMenuOpen: false
  };

  render() {
    return (
      <EuiHeader>
        <EuiHeaderSectionItem border='right'>
          <EuiHeaderLogo href='#'>Product</EuiHeaderLogo>
        </EuiHeaderSectionItem>

        <EuiHeaderLinks>
          <EuiHeaderLink href='#' isActive>
            Docs
          </EuiHeaderLink>

          <EuiHeaderLink href='#'>Code</EuiHeaderLink>

          <EuiHeaderLink iconType='help' href='#'>
            Help
          </EuiHeaderLink>
        </EuiHeaderLinks>
      </EuiHeader>
    );
  }
}
