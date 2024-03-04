import { authModalState } from '@/atoms/authModalAtom';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import { useSetRecoilState } from 'recoil';

type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const setAuthModalState=useSetRecoilState(authModalState);
            const handleClick=(type:'login'|'register'|'forgotPassword') =>{
                setAuthModalState((prev)=>({...prev,type}));
            }
            const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
                setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
            };
    const [inputs, setInputs] = useState({ email: "", password: "" });
    const router=useRouter();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);
    const handleLogin =async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputs.email || !inputs.password) return alert("Please fill all fields");
        try {
            const newUser = await signInWithEmailAndPassword(inputs.email, inputs.password);
            if (!newUser) return;
            
			router.push("/");
        } catch (error:any) {
            alert(error.message)
        }
    }
    useEffect(()=>{
        if(error) alert(error.message);
    },[error]);
    return (

        <form className='space-y-6 px-6 pb-4' onSubmit={handleLogin}>
            <h3 className='text-center text-white font-medium'>Login</h3>
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
				/>            
            </div>
            <div>
                <label htmlFor='password' 
                    className='text-sm font-medium block mb-0 text-white'>Password</label>
                <input
                onChange={handleChangeInput} 
                type='password' 
                name='password'
                id='password' 
                className='border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 bg-red-200 border-gray-500 placeholder-gray-400 text-black'/>
            </div>
            <button type='submit' className='w-full text-white focus:ring-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-brand-orange'>
                Login
            </button>
            <br />
            <button type='submit' className='flex w-full justify-end text-white' onClick={()=> handleClick("forgotPassword")}>
                <a href='#'>
                   forgot your passowrd?
                </a>
            </button>
            <div className='text-sm text-white'>
                Not Registered?
                <a href='#' className='text-blue-800' onClick={()=> handleClick("register")}> Create Account</a>
            </div>
        </form>
    )
}
export default Login;