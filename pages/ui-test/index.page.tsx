import { NextPage } from "next";

import UserProfileCard from "../../components/voispace/shared/profile";

const UiTest: NextPage = () => {
  return (
    <div className="m-[10px] flex gap-[16px] text-white">
      <UserProfileCard
        name="John Wedson"
        imageURL="/images/john-wedson.png"
        isApproved={true}
        isSpeaking={false}
      />

      <UserProfileCard
        name="John Doe"
        imageURL="/images/john-wedson.png"
        isApproved={false}
        isSpeaking={true}
      />
    </div>
  );
};

export default UiTest;
