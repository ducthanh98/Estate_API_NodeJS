export interface IReponse<T> {
    statusCode: number;
    message: string | ' Forbidden';
    data?: T[] | T | [];
}
