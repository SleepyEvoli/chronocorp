import {DateTimeValue, JobType} from './system';
import {User} from './user';
import {Task} from './task';

export interface TimeRecord {
    id: string;
    class: string;
    permalink: string;
    created_on: DateTimeValue;
    created_by_id: string;
    parent_class: string;
    parent?: Task;
    parent_id: string;
    state: number;
    billable_status: number;
    value: number;
    record_date: DateTimeValue;
    summary: string;
    user: User;
    job_type_id: string;
    job_type?: JobType;
}
