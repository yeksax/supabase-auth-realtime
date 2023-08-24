<script lang="ts">
  export let time: Date | string | number

  const date = new Date(time)

  const hours = date.getHours()
  const minutes = date.getMinutes()
</script>

{hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}