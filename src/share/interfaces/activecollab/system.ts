// noinspection SpellCheckingInspection

import {User} from './user';

export interface RolePermissions {
    has_system_access: boolean;
    has_admin_access: boolean;
    can_use_api: boolean;
    can_use_feeds: boolean;
    can_see_private_objects: boolean;
    can_manage_trash: boolean;
    can_manage_projects: boolean;
    can_manage_project_requests: boolean;
    can_add_project: boolean;
    can_see_project_budgets: boolean;
    can_manage_people: boolean;
    can_manage_company_details: boolean;
    can_see_contact_details: boolean;
    can_see_company_notes: boolean;
    can_have_homescreen: boolean;
    can_manage_assignment_filters: boolean;
    can_use_documents: boolean;
    can_add_documents: boolean;
    can_manage_documents: boolean;
    can_manage_finances: boolean;
    can_manage_quotes: boolean;

}

export interface Roles {
    id: string;
    class: string;
    is_default: boolean;
    is_administrator: boolean;
    is_project_manager: boolean;
    is_people_manager: boolean;
    role_permissions: RolePermissions;
}

export interface Avatar {
    photo: string;
    large: string;
    small: string;
    _full_size: string;
    _largest_size: string;
}

export interface Permissions {
    can_edit: boolean;
    can_delete: boolean;
    can_archive: boolean;
    can_unarchive: boolean;
    can_trash: boolean;
    can_untrash: boolean;
    can_set_as_invited?: boolean;
    can_change_complete_status: boolean;
    can_manage_tracking: boolean;
    can_see_budget: boolean;
    can_change_visibility?: boolean;
    can_comment?: boolean;
    can_move?: boolean;
    can_copy?: boolean;
}

export interface Urls {
    view: string;
    edit: string;
    delete: string;
    update_avatar: string;
    set_as_invited?: string;
    open: string;
    complete: string;
    update_category: string;
    update_label: string;
    add_to_favorites: string;
    remove_from_favorites: string;
    tracking: string;
    trash: string;
    update_priority: string;
    manage_assignees: string;
    subscriptions: string;
    subscribe: string;
    unsubscribe: string;
    reschedule: string;
    update_milestone: string;
    archive?: string;
    preview?: string;
}

export interface DateTimeValue {
    class?: string;
    timestamp?: number;
    mysql?: string;
    formatted?: string;
    formatted_gmt?: string;
    formatted_time?: string;
    formatted_time_gmt?: string;
    formatted_date?: string;
    formatted_date_gmt?: string;
    date_object: Date; // Added by us
}

export interface Currency {
    id: string;
    name: string;
    code: string;
    decimal_spaces: number;
    decimal_rounding: number;
    is_default: boolean;
}

export interface JobType {
    id: string;
    name: string;
    default_hourly_rate: number;
    is_default: boolean;
    is_active: boolean;
}

export interface AssignmentLabel {
    id: string;
    name: string;
    fg_color: string;
    bg_color: string;
    type: string;
    is_default: boolean;
}

export interface Events {
    created: string;
    updated: string;
    deleted: string;
}

export interface Category {
    id: string;
    class: string;
    name: string;
    permalink?: string;
    createdOn?: string;
    createdById?: string;
    parentId?: string | null;
    parentClass?: string | null;
    type?: string;
    parentType?: string | null;
    itemsCount?: number;
}

export interface Info {
    api_version: string;
    system_version: string;
    logged_user: User;
    read_only: boolean;
    root_url: string;
    assets_url: string;
    loaded_frameworks: string[];
    enabled_modules: string[];
    max_upload_size: number;
    first_week_day: number;
    workdays: string;
    multiple_assignees_for_milestones_and_tasks: boolean;
}

export interface Estimate {
    comment: string;
    job_type_id: string;
    job_type_name: string;
    value: number;
}
