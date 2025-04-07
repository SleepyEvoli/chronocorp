<template lang="html">
    <div class="attachment-upload">
        <Label class="attachment-upload__label" @click="triggerFileInput">
            <span class="attachment-upload__label-icon">
                <Icon icon-name="attachment"/>
            </span>
            <input
                ref="fileInput"
                multiple
                type="file"
                @change="onFilesSelected"
            />
            Upload
        </Label>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import Icon from '@/components/core/Icon.vue';
import Label from '@/components/core/Label.vue';

const emit = defineEmits(['filesSelected']);
const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const onFilesSelected = (event: Event): void | File[] => {
    const target = event.target as HTMLInputElement;
    const fileList: FileList | null = target.files;
    const files: File[] = Array.from(fileList || []);

    emit('filesSelected', files);
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

input[type='file'] {
    display: none; // Keeps the input hidden while still being functional
}

.attachment-upload {
    align-items: center;
    display: flex;
    padding: 0 .5em;
    font-size: .75rem;

    .attachment-upload__label {
        align-items: center;
        border-radius: .5em;
        color: $text-color;
        cursor: pointer;
        display: flex;

        .attachment-upload__label-icon {
            height: 1.5em;
            width: 1.5em;
        }
    }

    .attachment-upload__label:hover {
        color: #FFF;
    }
}
</style>
