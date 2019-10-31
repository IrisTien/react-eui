import UserService from '../../../services/user_service';

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

  getSessionOverview: (podId: string): any => {
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

  getResourceConsumptionTrend: () => {
    const to = Date.now();
    const from = to - 24 * 60 * 60 * 1000;
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
        cpu_abs_group: {
          terms: {
            field: 'tag_timestamp',
            order: [
              {
                _key: 'asc'
              }
            ]
          },
          aggs: {
            cpu_mhz: {
              sum: {
                field: 'c_total_mhz'
              }
            }
          }
        },
        session_group: {
          terms: {
            field: 'tag_timestamp',
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

    return UserService.searchData(query).then((res: any) => {
      if (!res || !res.aggregations) {
        return {};
      }

      const cpuRaw = res.aggregations.cpu_abs_group.buckets || [];
      const cpuTrendData = cpuRaw.map((item: any) => {
        return {
          time: item.key,
          cpu: item.cpu_mhz.value
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
        cpuTrend: cpuTrendData,
        totalTrend: totalSessionData,
        desktopTrend: desktopSessionData,
        applicationTrend: applicationSessionData
      };
    });
  },

  getSessionPerPod: () => {
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

  getSessionLatency: () => {
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
            ranges: [
              {
                key: '<100 ms',
                to: 100
              },
              {
                key: '100-150 ms',
                from: 100,
                to: 150
              },
              {
                key: '150-200 ms',
                from: 150,
                to: 200
              },
              {
                key: '200-250 ms',
                from: 200,
                to: 250
              },
              {
                key: '>250 ms',
                from: 250
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
          session: item.session_count.value
        };
      });

      return data;
    });
  }
};

export default DashboardSessionService;
