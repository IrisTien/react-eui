import { map } from 'lodash';
import UserService from '../../../services/user_service';
import {
  TENANT_ID,
  RESOURCE_FIELD_MAP,
  THRESHOLDS,
  POOL_POD_MAP
} from './DASHBOARD-SESSION.CONSTANTS';
import DashboardService from '../../../services/dashboard_service';
import { isTSEnumMember } from '@babel/types';

const DashboardSessionService = {
  groupSessionCountByField: (field: string) => {
    return {
      terms: {
        field: field,
        size: 10,
        shard_size: 25,
        min_doc_count: 1,
        shard_min_doc_count: 0,
        show_term_doc_count_error: false,
        order: [
          {
            session_count: 'desc'
          },
          {
            _key: 'asc'
          }
        ]
      },
      aggs: {
        session_count: {
          cardinality: {
            field: 'id'
          }
        }
      }
    };
  },

  getPodNameById: (value: any) => {
    switch (value) {
      case '5bb367cd-4419-4c19-b139-865c7a02318f':
        return 'AzureQ3';
      case '74f86498-5f3b-40eb-b9ce-823ebcd4c8f0':
        return 'pod-brown-2';
      default:
        return '';
    }
  },

  generateCommonFilter: (query: any, podId?: string, poolId?: string) => {
    if (!query) {
      query = {};
    }
    if (!query.query) {
      query.query = {};
    }
    if (!query.query.bool) {
      query.query.bool = {};
    }
    if (!query.query.bool.must) {
      query.query.bool.must = [];
    }
    query.query.bool.must.push({
      term: {
        cmstenantid: {
          value: TENANT_ID,
          boost: 1
        }
      }
    });

    if (podId && podId !== 'all') {
      query.query.bool.must.push({
        terms: {
          sn_id: [podId]
        }
      });
    }

    if (poolId && poolId !== 'all') {
      query.query.bool.must.push({
        terms: {
          poolid: [poolId]
        }
      });
    }

    return query;
  },

  getSessionOverview: (podId: string, poolId?: string): any => {
    const timestamp = Math.floor((Date.now() - 5 * 60000) / 60000) * 60000;
    const query: any = {
      query: {
        bool: {
          must: [
            {
              term: {
                cmstenantid: {
                  value: TENANT_ID,
                  boost: 1
                }
              }
            },
            {
              term: {
                tag_timestamp: {
                  value: timestamp,
                  boost: 1
                }
              }
            }
          ]
        }
      },
      aggs: {
        session_count: {
          cardinality: {
            field: 'id'
          }
        },
        user_count: {
          cardinality: {
            field: 'user'
          }
        },
        status_details: DashboardSessionService.groupSessionCountByField(
          's_status'
        ),
        type_details: DashboardSessionService.groupSessionCountByField('s_type')
      }
    };

    DashboardSessionService.generateCommonFilter(query, podId, poolId);

    return UserService.searchData(query).then((res: any) => {
      if (!res || !res.aggregations) {
        return {};
      }
      const totalSessions =
        res.aggregations.session_count && res.aggregations.session_count.value;
      const totalUsers =
        res.aggregations.user_count && res.aggregations.user_count.value;
      const status_details =
        (res.aggregations.status_details &&
          res.aggregations.status_details.buckets) ||
        [];
      const type_details =
        (res.aggregations.type_details &&
          res.aggregations.type_details.buckets) ||
        [];

      const sessionDetails: any = {};

      status_details.concat(type_details).forEach((detail: any) => {
        sessionDetails[detail.key] = detail.session_count.value;
      });

      const activeSessions = sessionDetails.active;
      const disconnectedSessions = sessionDetails.disconnected;
      const desktopSessions = sessionDetails.desktop;
      const applicationSessions = sessionDetails.application;
      return {
        sessions: totalSessions || 0,
        users: totalUsers || 0,
        activeSessions: activeSessions || 0,
        disconnectedSessions: disconnectedSessions || 0,
        desktopSessions: desktopSessions || 0,
        applicationSessions: applicationSessions || 0
      };
    });
  },

  getResourceConsumptionTrend: (
    timeInterval: number,
    resourceType: string | undefined,
    podId?: string,
    poolId?: string
  ) => {
    const resourceField = resourceType
      ? RESOURCE_FIELD_MAP[resourceType]
      : RESOURCE_FIELD_MAP.CPU;
    const to = Date.now();
    const from = to - timeInterval;
    const query = {
      query: {
        bool: {
          filter: {
            range: {
              '@timestamp': {
                gte: from,
                lte: to,
                format: 'epoch_millis'
              }
            }
          }
        }
      },
      aggs: {
        resource_group: {
          terms: {
            field: 'tag_timestamp',
            size: 7 * 24 * 60,
            order: [
              {
                _key: 'asc'
              }
            ]
          },
          aggs: {
            resource: {
              sum: {
                field: resourceField
              }
            }
          }
        },
        session_group: {
          terms: {
            field: 'tag_timestamp',
            size: 7 * 24 * 60,
            order: [
              {
                _key: 'asc'
              }
            ]
          },
          aggs: {
            session_count: {
              cardinality: {
                field: 'unique_id'
              }
            },
            session_detail: {
              terms: {
                field: 's_type'
              },
              aggs: {
                session_count: {
                  cardinality: {
                    field: 'unique_id'
                  }
                }
              }
            }
          }
        }
      }
    };

    DashboardSessionService.generateCommonFilter(query, podId, poolId);

    return UserService.searchData(query).then((res: any) => {
      if (!res || !res.aggregations) {
        return {};
      }

      const resourceRaw = res.aggregations.resource_group.buckets || [];
      const resourceTrendData = resourceRaw.map((item: any) => {
        return {
          time: item.key,
          cpu: item.resource.value
        };
      });

      const sessionRaw = res.aggregations.session_group.buckets || [];
      const totalSessionData: any[] = [];
      const desktopSessionData: any[] = [];
      const applicationSessionData: any[] = [];
      sessionRaw.forEach((item: any) => {
        totalSessionData.push({
          time: item.key,
          total: item.session_count.value
        });

        item.session_detail.buckets.forEach((detail: any) => {
          if (detail.key === 'desktop') {
            desktopSessionData.push({
              time: item.key,
              desktop: detail.session_count.value
            });
          } else if (detail.key === 'application') {
            applicationSessionData.push({
              time: item.key,
              application: detail.session_count.value
            });
          }
        });
      });

      return {
        resourceTrend: resourceTrendData,
        totalTrend: totalSessionData,
        desktopTrend: desktopSessionData,
        applicationTrend: applicationSessionData
      };
    });
  },

  getSessionPerPod: (podId?: string, poolId?: string) => {
    const timestamp = Math.floor((Date.now() - 5 * 60000) / 60000) * 60000;
    const query = {
      query: {
        bool: {
          must: [
            {
              term: {
                tag_timestamp: {
                  value: timestamp,
                  boost: 1
                }
              }
            }
          ]
        }
      },
      aggs: {
        pod_session_group: {
          terms: {
            field: 'sn_id',
            order: [
              {
                _key: 'asc'
              }
            ]
          },
          aggs: {
            session_count: {
              cardinality: {
                field: 'unique_id'
              }
            }
          }
        }
      }
    };

    DashboardSessionService.generateCommonFilter(query, podId, poolId);

    return UserService.searchData(query).then((res: any) => {
      if (!res || !res.aggregations) {
        return [];
      }

      const dataRaw = res.aggregations.pod_session_group.buckets || [];
      let index = 0;
      const data = dataRaw.map((item: any) => {
        return {
          index: index++,
          pod: DashboardSessionService.getPodNameById(item.key),
          session: item.session_count.value
        };
      });

      return data;
    });
  },

  getLatencyBlastThresholds: () => {
    return DashboardService.getThresholds(THRESHOLDS.BLAST_LATENCY).then(
      (thresholdsItem: any) => {
        let latencyRanges;
        if (!thresholdsItem || !thresholdsItem.thresholds) {
          latencyRanges = {
            0: {
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
              from: 250
            }
          };
        } else {
          latencyRanges = thresholdsItem.thresholds;
        }

        return latencyRanges;
      }
    );
  },

  getSessionLatency: (podId?: string, poolId?: string) => {
    return DashboardService.getThresholds(THRESHOLDS.BLAST_LATENCY).then(
      (thresholdsItem: any) => {
        let latencyRanges;
        if (!thresholdsItem || !thresholdsItem.thresholds) {
          latencyRanges = [
            {
              key: '0',
              to: 100
            },
            {
              key: '1',
              from: 100,
              to: 150
            },
            {
              key: '2',
              from: 150,
              to: 200
            },
            {
              key: '3',
              from: 200,
              to: 250
            },
            {
              key: '4',
              from: 250
            }
          ];
        } else {
          latencyRanges = map(
            thresholdsItem.thresholds,
            (item: any, key: number) => {
              const threshold: any = {
                key: key
              };
              if (item.from) {
                threshold.from = Number(item.from);
              }
              if (item.to) {
                threshold.to = Number(item.to);
              }
              return threshold;
            }
          );
        }

        const timestamp = Math.floor((Date.now() - 5 * 60000) / 60000) * 60000;
        const query = {
          query: {
            bool: {
              must: [
                {
                  term: {
                    tag_timestamp: {
                      value: timestamp,
                      boost: 1
                    }
                  }
                }
              ]
            }
          },
          aggs: {
            latency_group: {
              range: {
                field: 'proto_rtt',
                ranges: latencyRanges
              },
              aggs: {
                session_count: {
                  cardinality: {
                    field: 'unique_id'
                  }
                }
              }
            }
          }
        };

        DashboardSessionService.generateCommonFilter(query, podId, poolId);

        return UserService.searchData(query).then((res: any) => {
          if (!res || !res.aggregations) {
            return [];
          }

          const dataRaw = res.aggregations.latency_group.buckets || [];
          let index = 0;
          const data = dataRaw.map((item: any) => {
            return {
              index: index++,
              range: item.key,
              session: item.session_count ? item.session_count.value : 0
            };
          });

          return data;
        });
      }
    );
  },

  getResourcePerPod: (resourceType: string) => {
    const timestamp = Math.floor((Date.now() - 5 * 60000) / 60000) * 60000;
    const query = {
      query: {
        bool: {
          must: [
            {
              term: {
                tag_timestamp: {
                  value: timestamp,
                  boost: 1
                }
              }
            }
          ]
        }
      },
      aggs: {
        pod_resource_group: {
          terms: {
            field: 'sn_id',
            size: 10,
            order: [
              {
                _key: 'asc'
              }
            ]
          },
          aggs: {
            resource_total: {
              sum: {
                field: RESOURCE_FIELD_MAP[resourceType]
              }
            }
          }
        }
      }
    };

    return UserService.searchData(query).then((res: any) => {
      if (!res || !res.aggregations) {
        return {};
      }

      const resourceRaw = res.aggregations.pod_resource_group.buckets || [];
      return resourceRaw.map((item: any) => {
        return {
          podName: DashboardSessionService.getPodNameById(item.key),
          resourceValue: item.resource_total.value
        };
      });
    });
  }
};

export default DashboardSessionService;
