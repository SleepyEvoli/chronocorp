<template lang="html">
    <ul class="list">
        <slot></slot>
    </ul>
</template>

<style lang="scss" scoped>
.list {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
    padding: 0;
}
</style>
