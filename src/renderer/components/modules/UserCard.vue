<template lang="html">
    <div v-if="user" class="user-card">
        <div class="user-card__header">
            <div :class="{
                    'is-client': user.class === 'Client',
                    'user-card__header-thumbnail': true
                }"
            >
                <img :src="user.avatar._largest_size" alt="Thumbnail of User"/>
            </div>
            <div class="user-card__header-full-name">{{ user.first_name }} {{ user.last_name }}</div>
            <div class="user-card__header-company-name">{{ user.company?.name }}</div>
        </div>
        <div class="user-card__body">
            <div class="user-card__body-phone-work">
                <Icon class="user-card__body-icon" iconName="office"/>
                <span>{{ user.phone_work ?? '-' }}</span>
            </div>
            <div class="user-card__body-phone-mobile">
                <Icon class="user-card__body-icon" iconName="mobile"/>
                <span>{{ user.phone_mobile ?? '-' }}</span>
            </div>
            <div class="user-card__body-email">
                <Icon class="user-card__body-icon" iconName="mail"/>
                <span>{{ user.email }}</span>
            </div>
            <div class="user-card__body-birthday">
                <Icon class="user-card__body-icon" iconName="birthday"/>
                <span>{{ user.dob ? user.dob.toLocaleDateString() : '-' }}</span>
            </div>
        </div>
        <div class="user-card__note">{{ user.note || '...' }}</div>
        <div class="user-card__footer">
            <span>Letzter Besuch:</span><span> {{ user.last_visit_on.formatted }}</span>
            <span>Erstellt am:</span><span> {{ user.created_on.formatted }}</span>
            <span>Erstellt von:</span><span> {{ user.created_by?.first_name }} {{ user.created_by?.last_name }}</span>
            <span>Updated am:</span><span> {{ user.updated_on?.formatted }}</span>
            <span>Updated von:</span>
            <span>
                {{ user.updated_by?.first_name ?? '-' }}
                {{ user.updated_by?.last_name ?? '-' }}
            </span>
            <span>Class:</span><span>{{ user.class }}</span>
            <span>State:</span><span>{{ labelStore.getStateName(user.state) }}</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import type {User} from '@share/interfaces/activecollab/user';
import {onMounted, ref} from 'vue';
import Icon from '@/components/core/Icon.vue';
import {useLabelStore} from '@/stores/labelStore';
import {useUserStore} from '@/stores/userStore';

const props = defineProps({
    userId: {
        type: String,
        required: true,
    },
});

const labelStore = useLabelStore();
const userStore = useUserStore();

const user = ref<User | null>(null);

onMounted(async () => {
    user.value = await userStore.fetchUser(props.userId);
});
</script>
<style lang="scss" scoped>
@use '@/styles/variables' as *;

.user-card {
    color: $text-color;
    padding: 0 1em;
    width: 25em;

    .user-card__header {
        align-items: center;
        border-bottom: 1px solid $primary-color-2;
        display: flex;
        flex-direction: column;
        gap: .5em;
        margin-bottom: 1em;
        padding-bottom: .5em;

        .user-card__header-thumbnail {
            border: 3px solid $brand-color;
            border-radius: 50%;
            height: 7em;
            overflow: hidden;
            width: 7em;
        }

        .user-card__header-thumbnail.is-client {
            border: 3px solid $accent-color-green-2;
        }

        .user-card__header-full-name {
            color: #FFFFFF;
            font-size: 1.2rem;
        }
    }

    .user-card__body {
        display: flex;
        flex-direction: column;
        font-size: .9rem;
        gap: .5em;

        div {
            align-items: end;
            display: flex;
        }

        .user-card__body-icon {
            height: 1.2em;
            margin-right: .75em;
            width: 1.2em;
        }
    }

    .user-card__note {
        border-bottom: 1px solid $primary-color-2;
        padding: 1em 0;
        text-align: center;
    }

    .user-card__footer {
        display: grid;
        font-size: .8rem;
        gap: .5em;
        grid-template-columns: 1fr 1fr;
        padding-bottom: 1em;
        padding-top: 1em;
        text-align: start;
    }
}

</style>
