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

  const { userId }:{type: string} = auth();


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










