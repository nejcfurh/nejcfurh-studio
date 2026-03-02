import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import { MotionValue } from 'motion';
import Image from 'next/image';

const Column = ({
  images,
  y,
}: {
  images: string[];
  y?: MotionValue<number>;
}) => {
  return (
    <AnimatedDiv
      style={{ y }}
      className="w-[25%] h-full flex flex-col gap-[2vw] min-w-[250px] relative nth-of-type-[1]:top-[-45%] nth-of-type-[2]:top-[-95%] nth-of-type-[3]:top-[-25%] nth-of-type-[4]:top-[-70%]"
    >
      {images.map(image => (
        <div
          className="w-full h-full relative rounded-[1vw] overflow-hidden"
          key={image}
        >
          <Image src={image} alt={image} fill className="object-cover" />
        </div>
      ))}
    </AnimatedDiv>
  );
};

export default Column;
