import {AssignmentLabel, Category, DateTimeValue, Estimate, Permissions, Urls} from './system';
import {Project} from './project';
import {User} from './user';
import {Priority} from './enums';
import {Attachment} from './attachment';

export interface Task {
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
    body: string;
    body_formatted: string;
    state: number;
    visibility: number;
    is_completed: boolean;
    priority: number;
    due_on: DateTimeValue | null;
    comments_url: string;
    comments_count: number;
    is_locked: boolean;
    subtasks_url: string;
    total_subtasks: number;
    open_subtasks: number;
    completed_subtasks: number;
    attachments_url: string;
    attachments: Attachment[];
    attachments_count: number;
    assignee_id?: string;
    delegated_by_id?: string;
    other_assignee_ids?: string[] | null;
    assignee: User | null;
    delegated_by: User | null;
    other_assignees: User[] | null;
    category_id: string;
    category: Category | null;
    label_id: string;
    label: AssignmentLabel | null;
    user_is_subscribed: boolean;
    subscribers: Subscriber[] | null;
    is_favorite: boolean;
    custom_fields: any[];
    object_time: number;
    object_expenses: number;
    estimate: Estimate | null;
    version: string;
    project_id: string;
    project?: Project;
    milestone: Milestone | null;
    milestone_id?: string;
    task_id: string;
    start_on?: DateTimeValue;
}

// You can get 'my tasks' from the API, which have a slightly different structure
export interface MyTask {
    id: string;
    type: string;
    project_id: string;
    assignee_id: string;
    label_id: string;
    category_id: string;
    milestone_id: string;
    name: string;
    body: string;
    created_on: string;
    age: number;
    created_by_id: string;
    created_by_name: string;
    created_by_email: string;
    due_on: DateTimeValue | null;
    completed_on: DateTimeValue | null;
    completed_by_id: string | null;
    completed_by_name: string | null;
    completed_by_email: string | null;
    priority: Priority;
    task_id: string;
    project: string;
    milestone: string | null;
    category: string | null;
    assignee: string;
    created_by: string;
    completed_by: string | null;
    permalink: string;
    other_assignees: string[] | null;
    estimated_time: number | null;
    tracked_time: number | null;
}

export interface Subscriber {
    id: string;
    display_name: string;
    short_display_name: string;
    permalink: string;
}

// Currently null in JSON
export interface Milestone {
}
