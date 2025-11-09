import Header from '@/components/header';
import Pathname from '@/components/header/pathname';
import UserItem from '@/components/header/user-item';
import Aside from '@/components'

export default function Page() {
    return (
        <>
            <Header />
            <Pathname />
            <UserItem />
            <Aside />
            <div className="py-8 bg-[#F9F8FB] px-6 space-y-6">

            </div>
        </>
    );
}
