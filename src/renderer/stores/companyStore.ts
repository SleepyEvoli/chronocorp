import {ref} from 'vue';
import {defineStore} from 'pinia';
import {Company} from '@share/interfaces/activecollab/company';

export const useCompanyStore = defineStore('company', () => {
    const companies = ref<Company[]>([]);

    const init = async (): Promise<void> => {
        companies.value = await fetchCompanies();
    };

    const getCompanyById = (id: string): Company | undefined => {
        return companies.value.find((company) => company.id === id);
    };

    const fetchCompanies = async (): Promise<Company[]> => {
        try {
            const res = await window.electron.api.getCompanies();
            if (!res.success) {
                throw new Error(`Error at fetching Companies: ${res.error}`);
            }
            return res.data as Company[];
        } catch (error) {
            console.error(`Exception at fetching Companies: ${error}`);
            return [];
        }
    };

    return {
        companies,
        fetchCompanies,
        getCompanyById,
        init,
    };
});
