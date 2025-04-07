<template lang="html">
    <div
        class="comment-list-item"
    >
        <div class="comment-list-item__user">
            <div class="comment-list-item__user-thumbnail">
                <UserThumbnail :user="comment.created_by"/>
            </div>
            <div class="comment-list-item__user-name">
                {{ comment.created_by.name }}
            </div>
            <div class="comment-list-item__user-date">
                {{ comment.created_on.formatted }}
            </div>
        </div>
        <div class="comment-list-item__content">
            <InlineEditAreaField
                v-if="comment.permissions.can_edit"
                :id="`comment-rich-text-${comment.id}`"
                :format-html="true"
                :rich-text="true"
                :value="comment.body"
                @save="updateComment"
            />
            <div
                v-else
                v-html="comment.body"
            />
            <div class="comment-list-item__content-attachments">
                <AttachmentItem v-for="attachment in comment.attachments" :attachment="attachment"/>
            </div>
        </div>
        <div class="comment-list-item__actions">
            <Button
                v-if="comment.permissions.can_delete"
                class="icon no-bg no-border comment-list-item__action"
                @click="onDelete"
            >
                <Icon icon-name="close"/>
            </Button>
            <div class="comment-list-item__action-index">
                {{ props.index }}
            </div>
        </div>
    </div>
    <div v-if="showEdit" class="comment-list-item__edit-actions">
        <Button class="comment-list-item__edit-action primary" @click="updateComment">
            Speichern
        </Button>
        <Button class="comment-list-item__edit-action secondary" @click="showEdit = false">
            Abbrechen
        </Button>
    </div>
</template>

<script lang="ts" setup>
import UserThumbnail from '@/components/modules/UserThumbnail.vue';
import {defineProps, ref, watch} from 'vue';
import type {Comment} from '@share/interfaces/activecollab/comment';
import AttachmentItem from '@/components/core/AttachmentItem.vue';
import {useModalStore} from '@/stores/modalStore';
import Button from '@/components/core/Button.vue';
import {useTaskStore} from '@/stores/taskStore';
import InlineEditAreaField from '@/components/core/InlineEditAreaField.vue';
import Icon from '@/components/core/Icon.vue';

const props = defineProps({
    comment: {
        type: Object as () => Comment,
        required: true,
    },
    index: {
        type: Number,
        required: false,
    },
    projectId: {
        type: String,
        required: true,
    },
    taskId: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['change']);

const modalStore = useModalStore();
const taskStore = useTaskStore();

const comment = ref(props.comment);
const showEdit = ref(false);

watch(() => props.comment, (newComment) => {
    comment.value = newComment;
});

const onDelete = () => {
    modalStore.openConfirmModal(
        'Sicher, dass du den Kommentar wirklich löschen möchtest?',
        async () => {
            if (await taskStore.submitCommentDelete(comment.value, props.projectId, props.taskId)) {
                emit('change');
            }
        },
    );
};

const updateComment = async (value: string) => {
    const tmpComment = {...comment.value};
    tmpComment.body = value;

    if (await taskStore.submitCommentUpdate(tmpComment, props.projectId, props.taskId)) {
        comment.value = tmpComment;
        emit('change');
    }
};
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.comment-list-item {
    display: flex;
    padding: 1em 0;
    border-radius: $border-radius-sm;
    overflow-wrap: break-word;
    border: 1px solid $primary-color-2;

    .comment-list-item__user-thumbnail {
        height: 3em;
        width: 3em;
        margin-bottom: .2em;
    }

    .comment-list-item__user {
        align-items: end;
        border-right: 2px solid $primary-color-3;
        color: $primary-color-0;
        display: flex;
        flex-direction: column;
        font-size: 1em;
        padding: 0 .75em 0 .25em;
        text-align: end;
        min-width: 8em;
    }

    .comment-list-item__user-date {
        font-size: .9em;
    }

    .comment-list-item__content {
        display: flex;
        flex-direction: column;
        padding-left: .75em;
        width: 100%;
        cursor: pointer;
        height: fit-content;
    }

    .comment-list-item__actions {
        font-size: .9em;
        padding: 0 .5em;
        align-items: end;

        .comment-list-item__action {
            width: 2em;
            height: 2em;
        }

        .comment-list-item__action-index {
            font-size: 1em;
            text-align: center;
        }
    }

    .comment-list-item__content-attachments {
        display: flex;
        flex-wrap: wrap;
        gap: .75em;
        margin-top: 1em;
    }

    .comment-list-item__content-message {
        word-break: break-word;
    }
}

.comment-list-item__edit-actions {
    display: flex;
    flex-direction: column;
    gap: .5em;
    width: 100%;
    justify-content: end;
    padding-top: .75em;
}

.comment-list-item__edit-actions {
    display: flex;
    gap: .5em;
    width: 100%;
    justify-content: end;
    border-top: 1px solid $primary-color-2;
    padding-top: .75em;
}

.comment-list-item:hover {
    background-color: $primary-color-3;
    cursor: pointer;
}
</style>
