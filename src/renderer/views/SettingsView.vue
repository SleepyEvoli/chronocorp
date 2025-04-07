<template>
    <div class="view-settings">
        <Box>
            <div class="view-settings__actions">
                <Button class="primary" @click="fetchData">Fetch Data</Button>
                <Button class="primary" @click="fetchProjectTimes">Fetch Project Times</Button>
                <Button class="primary" @click="resetLoginData">Reset Login Data</Button>
                <Button class="primary" @click="clearLocalStorage">Clear LocalStorage</Button>
            </div>
        </Box>
        <Box>
            <div class="view-settings__actions">
                <Checkbox
                    :checked="settingStore.alwaysOnTop"
                    @change="alwaysOnTop($event)"
                >
                    Always on top
                </Checkbox>
            </div>
        </Box>
        <div class="view-settings__version">
            <p>Version: {{ appVersion }}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Box from '@/components/core/Box.vue';
import Button from '@/components/core/Button.vue';
import {useProjectStore} from '@/stores/projectStore';
import {useLabelStore} from '@/stores/labelStore';
import {useTaskStore} from '@/stores/taskStore';
import {useCompanyStore} from '@/stores/companyStore';
import {useUserStore} from '@/stores/userStore';
import {onMounted, ref} from 'vue';
import {useTrackingStore} from '@/stores/trackingStore';
import Checkbox from '@/components/core/Checkbox.vue';
import {useSettingStore} from '@/stores/settingStore';

const projectStore = useProjectStore();
const userStore = useUserStore();
const companyStore = useCompanyStore();
const taskStore = useTaskStore();
const labelStore = useLabelStore();
const trackingStore = useTrackingStore();
const settingStore = useSettingStore();

const appVersion = ref<string>('');

const fetchData = async () => {
    await labelStore.init();
    await userStore.init();
    await companyStore.init();
    await projectStore.init();
    await taskStore.init();
};

const resetLoginData = async () => {
    await window.electron.login.reset();
    await window.electron.app.restart();
};

const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
};

const getAppVersion = async () => {
    const res = await window.electron.app.getVersion();
    if (res.success) {
        return res.data;
    } else {
        return 'Unknown';
    }
};

const fetchProjectTimes = async () => {
    for (const project of projectStore.projects) {
        const records = await projectStore.fetchProjectTimeRecords(project.id);
        records.forEach((record) => {
            // if older than a month, don't add to history
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            if (record.record_date.date_object < date) {
                return;
            }
            trackingStore.addToTimeRecordHistory(record);
        });
    }
};

const alwaysOnTop = async (event: Event) => {
    settingStore.alwaysOnTop = (event.target as HTMLInputElement).checked;
    await window.electron.app.setAlwaysOnTop(settingStore.alwaysOnTop);
};

onMounted(async () => {
    appVersion.value = await getAppVersion();
});

</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.view-settings {
    display: flex;
    flex-direction: column;
    gap: 1em;

    .view-settings__actions {
        display: flex;
        gap: 1em;
    }
}
</style>
