import { motion, AnimatePresence } from "framer-motion";

interface BlobImageProps {
  blobPath: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
  blobTransform: string;
}

export default function BlobImage({
  blobTransform,
  blobPath,
  imageSrc,
  imageAlt,
  className = "",
}: BlobImageProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox='0 0 1000 1000'
        className='absolute inset-0 w-full h-full'
        preserveAspectRatio='none'>
        <defs>
          <clipPath id='blob'>
            <path
              d={blobPath}
              transform={blobTransform}
              fill='#FFF'
            />
          </clipPath>
        </defs>

        <foreignObject
          width='100%'
          height='100%'
          clipPath='url(#blob)'>
          <div className='w-full h-full'>
            <AnimatePresence mode='wait'>
              <motion.img
                key={imageSrc}
                fetchPriority='high'
                src={imageSrc}
                alt={imageAlt}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className='w-full h-full object-cover'
                exit={{ opacity: 0 }}
              />
            </AnimatePresence>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
