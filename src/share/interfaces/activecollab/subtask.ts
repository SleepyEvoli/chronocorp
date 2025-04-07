import {DateTimeValue, Permissions, Urls} from "./system";
import {User} from "./user";

export interface Subtask {
    id: string;
    class: string;
    name: string;
    permalink: string;
    created_on: DateTimeValue;
    created_by_id: string;
    updated_on: DateTimeValue | null;
    updated_by_id: string | null;
    parent_class: string;
    parent_id: string;
    urls: Urls;
    permissions: Permissions;
    state: number;
    is_completed: boolean;
    completed_on?: DateTimeValue;
    completed_by?: User;
    priority: number;
    due_on: DateTimeValue | null;
    assignee_id: string | null;
    delegated_by_id: string | null;
    label_id: string;
    user_is_subscribed: boolean;
}
