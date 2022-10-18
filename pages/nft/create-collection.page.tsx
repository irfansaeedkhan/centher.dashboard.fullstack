// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

// App imports
import { NextPageWithLayout } from "@/pages/_app.page";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { UploadNFTCollection, CreateNFTCollectionForm } from "./_components";

const CreateNFTCollection: NextPageWithLayout = () => {
  return (
    <div className="w-full pb-16">
      <h1 className={title}>Create New Collection</h1>
      <div className="flex gap-9 items-start [@media(max-width:1279px)]:flex-col">
        <UploadNFTCollection />
        <CreateNFTCollectionForm />
      </div>
    </div>
  );
};

CreateNFTCollection.getLayout = (page) => {
  return (
    <AllPagesWrapper pageTitle="Create NFT">
      <div className={dashboardContentContainer}>
        <div className={feedContainer}>{page}</div>
      </div>
    </AllPagesWrapper>
  );
};

export default CreateNFTCollection;

// styling
const dashboardContentContainer = ctl(`
 bg-black-shade-3 w-full h-full font-monto [@media(max-width:1279px)]:max-w-[544px] max-w-[1160px] mx-auto relative 
`);
const title = ctl(`
textGradient  font-semibold leading-[42px]  pb-6 animationTextHeading text-34px
`);
const feedContainer = ctl(`
flex flex-col lg:flex-row  gap-5 lg:items-start 
`);
