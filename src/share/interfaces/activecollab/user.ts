import {Avatar, DateTimeValue, Permissions, Roles, Urls} from './system';
import {Company} from './company';

export interface User {
    id: string;
    class: string;
    name: string;
    permalink: string;
    created_on: DateTimeValue;
    created_by_id: string;
    created_by?: User;
    updated_on: DateTimeValue | null;
    updated_by_id: string | null;
    updated_by?: User | null;
    urls?: Urls;
    permissions?: Permissions;
    state: number;
    avatar: Avatar;
    first_name: string;
    last_name: string;
    display_name: string;
    short_display_name: string;
    email: string;
    last_visit_on: DateTimeValue;
    last_activity_on?: DateTimeValue;
    is_administrator?: boolean;
    invited_on: DateTimeValue;
    is_project_manager?: boolean;
    is_people_manager?: boolean;
    company_id: string;
    local_time?: string;
    company?: Company;
    title?: string | null;
    phone_work?: string | null;
    phone_mobile?: string | null;
    dob?: Date | null;
    note?: string | null;
    im_type?: string;
    im_value?: string | null;
    role?: Roles;
}

export interface LoggedUserPermissions {
    role: string;
    permissions: LoggedUserPermissionsDetail;
}

export interface LoggedUserPermissions {
    role: string;
    permissions: LoggedUserPermissionsDetail;
}

export interface LoggedUserPermissionsDetail {
    milestone: number;
    tracking: number;
    repository: number;
    task: number;
    notebook: number;
    file: number;
    discussion: number;
}
