/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import CentherIconImgBg from "./centher.icon.bg.png";
import NTRIconImgBg from "./ntr.icon.bg.png";
import NTRIconImg from "./ntr.icon.png";

export interface IconProps {
  className?: string;
}

export { default as MetamaskIcon } from "./metamask.icon.svg";
export { default as WebsiteIcon } from "./website.link.icon.svg";
export { default as TwitterSvg } from "./twitter.svg";
export { default as LiquidityPoolSvg } from "./liquidity.icon.svg";
export { default as CopySvg } from "./copy.svg";
export { default as NetworkRewards } from "./network.rewards.svg";
export { default as StakingContract } from "./staking.contract.svg";
export { default as DaoGovernment } from "./dao.govt.svg";
export { default as ProfitsDashboard } from "./profits.dashboard.svg";
export { default as VotingChain } from "./voting.chain.svg";
export { default as Multilevel } from "./multilevel.svg";
export { default as NetworkGenealogy } from "./genealogy.svg";
export { default as Feed } from "./feed.svg";
export { default as Chat } from "./chat.svg";
export { default as Notification } from "./notification.svg";
export { default as Explore } from "./explore.svg";
export { default as TopInfluencer } from "./top.influencers.svg";
export { default as CreateCollection } from "./create.collection.svg";
export { default as LogoText } from "./logo.text.svg";
export { default as CloseIcon } from "./close.icon.svg";
export { default as MenuClose } from "./menu.close.svg";
export { default as Music3DIcon } from "./music.3d.icon.svg";
export { default as NoPost } from "./no.post.svg";
export { default as NotificationBell } from "./notification.bell.svg";
export { default as PauseIcon } from "./pause.svg";
export { default as PlayIcon } from "./play.svg";
export { default as SearchUserIcon } from "./search.user.svg";
export { default as RepliesIcon } from "./replies.icon.svg";
export { default as Flor } from "./flor.svg";
export { default as HotNftEmptyIcon } from "./hot.nfts.empty.icon.svg";
export { default as NftsCollectionEmpty } from "./nfts.collection.empty.svg";
export { default as Rocket } from "./rocket.svg";
export { default as RocketShadow } from "./rocket.shadow.svg";
export { default as CreateNFT } from "./create.nft.svg";
export { default as Archived } from "./archived.svg";
export { default as MoreIcon } from "./more.icon.svg";
export { default as Restore } from "./restore.svg";
export { default as Trash } from "./trash.svg";
export { default as FollowerIcon } from "./follower.icon.svg";
export { default as LinkIcon } from "./link.svg";
export { default as WorldIcon } from "./world.svg";
export { default as shareIcon } from "./shareIcon.svg";
export { default as ArchiveEmptyIcon } from "./archive.icon.svg";
export { default as BUSDIcon } from "./busd.icon.svg";
export { default as BUSDIconBG } from "./busd.icon.bg.svg";
export { default as FacbookIcon } from "./facebook.icon.svg";
export { default as LinkedInIcon } from "./linkedIn.icon.svg";
export { default as Logout } from "./logout.svg";
export { default as SearchIcon } from "./search.icon.svg";
export { default as InfluencerRequest } from "./influencer.request.svg";
export { default as InfluencerDetails } from "./influencer.details.svg";
export { default as Transactions } from "./transactions.svg";
export { default as Users } from "./users.svg";
export { default as PlusIconBtn } from "./plus.icon.btn.svg";
export { default as DeleteIconBtnCoinPack } from "./delete.icon.btn.coin.pack.svg";
export { default as LeftArrowIcon } from "./buy.cnether.arrow.icon.svg";
export { default as SpinIcon2 } from "./spin.registeration.icon.svg";
export { default as SpinIcon3 } from "./spin.login.icon.svg";
export { default as Successfully } from "./successfully.registeration.icon.svg";
export { default as YellowTick } from "./yellow.tick.icon.svg";
export { default as LockedIcon } from "./locked.icon.launchpad.svg";
export { default as WalletIconModal } from "./wallet.icon.registration.modal.svg";
export { default as NotificationIcon } from "./notification.icon.svg";
export { default as RightSimpleIcon } from "./right.side.blur.icon.svg";
export { default as PhotoIcon } from "./photo.icon.svg";
export { default as VideoIcon } from "./video.icon.svg";
export { default as EmojiIcon } from "./emoji.icon.svg";
export { default as DotsIcon } from "./dots.icon.collection.svg";
export { default as ArrowLeftSimpleIcon } from "./arrow.left.detail.nft.svg";
export { default as CameraIcon } from "./selfi.icon.svg";
export { default as CopyIcon } from "./copy.icon.share.button.svg";
export { default as AvatarIcon } from "./avatar.icon.svg";
export { default as UploadIcon } from "./upload.icon.svg";
export { default as Polygon } from "./polygon.svg";
export { default as CrossIcon } from "./cross.icon.svg";
export { default as ImageIcon } from "./image.icon.nft.svg";
export { default as GifIcon } from "./gif.icon.nft.svg";
export { default as VideosIcon } from "./video.icon.nft.svg";
export { default as AudioIcon } from "./audio.icon.nft.svg";
export { default as AddIcon } from "./add.icon.nft.svg";
export { default as GreyWorldIcon } from "./grey.website.icon.collection.svg";
export { default as GreyFBIcon } from "./grey.fb.icon.collection.svg";
export { default as GreyTwitterIcon } from "./grey.twitter.icon.collection.svg";
export { default as ShareBigIcon } from "./share.big.icon.svg";
export { default as BNBIcon } from "./bnb.icon.svg";
export { default as LoaderIcon } from "./loader.icon.svg";
export { default as FacebookCircleIcon } from "./facebook.icon.collection.svg";
export { default as DeleteCrossIcon } from "./delete.cross.icon.svg";
export { default as SuccessIcon } from "./success.icon.svg";
export { default as WarningIcon } from "./warning.icon.svg";

export const CentherIconBG: React.FC<IconProps> = (props) => {
  return (
    <img
      className={props.className}
      src={CentherIconImgBg.src}
      alt="Centher Icon BG"
      sizes="256px"
      width={40}
      height={40}
    />
  );
};

export const NTRIconBG: React.FC<IconProps> = (props) => {
  return (
    <img
      className={props.className}
      src={NTRIconImgBg.src}
      alt="NTR Icon BG"
      sizes="256px"
      width={40}
      height={40}
    />
  );
};

export const NTRIcon: React.FC<IconProps> = (props) => {
  return (
    <img
      className={props.className}
      src={NTRIconImg.src}
      alt="NTR Dao Icon"
      sizes="256px"
      width={40}
      height={40}
    />
  );
};

export const DefaultCircle: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="114"
      height="114"
      viewBox="0 0 114 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="112"
        height="112"
        rx="56"
        stroke="#1B1C22"
        strokeWidth="3"
        className="Animatecircle"
      />
    </svg>
  );
};
export const RainbowCircle: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="114"
      height="114"
      viewBox="0 0 114 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="112"
        height="112"
        rx="56"
        stroke="url(#paint0_linear_9184_100150)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_9184_100150"
          x1="19.5"
          y1="-4"
          x2="87.8076"
          y2="113.403"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FE070B" />
          <stop offset="0.440127" stopColor="#06FDFD" />
          <stop offset="1" stopColor="#E2BD3A" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export const SilverCircle: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="114"
      height="114"
      viewBox="0 0 114 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="112"
        height="112"
        rx="56"
        stroke="url(#paint0_linear_9186_100152)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_9186_100152"
          x1="13"
          y1="-7"
          x2="81.5"
          y2="120"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AAAAAA" />
          <stop offset="1" stopColor="#CBCFD8" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export const GoldCircle: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="114"
      height="114"
      viewBox="0 0 114 114"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="112"
        height="112"
        rx="56"
        stroke="url(#paint0_linear_9186_100156)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_9186_100156"
          x1="57"
          y1="0.999999"
          x2="94"
          y2="113"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E6B333" />
          <stop offset="1" stopColor="#DFB77B" />
        </linearGradient>
      </defs>
    </svg>
  );
};
