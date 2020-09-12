<template>
  <div id="scores">

      <svg id="chart" width= 400 height= 400>
        <circle cx= 200 cy= 200 r= 125 stroke= 'yellow' stroke-width= 5 style="z-index: 50" text="100"></circle>
        <circle id="player" cx= 200 cy= 200 :r= "machineScore * 1.25" fill= 'lime' text="machineScore"></circle>
        <circle id="machine" cx= 200 cy= 200 :r= "playerScore * 1.25" fill= 'transparent' stroke= 'red' stroke-width= 3 style="z-index: 100" text="playerScore"></circle>
      </svg>

  </div>
</template>

<script>
  export default {
    props: {
      playerScore: Number,
      machineScore: Number
    }
  }
</script>

<style scoped>

</style>
