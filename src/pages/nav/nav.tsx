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
  keyCodes
} from '@elastic/eui';

import AppRouterService from '../../app_router';

export class AppNav extends Component<any> {
  state = {};
  navDrawerRef: any;

  faveExtraAction = {
    color: 'subdued',
    iconType: 'starEmpty',
    iconSize: 's',
    'aria-label': 'Add to favorites'
  };

  pinExtraAction: any = {
    color: 'subdued',
    iconType: 'pin',
    iconSize: 's'
  };

  pinExtraActionFn = (val: any) => {
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
            extraAction: this.faveExtraAction
          },
          {
            label: 'Workpad with title that wraps',
            href: '#/layout/nav-drawer',
            iconType: 'canvasApp',
            extraAction: this.faveExtraAction
          },
          {
            label: 'My logs',
            href: '#/layout/nav-drawer',
            iconType: 'logsApp',
            'aria-label': 'This is an alternate aria-label',
            extraAction: this.faveExtraAction
          }
        ]
      }
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
              alwaysShow: true
            }
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
              alwaysShow: true
            }
          }
        ]
      }
    }
  ];

  exploreLinks = [
    {
      label: 'Session',
      href: 'app/session',
      iconType: 'canvasApp',
      extraAction: {
        ...this.pinExtraActionFn('Canvas'),
        alwaysShow: true
      }
    },
    {
      label: 'Board',
      href: 'app/board',
      iconType: 'discoverApp',
      extraAction: { ...this.pinExtraActionFn('Discover') }
    },
    {
      label: 'Board',
      href: 'app/newBoard',
      iconType: 'visualizeApp',
      extraAction: { ...this.pinExtraActionFn('Visualize') }
    },
    {
      label: 'Dashboard',
      href: 'app/layout/dashboards',
      iconType: 'dashboardApp',
      extraAction: { ...this.pinExtraActionFn('Dashboard') }
    },
    {
      label: 'Machine learning',
      href: '#/layout/nav-drawer',
      iconType: 'machineLearningApp',
      extraAction: { ...this.pinExtraActionFn('Machine learning') }
    },
    {
      label: 'Custom Plugin (no icon)',
      href: '#/layout/nav-drawer',
      extraAction: { ...this.pinExtraActionFn('Custom Plugin') }
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
      )
    }
  ];

  solutionsLinks = [
    {
      label: 'APM',
      href: '#/layout/nav-drawer',
      iconType: 'apmApp',
      extraAction: { ...this.pinExtraActionFn('APM') }
    },
    {
      label: 'Metrics',
      href: '#/layout/nav-drawer',
      iconType: 'metricsApp',
      extraAction: { ...this.pinExtraActionFn('Infrastructure') }
    },
    {
      label: 'Logs',
      href: '#/layout/nav-drawer',
      iconType: 'logsApp',
      extraAction: { ...this.pinExtraActionFn('Log viewer') }
    },
    {
      label: 'Uptime',
      href: '#/layout/nav-drawer',
      iconType: 'upgradeAssistantApp',
      extraAction: { ...this.pinExtraActionFn('Uptime') }
    },
    {
      label: 'Maps',
      href: '#/layout/nav-drawer',
      iconType: 'gisApp',
      extraAction: { ...this.pinExtraActionFn('Maps') }
    },
    {
      label: 'SIEM',
      href: '#/layout/nav-drawer',
      iconType: 'securityAnalyticsApp',
      extraAction: { ...this.pinExtraActionFn('SIEM') }
    }
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
              'aria-label': 'Add to favorites'
            }
          },
          {
            label: 'Stack Monitoring',
            href: '#/layout/nav-drawer',
            iconType: 'monitoringApp',
            extraAction: {
              color: 'subdued',
              iconType: 'starEmpty',
              iconSize: 's',
              'aria-label': 'Add to favorites'
            }
          },
          {
            label: 'Stack Management',
            href: '#/layout/nav-drawer',
            iconType: 'managementApp',
            extraAction: {
              color: 'subdued',
              iconType: 'starEmpty',
              iconSize: 's',
              'aria-label': 'Add to favorites'
            }
          }
        ]
      }
    }
  ];

  renderMenuTrigger() {
    return (
      <EuiHeaderSectionItemButton aria-label="Open nav">
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
  };

  setNavDrawerRef = (ref: any) => (this.navDrawerRef = ref);

  render() {
    this.exploreLinks.forEach((link: any) => {
      link.onClick = (event: any) => {
        if (
          !event.defaultPrevented && // onClick prevented default
          event.button === 0 && // ignore everything but left clicks
          !this.isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
          event.preventDefault();
          AppRouterService.navigateToApp({ path: link.href });
        }
      };
    });
    return (
      <>
        <EuiHeader className="app-header">
          <EuiHeaderSection grow={false}>
            <EuiHeaderSectionItem border="right">
              <EuiHeaderLogo href="#">Cloud Monitoring</EuiHeaderLogo>
            </EuiHeaderSectionItem>

            <EuiHeaderLinks>
              <EuiHeaderLink href="#">Docs</EuiHeaderLink>

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
      </>
    );
  }

  private isModifiedEvent(event: any) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
  }
}
