import cookies from 'next-cookies';

module.exports.checkInfluencerAuth = async (ctx)=>{
    //Fetching cookie before pages loads
    let allcookie = await cookies(ctx);
    try{    
        let {req} = ctx;
    }catch(e){
        return {
            props:{
                users: {
                    uservalid:false,
                }
            },
            redirect: {
                destination: `/logout`,
                permanent: false,
            }
        }
    }
}