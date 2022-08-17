import { ToastContainer } from 'react-toastify';
import PublicHead from "../pageheadtag/publicheader";
import PublicHeader from "../headers/publicheader";
import PublicFooter from "../footers/publicfooter";

const PublicLayout = ({children, title="Nether NFT Platform", description="Nether NFT Platform", imagelink="https://app.nethernft.io/nethernft-logo-320x320.png"})=>{
    return(
        <>
            <PublicHead title={title} description={description} imagelink={imagelink}></PublicHead>
            <ToastContainer>
            </ToastContainer>
            <PublicHeader></PublicHeader>
            <div>{children}</div>
            <PublicFooter></PublicFooter>
        </>
        
    )
}

export default PublicLayout;