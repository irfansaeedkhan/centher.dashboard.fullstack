import Image from "next/image";

export const Loader: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Image
        src="/images/preloader.png"
        alt="Preloader"
        width={64}
        height={64}
        className="h-16 w-16 flex-shrink-0 object-cover"
      />
    </div>
  );
};
