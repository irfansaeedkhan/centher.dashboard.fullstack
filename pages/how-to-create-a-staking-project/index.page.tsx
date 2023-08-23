import Image from "next/image";
import React from "react";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { NextPageWithLayout } from "../_app.page";

const CreateStakingProject: NextPageWithLayout = () => {
  return (
    <>
      <h2 className="textGradient px-8 pt-10 pb-6 text-[44px] font-semibold">
        Centher Academy
      </h2>
      <div className="flex-1 rounded-tl-[20px] rounded-tr-[20px] border border-[#2A2D3C] bg-[#1B1C22]">
        <div className="">
          <h2 className="text-20px textGradient px-8 pt-10 font-semibold">
            How to Create a Staking Project?
          </h2>
          <div className="content text-grayText text-14px p-8 font-normal text-white">
            <p>
              Let&apos;s get into a step-by-step-guide on how to Create your
              first Staking Project! First of all, you will need to be a Centher
              Citizen in order to benefit from this Service. If you have not
              gotten your Passport yet, (link to popup citizenship or you are
              already a citizen for citizens).
            </p>
            <h5 className="py-5 text-white">
              Once you are set up with Citizenship, head on the left menu bar
              (click on the three menu lines on mobile) and select Staking.
              Click on Create New button.
            </h5>
            <Image
              width={320}
              height={320}
              src="/images/step1.png"
              alt="what is staking"
              className="pb-4"
            />

            <div>
              <h5 className="text-white">
                The Staking Form will appear on screen and indicate all
                mandatory fields with * mark.
              </h5>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Logo and Banner
              </h2>
              <p>
                The first element needed is the logo image (suggested size
                350x350). Following the logo you will need to upload the banner
                image (suggested size 1400x350). These fields are required.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Name and Token Address
              </h2>
              <p>
                The Staking Name will be what the users will see when they go
                through the staking projects list, so choose something catchy!
                The Token Address is the address of the token you want to allow
                users to stake. These fields are mandatory.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Reward Token Address
              </h2>
              <p>
                This field is not mandatory and if left empty will have the same
                value as Token Address, this means that the same staked token
                will be given in rewards during the staking period. If another
                token is selected, that token will be used to reward the users
                fro staking.
              </p>
            </div>

            <Image
              width={520}
              height={420}
              src="/images/step2.png"
              alt="what is staking"
              className="pb-4 pt-4"
            />

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Multilevel Rewards System
              </h2>
              <p>
                Refer to he expenaded version of how-does-affiliate-system-works
                for more information about affiliation. <br />
                You can choose:
              </p>
              <ul className="ml-5 list-disc">
                <li>No referral: there is no reward system in place.</li>
                <li>
                  Recurring return: (claimable according to Claim Period). can
                  go from 0 o 6 levels of affiliation expressed in monthly
                  percentage for each level.
                </li>
                <li>
                  Fix commission: there is a commission paid that will be
                  distributed among 1 to 6 levels of referrals to the staking
                  project. Express it in percentage of the fee that you want
                  each level to get.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Staking / Reward Token Price Ratio
              </h2>
              <p>
                For a deep learning of the topic, head to the academy section at
                what-is-token-price-ratio. When you want to pay rewards to the
                users who are actively using your staking with a different token
                than the one staked, we calculate the reward based on the staked
                token and then by this ratio we calculate the amount of reward
                token to give. Give anything above 0 if reward token is more
                valuable than stake token.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Staking Period
              </h2>
              <p>
                This will be the length of the staking of tokens. It goes from
                15 days to 5 years and the next field will determine whether or
                not the staking is cancelable and how much fee we want our users
                to pay to unstake their tokens.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Is Cancelable
              </h2>
              <p>
                Determines the possibility to cancel the staking of tokens by
                the users and it can be applied a fee to unstaking the tokens.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Charge Fee on Cancel
              </h2>
              <p>
                Will only be applied if is cancelable is true, can go from
                anywhere between 0 and 100%.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                APY
              </h2>
              <p>
                Annual Percentage Yield that the tokens will produce while on
                staking and thee users will be able to claim.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Start Date
              </h2>
              <p>
                Select from the dropdown calendar a date you wish your staking
                project to start from. It will be active from that date onwards.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Reward Release Start
              </h2>
              <p>
                The rewards that you will be paying to the users staking your
                tokens will be possible to schedule using this field. You can
                choose any time you want or set it accordingly to claim period.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Claim Period
              </h2>
              <p>
                Claim period can be anytime (meaning users can claim as soon as
                they collect some rewards) or based on a period of 15 - 30 - 45
                - 60 - 120 - 180 days. Users will be able to claim their rewards
                based on this parameter.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Show on Centher
              </h2>
              <p>
                The staking for is a Software As A Service so it can be used
                inside or outside of Centher for your project. If you want to
                show your project on your on landing page, select FALSE, if you
                want Centher to advertise your project on the platform choose
                TRUE. Showing the project on Centher costs 1 BNB. Talk to our
                support team at info@centher.io to have your project set up
                outside of Centher platform.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Liquidity Pool Provided
              </h2>
              <p>
                If you are going to provide a Liquidity Pool for the rewards
                payout select TRUE, if you select FALSE and at the same time you
                select TRUE on Show on Centher your project will be flagged as
                dangerous.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Minimum Stakable Amount
              </h2>
              <p>
                It&apos;s the minimum amount you want your users to stake, it
                can be any number but if you set a min value then staking amount
                is always a coefficient of this value, for example if min value
                is 250, then allowed amounts are 250,500,750,1000,etc.
              </p>
            </div>

            <Image
              src="/images/step3.png"
              alt=""
              width={520}
              height={420}
              className="pb-4 pt-4"
            />

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Maximum Stakable Amount
              </h2>
              <p>
                It must be a number that is a coefficient of the Minimum
                Stakable Amount and it&apos;s the maximum amount that can be put
                in staking per each stake. Each user can stake multiple times
                the maximum amount and each stake will follow the same vesting
                contract prepared in this form.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Total Supply
              </h2>
              <p>
                This field indicates how many tokens will be available for users
                to stake.
              </p>
            </div>

            <div>
              <h2 className="textGradient pt-4 pb-4 text-[20px] font-semibold">
                Project Metadata
              </h2>
              <p>
                Add any characteristics to your project like
                &ldquo;Rarity&ldquo; - &ldquo;Common&ldquo; or
                &ldquo;Round&ldquo; - &ldquo;One&ldquo; or whatever you want to
                mark your project with.
              </p>
            </div>

            <Image
              src="/images/step4.png"
              alt=""
              width={520}
              height={420}
              className="pb-4 pt-4"
            />

            <p className="pb-2">
              After you click on Next button you will be directed to the social
              page where you can add all of the social links you have at your
              disposal to maximise the networking of your project.
            </p>

            <p>
              Save and see the preview of your project before submitting. In
              this phase you can still edit the project details.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

CreateStakingProject.getLayout = (page) => {
  return <AllPagesWrapper pageTitle="Create Staking">{page}</AllPagesWrapper>;
};

export default CreateStakingProject;
