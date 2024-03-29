
import { auth, firestore } from '@/firebase/firebase';
import { DBProblem } from '@/utils/types/problem';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsCheckCircle } from 'react-icons/bs';

type ProblemsTableProps = {
    setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
};


const ProblemsTable:React.FC<ProblemsTableProps> = ({setLoadingProblems}) => {
    const problems = useGetProblems(setLoadingProblems);
    const solvedProblems= useGetSolvedProblems();
    return (
        <tbody className='text-white'>
            {problems.map((problem,idx) => {
                const difficulyColor =
                problem.difficulty === "Easy"
                    ? "text-dark-green-s"
                    : problem.difficulty === "Medium"
                    ? "text-dark-yellow"
                    : "text-dark-pink";
                return(
                    <tr className={`${idx % 2 == 1 ? "bg-dark-layer-1" : ""}`} key={problem.id}>
                        <th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s'>
                            {solvedProblems.includes(problem.id) && <BsCheckCircle fontSize={"18"} width="18" />}
                        </th>
                        <td className='px-6 py-4'>
                            <Link className='hover:text-blue-600 cursor-pointer' href={`/problems/${problem.id}`}>
                                {`${problem.title}`}                                   
                            </Link>
                        </td>
                        <td className={`px-6 py-4 ${difficulyColor}`}>{problem.difficulty}</td>
                    </tr>
                )
            })}
            
        </tbody>
    )
}
export default ProblemsTable

function useGetProblems(setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>) {
	const [problems, setProblems] = useState<DBProblem[]>([]);

	useEffect(() => {
		const getProblems = async () => {
			// fetching data logic
			setLoadingProblems(true);
			const q = query(collection(firestore, "problems"), orderBy("order", "asc"));
			const querySnapshot = await getDocs(q);

            const tmp:DBProblem[]= [];
			querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                tmp.push({ id: doc.id, ...doc.data() } as DBProblem);
              });
            setProblems(tmp);
            setLoadingProblems(false)
		};

		getProblems();
	}, []);
	return problems;
}
function useGetSolvedProblems() {
	const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
	const [user] = useAuthState(auth);

	useEffect(() => {
		const getSolvedProblems = async () => {
			const userRef = doc(firestore, "users", user!.uid);
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				setSolvedProblems(userDoc.data().solvedProblems);
			}
		};
		if (user) getSolvedProblems();
		if (!user) setSolvedProblems([]);
	}, [user]);

	return solvedProblems;
}
