import { ToastContainer } from 'react-toastify';
import AdminHeader from "../pageheadtag/adminheader";

const PublicLayout = ({children, title="Nether NFT Platform", description="Nether NFT Platform", imagelink="https://app.nethernft.io/nethernft-logo-320x320.png"})=>{
    console.log(title)
    return(
        <>
            <AdminHeader title={title} description={description} imagelink={imagelink}></AdminHeader>
            <ToastContainer>
            </ToastContainer>
            <div>{children}</div>
        </>
        
    )
}

export default PublicLayout;