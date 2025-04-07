import {defineStore} from 'pinia';
import type {Attachment} from '@share/interfaces/activecollab/attachment';
import type {AttachmentRequestCreate} from '@share/interfaces/activecollab/post/attachment';
import {useLoadingStore} from '@/stores/loadingStore';

export const useAttachmentStore = defineStore('attachment', () => {

    const loadingStore = useLoadingStore();

    const submitAttachments = async (attachments: File[]): Promise<Attachment[]> => {
        loadingStore.setLoading(true);
        const fetchedFiles: Attachment[] = [];

        try {
            for (const attachment of attachments) {
                const arrayBuffer = await attachment.arrayBuffer();

                const data: AttachmentRequestCreate = {
                    requestData: {
                        attachment: arrayBuffer,
                        name: attachment.name,
                        submitted: 'submitted',
                    },
                };

                const res = await window.electron.api.createAttachment(data);

                if (!res.success) {
                    console.error(`Failed to create attachment for ${attachment.name}`, res.error);
                    continue;
                }
                const createdAttachment = res.data as Attachment;
                fetchedFiles.push(createdAttachment);
            }
        } catch (error) {
            console.error('Error during attachment submission:', error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }

        return fetchedFiles;
    };

    const fetchTaskAttachments = async (projectId: string, taskId: string): Promise<Attachment[]> => {
        try {
            const res = await window.electron.api.getTaskAttachments(projectId, taskId);
            if (!res.success) {
                throw new Error(`Failed to fetch attachments: ${res.error}`);
            }
            return res.data as Attachment[];
        } catch (error) {
            console.error('Error during fetching task attachments:', error);
            return [];
        }
    };

    return {
        submitAttachments,
        fetchTaskAttachments,
    };
});
