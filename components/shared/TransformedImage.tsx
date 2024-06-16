import React from 'react'
import Image from 'next/image'
import { CldImage } from 'next-cloudinary';
import { dataUrl, debounce, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";


const TransformedImage = ({
    image,
      type,
      title,
      isTransforming,
      setIsTransforming,
      transformationConfig
}: TransformedImageProps, hasDownlaod=true) => {
  const donwloadHandler=()=>{

  }
    return (
    <div className='flex flex-col gap-4'>
        <div className='flex-between'>
            <h3 className='h3-bold text-dark-600'>
                Transformed
            </h3>
            {
                hasDownlaod&&(
                    <button className='donwload-btn'
                    onClick={donwloadHandler}>
                                <Image
                                src="/assets/icons/download.svg"
                                height={24}
                                width={24}
                                alt="Download"
                                className='pb-[6px]'/>
                    </button>
                )
            }

        </div>      
        {image?.publicId && transformationConfig?(
            <div className='relative'>
                 <CldImage 
                  width={getImageSize(type, image, "width")}
                  height={getImageSize(type, image, "height")}
                  src={image?.publicId}
                  alt={image.title}
                  sizes={"(max-width: 767px) 100vw, 50vw"}
                  placeholder={dataUrl as PlaceholderValue}
                  className="transformed-image"
                  onLoad={()=>{
                    setIsTransforming&&setIsTransforming
                    (false);
                  }}
                  onError={()=>{
                    debounce(()=>{
                        setIsTransforming&&setIsTransforming
                    (false);
                    },8000)();
                  }}
                  {...transformationConfig}
                />
                {
                    isTransforming&&(
                        <div className='transforming-loader'>
                            <Image 
                                src="/assets/icons/spinner.svg"
                                height={50}
                                width={50}
                                alt='transforming loader'

                            />

                        </div>
                    )
                }
            </div>
        ):(
            <div className='transformed-placeholder'></div>
        )}
        </div>
  )
}

export default TransformedImage