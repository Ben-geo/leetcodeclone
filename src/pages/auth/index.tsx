import { authModalState } from '@/atoms/authModalAtom';
import AuthModal from '@/components/Modals/AuthModal';
import Navbar from '@/components/Navbar/Navbar';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';


type AuthPageProps = {};

const AuthPage:React.FC <AuthPageProps> = () => {
    const authModal = useRecoilValue(authModalState);
    const [pageLoading,setPageLoading]=useState(true);
    const router=useRouter();
    const [user,loading,error]=useAuthState(auth);

    useEffect(()=>{
        if(user) router.push("/");
        if(!loading && !user) setPageLoading(false);
    },[user,router,loading]);

    if(pageLoading) return null;



    return(
    <div className='bg-gradient-to-b from-gray-600 to-black h-screen relative'>
        <div className='max-w-7xl mx-auto'>
            <Navbar />
        </div>
        {authModal.isOpen && <AuthModal />}
    </div>
    );
};
export default AuthPage
