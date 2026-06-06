import Image from 'next/image';

const ImageSection = ({ image, alt }: { image: string; alt: string }) => {
  return (
    <div className="relative h-full w-full">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
};

export default ImageSection;
