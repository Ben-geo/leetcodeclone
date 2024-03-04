import { auth } from '@/firebase/firebase';
import Link from 'next/link';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Logout from '../Buttons/Logout';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { BsList } from 'react-icons/bs';
import Timer from '../Timer/Timer';
import { useRouter } from 'next/router';
import { problems } from '@/utils/problems';
import { Problem } from '@/utils/types/problem';
import Image from 'next/image';

type TopbarProps = {
    problemPage? :boolean;
};

const Topbar:React.FC<TopbarProps> = ({problemPage}) => {
    const setAuthModalState=useSetRecoilState(authModalState);
	const [user] = useAuthState(auth);
	const router =useRouter();
	const handleProblemChange=(isForward:boolean)=>{
		const {order} =problems[router.query.pid as string] as Problem;
		const direction= isForward? 1 :-1;
		const nextProblemOrder = order+direction;
		const nextProblemKey = Object.keys(problems).find(key=>problems[key].order===nextProblemOrder);
		if (isForward && !nextProblemKey) {
			const firstProblemKey = Object.keys(problems).find((key) => problems[key].order === 1);
			router.push(`/problems/${firstProblemKey}`);
		} else if (!isForward && !nextProblemKey) {
			const lastProblemKey = Object.keys(problems).find(
				(key) => problems[key].order === Object.keys(problems).length
			);
			router.push(`/problems/${lastProblemKey}`);
		} else {
			router.push(`/problems/${nextProblemKey}`);
		}


	}
    return (
        <nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-dark-layer-1 text-dark-gray-7'>
			<div className={`flex w-full items-center justify-between ${problemPage ?"max-w-[1200px] mx-auto":""}`}>
			<Link href='/' className='h-[22px] flex-1'>
					<Image src='/logo-full.png' alt='Logo' height={100} width={100} />
				</Link>
				{
					problemPage &&
					<div className='flex items-center gap-4 justify-center'>
						<button>
						<div className='flex items-center gap-4 justify-center rounded hover:bg-dark-fill-3'
						onClick={()=>handleProblemChange(false)}>
						<FaChevronLeft />
							</div>
							</button>
							<Link href="/" className='flex items-center gap-2 font-medium max-w-[170-px] text-white'>
								<div>
								<BsList />
								</div>
							<p>Problem List</p>
							</Link>
							<button>
							<div className='flex items-center gap-4 justify-center rounded hover:bg-dark-fill-3'
							onClick={()=>handleProblemChange(true)}>
						<FaChevronRight />
							</div>
							</button>
						</div>
				}
				<div className='flex items-center space-x-4 flex-1 justify-end'>
				
					{!user &&(
					<Link href='/auth'>
						<button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded ' 

						onClick={()=>{
							setAuthModalState((prev)=>({...prev,isOpen:true,type:"login"}));
						}}
						>Sign In</button>
					</Link>
					)}
					{user && problemPage && <Timer />}
					{user &&(
						<div className='cursor-pointer group relative'>
						<p className='text-sm'>{user.email}</p>
						</div>
					)}
					{user &&<Logout />}
				</div>
			</div>
</nav>
    );
};
export default Topbar;