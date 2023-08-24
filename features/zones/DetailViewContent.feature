Feature: Zones: Detail view content
  Background:
    Given the CSS selectors
      | Alias               | Selector                                 |
      | ingress-detail-view | [data-testid='zone-ingress-detail-view'] |
      | egress-detail-view  | [data-testid='zone-egress-detail-view']  |

  Scenario Outline: Zone Ingress detail view has expected content
    Given the URL "/config" responds with
      """
      body:
        mode: global
      """
    And the URL "/zoneingresses+insights/zone-ingress-1" responds with
      """
      body:
        name: zone-ingress-1
        zoneIngress:
          zone: zone-cp-1
        zoneIngressInsight:
          subscriptions:
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: 2020-07-28T16:18:09.743141Z
              status: {}
            - connectTime: 2020-07-28T16:18:09.743141Z
              status: {}
      """

    When I visit the "/zones/zone-ingresses/zone-ingress-1" URL
    Then the page title contains "zone-ingress-1"
    Then the "$ingress-detail-view" element contains "zone-ingress-1"
    Then the "$ingress-detail-view" element contains "ZoneIngressOverview"
    Then the "$ingress-detail-view" element contains "Connected: Jul 28, 2020, 4:18 PM"

  Scenario Outline: Zone Egress detail view has expected content
    Given the URL "/config" responds with
      """
      body:
        mode: global
      """
    And the URL "/zoneegressoverviews/zone-egress-1" responds with
      """
      body:
        name: zone-egress-1
        zoneEgress:
          zone: zone-cp-2
        zoneEgressInsight:
          subscriptions:
            - connectTime: 2020-07-28T16:18:09.743141Z
              disconnectTime: 2020-07-28T16:18:09.743141Z
              status: {}
            - connectTime: 2020-07-28T16:18:09.743141Z
              status: {}
      """

    When I visit the "/zones/zone-egresses/zone-egress-1" URL
    Then the page title contains "zone-egress-1"
    Then the "$egress-detail-view" element contains "zone-egress-1"
    Then the "$egress-detail-view" element contains "ZoneEgressOverview"
    Then the "$egress-detail-view" element contains "Connected: Jul 28, 2020, 4:18 PM"
