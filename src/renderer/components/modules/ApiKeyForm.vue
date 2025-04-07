<template>
    <div class="api-key-form">
        <InputField
            :value="username"
            class="api-key-form__input"
            placeholder="Username"
            @input="(event) => username = event.target.value"
        />
        <InputField
            :value="password"
            class="api-key-form__input"
            placeholder="Passwort"
            @input="(event) => password = event.target.value"
        />
        <InputField
            :value="apiKey"
            class="api-key-form__input"
            placeholder="API Key"
            @input="(event) => apiKey = event.target.value"
        />
        <Button class="primary api-key-form__button" @click="save">Speichern</Button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
</template>

<script lang="ts" setup>
import InputField from '@/components/core/InputField.vue';
import {ref} from 'vue';
import Button from '@/components/core/Button.vue';

const emit = defineEmits(['success']);

const username = ref<string>('your_username');
const password = ref<string>('your_password');
const apiKey = ref<string>('');
const errorMessage = ref<string>('');

const save = async () => {
    errorMessage.value = '';

    if (!username.value || !password.value || !apiKey.value) {
        errorMessage.value = 'Bitte alle Felder ausfüllen.';
        return;
    }

    await window.electron.login.setup(username.value, password.value, apiKey.value);
    const res = await window.electron.api.testConnection();

    if (res.success && res.data) {
        emit('success');
    } else {
        console.error('API Connection is not possible', res);
        errorMessage.value = 'API Verbindung ist nicht möglich. Bitte überprüfe deine Zugangsdaten und versuche es erneut.';
    }
};
</script>

<style lang="scss" scoped>
.api-key-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 20rem;

    .api-key-form__button {
        width: 100%;
    }

    .error-message {
        margin-top: 1rem;
        text-align: center;
    }
}
</style>
