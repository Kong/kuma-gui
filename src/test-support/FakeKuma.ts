import { Faker } from '@faker-js/faker'
import deepmerge from 'deepmerge'

import type {
  DataplaneNetworking,
  DataPlaneProxyStatus,
  ToTargetRefRuleMatch,
} from '@/types/index.d'

type Tags<T extends Record<string, string | undefined>> =
  T extends { service: string }
    ? { 'kuma.io/service': string, [key: string]: string }
    : { [key: string]: string }

export class K8sModule {
  constructor(
    protected faker: Faker,
  ) { }

  deploymentId() {
    return this.faker.string.hexadecimal({ length: 9, casing: 'lower', prefix: '' })
  }

  podId() {
    return this.faker.string.alpha({ length: 5, casing: 'lower' })
  }

  namespace() {
    return this.faker.helpers.arrayElement([this.faker.hacker.noun(), 'kuma-system'])
  }

  namespaceSuffix() {
    return `-${this.namespace()}`
  }

  dataplaneSuffix() {
    return `-${this.deploymentId()}-${this.podId()}`
  }
}

export class KumaModule {
  constructor(
    protected faker: Faker,
    protected k8s: K8sModule,
  ) { }

  seed(str: string = '') {
    // sync the seed by name (temp use length until we convert strings to numbers differently)
    return this.faker.seed(str.length > 0 ? str.length : undefined)
  }

  partition(min: number, max: number, length: number, sum: number): number[] {
    return Array.from(
      { length },
      (_, i) => {
        const smin = (length - i - 1) * min
        const smax = (length - i - 1) * max
        const offset = Math.max(sum - smax, min)
        const random = 1 + Math.min(sum - offset, max - offset, sum - smin - min)
        const value = Math.floor(Math.random() * random + offset)

        sum -= value
        return value
      },
    )
  }

  // TODO(jc): Use `totalName: Number.MAX_VALUE` so we can set a 'total' property automatically
  /**
   * Returns an object with the specified properties with the values as a random 'partition' of `total`
   */
  partitionInto<T extends Record<string, typeof Number | number>>(skeleton: T, total: number): { [K in keyof T]: number } {
    const props = Object.entries(skeleton).filter(([_key, value]) => value === Number || isNaN(Number(value))).map(([key, _value]) => key)
    return {
      ...skeleton,
      ...this.partition(0, total, props.length, total).reduce((prev, item, i) => {
        prev[props[i]] = item
        return prev
      }, {} as Record<string, number>),
    }
  }

  origin() {
    return this.faker.helpers.arrayElement(['zone', 'global'])
  }

  serviceType({ serviceTypes = ['internal', 'external', 'gateway_delegated', 'gateway_builtin'] }: { serviceTypes?: Array<'internal' | 'external' | 'gateway_delegated' | 'gateway_builtin'> } = { serviceTypes: ['internal', 'external', 'gateway_delegated', 'gateway_builtin'] }) {
    return this.faker.helpers.arrayElement(serviceTypes)
  }

  version() {
    return this.faker.helpers.arrayElement([this.faker.system.semver(), `${this.faker.system.semver()}-${this.faker.git.branch()}-${this.faker.git.commitSha({ length: 7 })}`])
  }

  serviceName(serviceType: 'internal' | 'external' | 'gateway_builtin' | 'gateway_delegated' = 'internal') {
    const prefix = `${this.faker.hacker.noun()}-`

    if (serviceType === 'gateway_delegated' || serviceType === 'gateway_builtin') {
      return prefix + serviceType
    } else {
      return prefix + `${this.faker.hacker.noun()}_svc.mesh:80_${serviceType}`
    }
  }

  dataplaneSuffix(k8s: boolean) {
    return k8s ? this.k8s.dataplaneSuffix() : ''
  }

  connection<T>(_: T, i: number, arr: T[]) {
    const connected = this.faker.date.past()
    const times: {
      connectTime: string
      disconnectTime?: string
    } = {
      connectTime: `${connected.toISOString().slice(0, -1)}${this.faker.number.int({ min: 1000, max: 9999 })}Z`,
      // connectTime: '2021-07-13T08:41:04.556796688Z',
    }
    if ((arr.length > 1 && i !== arr.length - 1) || this.faker.datatype.boolean({ probability: 0.3 })) {
      times.disconnectTime = `${this.faker.date.between({
        from: connected,
        to: new Date(),
      }).toISOString().slice(0, -1)}${this.faker.number.int({ min: 1000, max: 9999 })}Z`
      // times.disconnectTime = '2021-02-17T07:33:36.412683Z'
    }
    return times
  }

  serviceStatusKeyword() {
    return this.faker.helpers.arrayElement<'not_available' | 'partially_degraded' | 'offline' | 'online'>(['not_available', 'partially_degraded', 'offline', 'online'])
  }

  protocol() {
    return this.faker.helpers.arrayElement(
      [
        'http',
        'grpc',
        'tcp',
        'kafka',
      ],
    )
  }

  subscriptionConfig(config: any = {}) {
    return JSON.stringify(deepmerge(subscriptionConfig(), config), null, 4)
  }

  /**
   * Returns a random DPP (or gateway) status object with self-consistent values (i.e. total = online + partiallyDegraded + offline).
   */
  healthStatus({ min = 0, max = 30, omitZeroValues = true }: { min?: number, max?: number, omitZeroValues?: boolean } = {}) {
    const total = this.faker.number.int({ min, max })
    const online = this.faker.number.int({ min: 0, max: total })
    const partiallyDegraded = this.faker.number.int({ min: 0, max: total - online })
    const offline = total - online - partiallyDegraded

    const values = [
      ['total', total],
      ['online', online],
      ['partiallyDegraded', partiallyDegraded],
      ['offline', offline],
    ].filter(([_key, value]) => omitZeroValues ? value !== 0 : true)

    return Object.fromEntries(values) as DataPlaneProxyStatus
  }

  globalInsightServices({ min = 0, max = 30 }: { min?: number, max?: number } = {}) {
    const total = this.faker.number.int({ min, max })

    const internalTotal = this.faker.number.int({ min: 0, max: total })
    const externalTotal = this.faker.number.int({ min: 0, max: total - internalTotal })
    const gatewayBuiltinTotal = this.faker.number.int({ min: 0, max: total - internalTotal - externalTotal })
    const gatewayDelegatedTotal = total - internalTotal - externalTotal - gatewayBuiltinTotal

    return {
      external: {
        total: externalTotal,
      },
      gatewayBuiltin: this.healthStatus({ max: gatewayBuiltinTotal, omitZeroValues: false }),
      gatewayDelegated: this.healthStatus({ max: gatewayDelegatedTotal, omitZeroValues: false }),
      internal: this.healthStatus({ max: internalTotal, omitZeroValues: false }),
    }
  }

  /**
   * Returns a random policy type status object.
   */
  policyTypeStatus({ min = 0, max = 20 }: { min?: number, max?: number } = {}) {
    const total = this.faker.number.int({ min, max })

    const values = [
      ['total', total],
    ]

    return Object.fromEntries(values)
  }

  tags<T extends Record<string, string | undefined>>({ protocol, service, zone }: T): Tags<T> {
    const additionalTags = Object.fromEntries(this.faker.helpers.multiple(() => [this.faker.hacker.noun(), this.faker.hacker.noun()], { count: this.faker.number.int({ min: 1, max: 3 }) }))

    // @ts-ignore TS isn’t happy when the service tag is not always provided, but I don’t know how to type this out better.
    return {
      ...(service && { 'kuma.io/service': service }),
      ...(protocol && { 'kuma.io/protocol': protocol }),
      ...(zone && { 'kuma.io/zone': zone }),
      ...additionalTags,
    }
  }

  dataplaneNetworking(
    {
      type = 'proxy',
      inbounds = 0,
      isMultizone = false,
      service,
    }: {
      type?: 'gateway_builtin' | 'gateway_delegated' | 'proxy'
      inbounds?: number
      isMultizone?: boolean
      service?: string
    } = {},
  ): DataplaneNetworking {
    const address = this.faker.internet.ipv4()
    const advertisedAddress = this.faker.datatype.boolean({ probability: 0.25 }) ? this.faker.internet.ipv4() : undefined
    const dataplaneType = type === 'gateway_builtin' ? 'BUILTIN' : type === 'gateway_delegated' ? 'DELEGATED' : undefined

    return {
      address,
      ...(advertisedAddress && { advertisedAddress }),
      ...(type !== 'proxy'
        ? {
          gateway: {
            tags: this.tags({
              service: service ?? this.serviceName(type),
              zone: isMultizone && this.faker.datatype.boolean() ? this.faker.hacker.noun() : undefined,
            }),
            ...(dataplaneType && { type: dataplaneType }),
          },
        }
        : {}),
      ...(type === 'proxy'
        ? {
          inbound: Array.from({ length: inbounds }).map(() => {
            const address = this.faker.datatype.boolean({ probability: 0.25 }) ? this.faker.internet.ipv4() : undefined
            const port = this.faker.internet.port()
            const hasServiceAddress = this.faker.datatype.boolean({ probability: 0.25 })
            const serviceAddress = hasServiceAddress ? this.faker.internet.ipv4() : undefined
            const servicePort = hasServiceAddress ? this.faker.internet.port() : undefined
            const tags = this.tags({
              protocol: this.protocol(),
              service: service ?? this.serviceName(),
              zone: isMultizone && this.faker.datatype.boolean() ? this.faker.hacker.noun() : undefined,
            })

            return {
              port,
              tags,
              ...(this.faker.datatype.boolean()
                ? {
                  health: {
                    ready: this.faker.datatype.boolean(),
                  },
                }
                : {}),
              ...(address && { address }),
              ...(serviceAddress && { serviceAddress }),
              ...(servicePort && { servicePort }),
            }
          }),
        }
        : {}),
      outbound: [
        {
          port: this.faker.internet.port(),
          tags: this.tags({ service: service ?? this.serviceName() }),
        },
      ],
    }
  }

  dataplaneMtls() {
    const issuedBackend = this.faker.hacker.noun()
    const supportedBackends = [issuedBackend].concat(this.faker.helpers.multiple(this.faker.hacker.noun))

    return {
      certificateExpirationTime: this.faker.date.anytime(),
      lastCertificateRegeneration: '2023-10-02T12:40:13.956741929Z',
      certificateRegenerations: this.faker.number.int(),
      issuedBackend,
      supportedBackends,
    }
  }

  ruleMatch({ kind }: { kind?: 'path' | 'method' | 'headers' | 'queryParams' } = { kind: 'path' }): ToTargetRefRuleMatch {
    const _kind = kind ?? this.faker.helpers.arrayElement<'path' | 'method' | 'headers' | 'queryParams'>(['path', 'method', 'headers', 'queryParams'])

    return {
      ...(_kind === 'path' && {
        path: {
          value: '/api',
          type: 'PathPrefix',
        },
      }),
      ...(_kind === 'method' && {
        method: this.faker.internet.httpMethod(),
      }),
      ...(_kind === 'queryParams' && {
        queryParams: [
          {
            name: 'size',
            type: 'Exact',
            value: '1',
          },
        ],
      }),
      ...(_kind === 'headers' && {
        headers: [
          {
            name: 'X-Test-Header',
            value: 'test-1',
          },
          {
            name: 'X-Test-Header',
            value: 'test-2',
          },
        ],
      }),
    }
  }
}
export default class FakeKuma extends Faker {
  k8s = new K8sModule(this)
  kuma = new KumaModule(this, this.k8s)
}

function subscriptionConfig() {
  return {
    apiServer: {
      auth: {
        allowFromLocalhost: true,
        clientCertsDir: '',
      },
      corsAllowedDomains: ['.*'],
      http: {
        enabled: true,
        interface: '0.0.0.0',
        port: 6681,
      },
      https: {
        enabled: true,
        interface: '0.0.0.0',
        port: 6682,
        tlsCertFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.crt',
        tlsKeyFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.key',
      },
      readOnly: false,
    },
    bootstrapServer: {
      apiVersion: 'v3',
      params: {
        adminAccessLogPath: '/dev/null',
        adminAddress: '127.0.0.1',
        adminPort: 0,
        xdsConnectTimeout: '1s',
        xdsHost: '',
        xdsPort: 5678,
      },
    },
    defaults: {
      skipMeshCreation: false,
    },
    diagnostics: {
      debugEndpoints: false,
      serverPort: 6680,
    },
    dnsServer: {
      CIDR: '240.0.0.0/4',
      domain: 'mesh',
      port: 5653,
    },
    dpServer: {
      auth: {
        type: 'dpToken',
      },
      hds: {
        checkDefaults: {
          healthyThreshold: 1,
          interval: '1s',
          noTrafficInterval: '1s',
          timeout: '2s',
          unhealthyThreshold: 1,
        },
        enabled: true,
        interval: '5s',
        refreshInterval: '10s',
      },
      port: 5678,
      tlsCertFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.crt',
      tlsKeyFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.key',
    },
    environment: 'universal',
    general: {
      dnsCacheTTL: '10s',
      tlsCertFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.crt',
      tlsKeyFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.key',
      workDir: '/Users/tomasz.wylezek/.kuma',
    },
    guiServer: {
      apiServerUrl: '',
    },
    metrics: {
      dataplane: {
        enabled: true,
        idleTimeout: '5m0s',
        subscriptionLimit: 2,
      },
      mesh: {
        maxResyncTimeout: '20s',
        minResyncTimeout: '1s',
      },
      zone: {
        enabled: true,
        idleTimeout: '5m0s',
        subscriptionLimit: 10,
      },
    },
    mode: 'zone',
    monitoringAssignmentServer: {
      apiVersions: ['v1'],
      assignmentRefreshInterval: '1s',
      defaultFetchTimeout: '30s',
      grpcPort: 0,
      port: 5676,
    },
    multizone: {
      global: {
        kds: {
          grpcPort: 5685,
          maxMsgSize: 10485760,
          refreshInterval: '1s',
          tlsCertFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.crt',
          tlsKeyFile: '/Users/tomasz.wylezek/.kuma/kuma-cp.key',
          zoneInsightFlushInterval: '10s',
        },
      },
      zone: {
        globalAddress: 'grpcs://localhost:5685',
        kds: {
          maxMsgSize: 10485760,
          refreshInterval: '1s',
          rootCaFile: '',
        },
        name: 'cluster-1',
      },
    },
    reports: {
      enabled: true,
    },
    runtime: {
      kubernetes: {
        admissionServer: {
          address: '',
          certDir: '',
          port: 5443,
        },
        controlPlaneServiceName: 'kuma-control-plane',
        injector: {
          builtinDNS: {
            enabled: true,
            port: 15053,
          },
          caCertFile: '',
          cniEnabled: false,
          exceptions: {
            labels: {
              'openshift.io/build.name': '*',
              'openshift.io/deployer-pod-for.name': '*',
            },
          },
          initContainer: {
            image: 'kuma/kuma-init:latest',
          },
          sidecarContainer: {
            adminPort: 9901,
            drainTime: '30s',
            envVars: {},
            gid: 5678,
            image: 'kuma/kuma-dp:latest',
            livenessProbe: {
              failureThreshold: 12,
              initialDelaySeconds: 60,
              periodSeconds: 5,
              timeoutSeconds: 3,
            },
            readinessProbe: {
              failureThreshold: 12,
              initialDelaySeconds: 1,
              periodSeconds: 5,
              successThreshold: 1,
              timeoutSeconds: 3,
            },
            redirectPortInbound: 15006,
            redirectPortInboundV6: 15010,
            redirectPortOutbound: 15001,
            resources: {
              limits: {
                cpu: '1000m',
                memory: '512Mi',
              },
              requests: {
                cpu: '50m',
                memory: '64Mi',
              },
            },
            uid: 5678,
          },
          sidecarTraffic: {
            excludeInboundPorts: [],
            excludeOutboundPorts: [],
          },
          virtualProbesEnabled: true,
          virtualProbesPort: 9000,
        },
        marshalingCacheExpirationTime: '5m0s',
      },
      universal: {
        dataplaneCleanupAge: '72h0m0s',
      },
    },
    store: {
      cache: { enabled: true, expirationTime: '1s' },
      kubernetes: {
        systemNamespace: 'kuma-system',
      },
      postgres: {
        connectionTimeout: 5,
        dbName: 'kuma',
        host: '127.0.0.1',
        maxIdleConnections: 0,
        maxOpenConnections: 0,
        maxReconnectInterval: '1m0s',
        minReconnectInterval: '10s',
        password: '*****',
        port: 15432,
        tls: {
          caPath: '',
          certPath: '',
          keyPath: '',
          mode: 'disable',
        },
        user: 'kuma',
      },
      type: 'memory',
      upsert: {
        conflictRetryBaseBackoff: '100ms',
        conflictRetryMaxTimes: 5,
      },
    },
    xdsServer: {
      dataplaneConfigurationRefreshInterval: '1s',
      dataplaneStatusFlushInterval: '10s',
      nackBackoff: '5s',
    },
  }
}
