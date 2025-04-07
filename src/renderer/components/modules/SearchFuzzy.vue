<template lang="html">
    <InputField
        :value="inputValue"
        class="search-fuzzy"
        @input="onInput"
    />
</template>

<script lang="ts" setup>
import InputField from '@/components/core/InputField.vue';
import {ref, watch} from 'vue';
import fuzzy from 'fuzzy';

const props = defineProps({
    searchList: {
        type: Array as () => string[],
        required: true,
    },
});

const emit = defineEmits(['filter']);

const searchList = ref(props.searchList);

watch(() => props.searchList, (newValue) => {
    searchList.value = newValue;
});

const inputValue = ref('');
const minScore = 0;

const onInput = (event: Event) => {
    inputValue.value = (event.target as HTMLInputElement).value;
    search(inputValue.value);
};

const search = (searchString: string) => {
    const matches = fuzzy.filter(searchString, searchList.value).filter((el) => el.score > minScore).map((el) => el.string);
    emit('filter', matches);
};
</script>
