export const enum State {
    IS_TRASHED = 1,
    IS_ARCHIVED = 2,
    IS_ACTIVE = 3,
}

export const enum Visibility {
    PRIVATE = 0,
    NORMAL = 1, // Default
    PUBLIC = 2,
}

export const enum Priority {
    LOWEST = -2,
    LOW = -1,
    NORMAL = 0, // Default
    HIGH = 1,
    HIGHEST = 2,
}

export const enum BillableStatus {
    UNBILLABLE = 0,
    BILLABLE = 1,
    PENDING_PAYMENT = 2,
    PAID = 3,
}
