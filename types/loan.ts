export interface loan {
    id: number;
    id_user: number;
    id_item: number;
    date_loan: string;
    date_return: string;
    date_returned: string | null;
    quantity: number;
    status: string;
}
