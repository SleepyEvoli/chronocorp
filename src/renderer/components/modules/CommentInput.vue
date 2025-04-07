<template lang="html">
    <div class="comment-write">
        <RichTextArea
            :id="`comment-write-editor-${projectId}-${taskId}`"
            :value="commentValue"
            @save="(v)=>commentValue = v"
        />
        <div class="comment-write__actions">
            <AttachmentUpload @files-selected="(x)=>preparedFiles = x"/>
            <Button class="primary" @click="createComment">
                Senden
            </Button>
        </div>
        <div class="comment-write__attachment-files">
            <div v-for="(file, index) in preparedFiles" :key="index">
                {{ file.name }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {defineProps, ref} from 'vue';
import Button from '@/components/core/Button.vue';
import AttachmentUpload from '@/components/core/AttachmentUpload.vue';
import {useTaskStore} from '@/stores/taskStore';
import RichTextArea from '@/components/core/RichTextArea.vue';

const props = defineProps({
    projectId: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['submit']);

const taskStore = useTaskStore();

const commentValue = ref<string>('');
const preparedFiles = ref<File[]>([]);

const createComment = async () => {
    if (await taskStore.submitCommentCreate(props.projectId, props.taskId, commentValue.value, preparedFiles.value)) {
        commentValue.value = '';
        preparedFiles.value = [];
        emit('submit');
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.comment-write {
    .comment-write__actions {
        align-items: center;
        display: flex;
        gap: .5em;
        justify-content: flex-end;
        margin-top: .5em;
    }

    .comment-write__attachment-files {
        align-items: end;
        display: flex;
        flex-direction: column;
        font-size: 0.75rem;
        gap: .25em;
        padding: .25em;
        width: 100%;
    }
}
</style>
