import ItemsTable from "@/components/items/ItemsTable";
import BackButton from '@/components/BackButton';
import Itemsnext from "@/components/items/ItemsPage";

const ItemPages = () => {
    return ( 
        <div>
            <BackButton text="Go Back" link="/"></BackButton>
            <ItemsTable></ItemsTable>
            <Itemsnext></Itemsnext>
        </div>
     );
}
 
export default ItemPages;