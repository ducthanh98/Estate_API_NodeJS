export interface CommentRO {
    total: number;
    list: ListComment[];
}

interface ListComment {
    id: number;
    comment: string;
    user: {
        id: number,
        name: string,
        email: string,
    };
}
