<template>
  <Krumbs
    v-if="!hideBreadcrumbs"
    :items="routes"
  />
</template>

<script>
import { isValidUuid } from '@/helpers'

export default {
  name: 'Breadcrumbs',
  computed: {
    pageMesh() {
      return this.$route.params.mesh
    },

    routes() {
      // const { query } = this.$router.currentRoute

      const items = []

      this.$route.matched.map((r) => {
        const key = r.redirect !== undefined && r.redirect.name !== undefined ? r.redirect.name : r.name

        /** this adds the mesh name and url to the breadcrumb chain */
        if (this.isCurrentRoute(r) && this.pageMesh) {
          items.push({
            key: this.pageMesh,
            to: { path: `/meshes/${this.pageMesh}` },
            title: `Mesh Overview for ${this.pageMesh}`,
            text: this.pageMesh,
          })
        }

        if (this.isCurrentRoute(r) && r.meta.parent && r.meta.parent !== 'undefined') {
          items.push({
            key: r.meta.parent,
            to: { name: r.meta.parent },
            title: r.meta.title,
            text: r.meta.breadcrumb || r.meta.title,
          })
        } else if (this.isCurrentRoute(r) && !r.meta.excludeAsBreadcrumb) {
          items.push({
            key: key,
            to: { name: key },
            title: r.meta.title,
            text: r.meta.breadcrumb || r.meta.title,
          })
        } else if (r.meta.parent && r.meta.parent !== 'undefined') {
          items.push({
            key: r.meta.parent,
            to: { name: r.meta.parent },
            title: r.meta.title,
            text: r.meta.breadcrumb || r.meta.title,
          })
        }
      })

      // the current page the user is on
      const currentRouteText = this.calculateRouteTextAdvanced(this.$route)

      if (currentRouteText) {
        items.push({
          title: currentRouteText,
          text: currentRouteText,
        })
      }

      return items
    },

    hideBreadcrumbs() {
      return this.$route.query.hide_breadcrumb
    },
  },

  methods: {
    getBreadcrumbItem(key, to, title, text) {
      return { key, to, title, text }
    },

    isCurrentRoute(r) {
      return (r.name && r.name === this.$router.currentRoute.name) || r.redirect === this.$router.currentRoute.name
    },

    calculateRouteFromQuery(q) {
      const { entity_id: entityId, entity_type: entityType } = q

      if (entityId && entityType) {
        const resolvedTo = this.$router.resolve({
          name: `show-${entityType.split('_')[0]}`,
          params: { id: entityId.split(',')[0] },
        }).normalizedTo

        const normalized = {
          ...resolvedTo,
          meta: {
            ...resolvedTo.meta,
          },
        }

        // if there is an entity in the query params, then use it as the
        // breadcrumb comma separated list with label being the second argument
        // e.g. ?entity_id=uuid,name&entity_type=
        let breadcrumb = normalized.params.id.split('-')[0]
        if (entityId.split(',').length > 1 && entityId.split(',')[1]) {
          breadcrumb = entityId.split(',')[1]
        }

        normalized.meta.breadcrumb = breadcrumb

        return [
          {
            ...this.getBreadcrumbItem(
              normalized.name,
              normalized,
              this.calculateRouteTitle(normalized),
              this.calculateRouteText(normalized),
            ),
          },
        ]
      }
    },

    calculateRouteText(route) {
      // TODO: support child routes that are children of :id to support routes
      // like /workspaces/:id/services/:id/update
      if (route.path && route.path.indexOf(':mesh') > -1) {
        const params = this.$router.currentRoute.params

        return (
          (params && params.mesh && isValidUuid(params.mesh) ? params.mesh.split('-')[0].trim() : params.mesh) ||
          route.meta.breadcrumb ||
          route.meta.title
        )
      }

      return (
        (route.meta && (route.meta.breadcrumb || route.meta.title)) ||
        route.name ||
        route.meta.breadcrumb ||
        route.meta.title
      )
    },

    calculateRouteTitle(route) {
      return (
        (route.params && route.params.mesh) ||
        (route.path.indexOf(':mesh') > -1 && this.$router.currentRoute.params && this.$router.currentRoute.params.mesh)
      )
    },

    calculateRouteTextAdvanced(route) {
      const params = route.params

      const { expandSidebar, ...cleanParams } = params

      const isMesh = route.name === 'mesh-overview'
      const newParams = Object.assign({}, cleanParams, { mesh: null })

      if (isMesh) {
        return params.mesh
      } else {
        return Object.values(newParams).filter((x) => x)[0]
      }
    },
  },
}
</script>

<style lang="scss">
.krumbs {
  font-size: var(--type-lg);

  .krumb-item {
    a {
      color: #000 !important;
      text-decoration: none;
    }
  }

  @media (min-width: 701px) {
    font-size: var(--type-xl);
  }
}
</style>
