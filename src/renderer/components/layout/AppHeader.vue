<template>
    <section class="app-header">
        <div class="app-header__logo">
            <router-link to="/">
                <img :src="logo" alt="Logo von intercorp."/>
            </router-link>
        </div>
        <div class="app-header__back-and-forth">
            <Button class="icon secondary no-border" @click="router.go(-1)">
                <Icon alt="Going Back" iconName="arrowBack"/>
            </Button>
            <Button class="icon secondary no-border" @click="router.go(+1)">
                <Icon alt="Going forth" iconName="arrowForward"/>
            </Button>
        </div>
        <div class="app-header__navbar">
            <router-link
                v-for="link in navLinks"
                :key="link.to"
                :class="['app-header__navbar-icon', link.class]"
                :to="link.to"
            >
                <Button class="icon secondary no-border">
                    <Icon :alt="link.alt" :iconName="link.icon"/>
                </Button>
            </router-link>
            <div class="app-header__navbar-user">
                <UserThumbnail :user="userStore.loggedUser" class="app-header__navbar-user-thumbnail"/>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import Icon from '@/components/core/Icon.vue';
import UserThumbnail from '@/components/modules/UserThumbnail.vue';
import {useUserStore} from '@/stores/userStore';
import logo from '@/assets/intercorp_logo_full.svg?url';
import Button from '@/components/core/Button.vue';
import router from '@/router/router';

const userStore = useUserStore();

const navLinks = [
    {to: '/', icon: 'home', alt: 'Navigation Home Icon'},
    {to: '/task-assignment', icon: 'projectManager', alt: 'Navigation Project Icon'},
    {to: '/timer', icon: 'clock', alt: 'Navigation Timer Icon'},
    {to: '/settings', icon: 'settings', alt: 'Navigation Settings Icon', class: 'app-header__navbar-settings'},
];
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.app-header {
    display: flex;
    gap: 1em;

    // currently only used for the timer view
    @media (max-width: $breakpoint-tablet) {
        display: none;
    }

    .app-header__back-and-forth {
        display: flex;
        gap: 1em;
        align-self: center;
    }

    .app-header__navbar {
        align-items: center;
        background-color: $primary-color-5;
        border-radius: $border-radius-md;
        display: flex;
        gap: 1em;
        padding-left: 1em;
        width: 100%;

        .app-header__navbar-icon {
            height: 1.75em;
            width: 1.75em;
            align-content: center;
        }

        .app-header__navbar-settings {
            display: flex;
        }

        .app-header__navbar-user {
            display: flex;
            justify-content: flex-end;
            padding: 0 0.5em;
            width: 100%;

            .app-header__navbar-user-thumbnail {
                height: 2em;
                width: 2em;
            }
        }
    }
}

</style>
