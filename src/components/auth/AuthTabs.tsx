import { Tabs, TabsContent } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";

const AuthTabs = () => {
    return (
        <Tabs defaultValue='login' className='w-[400px]'>
            <TabsContent value='login'>
                <LoginForm />
            </TabsContent>
        </Tabs>
    );
}

export default AuthTabs;