<template lang="html">
    <div
        ref="inlineEditRef"
        class="inline-edit-date-field"
    >
        <InlineEditLabel
            :show-label="showLabel"
            class="inline-edit-date-field__display"
            @visibility-changed="(event)=>showLabel = event"
            @click.right="onContextMenuOpen"
        >
            <div
                v-if="dateValue"
                class="inline-edit-date-field__display-day-name"
            >
                {{ getWeekday(dateValue) }}
            </div>
            <div
                v-if="dateValue"
                class="inline-edit-date-field__display-date"
            >
                {{ new Date(dateValue).toLocaleDateString() }}
            </div>
            <div
                v-if="!dateValue"
                class="inline-edit-date-field__display-date-undefined"
            >
                Leer
            </div>
        </InlineEditLabel>
        <InputField
            v-if="!showLabel"
            :value="dateValue || ''"
            class="inline-edit-date-field__edit-field"
            type="date"
            @change="onSaveField"
            @keyup.esc="showLabel = true"
        />
    </div>
</template>

<script lang="ts" setup>
import {computed, defineProps, ref, watch} from 'vue';
import {getWeekday} from '@/utils';
import InputField from '@/components/core/InputField.vue';
import InlineEditLabel from '@/components/core/InlineEditLabel.vue';
import {useContextMenuStore} from '@/stores/contextMenuStore';

const emit = defineEmits(['save']);

const contextMenuStore = useContextMenuStore();

const props = defineProps({
    value: {
        type: [Date, null],
        required: true,
        default: () => null,
    },
});

const showLabel = ref<boolean>(true);
//const dateValue = ref<string | null>(props.value);

const dateValue = computed({
    get: () => props.value?.toISOString().split('T')[0] || null,
    set: (newValue) => {
        if (!newValue) {
            return null;
        }
        return new Date(newValue);
    },
});

watch(() => props.value, (newValue) => {
    if (!newValue) {
        dateValue.value = null;
    } else {
        dateValue.value = newValue.toISOString().split('T')[0];
    }
});

const onContextMenuOpen = (event: MouseEvent) => {
    contextMenuStore.openMenu(event, [
        {
            label: 'Zurücksetzen',
            cb: () => onRedo(),
        },
        {
            label: 'Heute',
            cb: () => onSetToday(),
        },
    ]);
};

const onRedo = () => {
    emit('save', null);
};

const onSetToday = () => {
    emit('save', new Date());
};

const onSaveField = (event: Event) => {
    showLabel.value = true;

    const newDateString = (event.target as HTMLInputElement).value;
    const newDateObject = new Date(newDateString);

    if (isNaN(newDateObject.getTime())) {
        console.error('Invalid date entered:', newDateString);
        return;
    }

    if (props.value?.toISOString().split('T')[0] !== newDateString) {
        emit('save', newDateObject);
    }
};

</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.inline-edit-date-field {
    width: auto;
    font-size: 0.9em;

    .inline-edit-date-field__display {
        cursor: pointer;

        .inline-edit-date-field__display-day-name {
            font-weight: 500;
        }

        .inline-edit-date-field__display-date {
            font-weight: 500;
        }
    }

    .inline-edit-date-field__edit-field {
        font-size: inherit;
        color: inherit;
        background-color: inherit;
        padding: 0;
        color-scheme: dark;
        width: auto;
    }
}

</style>
