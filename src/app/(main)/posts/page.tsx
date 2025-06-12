import PostsTable from "@/components/posts/PostTable";
import BackButton from "@/components/BackButton";
import PostPagination from "@/components/posts/PostPagination";

const PostsPage = () => {
    return (
        <>
        <BackButton text="Go Back" link="/"></BackButton>
        <PostsTable></PostsTable>
        <PostPagination></PostPagination>
        </>
    );
};
 
export default PostsPage;