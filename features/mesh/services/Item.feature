Feature: mesh / services / item
  Background:
    Given the CSS selectors
      | Alias                  | Selector                                         |
      | config-tab             | #service-config-view-tab a                       |
      | data-plane-proxies-tab | #service-data-plane-proxies-view-tab a           |
      | item                   | [data-testid='data-plane-collection'] tbody tr   |
      | input-search           | [data-testid='k-filter-bar-filter-input']        |
      | button-search          | [data-testid='k-filter-bar-submit-query-button'] |
      | button-clear-search    | [data-testid="k-filter-bar-clear-query-button"]  |

  Scenario Outline: Shows correct tabs for service type <ServiceType>
    Given the URL "/meshes/default/service-insights/firewall-1" responds with
      """
        body:
          serviceType: <ServiceType>
      """

    When I visit the "/meshes/default/services/firewall-1/overview" URL
    Then the "$config-tab" element doesn't exist
    Then the "$data-plane-proxies-tab" element exists

    Examples:
      | ServiceType       |
      | !!js/undefined    |
      | internal          |
      | gateway_builtin   |
      | gateway_delegated |

  Scenario Outline: Shows correct tabs for service type <ServiceType>
    Given the URL "/meshes/default/service-insights/firewall-1" responds with
      """
        body:
          serviceType: <ServiceType>
      """

    When I visit the "/meshes/default/services/firewall-1/overview" URL
    Then the "$config-tab" element exists
    Then the "$data-plane-proxies-tab" element doesn't exist

    Examples:
      | ServiceType |
      | external    |

  Rule: With an internal service
    Background:
      Given the URL "/meshes/default/service-insights/system-1" responds with
        """
        body:
          serviceType: "internal"
        """
      And the URL "/meshes/default/dataplanes/_overview" responds with
        """
          body:
            items:
              - name: fake-dataplane
                dataplane:
                  networking:
                    gateway: !!js/undefined
        """
      When I visit the "/meshes/default/services/system-1/overview" URL

    Scenario: Internal services request the dataplanes for the service
      When I click the "$data-plane-proxies-tab" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          tag: "kuma.io/service:system-1"
          offset: 0
          size: 50
        """

    Scenario: Searching by tag doesn't overwrite the existing service tag
      When I click the "$data-plane-proxies-tab" element
      Then the "[data-testid='k-filter-bar-filter-input']" element isn't disabled
      And I wait for 500 ms
      When I "type" "tag:version" into the "$input-search" element
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:system-1"
            - "version"
          offset: 0
          size: 50
        """

    Scenario: Searching by service tag doesn't overwrite the existing service tag
      When I click the "$data-plane-proxies-tab" element
      Then the "$input-search" element isn't disabled
      And I wait for 500 ms
      When I "type" "tag:kuma.io/service:panel-2" into the "$input-search" element
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes/_overview" wasn't requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:panel-2"
        """

    Scenario: The clear search button sends a new request with no search params
      When I click the "$data-plane-proxies-tab" element
      Then the "$input-search" element isn't disabled
      And I wait for 500 ms
      When I "type" "name:a-service protocol:tcp" into the "$input-search" element
      And I click the "$button-clear-search" element
      Then the URL "/meshes/default/dataplanes/_overview" wasn't requested with
        """
        searchParams:
          name: a-service
          tag:
            - "kuma.io/protocol:tcp"
        """
      And the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:system-1"
        """

    Scenario: The clear search button sends a new request with the correct service tag
      When I click the "$data-plane-proxies-tab" element
      Then the "$input-search" element isn't disabled
      And I wait for 500 ms
      When I "type" "name:a-service protocol:tcp" into the "$input-search" element
      And I click the "$button-search" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          name: a-service
          tag:
            - "kuma.io/service:system-1"
            - "kuma.io/protocol:tcp"
          offset: 0
          size: 50
        """
      And I click the "$button-clear-search" element
      Then the URL "/meshes/default/dataplanes/_overview" was requested with
        """
        searchParams:
          tag:
            - "kuma.io/service:system-1"
        """

    Scenario: Clicking an items view menu takes you to the correct page
      When I click the "$data-plane-proxies-tab" element
      Then the "$item:nth-child(1) td:nth-child(1) a" element contains "fake-dataplane"
      And I click the "$item:nth-child(1) [data-testid='details-link']" element
      Then the URL contains "/meshes/default/data-planes/fake-dataplane/overview"

    Scenario: Service with matching ExternalService doesn't show empty state
      Given the environment
        """
        KUMA_EXTERNALSERVICE_COUNT: 1
        """
      And the URL "/meshes/default/service-insights/service-1" responds with
        """
          body:
            serviceType: external
        """
      And the URL "/meshes/default/external-services" responds with
        """
          body:
            items:
              - name: external-service-1
                tags:
                  kuma.io/service: service-1
        """

      When I visit the "/meshes/default/services/service-1/overview" URL

      Then the "[data-testid='no-matching-external-service']" element doesn't exist

    Scenario: Service without matching ExternalService shows empty state
      Given the environment
        """
        KUMA_EXTERNALSERVICE_COUNT: 0
        """
      And the URL "/meshes/default/service-insights/service-1" responds with
        """
          body:
            serviceType: external
        """

      When I visit the "/meshes/default/services/service-1/overview" URL

      Then the "[data-testid='no-matching-external-service']" element exists
