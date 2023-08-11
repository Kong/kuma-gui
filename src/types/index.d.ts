import { RouteLocationNamedRaw } from 'vue-router'

/**
 * Creates an “unsaved” variant of a resource type which is missing the fields that are only present on an object once its saved in the database.
 */
export type Unsaved<RT> = Omit<RT, 'creationTime' | 'modificationTime'>

export type StatusKeyword = 'online' | 'offline' | 'partially_degraded' | 'not_available'

export type ChartDataPoint = {
  title: string
  data: number
  statusKeyword?: StatusKeyword
}

export type DoughnutChartData = {
  title: string
  subtitle?: string
  showTotal?: boolean // Default: `false`
  dataPoints: ChartDataPoint[]
}

export type PathConfig = {
  /**
   * The base API URL. Won’t include a trailing slash.
   *
   * **Example**: `'http://localhost:5681'`
   */
  apiUrl: string

  /**
   * The base GUI path. Will include a leading slash. Won’t include a trailing slash.
   *
   * **Example**: `'/gui'`
   */
  baseGuiPath: string

  /**
   * The version of the underlying host application (e.g. Kuma).
   *
   * **Example**: `'2.0.1'`
   */
  version: string

  product: string,
  mode: string,
  environment: string,
  apiReadOnly: boolean,

}

export type TableHeader = {
  key: string
  label: string
  sortable?: boolean
  hideLabel?: boolean
  useSortHandlerFn?: boolean
}

export type TableData = {
  headers: TableHeader[]
  data: any
}

export interface KDSSubscription {
  config: string
  id: string
  globalInstanceId: string
  connectTime: string
  disconnectTime?: string
  status: any
  version: any
}

export interface ZoneInsight {
  subscriptions: KDSSubscription[]
}

export interface DataPlaneProxyStatus {
  total?: number
  online?: number
  offline?: number
  partiallyDegraded?: number
}

export interface ServiceStatus {
  total?: number
  internal?: number
  external?: number
}

export interface ResourceStat {
  total: number
}

export interface GlobalInsights {
  type: 'GlobalInsights'
  creationTime: string
  resources: Record<string, ResourceStat>
}

export interface DiscoveryServiceStats {
  responsesSent?: string
  responsesAcknowledged?: string
  responsesRejected?: string
}

export interface KumaDpVersion {
  version: string
  gitTag: string
  gitCommit: string
  buildDate: string
  kumaCpCompatible?: boolean
}

export interface EnvoyVersion {
  version: string
  build: string
  kumaDpCompatible?: boolean
}

export interface DiscoverySubscriptionStatus {
  lastUpdateTime: string
  total: DiscoveryServiceStats
  cds: DiscoveryServiceStats
  eds: DiscoveryServiceStats
  lds: DiscoveryServiceStats
  rds: DiscoveryServiceStats
}

export interface Version {
  kumaDp: KumaDpVersion

  envoy: EnvoyVersion

  dependencies: Record<string, string>
}

export interface DiscoverySubscription {
  id: string
  controlPlaneInstanceId: string
  connectTime?: string
  disconnectTime?: string
  status: DiscoverySubscriptionStatus
  generation?: number
  version?: Version
}

export interface DataPlaneInsight {
  mTLS?: {
    certificateExpirationTime: string
    lastCertificateRegeneration: string
    certificateRegenerations: number
    issuedBackend: string
    supportedBackends: string[]
  }
  subscriptions: DiscoverySubscription[]
}

export type DataPlaneNetworking = {
  address: string
  inbound?: {
    port: number
    servicePort: number
    serviceAddress: string
    tags: Record<string, string>
    health?: {
      ready: boolean
    }
  }[]
  outbound?: {
    port: number
    tags: Record<string, string>
  }[]
  gateway?: {
    tags: Record<string, string>
    type?: 'builtin' | 'delegated' | undefined
  },
}

/**
 * A policy definition as returned via the `/policies` endpoint.
 */
export type PolicyType = {
  /**
   * The policy type’s name (e.g. “CircuitBreaker”).
   */
  name: string

  /**
   * The associated API path for the policy. Used to look up all set-up policies and policies for specific meshes.
   */
  path: string

  /**
   * Controls whether to display a warning alert letting users know that this policy is experimental.
   */
  isExperimental: boolean

  readOnly: boolean
}

export type DataPlaneStatus = 'Online' | 'Offline' | 'Partially degraded'

export type Compatibility = {
  kind: 'COMPATIBLE' | 'INCOMPATIBLE_UNSUPPORTED_KUMA_DP' | 'INCOMPATIBLE_UNSUPPORTED_ENVOY' | 'INCOMPATIBLE_WRONG_FORMAT' | 'INCOMPATIBLE_ZONE_CP_AND_KUMA_DP_VERSIONS'
  payload?: {
    kumaDp: string
    envoy?: string
  }
}

export type ZoneCompatibility = {
  kind: INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS
  payload?: {
    zoneCpVersion: string
    globalCpVersion: string
  }
}

export interface LabelValue {
  label: string
  value: string
}

export interface Entity {
  type: string
  name: string
  creationTime: string
  modificationTime: string
}

export interface MeshEntity extends Entity {
  mesh: string
}

/**
 * Entity as returned via the `/meshes/:mesh/dataplanes/:dataPlane` endpoint.
 */
export interface DataPlane extends MeshEntity {
  type: 'Dataplane'
  networking: DataPlaneNetworking
}

/**
 * Overview entity as returned via the `/meshes/:mesh/dataplanes+insights/:dataPlane` endpoint.
 */
export interface DataPlaneOverview extends MeshEntity {
  type: 'DataplaneOverview'
  dataplane: {
    networking: DataPlaneNetworking
  }
  dataplaneInsight?: DataPlaneInsight
}

export interface DataplaneRule {
  type: 'ClientSubset' | 'DestinationSubset' | 'SingleItem',
  name: string
  service?: string
  addresses?: string[]
  policyType: string
  subset?: Record<string, string>
  tags?: Record<string, string>
  conf: Record<string, unknown>
  origins: Array<{ mesh: string, name: string }>
}

export type PolicyMatch = {
  match: {
    'kuma.io/service': string
    [key: string]: string
  }
}

export interface MatchedPolicyType extends MeshEntity {
  sources?: PolicyMatch[]
  destinations?: PolicyMatch[]
  selectors?: Array<{ match: Record<string, string> }>
  conf?: any
}

export interface SidecarDataplane {
  type: 'inbound' | 'outbound' | 'service' | 'dataplane'
  service: string
  name: string
  matchedPolicies: Record<string, MatchedPolicyType[]>
}

export type MeshGatewayDataplaneDestination = {
  tags: {
    'kuma.io/service': string
  }
  policies: Record<string, MatchedPolicyType>
}

export type MeshGatewayDataplaneRoute = {
  route: string
  destinations: MeshGatewayDataplaneDestination[]
}

export type MeshGatewayDataplaneHost = {
  hostName: string
  routes: MeshGatewayDataplaneRoute[]
}

export type MeshGatewayDataplaneListener = {
  port: number
  protocol: string
  hosts: MeshGatewayDataplaneHost[]
}

export interface MeshGatewayDataplane {
  kind: 'MeshGatewayDataplane'
  gateway: {
    mesh: string
    name: string
  }
  listeners: MeshGatewayDataplaneListener[] | null
  policies?: Record<string, MatchedPolicyType>
}

export type PolicyTypeEntryOrigin = {
  name: string
  route: RouteLocationNamedRaw
}

export type PolicyTypeEntryConnection = {
  sourceTags: LabelValue[]
  destinationTags: LabelValue[]
  name: string | null
  origins: PolicyTypeEntryOrigin[]
  config: string | null
}

export type PolicyTypeEntry = {
  type: string
  connections: PolicyTypeEntryConnection[]
}

export type RuleEntryConnection = {
  type: {
    sourceTags: LabelValue[]
    destinationTags: LabelValue[]
  }
  addresses: string[]
  origins: PolicyTypeEntryOrigin[]
  config: string | null
}

export type RuleEntry = {
  type: string
  connections: RuleEntryConnection[]
}

export type SidecarDataplaneRuleEntry = {
  rule: DataplaneRule
  policyRoutes: Map<{ name: string, route: RouteLocationNamedRaw }>
}

export type MeshGatewayRoutePolicy = {
  type: string
  name: string
  route: RouteLocationNamedRaw
}

export type MeshGatewayRouteEntry = {
  route: RouteLocationNamedRaw
  routeName: string
  service: string
  policies: MeshGatewayRoutePolicy[]
}

export type MeshGatewayListenerEntry = {
  protocol: string
  port: number
  hostName: string
  routeEntries: MeshGatewayRouteEntry[]
}

/**
 * Entity as returned via the `/meshes/:mesh/service-insights/:service` endpoint.
 */
export interface ServiceInsight extends MeshEntity {
  type: 'ServiceInsight'
  serviceType?: 'internal' | 'external' | 'gateway_builtin' | 'gateway_delegated'
  addressPort?: string
  status?: StatusKeyword
  dataplanes?: {
    total: number
    online?: number
    offline?: number
  }
}

/**
 * Entity of type `ExternalService` as returned via the `/meshes/:mesh/external-service/:service` endpoint.
 */
export interface ExternalService extends MeshEntity {
  type: 'ExternalService'
  networking: {
    address: string
    tls?: {
      enabled: boolean
      allowRenegotiation: boolean
      caCert?: {
        secret?: string
        inline?: string
      }
      clientCert?: {
        secret?: string
        inline?: string
      }
      clientKey?: {
        secret?: string
        inline?: string
      }
    }
  }
  tags: Record<string, string>
}

export interface Zone {
  name: string
  enabled?: boolean
}

/**
 * Overview entity as returned via the `/zones+insights/:zone` endpoint.
 */
export interface ZoneOverview extends MeshEntity {
  type: 'ZoneOverview'
  zone: Zone
  zoneInsight?: ZoneInsight
}

export interface ZoneIngressOverview extends MeshEntity {
  type: 'ZoneIngressOverview'
  zoneIngress: any
  zoneIngressInsight: any
}

export interface ZoneEgressOverview extends MeshEntity {
  type: 'ZoneEgressOverview'
  zoneEgress: any
  zoneEgressInsight: any
}

/**
 * Entity as returned via the `/meshes/:mesh` endpoint.
 */
export interface Mesh extends Entity {
  type: 'Mesh'
  mtls?: any
  logging?: any
  tracing?: any
  metrics?: any
  routing?: any
}

export type DpVersions = {
  kumaDp: Record<string, DataPlaneProxyStatus>
  envoy: Record<string, DataPlaneProxyStatus>
}

/**
 * Overview entity as returned via the `/meshes-insights/:mesh` endpoint.
 */
export interface MeshInsight extends Entity {
  type: 'MeshInsight'
  lastSync: string
  dataplanes: DataPlaneProxyStatus
  dataplanesByType: {
    standard: DataPlaneProxyStatus
    gateway: DataPlaneProxyStatus
  }
  policies?: Record<string, ResourceStat>
  dpVersions: DpVersions
  mTLS: {
    issuedBackends?: Record<string, DataPlaneProxyStatus>
    supportedBackends?: Record<string, DataPlaneProxyStatus>
  }
  services: ServiceStatus
}

export interface PolicyEntity extends MeshEntity {}

export interface PolicyDataplaneAttachment {
  type: string
  name: string
  service?: string
}

export interface PolicyDataplaneListenerHostRoute {
  route: string
  destinations?: Record<string, string>
}

export interface PolicyDataplaneListenerHost {
  hostName: string
  routes: PolicyDataplaneListenerHostRoute[]
}

export interface PolicyDataplaneListener {
  port: number
  protocol: string
  host: PolicyDataplaneListenerHost[]
}

export interface PolicyDataplane {
  kind: 'SidecarDataplane' | 'MeshGatewayDataplane'
  dataplane: {
    mesh: string
    name: string
  }
  gateway?: {
    mesh: string
    name: string
  }
  attachments?: PolicyDataplaneAttachment[]
  listeners?: PolicyDataplaneListener[]
}
