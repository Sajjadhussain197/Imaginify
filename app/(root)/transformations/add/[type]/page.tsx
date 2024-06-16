import Header from '@/components/shared/Header'
import { transformationTypes } from '@/constants'
import { auth } from '@clerk/nextjs/server'
import TransformationForm from '@/components/shared/TransformationForm'
import { getUserById } from '@/lib/actions/user.actions'
import { redirect } from 'next/dist/server/api-utils'
import { SearchParamProps } from '@/types'
import { TransformationTypeKey } from '@/types'
const AddTransformationTypePage = async ({params :{type}}: SearchParamProps) => {

 const transformation= transformationTypes[type];
//  try {
//   const { userId }: { userId: string | null } = auth();

//   if (!userId) {
//     return null;
//   }

//   const user = await getUserById(userId);

//   return (
//     <>
//       <Header title={transformation.title} subtitle={transformation.subTitle} />
//      <section className='mt-10'>
//      <TransformationForm 
//         action='Add' 
//         userId={user._id} 
//         type={transformation.type as TransformationTypeKey}
//         creditBalance={123} 
//       />
//      </section>
//     </>
//   );
// } catch (error) {
//   console.error("Error fetching user data:", error);
//   // Handle error gracefully, e.g., show an error message to the user
//   return <div>Error fetching user data. Please try again later.</div>;
// }

  // const {userId}= auth();
  const { userId }:{type: string} = auth();

// let user;
//   if (userId !== null) {
//      user = await getUserById(userId);
//     // Proceed with further processing
// } else {
//      user= null
// }
if(!userId) return null;

  const user = await  getUserById(userId)
  return (
    <>
    
      <Header title={transformation.title} subtitle={transformation.subTitle} />

      <TransformationForm 
      action='Add' 
      userId={user._id} 
      type={transformation.type as TransformationTypeKey}
      creditBalance={user.creditBalance} />
    </>
  )
}

export default AddTransformationTypePage







// import { auth } from '@clerk/nextjs/server';

// export default function Page() {
//   const { userId } : { userId: string | null } = auth();

//   if (!userId) return null;

//   return <h1>Hello, {userId}</h1>;
// }




