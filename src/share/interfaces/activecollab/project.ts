import {Avatar, Currency, DateTimeValue, Estimate, Permissions, Urls} from './system';
import {Company} from './company';
import {LoggedUserPermissions, User} from './user';

export interface Project {
    id: string;
    class: string;
    name: string;
    permalink: string;
    created_on: DateTimeValue;
    created_by_id: string;
    created_by: User;
    updated_on: DateTimeValue | null;
    updated_by_id: string | null;
    updated_by: User | null;
    urls: Urls;
    permissions: Permissions;
    state: number;
    is_completed: boolean;
    avatar: Avatar;
    category_id: string | null;
    category: string | null;
    label_id: string;
    label: string | null;
    is_favorite: boolean;
    custom_fields: any[];
    object_time: number;
    object_expenses: number;
    estimate: Estimate | null;
    slug: string;
    project_number: string;
    company_id: string;
    leader_id: string;
    currency: Currency;
    overview: string;
    overview_formatted: string;
    based_on: string | null;
    template_id: string | null;
    progress: Progress;
    cost_summarized: number;
    leader: User;
    company: Company;
    logged_user_permissions: LoggedUserPermissions;
}

export interface Progress {
    percent_done: number;
    total_tasks: string;
    open_tasks: string;
}
