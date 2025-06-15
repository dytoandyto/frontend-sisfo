import CategoriesTable from '@/components/categories/CategoriesTable';
import BackButton from '@/components/BackButton';
import Categoriesnext from '@/components/categories/CategoriesPage';


const CategoriesPages = () => {
    return ( 
        <>
        <BackButton text="Go Back" link="/"></BackButton>
        <CategoriesTable></CategoriesTable>
        <Categoriesnext></Categoriesnext>
        </>
     );
}
 
export default CategoriesPages;