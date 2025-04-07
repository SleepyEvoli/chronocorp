<template lang="html">
    <div class="rich-text-area">
        <div :id="props.id" class='rich-text-area__text-editor'/>
    </div>

</template>

<script lang="ts" setup>
import {onMounted, watch} from 'vue';
import Quill, {Delta} from 'quill';
import 'quill/dist/quill.snow.css';
import {useAttachmentStore} from '@/stores/attachmentStore';
import {BlockBlot, StyleAttributor} from 'parchment';

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Möchtest du etwas schreiben...?',
    },
    value: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        default: 'rich-text-area__text-editor',
    },
});

const emit = defineEmits(['save']);

// Only update the value from outside if it's empty
watch(() => props.value, (newValue) => {
    if (newValue == '') {
        quill.setContents([], 'silent');
        return;
    }
});

const attachmentStore = useAttachmentStore();
const Parchment = Quill.import('parchment');
const CodeBlock = Quill.import('formats/code-block') as typeof BlockBlot;

let quill: Quill;
const previewImgWidth = 300;
const previewImgHeight = 300;
const largeImgWidth = 2000;
const largeImgHeight = 2000;

const AlignStyle = new StyleAttributor('align', 'text-align', {
    scope: Parchment.Scope.BLOCK,
});

const FontStyle = new StyleAttributor('font', 'font-family', {
    scope: Parchment.Scope.INLINE,
});

// Enable the custom styles
Quill.register(AlignStyle, true);
Quill.register(FontStyle, true);

// Register custom modules
Quill.register('modules/avoidImageBase64', avoidImageBase64);

// Override the default Code Block
class CustomCodeBlock extends CodeBlock {
    // We need paragraph so that backend renders the custom styling
    static tagName = 'p';

    static create(value: any) {
        let node = super.create(value) as HTMLElement;
        node.style.fontFamily = 'Roboto Mono, monospace';
        node.style.backgroundColor = '#141F27';
        node.style.borderRadius = '0.25rem';
        node.style.padding = '0.25rem';
        node.style.color = '#CFD4DA';
        return node;
    }
}

Quill.register('formats/code-block', CustomCodeBlock, true);

// Quill has a bug, where it doesn't convert the html correctly (<ul>) to quill format
const getHtmlToQuillFormat = (value: string): Delta => {
    return quill.clipboard.convert({
        html: value,
    });
};

const handlePaste = async (event: ClipboardEvent) => {
    const clipboardData = event.clipboardData;
    const items = clipboardData?.items;

    if (!items || items.length === 0) {
        return;
    }

    for (const item of Array.from(items)) {
        if (item.type.startsWith('image')) {
            const file = item.getAsFile();
            if (file) {
                const res = await attachmentStore.submitAttachments([file]);
                if (res && res.length > 0) {
                    const attachment = res[0];
                    if (attachment.urls.preview) {
                        insertImageToEditor(attachment.urls.preview);
                    }
                }
            }
        }
    }
};

const insertImageToEditor = (previewImageUrl: string) => {
    const range = quill.getSelection();
    if (range) {
        const imageWithLink = `
            <a href="${changePreviewUrlSize(previewImageUrl, largeImgWidth, largeImgHeight)}" target="_blank">
                <img src="${changePreviewUrlSize(previewImageUrl, previewImgWidth, previewImgHeight)}" style="max-width: 100%; cursor: pointer;"  alt="Comment Image"/>
            </a>`;
        quill.clipboard.dangerouslyPasteHTML(range.index, imageWithLink);
    }
};

// Quill will insert base64 images, this function will remove them, because we will manually upload it and get the URL from the API
function avoidImageBase64(quill: Quill) {
    quill.on(Quill.events.TEXT_CHANGE, function (delta) {
        delta.ops.forEach(op => {
            if (op.insert && typeof op.insert === 'object' && op.insert.image) {
                if (op.insert.image.toString().startsWith('data:image')) {
                    const range = quill.getSelection();
                    if (range) {
                        quill.deleteText(range.index, 1);
                    }
                }
            }
        });
    });
}

const changePreviewUrlSize = (url: string, width: number, height: number): string => {
    const urlObj = new URL(url);
    urlObj.searchParams.set('width', width.toString());
    urlObj.searchParams.set('height', height.toString());
    return urlObj.toString();
};

const handleToolbarImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
        if (input.files && input.files[0]) {
            const file = input.files[0];

            const res = await attachmentStore.submitAttachments([file]);

            if (res && res.length > 0) {
                const attachment = res[0];

                if (attachment.urls.preview) {
                    insertImageToEditor(attachment.urls.preview);
                }
            }
        }
    };
};

onMounted(() => {
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        [{'color': []}, {'background': []}],
        [{'font': []}],
        [{'align': []}],
        ['clean'],
    ];
    const el = document.getElementById(props.id) as HTMLElement;

    quill = new Quill(el, {
        theme: 'snow',
        placeholder: props.placeholder,
        modules: {
            toolbar: {
                container: toolbarOptions,
                handlers: {
                    image: handleToolbarImage,
                },
            },
            avoidImageBase64: true,
        },
    });

    quill.root.addEventListener('paste', handlePaste);
    quill.setContents(getHtmlToQuillFormat(props.value), 'silent');
    quill.on('text-change', () => {
        // console.log('Semantic', quill.getSemanticHTML().replace(/&nbsp;/g, ' '))
        // console.log('root', quill.root.innerHTML)
        emit('save', quill.getSemanticHTML().replace(/&nbsp;/g, ' '));
    });
});
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.rich-text-area {
    :deep(.ql-toolbar.ql-snow + .ql-container.ql-snow) {
        border-top: 2px solid $primary-color-2;
    }

    :deep(.rich-text-area__text-editor) {
        .ql-tooltip {
            left: 10% !important;
            top: 10% !important;
        }

        &.ql-container {
            border: 2px solid $primary-color-2;
            margin-top: 0.5rem;
            border-radius: $border-radius-sm;
            color: $text-color;
        }

        .ql-blank {
            &::before {
                color: $primary-color-0;
                font-style: unset;
            }
        }

        .ql-editor {
            background-color: $primary-color-4;

            .rich-text-block-code {
                background-color: #141F27;
                border-radius: 0.25rem;
                font-family: 'Roboto Mono', monospace;
                padding: 0.25rem;
                color: $text-color;
            }

            .ql-code-block-container {
                border: unset;
                background-color: unset;
                color: unset;
                font-family: unset;
            }

            .ql-stroke {
                stroke: $text-color;
            }
        }
    }

    :deep(.ql-toolbar) {
        background-color: $primary-color-6;
        border: 2px solid $primary-color-2;
        border-radius: $border-radius-sm;

        .ql-active {
            color: $primary-color-1;

            & * {
                color: $primary-color-1;
                stroke: $primary-color-1;
            }

            .ql-stroke {
                stroke: $primary-color-1;
            }
        }

        .ql-picker-options {
            background-color: $primary-color-5;
            font-size: 0.8em;

            .ql-picker-item {
                color: $text-color;

                &:hover,
                &:focus,
                &:active {
                    color: $primary-color-1;
                }
            }
        }

        .ql-stroke {
            stroke: $text-color;
        }

        .ql-picker-label {
            color: $text-color;

            &:hover,
            &:focus,
            &:active {
                color: $primary-color-1;

                .ql-stroke {
                    stroke: $primary-color-1;
                }
            }
        }

        button {
            &:hover,
            &:focus,
            &:active {
                color: $primary-color-1;

                .ql-stroke,
                .ql-fill {
                    stroke: $primary-color-1;
                    fill: $primary-color-1;
                }
            }

            &.ql-active {
                .ql-stroke {
                    stroke: $accent-color-blue-1;
                }
            }

            .ql-fill {
                fill: $text-color;
            }
        }
    }
}
</style>
