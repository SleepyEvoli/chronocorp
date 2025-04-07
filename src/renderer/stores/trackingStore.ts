import {defineStore} from 'pinia';
import {ref} from 'vue';
import type {Tracking} from '@/interfaces';
import {Task} from '@share/interfaces/activecollab/task';
import {BillableStatus} from '@share/interfaces/activecollab/enums';
import type {
    TimeRecordRequestCreate,
    TimeRecordRequestDelete,
    TimeRecordRequestUpdate,
} from '@share/interfaces/activecollab/post/timerecord';
import {calculateTimeValue} from '@/utils';
import {useUserStore} from '@/stores/userStore';
import {useLabelStore} from '@/stores/labelStore';
import {useEventStore} from '@/stores/eventStore';
import type {TimeRecord} from '@share/interfaces/activecollab/timeRecord';
import {useProjectStore} from '@/stores/projectStore';
import {useLoadingStore} from '@/stores/loadingStore';
import {Project} from '@share/interfaces/activecollab/project';

export const useTrackingStore = defineStore('tracking', () => {
    const userStore = useUserStore();
    const labelStore = useLabelStore();
    const eventStore = useEventStore();
    const projectStore = useProjectStore();
    const loadingStore = useLoadingStore();

    const trackings = ref<Tracking[]>([]);
    const pinnedTasks = ref<Task[]>([]);
    const focusedTracking = ref<Tracking | null>(null);
    const lazyTrackings = ref<Tracking[]>([]);
    const timeRecordHistory = ref<TimeRecord[]>([]);

    const addTracking = (record: Tracking): void => {
        trackings.value.push(record);
        console.log(`Adding tracking: `, record);
    };

    const addLazyTracking = (record: Tracking): void => {
        lazyTrackings.value.push(record);
        eventStore.createEventNotification('Lazy Tracking hinzugefügt', record.task.name);
        console.log(`Adding lazy tracking: `, record);
    };

    const removeLazyTracking = (trackingId: string): void => {
        const index = lazyTrackings.value.findIndex((storeTracking) => storeTracking.id === trackingId);
        if (index !== -1) {
            lazyTrackings.value.splice(index, 1);
            console.log(`Removing lazy tracking: `, trackingId);
        } else {
            eventStore.createEventNotification('Error', `Lazy Tracking nicht gefunden. ID: ${trackingId}`);
            console.error(`Lazy tracking not found: `, trackingId);
        }
    };

    const createTracking = (task: Task): Tracking | null => {
        if (!task.project) {
            console.log(`Fetching project for tracking`);
            task.project = projectStore.getProjectById(task.project_id);
            if (!task.project) {
                console.error(`Project not found for task: `, task);
                eventStore.createEventNotification('Error', `Projekt nicht gefunden für Task: ${task.name}`);
                return null;
            }
        }

        if (!userStore.loggedUser) {
            console.error('User is not logged in');
            eventStore.createEventNotification('Error', `User nicht eingeloggt.`);
            return null;
        }

        return {
            billableStatus: BillableStatus.BILLABLE,
            createdBy: userStore.loggedUser,
            createdOn: new Date(),
            id: new Date().getTime().toString(),
            jobTypeId: task.estimate?.job_type_id ?? labelStore.jobTypes[0].id,
            recordDate: new Date(),
            summary: 'Umsetzung;',
            keepOnSubmit: false,
            task: task,
            time: {
                hours: 0,
                minutes: 1,
            },
        } as Tracking;
    };

    const removeTracking = (trackingId: string): void => {

        const index = trackings.value.findIndex((storeTracking) => storeTracking.id === trackingId);

        if (index === -1) {
            console.error(`Tracking not found: `, trackingId);
            eventStore.createEventNotification('Error', `Tracking nicht gefunden. ID: ${trackingId}`);
            return;
        }

        trackings.value.splice(index, 1);
        console.log(`Removing tracking: `, trackingId);

        if (focusedTracking.value && focusedTracking.value.id === trackingId) {
            focusedTracking.value = null;
        }
    };

    const addPinnedTask = async (task: Task): Promise<void> => {
        loadingStore.setLoading(true);
        try {
            const index = pinnedTasks.value.findIndex((t) => t.id === task.id);
            if (index !== -1) {
                removePinnedTask(task.id);
                return;
            }
            // It is possible that the task does not have the project as an object
            if (!task.project) {
                console.log(`Fetching project for task: `, task);
                const project = projectStore.getProjectById(task.project_id);
                if (!project) {
                    eventStore.createEventNotification('Error', `Projekt nicht gefunden für Task: ${task.name}`);
                    throw new Error(`Project not found for task: ${task.name}`);
                }
                task.project = project;
            }
            console.log(`Adding pinned task: `, task);
            eventStore.createEventNotification('Pin hinzugefügt', task.name);
            pinnedTasks.value.push(task);
        } catch (error) {
            console.error(error);
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const removePinnedTask = (taskId: string): void => {
        try {
            const index = pinnedTasks.value.findIndex((t) => t.id === taskId);
            if (index === -1) {
                throw new Error(`Pinned task not found: ${taskId}`);
            }
            pinnedTasks.value.splice(index, 1);
            console.log(`Removing pinned task: `, taskId);
            eventStore.createEventNotification('Pin gelöscht', taskId);
        } catch (error) {
            console.error(error);
            eventStore.createEventNotification('Error', `Pin nicht gefunden für Task: ${taskId}`);
        }
    };

    const submitTimeRecord = async (trackingId: string, remove: boolean = true): Promise<boolean> => {
        loadingStore.setLoading(true);
        try {
            if (!userStore.loggedUser) {
                throw new Error('User is not logged in');
            }

            const trackingFromStore = trackings.value.find(storeTracking => storeTracking.id === trackingId);
            if (!trackingFromStore) {
                throw new Error(`Tracking not found in store. ID: ${trackingId}`);
            }

            const record: TimeRecordRequestCreate = {
                projectId: trackingFromStore.task.project_id,
                taskId: trackingFromStore.task.task_id,
                requestData: {
                    time_record: {
                        value: calculateTimeValue(trackingFromStore.time.hours, trackingFromStore.time.minutes),
                        user_id: trackingFromStore.createdBy.id,
                        job_type_id: trackingFromStore.jobTypeId,
                        record_date: trackingFromStore.recordDate,
                        summary: trackingFromStore.summary,
                        billable_status: trackingFromStore.billableStatus,
                    },
                    submitted: 'submitted',
                },
            };

            const res = await window.electron.api.createTimeRecord(record);

            if (!res.success) {
                eventStore.createEventNotification('Error', `Fehler beim Senden des Trackings für Task: ${trackingFromStore?.task.name ?? trackingId}`);
                throw new Error(`Failed to create time record: ${res.error}`);
            }

            console.log('Time record created:', res.data);

            if (remove) {
                removeTracking(trackingFromStore.id);
            }

            addToTimeRecordHistory(res.data);
            eventStore.createEventNotification('Neuen Zeiteintrag erstellt', trackingFromStore.task.name);
            return true;
        } catch (error) {
            console.error('Error during tracking submission:', error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const submitLazyTracking = async (tracking: Tracking): Promise<boolean> => {
        const record = createTracking(tracking.task);
        if (record) {
            record.time = tracking.time;
            record.summary = tracking.summary;
            record.billableStatus = tracking.billableStatus;
            record.jobTypeId = tracking.jobTypeId;
            addTracking(record);
            return await submitTimeRecord(record.id);
        } else {
            return false;
        }
    };

    const fetchTimeRecords = async (projectId: string, taskId: string): Promise<TimeRecord[]> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getTaskTimeRecords(projectId, taskId);

            if (!res.success) {
                throw new Error('Failed to fetch time records');
            }

            console.log('Fetched time records:', res.data);
            return res.data as TimeRecord[];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const getProjectFromTimeRecord = (timeRecord: TimeRecord): Project | undefined => {
        const permalink = timeRecord.permalink;
        const url = new URL(permalink);
        const pathInfo = url.searchParams.get('path_info');
        let slug = '';

        if (!pathInfo) {
            return undefined;
        }

        const parts = decodeURIComponent(pathInfo).split('/');
        const projectIndex = parts.indexOf('projects');
        if (projectIndex !== -1 && parts.length > projectIndex + 1) {
            slug = parts[projectIndex + 1];
            return projectStore.projects.find((project) => {
                return project.slug === slug;
            });
        }
        return undefined;
    };

    const getTaskIdFromTimeRecord = (timeRecord: TimeRecord): string => {
        const permalink = timeRecord.permalink;
        const url = new URL(permalink);
        const pathInfo = url.searchParams.get('path_info');

        if (!pathInfo) {
            return 'Task not found';
        }

        const parts = decodeURIComponent(pathInfo).split('/');
        const tasksIndex = parts.indexOf('tasks');

        if (tasksIndex !== -1 && parts.length > tasksIndex + 1) {
            return parts[tasksIndex + 1];
        } else {
            return 'Task not found';
        }
    };

    // Important: The data we get back from the API, after submitting, is not the same as the one
    // we defined on the interface. For example here: job_type_id does not exist on the record we get after deleting
    // the time record. However, it gives us a job type object. So we need to cast the data to the TimeRecord interface
    const submitTimeRecordDelete = async (timeRecord: TimeRecord): Promise<boolean> => {
        loadingStore.setLoading(true);

        const project = getProjectFromTimeRecord(timeRecord);
        const taskId = getTaskIdFromTimeRecord(timeRecord);

        if (!project) {
            eventStore.createEventNotification('Error', `Projekt nicht gefunden: ${taskId}`);
            throw new Error(`Project not found for record: ${timeRecord}`);
        }

        const request: TimeRecordRequestDelete = {
            recordId: timeRecord.id,
            projectId: project.id,
            taskId: taskId,
            requestData: {
                submitted: 'submitted',
            },
        };

        try {
            const res = await window.electron.api.deleteRecord(request);

            if (!res.success) {
                throw new Error(`Failed to delete time record: ${res.error}`);
            }

            console.log('Time record deleted:', res.data);
            eventStore.createEventNotification('Zeiteintrag gelöscht', `Projekt: ${project.id} Task: ${taskId}`);
            removeFromTimeRecordHistory(timeRecord.id);
            return true;
        } catch (error) {
            eventStore.createEventNotification('Error', `Zeiteintrag konnte nicht gelöscht werden für Projekt: ${project.slug} Task: ${taskId}`);
            console.error(error);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };
    const submitTimeRecordUpdate = async (timeRecord: TimeRecord): Promise<boolean> => {
        loadingStore.setLoading(true);

        const project = getProjectFromTimeRecord(timeRecord);
        const taskId = getTaskIdFromTimeRecord(timeRecord);

        if (!project) {
            eventStore.createEventNotification('Error', `Projekt nicht gefunden: ${taskId}`);
            throw new Error(`Project not found for record: ${timeRecord}`);
        }

        const req: TimeRecordRequestUpdate = {
            projectId: project.id,
            taskId: taskId,
            recordId: timeRecord.id,
            requestData: {
                time_record: {
                    value: timeRecord.value,
                    user_id: timeRecord.created_by_id,
                    job_type_id: timeRecord.job_type_id ? timeRecord.job_type_id : timeRecord.job_type?.id ? timeRecord.job_type.id : '0',
                    record_date: timeRecord.record_date.date_object,
                    summary: timeRecord.summary,
                    billable_status: timeRecord.billable_status,
                },
                submitted: 'submitted',
            },
        };

        try {
            const res = await window.electron.api.updateRecord(req);

            if (!res.success) {
                throw new Error(`Failed to update record: ${res.error}`);
            }

            console.log('Record updated:', res.data);
            eventStore.createEventNotification(`Zeitantrag geändert`, `Projekt ${project.slug} Task ${taskId}: ${timeRecord.id}`);
            updateInTimeRecordHistory(timeRecord);
            return true;
        } catch (error) {
            console.error('Error during time record update:', error);
            eventStore.createEventNotification('Error', `Zeiteintrag konnte nicht geändert werden für Projekt: ${project.slug} Task: ${taskId}`);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const addToTimeRecordHistory = (record: TimeRecord): void => {
        timeRecordHistory.value.push(record);
    };

    const removeFromTimeRecordHistory = (recordId: string): void => {
        const index = timeRecordHistory.value.findIndex((record) => record.id === recordId);
        if (index !== -1) {
            timeRecordHistory.value.splice(index, 1);
        }
    };

    const updateInTimeRecordHistory = (record: TimeRecord): void => {
        const index = timeRecordHistory.value.findIndex((r) => r.id === record.id);
        if (index !== -1) {
            timeRecordHistory.value[index] = record;
        }
    };

    return {
        focusedTracking,
        trackings,
        pinnedTasks,
        lazyTrackings,
        timeRecordHistory,
        submitTimeRecord,
        removeTracking,
        createTracking,
        removePinnedTask,
        addTracking,
        addPinnedTask,
        addLazyTracking,
        submitLazyTracking,
        fetchTimeRecords,
        submitTimeRecordDelete,
        submitTimeRecordUpdate,
        removeLazyTracking,
        addToTimeRecordHistory,
        removeFromTimeRecordHistory,
        updateInTimeRecordHistory,
        getProjectFromTimeRecord,
        getTaskIdFromTimeRecord,
    };
});
