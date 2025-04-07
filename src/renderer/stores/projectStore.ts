import {ref} from 'vue';
import {defineStore} from 'pinia';
import {Project} from '@share/interfaces/activecollab/project';
import {FavoriteAdd, FavoriteRemove} from '@share/interfaces/activecollab/post/favorite';
import {useUserStore} from '@/stores/userStore';
import type {User} from '@share/interfaces/activecollab/user';
import {useEventStore} from '@/stores/eventStore';
import {useLoadingStore} from '@/stores/loadingStore';
import {TimeRecord} from '@share/interfaces/activecollab/timeRecord';

export const useProjectStore = defineStore('project', () => {
    const userStore = useUserStore();
    const eventStore = useEventStore();
    const loadingStore = useLoadingStore();

    const projects = ref<Project[]>([]);

    const init = async (): Promise<void> => {
        projects.value = await fetchProjects();
    };

    const fetchProjects = async (): Promise<Project[]> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getProjects();
            if (!res.success) {
                throw new Error(`Error at fetching Projects: ${res.error}`);
            }
            console.log(`Fetched Projects: `, res.data);
            return res.data as Project[];
        } catch (error) {
            console.error(`Exception at fetching Projects: ${error}`);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const getProjectById = (projectId: string): Project | undefined => {
        return projects.value.find((project) => project.id === projectId);
    };

    const addFavoriteProject = async (projectId: string): Promise<boolean> => {
        if (!userStore.loggedUser) {
            return false;
        }

        const requestData: FavoriteAdd = {
            userId: userStore.loggedUser.id,
            objectId: projectId,
            requestData: {
                submitted: 'submitted',
            },
        };

        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.addFavoriteProject(requestData);

            if (!res.success) {
                throw new Error(`Error at adding favorite project: ${res.error}`);
            }

            eventStore.createEventNotification('Favorit hinzugefügt', `${projectId}`);
            console.log(`Added favorite project: `, res.data);
            return true;
        } catch (error) {
            console.error(`Exception at adding favorite project: ${error}`);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const removeFavoriteProject = async (projectId: string): Promise<boolean> => {
        if (!userStore.loggedUser) {
            return false;
        }

        const requestData: FavoriteRemove = {
            userId: userStore.loggedUser.id,
            objectId: projectId,
            requestData: {
                submitted: 'submitted',
            },
        };

        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.removeFavoriteProject(requestData);

            if (!res.success) {
                throw new Error(`Error at removing favorite project: ${res.error}`);
            }

            eventStore.createEventNotification('Favorit entfernt', `${projectId}`);
            console.log(`Removed favorite project: `, res.data);
            return true;
        } catch (error) {
            console.error(`Exception at removing favorite project: ${error}`);
            return false;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    // We already have a list with all users. We map the project users to the user list
    const fetchProjectUsers = async (projectId: string): Promise<User[]> => {
        let projectUsers: User[] = [];
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getProjectUsers(projectId);

            if (!res.success) {
                throw new Error(`Error at fetching Project Users: ${res.error}`);
            }

            console.log(`Fetched project users:`, res.data);
            projectUsers = res.data.map((user: any) => {
                return user.user;
            }) as User[];
            console.log(`Got users for project:`, projectUsers);
            return projectUsers;
        } catch (error) {
            console.error('Exception at fetching project users:', error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const fetchProjectTimeRecords = async (projectId: string): Promise<TimeRecord[]> => {
        loadingStore.setLoading(true);
        let records: TimeRecord[] = [];
        try {
            const res = await window.electron.api.getProjectTimeRecords(projectId);

            if (!res.success) {
                throw new Error(`Error at fetching Project Time Records: ${res.error}`);
            }

            const fetchedTimeRecords: TimeRecord[] = res.data as TimeRecord[];
            fetchedTimeRecords.forEach((timeRecord: TimeRecord) => {
                if (timeRecord.user.id === userStore.loggedUser?.id) {
                    records.push(timeRecord);
                }
            });

            console.log(`Fetched project time records:`, records);
            return records;

        } catch (error) {
            console.error('Exception at fetching project time records:', error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };

    return {
        projects,
        fetchProjects,
        getProjectById,
        addFavoriteProject,
        removeFavoriteProject,
        fetchProjectUsers,
        fetchProjectTimeRecords,
        init,
    };
});
