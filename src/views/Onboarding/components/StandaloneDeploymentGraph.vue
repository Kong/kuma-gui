<template>
  <div>
    <div>
      <KPop
        placement="bottom"
        trigger="hover"
      >
        <span>Standalone 1</span>

        <template #content>
          <p>Text of Standalone 1</p>
        </template>
      </KPop>
    </div>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="441px"
      height="151px"
      viewBox="-0.5 -0.5 441 151"
    >
      <defs />
      <g>
        <KPop
          trigger="hover"
          title="Light"
          :is-svg="true"
          tag="g"
        >
          <g>
            <rect
              x="160"
              y="0"
              width="120"
              height="60"
              fill="#00cc00"
              stroke="#000000"
              pointer-events="all"
            />
            <text
              x="220"
              y="34"
              fill="#000000"
              font-family="Helvetica"
              font-size="12px"
              text-anchor="middle"
            >
              Kuma control plane
            </text>
          </g>

          <template #content>
            <p>Text of Control Plane</p>
          </template>
        </KPop>
        <rect
          x="0"
          y="90"
          width="120"
          height="60"
          fill="#ffffff"
          stroke="#000000"
          pointer-events="all"
        />
        <text
          x="40"
          y="124"
          fill="#000000"
          font-family="Helvetica"
          font-size="12px"
          text-anchor="middle"
        >
          Service
        </text>
        <rect
          x="320"
          y="90"
          width="120"
          height="60"
          fill="#ffffff"
          stroke="#000000"
          pointer-events="all"
        />
        <text
          x="400"
          y="124"
          fill="#000000"
          font-family="Helvetica"
          font-size="12px"
          text-anchor="middle"
        >
          Service
        </text>

        <!-- arrow left -->
        <g>
          <path
            d="M 125.09 86.18 L 154.91 63.82"
            fill="none"
            stroke="#000000"
            stroke-miterlimit="10"
            pointer-events="stroke"
          />
          <path
            d="M 120.89 89.33 L 124.39 82.33 L 125.09 86.18 L 128.59 87.93 Z"
            fill="#000000"
            stroke="#000000"
            stroke-miterlimit="10"
            pointer-events="all"
          />
          <path
            d="M 159.11 60.67 L 155.61 67.67 L 154.91 63.82 L 151.41 62.07 Z"
            fill="#000000"
            stroke="#000000"
            stroke-miterlimit="10"
            pointer-events="all"
          />

        </g>
        <!-- arrow right -->
        <g>
          <path
            d="M 314.91 86.18 L 285.09 63.82"
            fill="none"
            stroke="#000000"
            stroke-miterlimit="10"
            pointer-events="stroke"
          />
          <path
            d="M 319.11 89.33 L 311.41 87.93 L 314.91 86.18 L 315.61 82.33 Z"
            fill="#000000"
            stroke="#000000"
            stroke-miterlimit="10"
            pointer-events="all"
          />
          <path
            d="M 280.89 60.67 L 288.59 62.07 L 285.09 63.82 L 284.39 67.67 Z"
            fill="#000000"
            stroke="#000000"
            stroke-miterlimit="10"
            pointer-events="all"
          />
        </g>

        <g>
          <rect
            x="80"
            y="90"
            width="40"
            height="60"
            fill="#ff3333"
            stroke="#000000"
            pointer-events="all"
          />
          <text
            x="100"
            y="124"
            fill="#000000"
            font-family="Helvetica"
            font-size="12px"
            text-anchor="middle"
          >
            DPP
          </text>
        </g>

        <g>
          <rect
            x="320"
            y="90"
            width="40"
            height="60"
            fill="#ff0000"
            stroke="#000000"
            pointer-events="all"
          />

          <text
            x="340"
            y="124"
            fill="#000000"
            font-family="Helvetica"
            font-size="12px"
            text-anchor="middle"
          >
            DPP
          </text>
        </g>

      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'StandaloneDeploymentGraph',
}
</script>

<style></style>
