<template lang="html">
    <LoadingCircle/>
    <ConfirmModal
        v-if="modalStore.confirmModalVisible"
        @cancel="modalStore.closeConfirmModal"
        @confirm="modalStore.confirm"
    />
    <ContextMenu
        v-if="contextMenuStore.visible"
        @close="contextMenuStore.closeMenu"
    />
    <AppLeftBar v-if="appLoadComplete"/>
    <main>
        <BoxFocus v-if="!appLoadComplete">
            <ApiKeyForm
                @success="async ()=>{
                    await startSetup();
                }"
            />
        </BoxFocus>
        <header v-if="appLoadComplete">
            <AppHeader/>
        </header>
        <router-view v-if="appLoadComplete" class="view"/>
        <div class="notification-box-container">
            <NotificationBox/>
        </div>
    </main>
    <AppRightBar v-if="appLoadComplete"/>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import ContextMenu from '@/components/core/ContextMenu.vue';
import ConfirmModal from '@/components/core/ConfirmModal.vue';
import {useContextMenuStore} from '@/stores/contextMenuStore';
import {useModalStore} from '@/stores/modalStore';
import {useUserStore} from '@/stores/userStore';
import {useTaskStore} from '@/stores/taskStore';
import {useProjectStore} from '@/stores/projectStore';
import {useLabelStore} from '@/stores/labelStore';
import {useCompanyStore} from '@/stores/companyStore';
import AppRightBar from '@/components/layout/AppRightBar.vue';
import NotificationBox from '@/components/modules/NotificationBox.vue';
import {useTimerStore} from '@/stores/timerStore';
import BoxFocus from '@/components/core/BoxFocus.vue';
import ApiKeyForm from '@/components/modules/ApiKeyForm.vue';
import AppLeftBar from '@/components/layout/AppLeftBar.vue';
import LoadingCircle from '@/components/core/LoadingCircle.vue';
import {useSettingStore} from '@/stores/settingStore';

const contextMenuStore = useContextMenuStore();
const modalStore = useModalStore();
const companyStore = useCompanyStore();
const labelStore = useLabelStore();
const projectStore = useProjectStore();
const taskStore = useTaskStore();
const userStore = useUserStore();
const timerStore = useTimerStore();
const settingStore = useSettingStore();

const isLogged = ref<boolean>(false);
const appLoadComplete = ref<boolean>(false);

const storeSetup = async () => {
    try {
        await labelStore.init();
        await userStore.init();
        await companyStore.init();
        await projectStore.init();
        await taskStore.init();
        await settingStore.init();
        timerStore.init();
    } catch (error) {
        console.error('Error on Store Setup', error);
        throw error;
    }
};

// Not just connection but also if the credentials are valid
const checkValidApiConnection = async () => {
    try {
        const connTest = await window.electron.api.testConnection();
        return (connTest.success && connTest.data);
    } catch (error) {
        console.error('Error on API Connection', error);
        return false;
    }
};

const startSetup = async () => {
    try {
        if (await checkValidApiConnection()) {
            await storeSetup();
            appLoadComplete.value = true;
        }
    } catch (error) {
        console.error('Error on Start Setup', error);
        isLogged.value = false;
    }
};

onMounted(async () => {
    await startSetup();
});
</script>

<style lang="scss">
@use '@/styles/variables' as *;

#app {
    display: flex;
    gap: 1rem;

    @media (max-width: $breakpoint-tablet) {
        gap: 0;
    }
}

main {
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    max-height: 100vh;

    @media (max-width: $breakpoint-tablet) {
        padding: 0;
        gap: 0;
        margin: 0;
    }

    .view {
        overflow: auto;
        padding-top: .25rem;

        @media (max-width: $breakpoint-tablet) {
            padding: 0;
        }
    }

    .notification-box-container {
        position: fixed;
        right: 3%;
        top: 5%;
        z-index: 90;
        width: fit-content;
        height: fit-content;
        display: flex;
        justify-content: flex-end;
    }
}

</style>
