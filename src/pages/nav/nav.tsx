import React, { Component } from 'react';

import {
  EuiHeader,
  EuiHeaderLink,
  EuiHeaderLinks,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiHeaderSectionItemButton,
  EuiHeaderLogo,
  EuiIcon,
  EuiImage,
  // @ts-ignore
  EuiNavDrawerGroup,
  // @ts-ignore
  EuiNavDrawer,
  EuiHorizontalRule,
  EuiFocusTrap,
} from '@elastic/eui';

import { keyCodes } from '@elastic/eui/lib/services';
import './nav.scss';

export class AppNav extends Component {
  state = {};
  navDrawerRef: any;

  faveExtraAction = {
    color: 'subdued',
    iconType: 'starEmpty',
    iconSize: 's',
    'aria-label': 'Add to favorites',
  };

  pinExtraAction: any = {
    color: 'subdued',
    iconType: 'pin',
    iconSize: 's',
  };

  pinExtraActionFn = (val:any) => {
    this.pinExtraAction['aria-label'] = `Pin ${val} to top`;
    return this.pinExtraAction;
  };

  topLinks = [
    {
      label: 'Recently viewed',
      iconType: 'clock',
      flyoutMenu: {
        title: 'Recent items',
        listItems: [
          {
            label: 'My dashboard',
            href: '#/layout/nav-drawer',
            iconType: 'dashboardApp',
            extraAction: this.faveExtraAction,
          },
          {
            label: 'Workpad with title that wraps',
            href: '#/layout/nav-drawer',
            iconType: 'canvasApp',
            extraAction: this.faveExtraAction,
          },
          {
            label: 'My logs',
            href: '#/layout/nav-drawer',
            iconType: 'logsApp',
            'aria-label': 'This is an alternate aria-label',
            extraAction: this.faveExtraAction,
          },
        ],
      },
    },
    {
      label: 'Favorites',
      iconType: 'starEmpty',
      flyoutMenu: {
        title: 'Favorite items',
        listItems: [
          {
            label: 'My workpad',
            href: '#/layout/nav-drawer',
            iconType: 'canvasApp',
            extraAction: {
              color: 'subdued',
              iconType: 'starFilled',
              iconSize: 's',
              'aria-label': 'Remove from favorites',
              alwaysShow: true,
            },
          },
          {
            label: 'My logs',
            href: '#/layout/nav-drawer',
            iconType: 'logsApp',
            extraAction: {
              color: 'subdued',
              iconType: 'starFilled',
              iconSize: 's',
              'aria-label': 'Remove from favorites',
              alwaysShow: true,
            },
          },
        ],
      },
    },
  ];

  exploreLinks = [
    {
      label: 'Canvas',
      href: '#/layout/nav-drawer',
      iconType: 'canvasApp',
      isActive: true,
      extraAction: {
        ...this.pinExtraActionFn('Canvas'),
        alwaysShow: true,
      },
    },
    {
      label: 'Discover',
      href: '#/layout/nav-drawer',
      iconType: 'discoverApp',
      extraAction: { ...this.pinExtraActionFn('Discover') },
    },
    {
      label: 'Visualize',
      href: '#/layout/nav-drawer',
      iconType: 'visualizeApp',
      extraAction: { ...this.pinExtraActionFn('Visualize') },
    },
    {
      label: 'Dashboard',
      href: '#/layout/dashboards',
      iconType: 'dashboardApp',
      extraAction: { ...this.pinExtraActionFn('Dashboard') },
    },
    {
      label: 'Machine learning',
      href: '#/layout/nav-drawer',
      iconType: 'machineLearningApp',
      extraAction: { ...this.pinExtraActionFn('Machine learning') },
    },
    {
      label: 'Custom Plugin (no icon)',
      href: '#/layout/nav-drawer',
      extraAction: { ...this.pinExtraActionFn('Custom Plugin') },
    },
    {
      label: 'Nature Plugin (image as icon)',
      href: '#/layout/nav-drawer',
      extraAction: { ...this.pinExtraActionFn('Nature Plugin') },
      icon: (
        <EuiImage
          size="s"
          alt="Random nature image"
          url="https://source.unsplash.com/300x300/?Nature"
        />
      ),
    },
  ];

  solutionsLinks = [
    {
      label: 'APM',
      href: '#/layout/nav-drawer',
      iconType: 'apmApp',
      extraAction: { ...this.pinExtraActionFn('APM') },
    },
    {
      label: 'Metrics',
      href: '#/layout/nav-drawer',
      iconType: 'metricsApp',
      extraAction: { ...this.pinExtraActionFn('Infrastructure') },
    },
    {
      label: 'Logs',
      href: '#/layout/nav-drawer',
      iconType: 'logsApp',
      extraAction: { ...this.pinExtraActionFn('Log viewer') },
    },
    {
      label: 'Uptime',
      href: '#/layout/nav-drawer',
      iconType: 'upgradeAssistantApp',
      extraAction: { ...this.pinExtraActionFn('Uptime') },
    },
    {
      label: 'Maps',
      href: '#/layout/nav-drawer',
      iconType: 'gisApp',
      extraAction: { ...this.pinExtraActionFn('Maps') },
    },
    {
      label: 'SIEM',
      href: '#/layout/nav-drawer',
      iconType: 'securityAnalyticsApp',
      extraAction: { ...this.pinExtraActionFn('SIEM') },
    },
  ];

  adminLinks = [
    {
      label: 'Admin',
      iconType: 'managementApp',
      flyoutMenu: {
        title: 'Tools and settings',
        listItems: [
          {
            label: 'Dev tools',
            href: '#/layout/nav-drawer',
            iconType: 'devToolsApp',
            extraAction: {
              color: 'subdued',
              iconType: 'starEmpty',
              iconSize: 's',
              'aria-label': 'Add to favorites',
            },
          },
          {
            label: 'Stack Monitoring',
            href: '#/layout/nav-drawer',
            iconType: 'monitoringApp',
            extraAction: {
              color: 'subdued',
              iconType: 'starEmpty',
              iconSize: 's',
              'aria-label': 'Add to favorites',
            },
          },
          {
            label: 'Stack Management',
            href: '#/layout/nav-drawer',
            iconType: 'managementApp',
            extraAction: {
              color: 'subdued',
              iconType: 'starEmpty',
              iconSize: 's',
              'aria-label': 'Add to favorites',
            },
          },
        ],
      },
    },
  ];

  renderMenuTrigger() {
    return (
      <EuiHeaderSectionItemButton
        aria-label="Open nav">
        <EuiIcon type="apps" href="#" size="m" />
      </EuiHeaderSectionItemButton>
    );
  }

  renderLogo() {
    return (
      <EuiHeaderLogo
        iconType="logoKibana"
        href="#/layout/nav-drawer"
        aria-label="Goes to home"
      />
    );
  }

  onKeyDown = (event: any) => {
    if (event.keyCode === keyCodes.ESCAPE) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  setNavDrawerRef = (ref: any) => (this.navDrawerRef = ref);

  render() {
    return (
      <EuiFocusTrap>
        <EuiHeader>
          <EuiHeaderSection grow={false}>
            <EuiHeaderSectionItem border="right">
            <EuiHeaderLogo href="#">Cloud Monitoring</EuiHeaderLogo>
          </EuiHeaderSectionItem>

          <EuiHeaderLinks>
            <EuiHeaderLink href="#">
              Docs
            </EuiHeaderLink>

            <EuiHeaderLink href="#">Code</EuiHeaderLink>

            <EuiHeaderLink iconType="help" href="#">
              Help
            </EuiHeaderLink>
          </EuiHeaderLinks>
          </EuiHeaderSection>
        </EuiHeader>
        <EuiNavDrawer ref={this.setNavDrawerRef} showExpandButton={true}>
          <EuiNavDrawerGroup listItems={this.topLinks} />
          <EuiHorizontalRule margin="none" />
          <EuiNavDrawerGroup listItems={this.exploreLinks} />
          <EuiHorizontalRule margin="none" />
          <EuiNavDrawerGroup listItems={this.solutionsLinks} />
          <EuiHorizontalRule margin="none" />
          <EuiNavDrawerGroup listItems={this.adminLinks} />
        </EuiNavDrawer>
      </EuiFocusTrap>
    );
  }
}