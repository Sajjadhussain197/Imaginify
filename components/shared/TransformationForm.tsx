"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import MediaUploader from "./MediaUploader"
import { z } from "zod"
import { TransformationFormProps } from "@/types"
 import { debounce, deepMergeObjects } from "@/lib/utils"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from '@/constants'
import { InsufficientCreditsModal } from "./InsufficientCreditModal"
import { CustomField } from "./CustomField"
import { useEffect, useState , useTransition} from "react"
import { Button } from "@/components/ui/button"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import TransformedImage from "./TransformedImage"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { title } from "process"
import { AspectRatioKey } from "@/lib/utils"
import { updateCredits } from "@/lib/actions/user.actions"
import { getCldImageUrl } from "next-cloudinary"
import path from "path"
import { useRouter } from "next/navigation"


export const formSchema = z.object({
  title: z.string(),
  aspectRatio:z.string().optional(),
  color:z.string().optional(),
  prompt:z.string().optional(),
  publicId: z.string(),
  
})


const TransformationForm = ({action, data=null, userId ,
  config =null, type, creditBalance}: TransformationFormProps) => {
  const transformationType= transformationTypes[type] ;
  const [image, setImage] = useState(data) 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformationConfig, setTransformationConfig ] = useState(config)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
 const [isPending,startTransition]= useTransition();
 const router=useRouter();
  const initialValues= data && action === 'Update'?{
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
    }: defaultValues;
      // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    if (data || image){
      const transformationUrl= getCldImageUrl(

        {
          width:image?.width,
          height:image.height,
          src:image?.publicId,
          ...transformationConfig
        }

      )
      const imageData= {
        title:values.title,
        height:image?.height,
        width:image?.width,
        transformationType:type,
        publicId:image?.publicId,
        config:transformationConfig,
        secureURL:image?.secureURL,
        transformationURL:transformationUrl,
        aspectRatio:values.aspectRatio,
        prompt:values.prompt,
        color:values.color
      }

      if(action==='Add'){
        try {
          const newImage=await addImage({
              image:imageData,
              userId,
              path:'/'
          })
          if(newImage){
              form.reset()
              setImage(data)
              router.push(`/transformations/${newImage._id}`)
          }
        } catch (error) {
          
        }

      }
      if(action==='Update'){
        try {
          const updatedImage=await updateImage({
              image:{
                ...imageData,
                _id:data._id

              },
              userId,
              path:`/transformations/${data._id}`          })
          if(updatedImage){
              form.reset()
              setImage(data)
              router.push(`/transformations/${updatedImage._id}`)
          }
        } catch (error) {
          
        }

      }
      
      }
    setIsSubmitting(false)
  }
  const onSelectFieldHandler= (value:string,
    onChangeField:(value:string)=>void
  )=>{
    const imageSize= aspectRatioOptions[value as AspectRatioKey]
    setImage((prevState: any)=>({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      height: imageSize.height,
      width : imageSize.width,
    }))
    setNewTransformation(transformationType.config)

    return onChangeField(value)

  }
const onInputChangeHandler=(fieldName: string, type: string, value: string ,
  onChangeField: (value: string)=>void
)=>{
  debounce(() => {
    setNewTransformation((prevState: any) => ({
      ...prevState,
      [type]: {
        ...prevState?.[type],
        [fieldName === 'prompt' ? 'prompt' : 'to' ]: value 
      }
    }))
  }, 1000)();
    
  return onChangeField(value)
 

}

//TODO: update credit fee to dynamic
const ontransformHandeler=async ()=>{


setIsTransforming(true)
setTransformationConfig(
  deepMergeObjects(newTransformation, transformationConfig)
)
setNewTransformation(null)
startTransition(async ()=>{
  updateCredits(userId, -1)
})
}

useEffect(()=>{
  if(image&& (type === 'resotre' || type === 'removeBackground'))
    {
      setNewTransformation(transformationType.config)
    }

},[image,transformationType.config,type])
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}
     className="space-y-8">
      {creditBalance < Math.abs(creditFee)&& <InsufficientCreditsModal /> }
   <CustomField 
    control={form.control}
      name="title"
      formLabel="imageTitle"
      className="w-full"
      render={({field})=> <Input {...field} className="input-field"/>}
      

    />
    {type==='fill' && 
    <CustomField
    formLabel="Aspect Ratio"
    name="aspectRatio"
    control={form.control}
    className="w-full"

    render={({field})=>
      <Select onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
    value={field.value}>
    <SelectTrigger className="select-field">
      <SelectValue placeholder="Select size" />
    </SelectTrigger>
    <SelectContent>
       {Object.keys(aspectRatioOptions).map(
        (key)=>{
         return(
        <SelectItem key={key} value={key}
        className="select-item">
              {
                aspectRatioOptions[key as AspectRatioKey].label
              }

            </SelectItem>
          )
        }

      )}
      
      
    </SelectContent>
  </Select>
  } />
    }
    {(type==='remove'|| type==='recolor')&& (
      <div className="prompt-field">
        { <CustomField
        name="prompt"
        control={form.control}
        formLabel={type=== 'remove'? "Object to remove": 
          "Object to recolor"}
          className="w-full"
          render={
           
           
            ({field})=>( <Input
            value={field.value}
            className="field-input"
            onChange={(e)=>onInputChangeHandler(
              'prompt',
              type,
              e.target.value, field.onChange
            )}
          />)
        
        


        }             
        /> }

          {
          type=== 'recolor' && (
            <CustomField
            control={form.control}
            name="color"
            formLabel="Replacement of color"
            className="w-full"
            render={(({field})=> <Input
            value={field.value}
            className="field-input"
            onChange={(e)=>onInputChangeHandler(
              'prompt',
              type,
              e.target.value, field.onChange
            )}
          />)}
      
            />
        )
        }
      </div>
    )}


    <div className="media-uploader-field">
      <CustomField 
      control={form.control}
      name="publicId"
      className="flex flex-col size-full"
      render={({field})=>(
        <MediaUploader
        onValueChange={field.onChange}
        setImage={setImage}
        publicId={field.value}
        image={image}
        type={type}
         />
      )}
      />
      
      <TransformedImage
      image={image}
      type={type}
      title={form.getValues().title}
      isTransforming={isTransforming}
      setIsTransforming={setIsTransforming}
      transformationConfig={transformationConfig}
      
      />
    </div>
    <div className="flex flex-col gap-4">
    
    <Button 
    type='button'
    className="submit-button capitalize"
    disabled={isTransforming || newTransformation === null }
    onClick={ontransformHandeler}>{isTransforming? 'Transforming...':'Apply Tranformation'} </Button><Button 
    type='submit'
    className="submit-button capitalize"
    disabled={isSubmitting}>{isSubmitting? 'submitting...': 'Save image'}
      </Button>
    </div>
    
    </form>
  </Form>
  )
}

export default TransformationForm