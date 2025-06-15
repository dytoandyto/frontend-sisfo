import BackButton from "@/components/BackButton";
import ReturnTable from "@/components/return/ReturnTable";
import NextLoanPages from '@/components/loan/LoanPage'



const LoanPages = () => {
    return (<>
        <BackButton text="Go Back" link="/"></BackButton>
        <ReturnTable />
        <NextLoanPages />
    </>);
}

export default LoanPages;