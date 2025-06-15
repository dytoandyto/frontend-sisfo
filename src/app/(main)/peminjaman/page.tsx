import BackButton from "@/components/BackButton";
import LoanTable from "@/components/loan/LoanTable";
import Loannext from "@/components/loan/LoanPage";

const LoanPages = () => {
    return (<>
        <BackButton text="Go Back" link="/"></BackButton>
        <LoanTable />
        <Loannext />
    </>);
}

export default LoanPages;