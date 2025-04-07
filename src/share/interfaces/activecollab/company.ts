import {Avatar, DateTimeValue} from "./system";

export interface Company {
    id: string;
    class: string;
    name: string;
    permalink: string;
    created_on: DateTimeValue | null;
    created_by_id: string | null;
    updated_on: DateTimeValue | null;
    updated_by_id: string | null;
    state: number;
    avatar: Avatar;
    office_address: string;
    office_phone: string;
    office_fax: string;
    office_homepage: string;
    is_owner: boolean;
}
