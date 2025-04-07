<template lang="html">
    <div
        class="inline-edit-area-field"
    >
        <div
            v-show="!formatHtml && !isEditingArea"
            class="inline-edit-area-field__display"
            @click="onEditField"
        >
            {{ inputValue }}
        </div>
        <div
            v-if="formatHtml && !isEditingArea"
            class="inline-edit-area-field__display"
            @click="onEditField"
            v-html="inputValue"
        />
        <TextArea
            v-if="isEditingArea && !richText"
            :value="inputValue"
            class="inline-edit-area-field__edit-field"
            @input="inputValue = $event.target.value"
            @keyup.esc="onCancel"
        />
        <RichTextArea
            v-if="isEditingArea && richText"
            :id="props.id"
            :value="inputValue"
            class="inline-edit-area-field__edit-field"
            @save="(v)=>inputValue = v"
            @keyup.esc="onCancel"
        />
        <div v-show="isEditingArea" class="inline-edit-area-field__actions">
            <Button class="secondary inline-edit-area-field__action" @click="onCancel">Cancel</Button>
            <Button class="primary inline-edit-area-field__action" @click="onSaveField">Save</Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import TextArea from '@/components/core/TextArea.vue';
import Button from '@/components/core/Button.vue';
import RichTextArea from '@/components/core/RichTextArea.vue';

const emit = defineEmits(['save']);

const props = defineProps({
    value: {
        required: true,
        type: String,
        default: '',
    },
    formatHtml: {
        type: Boolean,
        default: false,
    },
    richText: {
        type: Boolean,
        default: false,
    },
    id: {
        type: String,
        default: '',
    },
});

const isEditingArea = ref<boolean>(false);
const inputValue = ref<string>(props.value);

watch(() => props.value, (newValue) => {
    inputValue.value = newValue;
});

const onEditField = async () => {
    isEditingArea.value = true;
};

const onSaveField = () => {
    if (isEditingArea.value) {
        isEditingArea.value = false;

        if (inputValue.value !== props.value) {
            emit('save', inputValue.value);
        }
    }
};

const onCancel = () => {
    isEditingArea.value = false;
    inputValue.value = props.value;
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.inline-edit-area-field {
    padding: .25em;

    .inline-edit-area-field__display {
        cursor: pointer;
        padding: .4em;
        min-width: 1rem;
        min-height: 1em;
        filter: brightness(1.1);
        border-radius: $border-radius-sm;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .inline-edit-area-field__actions {
        display: flex;
        justify-content: flex-end;
        gap: .5em;
        margin-top: .25em;
    }
}
</style>
