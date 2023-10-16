import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import clsx from "clsx";
import { NextPageWithLayout } from "@/pages/_app.page";
import useUser from "@/hooks/use.user";
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import Button from "@/components/button";
import { BuyCitizenshipModal } from "@/components/modal/buy-citizenship-modal";
import { NoStakingIcon } from "@/assets/svgs";
import { AppRoutes } from "@/constants/app.routes";
import { PreLoader } from "@/components/pre.loader";
import { useStaking } from "@/hooks/staking";
import { GetStakingProjectInput } from "@/staking/types/get.projects.interface";
import { ZeroAddress } from "@/web3/constants/common";
import { setupUiModels } from "@/staking/helpers/mappers.helper";
import { formatIPFSUrl } from "@/utils/format.address";
import { CoinDetails } from "@/staking/types/coin.info.interface";
import { fetchTokenMetadata } from "@/hooks/use.token.metadata";
import StakingListContainer from "./_components/staking-list-container";
import { ListCardDataOBj } from "./_components/list-card-data";
import { project_metadata } from "@/staking/cache";

const Staking: NextPageWithLayout = () => {
  const router = useRouter();
  const { user: loggedInUser } = useUser();
  const [showBuyCitizenshipModal, setShowBuyCitizenshipModal] = useState(false);
  const [stakingList, setStakingList] = useState<ListCardDataOBj[]>([]);
  const [coinsDetails, setCoinsDetails] = useState<
    Array<CoinDetails | undefined>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { sdk } = useStaking();
  useEffect(() => {
    const getCoinDetails = async (tokens: string[]) => {
      const list: string[] = [];
      tokens.filter(Boolean).forEach((e) => {
        if (e != ZeroAddress && list.indexOf(e) == -1) {
          list.push(e);
        }
      });

      const details = await fetchTokenMetadata(list);

      if (!details?.length) {
        return;
      }

      const tokenDetails = details.map((e: any) => e.token._value);
      setCoinsDetails(
        tokenDetails.map((e: any) => {
          return {
            ...e,
            contractAddress: e.contractAddress._value,
            chain: e.chain._value,
          };
        })
      );
    };

    const getPoolMetadata = async (inputs: ListCardDataOBj[]) => {
      const fetchedItems = [];
      for (const item of inputs) {
        try {
          const cachedMetadata = project_metadata.find(
            (e) => e.ipfsAddress == item.metadataUrl
          );

          if (!cachedMetadata) {
            const metadata = await axios.get(formatIPFSUrl(item.metadataUrl));
            const buff = inputs.find((e) => e.metadataUrl == item.metadataUrl);
            if (buff) {
              buff.metadata = metadata.data;
              fetchedItems.push(buff);
            }
          } else {
            const buff = inputs.find((e) => e.metadataUrl == item.metadataUrl);
            if (buff) {
              buff.metadata = cachedMetadata;
              fetchedItems.push(buff);
            }
          }
        } catch (error) {}
      }

      // FIXME: This is quick fix to hide pool id 1
      setStakingList(fetchedItems.filter((e) => e.id !== "1"));
    };

    if (sdk) {
      setIsLoading(true);
      const filters = new GetStakingProjectInput(0, 20);
      sdk.getProjects(filters).then((pools) => {
        if (pools?.length) {
          if (!coinsDetails?.length) {
            getCoinDetails(
              pools.map((e) => [e.stakeToken, e.rewardToken]).flat()
            ).then();
          }

          const mappedPools = setupUiModels(pools);
          getPoolMetadata(mappedPools).then(() => {
            setIsLoading(false);
          });
        } else {
          setIsLoading(false);
        }
      });
    }
  }, [sdk]);

  return (
    <section
      className={clsx(
        "flex w-full justify-center",
        !stakingList && "min-h-[calc(100vh-120px)] items-center"
      )}
    >
      {/* show if user already have stakings */}
      {stakingList?.length ? (
        <StakingListContainer
          pools={stakingList}
          fetchTime={+new Date()}
          coins={coinsDetails}
        />
      ) : (
        <div className="flex max-w-[330px] flex-col items-center justify-center gap-2 text-center">
          <NoStakingIcon className="mb-6" />
          <h3 className="text-16px font-semibold text-white ">
            No Staking Projects yet!
          </h3>
          <p className="text-14px font-normal text-gray-shade-14">
            There are currently no Staking Projects available. Create one
            yourself!
          </p>
          {/* if member go to staking form other wise membership modal */}
          <Button
            title="Create New"
            onClick={
              loggedInUser?.membership.status === "citizen"
                ? () =>
                    router.push({
                      pathname: AppRoutes.staking.create_staking,
                    })
                : () => setShowBuyCitizenshipModal(true)
            }
            variant="primary"
            className="text-14px mt-6 px-5 py-3"
          />
        </div>
      )}

      {showBuyCitizenshipModal && (
        <BuyCitizenshipModal
          isOpen={showBuyCitizenshipModal}
          onClickClose={() => setShowBuyCitizenshipModal(false)}
        />
      )}
      {isLoading && <PreLoader />}
    </section>
  );
};

Staking.getLayout = (page) => (
  <AllPagesWrapper pageTitle="Staking">
    <div className="mx-auto w-full max-w-[1144px] bg-black-shade-3 font-monto">
      {page}
    </div>
  </AllPagesWrapper>
);

export default Staking;
