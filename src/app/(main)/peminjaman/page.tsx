import BackButton from "@/components/BackButton";
import LoanTable from "@/components/loan/LoanTable";

const LoanPages = () => {
    return (<>
        <BackButton text="Go Back" link="/"></BackButton>
        <LoanTable />
    </>);
}

export default LoanPages;