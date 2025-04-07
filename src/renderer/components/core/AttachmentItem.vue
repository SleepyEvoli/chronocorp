<template lang="html">
    <div class="attachment-item">
        <div class="attachment-item__icon">
            <Icon icon-name="attachment"/>
        </div>
        <div class="attachment-item__name">
            <a :href="props.attachment.permalink">{{ props.attachment.name }}</a>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Icon from '@/components/core/Icon.vue';
import type {Attachment} from '@share/interfaces/activecollab/attachment';

const props = defineProps({
    attachment: {
        type: Object as () => Attachment,
        required: true,
    },
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.attachment-item {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .attachment-item__icon {
        height: 1em;
        width: 1em;
    }

    .attachment-item-name {
        font-size: .75em;
    }
}
</style>
