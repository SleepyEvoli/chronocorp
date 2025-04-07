import {ref} from 'vue';
import {defineStore} from 'pinia';
import {User} from '@share/interfaces/activecollab/user';
import {useLoadingStore} from '@/stores/loadingStore';

export const useUserStore = defineStore('user', () => {
    // App will not run, if loggedUser is not initialized, so we can safely use {} as User
    const loggedUser = ref<User>({} as User);
    const users = ref<User[]>([]);

    const loadingStore = useLoadingStore();

    const init = async (): Promise<void> => {
        const user = await fetchLoggedUser();
        if (user) {
            loggedUser.value = user;
        }
        users.value = await fetchUsers();
    };

    const fetchLoggedUser = async (): Promise<User | null> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getInfo();
            if (!res.success) {
                throw new Error(`Error at fetching Logged User: ${res.error}`);
            }
            return res.data.logged_user as User;
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const fetchUsers = async (): Promise<User[]> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getUsers();
            if (!res.success) {
                throw new Error(`Error at fetching Users: ${res.error}`);
            }
            console.log(`Users fetched: `, users.value);
            return res.data as User[];
        } catch (error) {
            console.error(error);
            return [];
        } finally {
            loadingStore.setLoading(false);
        }
    };

    const fetchUser = async (id: string): Promise<User | null> => {
        loadingStore.setLoading(true);
        try {
            const res = await window.electron.api.getUser(id);
            if (!res.success) {
                throw new Error(`Error at fetching User: ${res.error}`);
            }
            console.log('User fetched:', res.data);
            return res.data as User;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        } finally {
            loadingStore.setLoading(false);
        }
    };

    return {
        loggedUser,
        users,
        fetchLoggedUser,
        fetchUsers,
        fetchUser,
        init,
    };
});
