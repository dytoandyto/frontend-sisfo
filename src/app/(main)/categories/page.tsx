import { Categories } from '../types/categories';
import CategoriesTable from '@/components/categories/CategoriesTable';
import BackButton from '@/components/BackButton';

const CategoriesPages = () => {
    return ( 
        <>
        <BackButton text="Go Back" link="/"></BackButton>
        <CategoriesTable></CategoriesTable>
        </>
     );
}
 
export default CategoriesPages;