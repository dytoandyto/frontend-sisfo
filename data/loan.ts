import { loan } from "../types/loan";

const loans: loan[] = [
    {
        id: 1,
        id_user: 1,
        id_item: 2,
        date_loan: "2025-06-05",
        date_return: "2025-06-10",
        date_returned: null,
        quantity: 1,
        status: "waiting for respond",
    },
    {
        id: 2,
        id_user: 2,
        id_item: 1,
        date_loan: "2025-06-06",
        date_return: "2025-06-11",
        date_returned: null,
        quantity: 1,
        status: "waiting for respond",
    }
]

export default loans;
