import PublicHead from "@/components/page.head.tag/public";
import PublicHeader from "@/components/headers/public";

const PublicLayout = ({
  children,
  title = "Nether NFT Platform",
  description = "Nether NFT Platform",
  imagelink = "/images/nether.nft.favicon.svg",
}) => {
  return (
    <>
      <PublicHead
        title={title}
        description={description}
        imagelink={imagelink}
      />
      <div className="bg-black-shade-3 font-monto text-white min-h-screen">
        <PublicHeader />
        <div>{children}</div>
      </div>
    </>
  );
};

export default PublicLayout;
