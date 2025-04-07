import {DateTimeValue, Events, Permissions, Urls} from "./system";

export interface Attachment {
    id: string;
    name: string;
    permalink: string;
    class: string;
    verbose_type: string;
    verbose_type_lowercase: string;
    urls: Urls;
    permissions: Permissions;
    type: string;
    created_on: DateTimeValue;
    created_by_id: string;
    parent_class: string | null;
    parent_id: string | null;
    event_names: Events;
    state: number;
    is_archived: boolean;
    is_trashed: boolean;
    preview: Preview;
    size: string;
    mime_type: string;
    md5: string;
    thumbnail: string;
}

export interface Preview {
    icons: PreviewIcons;
}

export interface PreviewIcons {
    small: string;
    large: string;
}
