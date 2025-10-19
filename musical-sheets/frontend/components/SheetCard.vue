<template>
  <div class="card">
    <h3>{{ sheet.title }}</h3>
    <p>Composer: {{ sheet.composerID?.name || '—' }}</p>
    <p>Instrument: {{ sheet.instrumentID?.name || '—' }}</p>
    <router-link :to="`/sheets/${sheet._id}`">Open</router-link>
  </div>
</template>

<script>
export default {
  props: { sheet: Object }
};
</script>

<style>
.card { padding:1rem; border:1px solid #ddd; border-radius:8px; background:#fff; }
</style>
