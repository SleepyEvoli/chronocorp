import {ref} from 'vue';
import {defineStore} from 'pinia';
import {AssignmentLabel, Category, JobType} from '@share/interfaces/activecollab/system';
import {BillableStatus, Priority, State, Visibility} from '@share/interfaces/activecollab/enums';
import {useLoadingStore} from '@/stores/loadingStore';

export const useLabelStore = defineStore('label', () => {
    const PriorityMap: { [key in Priority]: string } = {
        [Priority.LOWEST]: 'Niedrigste',
        [Priority.LOW]: 'Niedrig',
        [Priority.NORMAL]: 'Normal',
        [Priority.HIGH]: 'Hoch',
        [Priority.HIGHEST]: 'Höchste',
    };

    const StateMap: { [key in State]: string } = {
        [State.IS_TRASHED]: 'Gelöscht',
        [State.IS_ARCHIVED]: 'Archiviert',
        [State.IS_ACTIVE]: 'Aktiv',
    };

    const VisibilityMap: { [key in Visibility]: string } = {
        [Visibility.PRIVATE]: 'Privat',
        [Visibility.NORMAL]: 'Normal',
        [Visibility.PUBLIC]: 'Öffentlich',
    };

    const BillableStatusMap: { [key in BillableStatus]: string } = {
        [BillableStatus.UNBILLABLE]: 'Nicht abrechenbar',
        [BillableStatus.BILLABLE]: 'Abrechenbar',
        [BillableStatus.PENDING_PAYMENT]: 'Zahlung ausstehend',
        [BillableStatus.PAID]: 'Bezahlt',
    };

    const priorityList: Priority[] = [
        Priority.LOWEST,
        Priority.LOW,
        Priority.NORMAL,
        Priority.HIGH,
        Priority.HIGHEST,
    ];

    const stateList: State[] = [
        State.IS_ACTIVE,
        State.IS_ARCHIVED,
        State.IS_TRASHED,
    ];

    const visibilityList: Visibility[] = [
        Visibility.PRIVATE,
        Visibility.NORMAL,
        Visibility.PUBLIC,
    ];

    const billableStatusList: BillableStatus[] = [
        BillableStatus.UNBILLABLE,
        BillableStatus.BILLABLE,
        BillableStatus.PENDING_PAYMENT,
        BillableStatus.PAID,
    ];

    const priorityColorMap: { [key in Priority]: string } = {
        [Priority.LOWEST]: '#76a6a0',
        [Priority.LOW]: '#387c73',
        [Priority.NORMAL]: '#5f9c5d',
        [Priority.HIGH]: '#916c42',
        [Priority.HIGHEST]: '#651919',
    };

    const visibilityColorMap: { [key in Visibility]: string } = {
        [Visibility.PRIVATE]: '#ba6868',
        [Visibility.NORMAL]: '#76ba76',
        [Visibility.PUBLIC]: '#5ba8b8',
    };

    const defaultAssignmentLabelId = '1';
    const projectCategories = ref<Category[]>([]);
    const assignmentLabels = ref<AssignmentLabel[]>([]);
    const jobTypes = ref<JobType[]>([]);

    const loadingStore = useLoadingStore();

    const init = async (): Promise<void> => {
        await fetchAssignmentLabels();
        if (assignmentLabels.value.length === 0) {
            throw new Error('Assignment Labels are empty');
        }
        assignmentLabels.value = sortAssignmentLabels(assignmentLabels.value);

        await fetchProjectCategories();
        if (projectCategories.value.length === 0) {
            throw new Error('Project Categories are empty');
        }
        addEmptyCategory();

        await fetchJobTypes();
        if (jobTypes.value.length === 0) {
            throw new Error('Job Types are empty');
        }
    };

    const sortAssignmentLabels = (labels: AssignmentLabel[]): AssignmentLabel[] => {
        const names = ['neu', 'wiedergeöffnet', 'zugeteilt', 'in arbeit', 'in der abnahme', 'klärung nötig', 'erledigt'];
        const sortedLabels = labels.sort((a, b) => names.indexOf(a.name.toLowerCase()) - names.indexOf(b.name.toLowerCase()));
        return [...sortedLabels.splice(-names.length), ...sortedLabels];
    };

    const getStateName = (x: State): string => {
        return StateMap[x];
    };

    const getVisibilityName = (x: Visibility): string => {
        return VisibilityMap[x];
    };

    const getPriorityName = (x: Priority): string => {
        return PriorityMap[x];
    };

    const getBillableStatusName = (x: BillableStatus): string => {
        return BillableStatusMap[x];
    };

    const getPriorityColor = (x: Priority): string => {
        return priorityColorMap[x];
    };

    const getVisibilityColor = (x: Visibility): string => {
        return visibilityColorMap[x];
    };

    const getAssignmentLabelById = (id: string): AssignmentLabel | undefined => {
        return assignmentLabels.value.find((label) => label.id === id);
    };

    const getProjectCategoryById = (id: string): Category | undefined => {
        return projectCategories.value.find((category) => category.id === id);
    };

    const getJobTypeById = (id: string): JobType | undefined => {
        return jobTypes.value.find((jobType) => jobType.id === id);
    };

    const fetchAssignmentLabels = async (): Promise<void> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getAssignmentLabels();
            if (!res.success) {
                throw new Error(`Error at fetching Assignment Labels: ${res.error}`);
            }
            assignmentLabels.value = res.data;
            console.log(`Fetched Assignment Labels: `, res.data);
        } catch (error) {
            console.error(error);
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const fetchProjectCategories = async (): Promise<void> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getProjectCategories();
            if (!res.success) {
                throw new Error(`Error at fetching Project Categories: ${res.error}`);
            }
            console.log(`Fetched Project Categories: `, res.data);
            projectCategories.value = res.data;
        } catch (error) {
            console.error(error);
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const fetchTaskCategories = async (projectId: string): Promise<Category[]> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getTasksCategories(projectId);
            if (!res.success) {
                throw new Error(`Error at fetching Task Categories: ${res.error}`);
            }
            console.log(`Fetched Task Categories: `, res.data);
            return res.data;
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const addEmptyCategory = (): void => {
        const emptyCategory: Category = {
            id: '0',
            class: 'taskCategory',
            name: 'Keine Kategorie',
        };
        projectCategories.value.unshift(emptyCategory);
    };

    const fetchJobTypes = async (): Promise<void> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getJobTypes();
            if (!res.success) {
                throw new Error(`Error at fetching Job Types: ${res.error}`);
            }
            console.log(`Fetched Job Types: `, res.data);
            jobTypes.value = res.data;
        } catch (error) {
            console.error(`Exception during fetching Job Types:`, error);
        } finally {
            loadingStore.setLoading(false);
        }
    };

    return {
        priorityList,
        stateList,
        assignmentLabels,
        projectCategories,
        jobTypes,
        visibilityList,
        billableStatusList,
        defaultAssignmentLabelId,
        fetchJobTypes,
        fetchAssignmentLabels,
        fetchProjectCategories,
        fetchTaskCategories,
        getStateName,
        getVisibilityName,
        getPriorityName,
        getBillableStatusName,
        getAssignmentLabelById,
        getProjectCategoryById,
        getJobTypeById,
        getPriorityColor,
        init,
        getVisibilityColor,
        priorityColorMap,
    };
});
