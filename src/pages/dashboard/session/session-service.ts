import UserService from '../../../services/user_service';

const DashboardSessionService = {
  getSessionOverview: (podId: string): any => {
    const to = Date.now();
    const from = to - 5 * 60 * 1000;
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
        details: {
          filters: {
            filters: {
              active_sessions: {
                match: {
                  s_status: 'active'
                }
              },
              idle_sessions: {
                match: {
                  s_status: 'idle'
                }
              },
              disconnected_sessions: {
                match: {
                  s_status: 'disconnected'
                }
              },
              desktop_sessions: {
                match: {
                  s_type: 'desktop'
                }
              },
              application_sessions: {
                match: {
                  s_type: 'application'
                }
              }
            }
          },
          aggs: {
            session_count: {
              cardinality: {
                field: 'id'
              }
            }
          }
        }
      }
    };
    return UserService.searchDataByQueryBody(query).then((res: any) => {
      if (!res || !res.aggregations) {
        return {};
      }
      const totalSessions =
        res.aggregations.session_count && res.aggregations.session_count.value;
      const totalUsers =
        res.aggregations.user_count && res.aggregations.user_count.value;
      const details =
        res.aggregations.details && res.aggregations.details.buckets;
      const activeSessions = details.active_sessions.session_count.value;
      const idleSessions = details.idle_sessions.session_count.value;
      const disconnectedSessions =
        details.disconnected_sessions.session_count.value;
      const desktopSessions = details.desktop_sessions.session_count.value;
      const applicationSessions =
        details.application_sessions.session_count.value;
      return {
        sessions: totalSessions,
        users: totalUsers,
        activeSessions: (activeSessions || 0) + (idleSessions || 0),
        disconnectedSessions: disconnectedSessions,
        desktopSessions: desktopSessions,
        applicationSessions: applicationSessions
      };
    });
  }
};

export default DashboardSessionService;
