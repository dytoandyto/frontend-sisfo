import api from "./api";
import Cookies from "js-cookie";

// Admin Login
export async function login(email: string, password: string) {
    const res = await api.post("/login", { email, password });
    Cookies.set('token', res.data.token);
    return res.data.user;
}

export async function logout() {
    Cookies.remove('token');
}

// REGISTER USER
export async function register(data: { name: string; email: string; password: string }) {
    const res = await api.post("/admin/register", data);
    return res.data;
}
export async function getProfile() {
    const res = await api.get("/admin/profile");
    return res.data;
}
export async function updateUser(data: { name: string; email: string; password: string }) {
    const res = await api.put("/admin/profile", data);
    return res.data;
}
export async function deleteUser() {
    const res = await api.delete("/admin/profile");
    return res.data;
}

// CATEGORIES
export async function getCategories() {
    const res = await api.get("/admin/categories");
    return res.data;
}
export async function getCategory(categoryId: number) {
    const res = await api.get(`/admin/categories/${categoryId}`);
    return res.data;
}
export async function createCategory(data: { name_category: string; description: string; }) {
    const res = await api.post("/admin/categories", data);
    return res.data;
}
export async function updateCategory(data: { name_category: string; description: string; }) {
    const res = await api.put("/admin/categories/{category}/edit", data);
    return res.data;
}
export async function deleteCategory(categoryId: number) {
    const res = await api.delete(`/admin/categories/${categoryId}/delete`);
    return res.data;
}

// ITEMS (UNITS)
export async function getItems() {
    const res = await api.get("/admin/units");
    return res.data;
}
export async function createItem(data: {
    item_code: string;
    item_name: string;
    item_brand: string;
    item_category: number; // id kategori
    quantity: number;
}) {
    const res = await api.post("/admin/units", data);
    return res.data;
}
export async function updateItem(data: {
    item_code: string;
    item_name: string;
    item_brand: string;
    item_category: number; // id kategori
    quantity: number;
}) {
    const res = await api.put("/admin/units/{item}/edit", data);
    return res.data;
}
export async function deleteItem(itemId: number) {
    const res = await api.delete(`/admin/units/${itemId}/delete`);
    return res.data;
}

// LOAN
export async function getLoans() {
    const res = await api.get("/admin/loans");
    return res.data;
}
export async function getLoan(loanId: number) {
    const res = await api.get(`/admin/loans/${loanId}`);
    return res.data;
}
// export async function createLoan(data: {
//     loan_code: string;
// }) {
//     const res = await api.post("/admin/loans/create", data);
//     return res.data;
// }
// export async function updateLoan(loanId: number, data: {    }) {
//     const res = await api.put(`/admin/loans/${loanId}/edit`, data);
//     return res.data; 
// }
export async function deleteLoan(loanId: number) {
    const res = await api.delete(`/admin/loans/${loanId}/delete`);
    return res.data;
}

//APPROVE & Reject
export async function approveLoan(loanId: number) {
    const res = await api.put(`/admin/loans/approve/${loanId}`);
    return res.data;
}
export async function rejectLoan(loanId: number) {
    const res = await api.put(`/admin/loans/reject/${loanId}`);
    return res.data;
}

// RETURN
export async function getReturns(loanId: number) {
    const res = await api.get(`/admin/loans/${loanId}/return`);
    return res.data;
}
export async function getReturn(loanId: number, returnId: number) {
    const res = await api.get(`/admin/loans/${loanId}/return/${returnId}`);
    return res.data;
}
export async function createReturn(loanId: number, data: {
    item_code: string;
    quantity: number;
}) {
    const res = await api.post(`/admin/loans/${loanId}/return`, data);
    return res.data;
}