import UsersTable from "@/components/users/UsersTable";
import BackButton from "@/components/BackButton";
import UsersPage from "@/components/users/UsersPage";

const PageListUser = () => {
    return (
        <>
        <BackButton text="Go Back" link="/"></BackButton>
        <UsersTable />
        <UsersPage />
        </>
    );
}

export default PageListUser;