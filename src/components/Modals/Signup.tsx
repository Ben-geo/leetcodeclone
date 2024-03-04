import React, { useEffect, useState } from 'react';
import { authModalState } from '@/atoms/authModalAtom';
import { useSetRecoilState } from 'recoil';
import { auth, firestore } from '@/firebase/firebase';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

import { useRouter } from 'next/router';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
type SignupProps = {
    
};

const Signup:React.FC<SignupProps> = () => {
    const setAuthModalState=useSetRecoilState(authModalState);
    const handleClick=(type:'login'|'register'|'forgotPassword') =>{
                setAuthModalState((prev)=>({...prev,type}));
            };
    const [inputs, setInputs] = useState({ email: "", displayName: "", password: "" });
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };//will only change email if email is changed wont change others

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(auth);
    const router=useRouter();
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
        if (!inputs.email || !inputs.password || !inputs.displayName) return alert("Please fill all fields");
        try {
            toast.loading("Creating your account",{position:"top-center",toastId:"loadingToast"})
            const newUser = await createUserWithEmailAndPassword(inputs.email, inputs.password);
            if (!newUser) return;
            const userData={
                uid:newUser.user.uid,
                email:newUser.user.email,
                displayName:inputs.displayName,
                createdAt:Date.now(),
                updatedAt:Date.now(),
                likedProblems:[],
                dislikedProblems:[],
                solvedProblems:[],
                starredProblems:[],
                
            }
            await setDoc(doc(firestore,"users",newUser.user.uid),userData)
            router.push("/");
        } catch (error: any) {
            toast.error(error.message,{position:"top-center"})
        }
        finally{
            toast.dismiss("loadingToast")
        }
    }
    useEffect(()=>{
        if(error) alert(error.message);
    },[error]);
    
    return (
        <form className='space-y-6 px-6 pb-4' onSubmit={handleRegister}>
        <h3 className='text-center text-white font-medium'>Register</h3>
        <div>
        <label htmlFor='displayName' className='text-sm font-medium block mb-0 text-white'>
                Display Name
            </label>
            <input
            onChange={handleChangeInput}
            type='displayName'
                name='displayName'
                id='displayName'
                className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 bg-red-200 border-gray-500 placeholder-gray-400 text-black'
                placeholder='JohnDoe77'
            />            </div>
        <div></div>
        <div>
        <label htmlFor='email' className='text-sm font-medium block mb-0 text-white'>
                Email
            </label>
            <input
            onChange={handleChangeInput}
            type='email'
                name='email'
                id='email'
                className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 bg-red-200 border-gray-500 placeholder-gray-400 text-black'
                placeholder='name@company.com'
            />            </div>
        <div>
            <label htmlFor='password' className='text-sm font-medium block mb-0 text-white'>Password</label>
            <input
            onChange={handleChangeInput}
            type='password'
            name='password'
            id='password'
            className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 bg-red-200 border-gray-500 placeholder-gray-400 text-black'/>
        </div>
        <button type='submit' className='w-full text-white focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange'>
            {loading? "Registering.....":"Register"}
        </button>
        <div className='text-sm text-white'>
                Already have an Account?
                <a href='#' className='text-blue-800' onClick={()=> handleClick("login")}> Log in</a>
            </div>
    </form>
    )
}
export default Signup;