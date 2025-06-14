import ItemsTable from "@/components/items/ItemsTable";
import BackButton from '@/components/BackButton';


const ItemPages = () => {
    return ( 
        <div>
            <BackButton text="Go Back" link="/"></BackButton>
            <ItemsTable></ItemsTable>
        </div>
     );
}
 
export default ItemPages;