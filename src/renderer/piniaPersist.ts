import {PiniaPluginContext} from 'pinia';

export function piniaPersistPlugin({store}: PiniaPluginContext) {
    const storageKey = `pinia-${store.$id}`;

    // Get the state from localStorage and convert the dates back to Date objects
    function reviveDates(obj: any) {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (typeof obj[key] === 'string' && obj[key].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)) {
                    obj[key] = new Date(obj[key]);
                } else if (typeof obj[key] === 'object') {
                    reviveDates(obj[key]);
                }
            }
        }
        return obj;
    }

    // Save the state to localStorage
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
        store.$patch(reviveDates(JSON.parse(savedState)));
    }

    // listens for any changes in the Pinia store
    // when value updated => Callback function is called
    // _mutations (ignored) contains details about what changed
    store.$subscribe((_mutation, state) => {
        localStorage.setItem(storageKey, JSON.stringify(state));
    });
}
