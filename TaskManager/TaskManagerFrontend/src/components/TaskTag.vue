<template>
    <span :class="tagMapping[tag]" class="text-xs px-2 py-1 rounded-md">{{ tag }}</span>
</template>

<script setup>
defineProps({
    tag: Object,
})

let tagMapping = {
    "hitno": "bg-red-100",
    "faks": "bg-blue-100",
    "pomalo": "bg-green.100",
};
</script>

<style scoped>
.tag{
    padding: 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    display: inline-block;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
}
</style>