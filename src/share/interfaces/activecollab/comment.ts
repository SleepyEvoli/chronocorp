import {User} from './user';
import {DateTimeValue, Permissions, Urls} from './system';
import {Attachment} from './attachment';

export interface Comment {
    id: string;
    class: string;
    permalink: string;
    created_on: DateTimeValue;
    created_by_id: string;
    created_by: User;
    updated_on: DateTimeValue | null;
    updated_by_id: string | null;
    updated_by: User | null;
    parent_class: string;
    parent_id: string;
    urls: Urls;
    permissions: Permissions;
    body: string;
    body_formatted: string;
    state: number;
    attachments_url: string;
    attachments: Attachment[];
    attachments_count: number;
}
