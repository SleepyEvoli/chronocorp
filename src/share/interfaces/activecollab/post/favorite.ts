export interface FavoriteAdd {
    userId: string;
    objectId: string;

    requestData: {
        submitted: 'submitted';
    };
}

export interface FavoriteRemove extends FavoriteAdd {
}
