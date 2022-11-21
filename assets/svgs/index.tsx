import Image from "next/image";
import NTRDAOIconImg from "./ntr.dao.icon.png";

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
export { default as DaoGovernment } from "./ntr.dao.svg";
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
export { default as PromotionText } from "./promotion.text.svg";
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

export const NTRDAOIcon: React.FC<IconProps> = (props) => {
  return (
    <Image
      className={props.className}
      src={NTRDAOIconImg}
      alt="NTR Dao Icon"
      sizes="256px"
      width={40}
      height={40}
    />
  );
};

export const Logout = () => {
  return (
    <svg
      width="25"
      height="20"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.5 21H5.5C4.96957 21 4.46086 20.7893 4.08579 20.4142C3.71071 20.0391 3.5 19.5304 3.5 19V5C3.5 4.46957 3.71071 3.96086 4.08579 3.58579C4.46086 3.21071 4.96957 3 5.5 3H9.5"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 17L21.5 12L16.5 7"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 12H9.5"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ReferralProgram: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="25"
      height="20"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.43837 5.97119C4.37637 7.06119 3.60537 8.43119 3.23438 9.95919"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.79297 20.443C10.384 20.571 10.997 20.642 11.627 20.642C12.519 20.642 13.38 20.506 14.19 20.255"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.23438 14.041C3.60537 15.569 4.37637 16.939 5.43837 18.029"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.9073 14.4641C19.4883 15.8761 18.7143 17.1331 17.6953 18.1421"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.6953 5.85815C18.7143 6.86715 19.4873 8.12415 19.9073 9.53615"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.79297 3.55701C10.384 3.42901 10.997 3.35801 11.627 3.35801C12.519 3.35801 13.38 3.49401 14.19 3.74501"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.0334 10.2322C23.0097 11.2085 23.0097 12.7915 22.0334 13.7678C21.0571 14.7441 19.4742 14.7441 18.4979 13.7678C17.5215 12.7915 17.5215 11.2085 18.4979 10.2322C19.4742 9.25592 21.0571 9.25592 22.0334 10.2322"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.32636 17.5694C10.3027 18.5457 10.3027 20.1286 9.32636 21.1049C8.35005 22.0812 6.76714 22.0812 5.79083 21.1049C4.81452 20.1286 4.81452 18.5457 5.79083 17.5694C6.76714 16.5931 8.35005 16.5931 9.32636 17.5694"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.32636 2.89532C10.3027 3.87163 10.3027 5.45454 9.32636 6.43085C8.35005 7.40716 6.76714 7.40716 5.79083 6.43085C4.81452 5.45454 4.81452 3.87163 5.79083 2.89532C6.76714 1.91901 8.35005 1.91901 9.32636 2.89532"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SearchIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <path
          d="M15.7143 6.83804C16.8913 8.01507 17.5526 9.61146 17.5526 11.276C17.5526 12.9406 16.8913 14.537 15.7143 15.714C14.5372 16.8911 12.9409 17.5523 11.2763 17.5523C9.61171 17.5523 8.01531 16.8911 6.83828 15.714C5.66125 14.537 5 12.9406 5 11.276C5 9.61146 5.66125 8.01507 6.83828 6.83804C8.01531 5.661 9.61171 4.99976 11.2763 4.99976C12.9409 4.99976 14.5372 5.661 15.7143 6.83804"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.0009 19.0001L15.7109 15.7101"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export const WalletIcon = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="14" fill="white" fillOpacity="0.03" />
      <path
        d="M34.1673 23.5V18.6667H17.2507C16.6097 18.6667 15.995 18.4121 15.5418 17.9589C15.0886 17.5057 14.834 16.891 14.834 16.25C14.834 14.9209 15.9215 13.8334 17.2507 13.8334H31.7506V18.6667"
        stroke="white"
        strokeWidth="1.16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.834 16.25V30.75C14.834 32.0792 15.9215 33.1667 17.2507 33.1667H34.1673V28.3333"
        stroke="white"
        strokeWidth="1.16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.7507 23.5C31.1097 23.5 30.495 23.7546 30.0418 24.2078C29.5886 24.661 29.334 25.2757 29.334 25.9167C29.334 27.2458 30.4215 28.3333 31.7507 28.3333H36.584V23.5H31.7507Z"
        stroke="white"
        strokeWidth="1.16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const YellowTick = () => {
  return (
    <svg
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.48529 2.31134L6 1.03209L9.51471 2.31134L11.3848 5.55051L10.7353 9.23396L7.87014 11.6382H4.12986L1.26465 9.23396L0.615159 5.55051L2.48529 2.31134Z"
        fill="#FEBF32"
        stroke="#FEBF32"
      />
      <path
        d="M4.25 6.50016L5.41667 7.66683L7.75 5.3335"
        stroke="#17171A"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const InfluencerRequest: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.1667 18.333V16.6663C14.1667 15.7823 13.8155 14.9344 13.1904 14.3093C12.5652 13.6842 11.7174 13.333 10.8333 13.333H5.83333C4.94928 13.333 4.10143 13.6842 3.47631 14.3093C2.85119 14.9344 2.5 15.7823 2.5 16.6663V18.333"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.33333 9.99967C10.1743 9.99967 11.6667 8.50729 11.6667 6.66634C11.6667 4.82539 10.1743 3.33301 8.33333 3.33301C6.49238 3.33301 5 4.82539 5 6.66634C5 8.50729 6.49238 9.99967 8.33333 9.99967Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 3.09958C13.5014 2.62193 13.833 2.21915 14.2696 1.9626C14.7061 1.70604 15.2193 1.61226 15.7184 1.69786C16.2175 1.78346 16.6701 2.04292 16.9962 2.43029C17.3223 2.81765 17.5008 3.30793 17.5 3.81427C17.5 5.24366 15.3559 5.95835 15.3559 5.95835"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4131 8.81738H15.4202"
        strokeWidth="1.71526"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const InfluencerDetails: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 1.90039H5C4.07953 1.90039 3.33334 2.57196 3.33334 3.40039V15.4004C3.33334 16.2288 4.07953 16.9004 5 16.9004H15C15.9205 16.9004 16.6667 16.2288 16.6667 15.4004V3.40039C16.6667 2.57196 15.9205 1.90039 15 1.90039Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.2674 16.7003V15.767C13.2674 15.2719 13.0707 14.7972 12.7207 14.4471C12.3706 14.097 11.8958 13.9004 11.4008 13.9004H8.60089C8.10583 13.9004 7.63106 14.097 7.281 14.4471C6.93095 14.7972 6.73429 15.2719 6.73429 15.767V16.7003"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0008 12.034C11.0317 12.034 11.8674 11.1983 11.8674 10.1674C11.8674 9.13648 11.0317 8.30078 10.0008 8.30078C8.96993 8.30078 8.13423 9.13648 8.13423 10.1674C8.13423 11.1983 8.96993 12.034 10.0008 12.034Z"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.53191 5.2334H11.8652"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Transactions: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6667 9.99967V6.66634H5C4.55798 6.66634 4.13405 6.49075 3.82149 6.17819C3.50893 5.86563 3.33334 5.4417 3.33334 4.99967C3.33334 4.08301 4.08334 3.33301 5 3.33301H15V6.66634"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33334 5V15C3.33334 15.9167 4.08334 16.6667 5 16.6667H16.6667V13.3333"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 10C14.558 10 14.1341 10.1756 13.8215 10.4882C13.5089 10.8007 13.3333 11.2246 13.3333 11.6667C13.3333 12.5833 14.0833 13.3333 15 13.3333H18.3333V10H15Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const Users: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5C4.11594 12.5 3.2681 12.8512 2.64297 13.4763C2.01785 14.1014 1.66666 14.9493 1.66666 15.8333V17.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 9.16667C9.34095 9.16667 10.8333 7.67428 10.8333 5.83333C10.8333 3.99238 9.34095 2.5 7.5 2.5C5.65905 2.5 4.16666 3.99238 4.16666 5.83333C4.16666 7.67428 5.65905 9.16667 7.5 9.16667Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 17.5001V15.8334C18.3328 15.0948 18.087 14.3774 17.6345 13.7937C17.182 13.2099 16.5484 12.793 15.8333 12.6084"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3333 2.6084C14.0503 2.79198 14.6859 3.20898 15.1397 3.79366C15.5935 4.37833 15.8399 5.09742 15.8399 5.83757C15.8399 6.57771 15.5935 7.2968 15.1397 7.88147C14.6859 8.46615 14.0503 8.88315 13.3333 9.06673"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PlusIconBtn: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21C9.61305 21 7.32387 20.0518 5.63604 18.364C3.94821 16.6761 3 14.3869 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21V21Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8V16"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 12H8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DeleteIconBtnCoinPack: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6H21"
        stroke="#EA3943"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6"
        stroke="#EA3943"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
        stroke="#EA3943"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11V17"
        stroke="#EA3943"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11V17"
        stroke="#EA3943"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const BUSDIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill="#FEBF32" fillOpacity="0.1" />
      <circle
        cx="20"
        cy="20"
        r="19.5"
        stroke="url(#paint0_linear_7275_64280)"
        strokeOpacity="0.1"
      />
      <circle cx="20" cy="20" r="11" fill="#DA9C24" />
      <path
        d="M19.9987 12.8047L21.7759 14.6248L17.3007 19.1L15.5234 17.3228L19.9987 12.8047Z"
        fill="white"
      />
      <path
        d="M22.6967 15.5L24.4739 17.3201L17.3007 24.4933L15.5234 22.7161L22.6967 15.5Z"
        fill="white"
      />
      <path
        d="M14.6054 18.2031L16.3826 20.0232L14.6054 21.8005L12.8281 20.0232L14.6054 18.2031Z"
        fill="white"
      />
      <path
        d="M25.3998 18.2031L27.1771 20.0232L20.0038 27.1965L18.2266 25.4192L25.3998 18.2031Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_7275_64280"
          x1="13.5"
          y1="-5.5"
          x2="35"
          y2="37"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FEBF32" />
          <stop offset="1" stopColor="#FEBF32" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const LeftArrowIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      fill="none"
      viewBox="0 0 28 28"
    >
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.333"
        d="M5.832 14h16.333M14 5.835L22.167 14 14 22.168"
      ></path>
    </svg>
  );
};

export const SpinIcon = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="mr-2 w-5 h-5 text-gray-400 animate-spin dark:text-gray-600 fillWhite"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const SpinIcon2 = () => {
  return (
    <div role="status">
      <svg
        className="animate-spin"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="32.0002"
          cy="32.0002"
          rx="24.01"
          ry="24.01"
          stroke="#2A2D3C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M56.0102 32.0002C56.0102 36.749 54.6021 41.391 51.9638 45.3395C49.3256 49.2879 45.5757 52.3653 41.1885 54.1826C36.8012 55.9998 31.9736 56.4753 27.3161 55.5489C22.6586 54.6225 18.3805 52.3357 15.0226 48.9779C11.6647 45.62 9.37801 41.3418 8.45158 36.6844C7.52515 32.0269 8.00063 27.1993 9.81789 22.812C11.6351 18.4248 14.7126 14.6749 18.661 12.0366C22.6094 9.3984 27.2515 7.99023 32.0002 7.99023"
          stroke="url(#paint0_linear_6774_66731)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_6774_66731"
            x1="7.99023"
            y1="7.99023"
            x2="57.0405"
            y2="9.06678"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A9CDFF" />
            <stop offset="0.21875" stopColor="#72F6D1" />
            <stop offset="0.557292" stopColor="#A0ED8D" />
            <stop offset="0.817708" stopColor="#FED365" />
            <stop offset="1" stopColor="#FAA49E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const SpinIcon3 = () => {
  return (
    <svg
      width="25"
      height="24"
      className="animate-spin"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12.5"
        cy="12"
        r="7.5"
        stroke="#17171A"
        strokeOpacity="0.4"
        strokeWidth="3"
      />
      <mask id="path-2-inside-1_7930_7948" fill="white">
        <path d="M6.13604 18.364C4.87737 17.1053 4.0202 15.5016 3.67293 13.7558C3.32567 12.01 3.5039 10.2004 4.18508 8.55585C4.86627 6.91131 6.01983 5.50571 7.49987 4.51677C8.97991 3.52784 10.72 3 12.5 3V5.83671C11.281 5.83671 10.0894 6.19818 9.07586 6.87541C8.06231 7.55264 7.27234 8.51521 6.80586 9.64141C6.33937 10.7676 6.21732 12.0068 6.45513 13.2024C6.69294 14.398 7.27994 15.4962 8.14189 16.3581L6.13604 18.364Z" />
      </mask>
      <path
        d="M6.13604 18.364C4.87737 17.1053 4.0202 15.5016 3.67293 13.7558C3.32567 12.01 3.5039 10.2004 4.18508 8.55585C4.86627 6.91131 6.01983 5.50571 7.49987 4.51677C8.97991 3.52784 10.72 3 12.5 3V5.83671C11.281 5.83671 10.0894 6.19818 9.07586 6.87541C8.06231 7.55264 7.27234 8.51521 6.80586 9.64141C6.33937 10.7676 6.21732 12.0068 6.45513 13.2024C6.69294 14.398 7.27994 15.4962 8.14189 16.3581L6.13604 18.364Z"
        stroke="#17171A"
        strokeWidth="6"
        mask="url(#path-2-inside-1_7930_7948)"
      />
    </svg>
  );
};

export const Successfully = () => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="31.9963"
        cy="32.0005"
        r="24.01"
        stroke="#76E268"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5078 32.905L28.2889 38.686L28.2515 38.6487L41.2943 25.6059"
        stroke="#76E268"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const WalletIconModal = () => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M48.6673 32V23.6667H19.5007C18.3956 23.6667 17.3358 23.2277 16.5544 22.4463C15.773 21.6649 15.334 20.6051 15.334 19.5C15.334 17.2083 17.209 15.3333 19.5007 15.3333H44.5006V23.6667"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.334 19.5V44.5C15.334 46.7917 17.209 48.6667 19.5007 48.6667H48.6673V40.3333"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44.5007 32C43.3956 32 42.3358 32.439 41.5544 33.2204C40.773 34.0018 40.334 35.0616 40.334 36.1667C40.334 38.4583 42.209 40.3333 44.5007 40.3333H52.834V32H44.5007Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const LockedIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="81"
      height="80"
      fill="none"
      viewBox="0 0 81 80"
    >
      <rect
        width="79"
        height="79"
        x="1"
        y="0.5"
        fill="#1E1F28"
        stroke="#2A2D3C"
        rx="39.5"
      ></rect>
      <path
        fill="#888DAA"
        d="M48.724 46.36V49H36.34v-2.088l6.672-6.336c.752-.72 1.256-1.344 1.512-1.872.272-.544.408-1.08.408-1.608 0-.784-.264-1.384-.792-1.8-.528-.416-1.304-.624-2.328-.624-1.712 0-3.024.584-3.936 1.752l-2.184-1.68c.656-.88 1.536-1.56 2.64-2.04 1.12-.496 2.368-.744 3.744-.744 1.824 0 3.28.432 4.368 1.296 1.088.864 1.632 2.04 1.632 3.528 0 .912-.192 1.768-.576 2.568-.384.8-1.12 1.712-2.208 2.736l-4.488 4.272h7.92z"
      ></path>
      <g filter="url(#filter0_b_7275_64835)">
        <rect
          width="48"
          height="48"
          x="16.5"
          y="16"
          fill="#1C1F29"
          fillOpacity="0.3"
          rx="12"
        ></rect>
      </g>
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M47.5 39h-14a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM35.5 39v-4a5 5 0 1110 0v4"
      ></path>
      <defs>
        <filter
          id="filter0_b_7275_64835"
          width="58"
          height="58"
          x="11.5"
          y="11"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feGaussianBlur
            in="BackgroundImage"
            stdDeviation="2.5"
          ></feGaussianBlur>
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_7275_64835"
          ></feComposite>
          <feBlend
            in="SourceGraphic"
            in2="effect1_backgroundBlur_7275_64835"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  );
};

export const NotificationIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.4111 11.1477V8.51807C16.4111 5.03258 13.5856 2.20703 10.1001 2.20703V2.20703C6.61461 2.20703 3.78906 5.03258 3.78906 8.51807V11.1477"
        stroke="#888DAA"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <path
        d="M11.1484 15.3558H16.7105C17.1784 15.3558 17.6154 15.1219 17.8749 14.7326V14.7326C18.245 14.1776 18.1708 13.4397 17.7197 12.9483C17.1232 12.2986 16.4076 11.4552 16.4076 11.1484"
        stroke="#888DAA"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <path
        d="M3.78556 11.1484C3.78556 11.4552 3.06999 12.2986 2.47352 12.9483C2.0224 13.4397 1.94824 14.1776 2.31828 14.7326V14.7326C2.57782 15.1219 3.01478 15.3558 3.48268 15.3558H9.04476H11.1484"
        stroke="#888DAA"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <path
        d="M6.94141 17.9844H13.2524"
        stroke="#888DAA"
        stroke-width="1.52793"
        stroke-linecap="round"
      />
      <path
        d="M6.94141 17.9844H13.2524"
        stroke="#888DAA"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
  );
};
export const RightSimpleIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="6"
      height="8"
      viewBox="0 0 6 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.33464 7.33398L4.66797 4.00065L1.33463 0.667318"
        stroke="white"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const PhotoIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 3.03906H5C3.89543 3.03906 3 3.93449 3 5.03906V19.0391C3 20.1436 3.89543 21.0391 5 21.0391H19C20.1046 21.0391 21 20.1436 21 19.0391V5.03906C21 3.93449 20.1046 3.03906 19 3.03906Z"
        stroke="#FECA43"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 10.0391C9.32843 10.0391 10 9.36749 10 8.53906C10 7.71064 9.32843 7.03906 8.5 7.03906C7.67157 7.03906 7 7.71064 7 8.53906C7 9.36749 7.67157 10.0391 8.5 10.0391Z"
        stroke="#FECA43"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 15.0391L16 10.0391L5 21.0391"
        stroke="#FECA43"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const VideoIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 8.44575L12.3754 7.79645L12.3742 7.79579L12 8.44575ZM14.56 9.92575L14.1846 10.5751L14.1858 10.5757L14.56 9.92575ZM14.56 13.3858L14.1858 12.7358L14.1846 12.7365L14.56 13.3858ZM12 14.8658L12.3742 15.5157L12.3754 15.5151L12 14.8658ZM5 3.78906H19V2.28906H5V3.78906ZM19 3.78906C19.6904 3.78906 20.25 4.34871 20.25 5.03906H21.75C21.75 3.52028 20.5188 2.28906 19 2.28906V3.78906ZM20.25 5.03906V19.0391H21.75V5.03906H20.25ZM20.25 19.0391C20.25 19.7294 19.6904 20.2891 19 20.2891V21.7891C20.5188 21.7891 21.75 20.5578 21.75 19.0391H20.25ZM19 20.2891H5V21.7891H19V20.2891ZM5 20.2891C4.30964 20.2891 3.75 19.7294 3.75 19.0391H2.25C2.25 20.5578 3.48122 21.7891 5 21.7891V20.2891ZM3.75 19.0391V5.03906H2.25V19.0391H3.75ZM3.75 5.03906C3.75 4.34871 4.30964 3.78906 5 3.78906V2.28906C3.48122 2.28906 2.25 3.52028 2.25 5.03906H3.75ZM9.75 10.1758C9.75 9.38082 10.0248 9.0208 10.255 8.88851C10.4865 8.75547 10.9383 8.69993 11.6258 9.09572L12.3742 7.79579C11.4117 7.24158 10.3635 7.09604 9.50754 7.58799C8.65022 8.08071 8.25 9.06069 8.25 10.1758H9.75ZM14.1858 10.5757C14.8712 10.9704 15.0475 11.3888 15.0475 11.6558C15.0475 11.9227 14.8712 12.3411 14.1858 12.7358L14.9342 14.0357C15.8988 13.4804 16.5475 12.6438 16.5475 11.6558C16.5475 10.6677 15.8988 9.83115 14.9342 9.27579L14.1858 10.5757ZM11.6258 14.2158C10.9402 14.6105 10.4885 14.554 10.2561 14.4199C10.0239 14.2859 9.75 13.9242 9.75 13.1358H8.25C8.25 14.2473 8.65106 15.2256 9.50641 15.7191C10.3615 16.2125 11.4098 16.071 12.3742 15.5157L11.6258 14.2158ZM9.75 13.1358V10.1758H8.25V13.1358H9.75ZM11.6246 9.09505L14.1846 10.5751L14.9354 9.27645L12.3754 7.79645L11.6246 9.09505ZM14.1846 12.7365L11.6246 14.2165L12.3754 15.5151L14.9354 14.0351L14.1846 12.7365Z"
        fill="#157AFB"
      />
    </svg>
  );
};
export const EmojiIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22.0391C17.5228 22.0391 22 17.5619 22 12.0391C22 6.51621 17.5228 2.03906 12 2.03906C6.47715 2.03906 2 6.51621 2 12.0391C2 17.5619 6.47715 22.0391 12 22.0391Z"
        stroke="#00BF96"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 15.0391C8 15.0391 9.5 17.0391 12 17.0391C14.5 17.0391 16 15.0391 16 15.0391"
        stroke="#00BF96"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9.03906H9.01"
        stroke="#00BF96"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 9.03906H15.01"
        stroke="#00BF96"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const MessageIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
        stroke="#666C8F"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const LikeIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_6620_66516"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_6620_66516)">
        <path
          d="M17.725 20.5004H7.2V8.50039L13.85 1.90039L14.7 2.75039C14.8 2.85039 14.8833 2.98772 14.95 3.16239C15.0167 3.33772 15.05 3.50039 15.05 3.65039V3.90039L14 8.50039H20.7C21.1667 8.50039 21.5833 8.68372 21.95 9.05039C22.3167 9.41706 22.5 9.83372 22.5 10.3004V11.9254C22.5 12.0254 22.4873 12.1377 22.462 12.2624C22.4373 12.3877 22.4083 12.5004 22.375 12.6004L19.5 19.3504C19.3667 19.6837 19.1293 19.9587 18.788 20.1754C18.446 20.3921 18.0917 20.5004 17.725 20.5004ZM8.7 19.0004H17.725C17.7917 19.0004 17.8627 18.9797 17.938 18.9384C18.0127 18.8964 18.075 18.8337 18.125 18.7504L21 12.0004V10.3004C21 10.2171 20.971 10.1461 20.913 10.0874C20.8543 10.0294 20.7833 10.0004 20.7 10.0004H12.1L13.35 4.52539L8.7 9.15039V19.0004ZM7.2 8.50039V10.0004H4V19.0004H7.2V20.5004H2.5V8.50039H7.2Z"
          fill="#666C8F"
        />
      </g>
    </svg>
  );
};
export const ShareIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_6620_66511"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_6620_66511)">
        <path
          d="M3.30078 18.7496H4.80078V14.9996C4.80078 14.0996 5.11745 13.3329 5.75078 12.6996C6.38411 12.0663 7.15078 11.7496 8.05078 11.7496H17.8508L14.0008 15.5996L15.0508 16.6496L20.7008 10.9996L15.0508 5.34961L14.0008 6.39961L17.8508 10.2496H8.05078C6.73411 10.2496 5.61345 10.7119 4.68878 11.6366C3.76345 12.5619 3.30078 13.6829 3.30078 14.9996V18.7496Z"
          fill="#666C8F"
        />
      </g>
    </svg>
  );
};
export const DotsIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 10C11.6044 10 11.2178 10.1173 10.8889 10.3371C10.56 10.5568 10.3036 10.8692 10.1522 11.2346C10.0009 11.6001 9.96126 12.0022 10.0384 12.3902C10.1156 12.7781 10.3061 13.1345 10.5858 13.4142C10.8655 13.6939 11.2219 13.8844 11.6098 13.9616C11.9978 14.0387 12.3999 13.9991 12.7654 13.8478C13.1308 13.6964 13.4432 13.44 13.6629 13.1111C13.8827 12.7822 14 12.3956 14 12C14 11.4696 13.7893 10.9609 13.4142 10.5858C13.0391 10.2107 12.5304 10 12 10ZM5 10C4.60444 10 4.21776 10.1173 3.88886 10.3371C3.55996 10.5568 3.30362 10.8692 3.15224 11.2346C3.00087 11.6001 2.96126 12.0022 3.03843 12.3902C3.1156 12.7781 3.30608 13.1345 3.58579 13.4142C3.86549 13.6939 4.22186 13.8844 4.60982 13.9616C4.99778 14.0387 5.39992 13.9991 5.76537 13.8478C6.13082 13.6964 6.44318 13.44 6.66294 13.1111C6.8827 12.7822 7 12.3956 7 12C7 11.4696 6.78929 10.9609 6.41421 10.5858C6.03914 10.2107 5.53043 10 5 10ZM19 10C18.6044 10 18.2178 10.1173 17.8889 10.3371C17.56 10.5568 17.3036 10.8692 17.1522 11.2346C17.0009 11.6001 16.9613 12.0022 17.0384 12.3902C17.1156 12.7781 17.3061 13.1345 17.5858 13.4142C17.8655 13.6939 18.2219 13.8844 18.6098 13.9616C18.9978 14.0387 19.3999 13.9991 19.7654 13.8478C20.1308 13.6964 20.4432 13.44 20.6629 13.1111C20.8827 12.7822 21 12.3956 21 12C21 11.4696 20.7893 10.9609 20.4142 10.5858C20.0391 10.2107 19.5304 10 19 10Z"
        fill="#666C8F"
      />
    </svg>
  );
};

export const EditIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const TrashIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6.33203H5H21"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6.33203V4.33203C8 3.8016 8.21071 3.29289 8.58579 2.91782C8.96086 2.54274 9.46957 2.33203 10 2.33203H14C14.5304 2.33203 15.0391 2.54274 15.4142 2.91782C15.7893 3.29289 16 3.8016 16 4.33203V6.33203M19 6.33203V20.332C19 20.8625 18.7893 21.3712 18.4142 21.7462C18.0391 22.1213 17.5304 22.332 17 22.332H7C6.46957 22.332 5.96086 22.1213 5.58579 21.7462C5.21071 21.3712 5 20.8625 5 20.332V6.33203H19Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11.332V17.332"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11.332V17.332"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const AnimateTrashIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        id="trashRect"
        x="3"
        y="5"
        width="14"
        height="16"
        rx="1"
        fill="#FEBF32"
      />
      <path
        d="M1 5H3H19"
        stroke="#2A2D3C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5M17 5V19C17 19.5304 16.7893 20.0391 16.4142 20.4142C16.0391 20.7893 15.5304 21 15 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5H17Z"
        stroke="#2A2D3C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const WarningIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M37.4087 11.0375L57.8327 46.7815C60.2061 50.9362 57.2061 56.1068 52.4221 56.1068H11.5741C6.7874 56.1068 3.7874 50.9362 6.1634 46.7815L26.5874 11.0375C28.9794 6.84817 35.0167 6.84817 37.4087 11.0375Z"
        stroke="#FECA43"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 34.987V25.0137"
        stroke="#FECA43"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M31.996 42.667C31.8643 42.6675 31.7357 42.7071 31.6264 42.7807C31.5171 42.8542 31.4321 42.9585 31.382 43.0804C31.332 43.2023 31.3191 43.3362 31.3452 43.4654C31.3712 43.5945 31.4349 43.7131 31.5282 43.806C31.6216 43.899 31.7404 43.9622 31.8696 43.9877C31.9989 44.0132 32.1328 43.9999 32.2544 43.9493C32.3761 43.8988 32.4801 43.8134 32.5532 43.7038C32.6263 43.5942 32.6654 43.4654 32.6654 43.3337C32.6657 43.2458 32.6486 43.1587 32.6151 43.0775C32.5815 42.9963 32.5322 42.9226 32.47 42.8605C32.4077 42.7985 32.3337 42.7495 32.2524 42.7163C32.171 42.683 32.0839 42.6663 31.996 42.667"
        stroke="#FECA43"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SuccessIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="31.9944"
        cy="32.0007"
        r="24.01"
        stroke="#76E268"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5078 32.905L28.2889 38.6861L28.2515 38.6487L41.2943 25.606"
        stroke="#76E268"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const LinkIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.9641 6.03599C16.6271 5.37295 17.5264 5.00046 18.4641 5.00046C19.4018 5.00046 20.3011 5.37295 20.9641 6.03599C21.6271 6.69903 21.9996 7.59831 21.9996 8.53599C21.9996 9.47367 21.6271 10.373 20.9641 11.036L15.0851 16.915C14.4221 17.578 13.5228 17.9505 12.5851 17.9505C11.6474 17.9505 10.7481 17.578 10.0851 16.915C9.42205 16.252 9.04956 15.3527 9.04956 14.415C9.04956 13.4773 9.42205 12.578 10.0851 11.915L10.9641 11.036"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.03602 18.964C7.70772 19.2923 7.31796 19.5527 6.88901 19.7304C6.46006 19.9081 6.00031 19.9995 5.53602 19.9995C5.07173 19.9995 4.61198 19.9081 4.18303 19.7304C3.75408 19.5527 3.36433 19.2923 3.03602 18.964C2.37298 18.301 2.00049 17.4017 2.00049 16.464C2.00049 15.5263 2.37298 14.627 3.03602 13.964L8.91502 8.085C9.57806 7.42196 10.4773 7.04947 11.415 7.04947C12.3527 7.04947 13.252 7.42196 13.915 8.085C14.5781 8.74804 14.9506 9.64732 14.9506 10.585C14.9506 11.5227 14.5781 12.422 13.915 13.085L13 14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const WorldIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.0001 3H9.0001C7.0501 8.84 7.0501 15.16 9.0001 21H8.0001"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 3C16.95 8.84 16.95 15.16 15 21"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 9.00001C8.84 7.05001 15.16 7.05001 21 9.00001"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const ArrowRightIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 16L14 12L10 8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const ArrowLeftIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 8L10 12L14 16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const ArrowLeftSimpleIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 12L5.5 12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.5 16.5L5.5 12L9.5 7.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
export const MessageIcon2: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const CameraIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_7320_70608"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="16"
        height="16"
      >
        <rect width="16" height="16" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_7320_70608)">
        <path
          d="M10.064 10.7301L10.064 10.73C10.6326 10.161 10.918 9.4716 10.918 8.66732C10.918 7.86303 10.6326 7.17361 10.064 6.60464L10.064 6.60458C9.49501 6.03607 8.80559 5.75065 8.0013 5.75065C7.19702 5.75065 6.50759 6.03607 5.93862 6.60458L5.93856 6.60464C5.37005 7.17361 5.08464 7.86303 5.08464 8.66732C5.08464 9.4716 5.37005 10.161 5.93856 10.73L5.93862 10.7301C6.50759 11.2986 7.19702 11.584 8.0013 11.584C8.80559 11.584 9.49501 11.2986 10.064 10.7301ZM8.59363 9.30919L8.0013 10.6094L7.40897 9.30919L7.39346 9.27516L7.35943 9.25965L6.05919 8.66732L7.35943 8.07499L7.39346 8.05948L7.40897 8.02544L8.0013 6.7252L8.59363 8.02544L8.60914 8.05948L8.64318 8.07499L9.94342 8.66732L8.64318 9.25965L8.60914 9.27516L8.59363 9.30919ZM6.13464 2.23398H6.09091L6.06123 2.26608L4.85758 3.56732H2.86797C2.50842 3.56732 2.19956 3.69431 1.94726 3.94661C1.69496 4.19891 1.56797 4.50777 1.56797 4.86732V12.4673C1.56797 12.8269 1.69496 13.1357 1.94726 13.388C2.19956 13.6403 2.50842 13.7673 2.86797 13.7673H13.1346C13.4942 13.7673 13.803 13.6403 14.0553 13.388C14.3076 13.1357 14.4346 12.8269 14.4346 12.4673V4.86732C14.4346 4.50777 14.3076 4.19891 14.0553 3.94661C13.803 3.69431 13.4942 3.56732 13.1346 3.56732H11.145L9.94138 2.26608L9.91169 2.23398H9.86797H6.13464ZM10.5779 4.73522L10.6076 4.76732H10.6513H13.1346C13.1638 4.76732 13.1857 4.77643 13.2059 4.79669C13.2255 4.81627 13.2346 4.83781 13.2346 4.86732V12.4673C13.2346 12.4967 13.2256 12.5185 13.2059 12.5386C13.1859 12.5583 13.164 12.5673 13.1346 12.5673H2.86797C2.83846 12.5673 2.81693 12.5582 2.79735 12.5386C2.77708 12.5183 2.76797 12.4965 2.76797 12.4673V4.86732C2.76797 4.83818 2.77705 4.81677 2.79694 4.7971L2.79695 4.7971L2.79775 4.79629C2.81742 4.7764 2.83883 4.76732 2.86797 4.76732H5.3513H5.39502L5.42471 4.73522L6.62836 3.43398H9.37425L10.5779 4.73522Z"
          fill="#17171A"
          stroke="black"
          strokeWidth="0.2"
        />
      </g>
    </svg>
  );
};
export const CopyIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 17H5C4.46957 17 3.96086 16.7893 3.58579 16.4142C3.21071 16.0391 3 15.5304 3 15V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H15C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5V7"
        stroke="#FEBF32"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.895 7H8.105C7.49472 7 7 7.49472 7 8.105V19.895C7 20.5053 7.49472 21 8.105 21H19.895C20.5053 21 21 20.5053 21 19.895V8.105C21 7.49472 20.5053 7 19.895 7Z"
        stroke="#FEBF32"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SettingIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.908 10.09C14.4146 10.5965 14.6992 11.2836 14.6992 12C14.6992 12.7164 14.4146 13.4034 13.908 13.91C13.4015 14.4165 12.7144 14.7011 11.998 14.7011C11.2816 14.7011 10.5946 14.4165 10.088 13.91C9.58146 13.4034 9.29688 12.7164 9.29688 12C9.29688 11.6453 9.36674 11.294 9.50249 10.9663C9.63823 10.6386 9.8372 10.3408 10.088 10.09C10.3388 9.83915 10.6366 9.64019 10.9643 9.50444C11.2921 9.3687 11.6433 9.29883 11.998 9.29883C12.7144 9.29883 13.4015 9.58341 13.908 10.09"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.24822 12C5.24822 12.297 5.27522 12.594 5.31122 12.882L3.72322 14.124C3.5529 14.2574 3.43646 14.4478 3.39531 14.6602C3.35415 14.8725 3.39105 15.0926 3.49922 15.28L4.91122 17.723C5.01936 17.9101 5.19133 18.0519 5.39559 18.1224C5.59984 18.193 5.82268 18.1875 6.02322 18.107L7.44522 17.536C7.58365 17.4824 7.73306 17.4634 7.88049 17.4807C8.02792 17.4979 8.16891 17.5509 8.29122 17.635C8.51122 17.781 8.73922 17.915 8.97522 18.035C9.24522 18.172 9.44122 18.417 9.48422 18.717L9.70122 20.23C9.76422 20.672 10.1432 21 10.5892 21H13.4062C13.6221 21 13.8308 20.9221 13.9939 20.7807C14.157 20.6393 14.2637 20.4437 14.2942 20.23L14.5112 18.718C14.5349 18.5712 14.5938 18.4323 14.683 18.3134C14.7722 18.1944 14.8889 18.0989 15.0232 18.035C15.2582 17.917 15.4852 17.784 15.7042 17.639C15.8268 17.554 15.9684 17.5002 16.1166 17.4825C16.2647 17.4647 16.415 17.4834 16.5542 17.537L17.9732 18.107C18.1738 18.1873 18.3966 18.1927 18.6008 18.1221C18.805 18.0516 18.9769 17.9099 19.0852 17.723L20.4972 15.28C20.6054 15.0926 20.6423 14.8725 20.6011 14.6602C20.56 14.4478 20.4435 14.2574 20.2732 14.124L18.6852 12.882C18.7212 12.594 18.7482 12.297 18.7482 12C18.7482 11.703 18.7212 11.406 18.6852 11.118L20.2732 9.876C20.4435 9.74261 20.56 9.55222 20.6011 9.33984C20.6423 9.12745 20.6054 8.90735 20.4972 8.72L19.0852 6.277C18.9771 6.08991 18.8051 5.94809 18.6009 5.87755C18.3966 5.80702 18.1738 5.8125 17.9732 5.893L16.5542 6.463C16.4149 6.51634 16.2647 6.53492 16.1166 6.51715C15.9685 6.49938 15.827 6.44578 15.7042 6.361C15.4853 6.21555 15.2579 6.08332 15.0232 5.965C14.8889 5.90113 14.7722 5.8056 14.683 5.68663C14.5938 5.56766 14.5349 5.4288 14.5112 5.282L14.2952 3.77C14.2647 3.55627 14.158 3.36074 13.9949 3.2193C13.8318 3.07785 13.6231 2.99999 13.4072 3H10.5902C10.3743 2.99999 10.1657 3.07785 10.0025 3.2193C9.83942 3.36074 9.73279 3.55627 9.70222 3.77L9.48422 5.284C9.46057 5.43026 9.40194 5.56865 9.31332 5.68739C9.2247 5.80613 9.10871 5.90171 8.97522 5.966C8.73922 6.086 8.51122 6.221 8.29122 6.366C8.16853 6.44971 8.02735 6.50236 7.87981 6.51943C7.73227 6.5365 7.58279 6.51748 7.44422 6.464L6.02322 5.893C5.82268 5.8125 5.59984 5.80702 5.39559 5.87755C5.19133 5.94809 5.01936 6.08991 4.91122 6.277L3.49922 8.72C3.39105 8.90735 3.35415 9.12745 3.39531 9.33984C3.43646 9.55222 3.5529 9.74261 3.72322 9.876L5.31122 11.118C5.27202 11.4104 5.25097 11.705 5.24822 12V12Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CameraIcon2 = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_6871_83052"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_6871_83052)">
        <path
          d="M12 17.225C13.1667 17.225 14.1627 16.8127 14.988 15.988C15.8127 15.1627 16.225 14.1667 16.225 13C16.225 11.8333 15.8127 10.8373 14.988 10.012C14.1627 9.18733 13.1667 8.775 12 8.775C10.8333 8.775 9.83733 9.18733 9.012 10.012C8.18733 10.8373 7.775 11.8333 7.775 13C7.775 14.1667 8.18733 15.1627 9.012 15.988C9.83733 16.8127 10.8333 17.225 12 17.225ZM12 16.275L10.975 14.025L8.725 13L10.975 11.975L12 9.725L13.025 11.975L15.275 13L13.025 14.025L12 16.275ZM4.3 20.5C3.8 20.5 3.375 20.325 3.025 19.975C2.675 19.625 2.5 19.2 2.5 18.7V7.3C2.5 6.8 2.675 6.375 3.025 6.025C3.375 5.675 3.8 5.5 4.3 5.5H7.35L9.2 3.5H14.8L16.65 5.5H19.7C20.2 5.5 20.625 5.675 20.975 6.025C21.325 6.375 21.5 6.8 21.5 7.3V18.7C21.5 19.2 21.325 19.625 20.975 19.975C20.625 20.325 20.2 20.5 19.7 20.5H4.3ZM19.7 19C19.7833 19 19.8543 18.971 19.913 18.913C19.971 18.8543 20 18.7833 20 18.7V7.3C20 7.21667 19.971 7.146 19.913 7.088C19.8543 7.02933 19.7833 7 19.7 7H15.975L14.125 5H9.875L8.025 7H4.3C4.21667 7 4.146 7.02933 4.088 7.088C4.02933 7.146 4 7.21667 4 7.3V18.7C4 18.7833 4.02933 18.8543 4.088 18.913C4.146 18.971 4.21667 19 4.3 19H19.7Z"
          fill="white"
        />
      </g>
    </svg>
  );
};

export const AvatarIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_6871_83055"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_6871_83055)">
        <path
          d="M12 21.5C10.7 21.5 9.47067 21.25 8.312 20.75C7.154 20.25 6.14567 19.5707 5.287 18.712C4.429 17.854 3.75 16.846 3.25 15.688C2.75 14.5293 2.5 13.3 2.5 12C2.5 10.6833 2.75 9.45 3.25 8.3C3.75 7.15 4.429 6.14567 5.287 5.287C6.14567 4.429 7.154 3.75 8.312 3.25C9.47067 2.75 10.7 2.5 12 2.5C13.3167 2.5 14.55 2.75 15.7 3.25C16.85 3.75 17.854 4.429 18.712 5.287C19.5707 6.14567 20.25 7.15 20.75 8.3C21.25 9.45 21.5 10.6833 21.5 12C21.5 13.3 21.25 14.5293 20.75 15.688C20.25 16.846 19.5707 17.854 18.712 18.712C17.854 19.5707 16.85 20.25 15.7 20.75C14.55 21.25 13.3167 21.5 12 21.5ZM12 4C10.1 4 8.43333 4.58333 7 5.75C5.56667 6.91667 4.64167 8.38333 4.225 10.15C4.59167 10.1 4.98767 9.93333 5.413 9.65C5.83767 9.36667 6.29167 8.74167 6.775 7.775C7.00833 7.29167 7.346 6.91667 7.788 6.65C8.22933 6.38333 8.71667 6.25 9.25 6.25H14.75C15.2833 6.25 15.7707 6.38333 16.212 6.65C16.654 6.91667 16.9917 7.28333 17.225 7.75C17.725 8.75 18.1917 9.38733 18.625 9.662C19.0583 9.93733 19.4417 10.1 19.775 10.15C19.3583 8.38333 18.4333 6.91667 17 5.75C15.5667 4.58333 13.9 4 12 4ZM12 20C14.2333 20 16.1293 19.2167 17.688 17.65C19.246 16.0833 20.0167 14.1917 20 11.975V11.7C18.9167 11.6 18.0627 11.2417 17.438 10.625C16.8127 10.0083 16.2917 9.275 15.875 8.425C15.7583 8.20833 15.6043 8.04167 15.413 7.925C15.221 7.80833 15.0083 7.75 14.775 7.75H9.25C9 7.75 8.77933 7.80833 8.588 7.925C8.396 8.04167 8.24167 8.20833 8.125 8.425C7.70833 9.29167 7.18333 10.0333 6.55 10.65C5.91667 11.2667 5.06667 11.625 4 11.725V11.975C4 14.2083 4.77933 16.1043 6.338 17.663C7.896 19.221 9.78333 20 12 20ZM9 14.25C8.65 14.25 8.35433 14.129 8.113 13.887C7.871 13.6457 7.75 13.35 7.75 13C7.75 12.65 7.871 12.3543 8.113 12.113C8.35433 11.871 8.65 11.75 9 11.75C9.35 11.75 9.64567 11.871 9.887 12.113C10.129 12.3543 10.25 12.65 10.25 13C10.25 13.35 10.129 13.6457 9.887 13.887C9.64567 14.129 9.35 14.25 9 14.25ZM15 14.25C14.65 14.25 14.3543 14.129 14.113 13.887C13.871 13.6457 13.75 13.35 13.75 13C13.75 12.65 13.871 12.3543 14.113 12.113C14.3543 11.871 14.65 11.75 15 11.75C15.35 11.75 15.6457 11.871 15.887 12.113C16.129 12.3543 16.25 12.65 16.25 13C16.25 13.35 16.129 13.6457 15.887 13.887C15.6457 14.129 15.35 14.25 15 14.25Z"
          fill="white"
        />
      </g>
    </svg>
  );
};

export const UploadIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_6871_83058"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_6871_83058)">
        <path
          d="M6.3 19.5C5.8 19.5 5.375 19.325 5.025 18.975C4.675 18.625 4.5 18.2 4.5 17.7V15H6V17.7C6 17.7666 6.03333 17.8333 6.1 17.9C6.16667 17.9666 6.23333 18 6.3 18H17.7C17.7667 18 17.8333 17.9666 17.9 17.9C17.9667 17.8333 18 17.7666 18 17.7V15H19.5V17.7C19.5 18.2 19.325 18.625 18.975 18.975C18.625 19.325 18.2 19.5 17.7 19.5H6.3ZM11.25 15.625V7.22495L8.775 9.67495L7.725 8.59995L12 4.32495L16.275 8.59995L15.225 9.67495L12.75 7.22495V15.625H11.25Z"
          fill="white"
        />
      </g>
    </svg>
  );
};

export const NFTIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.08975 5.43301L12 0.866025L19.9103 5.43301V14.567L12 19.134L4.08975 14.567V5.43301Z"
        stroke="white"
        strokeWidth="1.5"
      />
      <path
        d="M8.9175 8.22021C9.33417 8.22021 9.65917 8.35188 9.8925 8.61521C10.1258 8.87521 10.2425 9.24688 10.2425 9.73021V11.7802H9.4325V9.75521C9.4325 9.47521 9.36583 9.26521 9.2325 9.12521C9.1025 8.98188 8.92083 8.91021 8.6875 8.91021C8.44083 8.91021 8.2425 8.98688 8.0925 9.14021C7.94583 9.29021 7.8725 9.51355 7.8725 9.81021V11.7802H7.0625V8.28021H7.8475V8.70521C7.9675 8.54521 8.1175 8.42521 8.2975 8.34521C8.4775 8.26188 8.68417 8.22021 8.9175 8.22021Z"
        fill="white"
      />
      <path
        d="M12.672 8.91021C12.392 8.91021 12.1803 8.97188 12.037 9.09521C11.8937 9.21521 11.822 9.39688 11.822 9.64021V9.85521H13.262V10.5052H11.822V11.7802H11.012V9.64521C11.012 9.19521 11.152 8.84521 11.432 8.59521C11.7153 8.34521 12.1103 8.22021 12.617 8.22021C12.817 8.22021 13.0053 8.24188 13.182 8.28521C13.3587 8.32521 13.512 8.38521 13.642 8.46521L13.392 9.10521C13.192 8.97521 12.952 8.91021 12.672 8.91021Z"
        fill="white"
      />
      <path
        d="M16.6682 9.26021C16.3682 9.08688 16.0465 8.97521 15.7032 8.92521V11.7802H14.8932V8.92521C14.5498 8.97521 14.2265 9.08688 13.9232 9.26021L13.6482 8.65521C13.8882 8.51188 14.1482 8.40355 14.4282 8.33021C14.7082 8.25688 14.9965 8.22021 15.2932 8.22021C15.5932 8.22021 15.8832 8.25688 16.1632 8.33021C16.4465 8.40355 16.7065 8.51188 16.9432 8.65521L16.6682 9.26021Z"
        fill="white"
      />
    </svg>
  );
};

export const Polygon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="30"
      height="12"
      viewBox="0 0 30 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15 0L30 12H0L15 0Z" fill="#0D0D0D" />
    </svg>
  );
};

export const Website: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12H22"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const CrossIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 7L17 17"
        stroke="#0B0B0B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 17L17 7"
        stroke="#0B0B0B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const CrossFullIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="9.5" fill="#1B1C22" stroke="#2A2D3C" />
      <path
        d="M7 7L13 13"
        stroke="white"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13L13 7"
        stroke="white"
        strokeWidth="1.125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const ImageIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.4987 9.16536C8.41917 9.16536 9.16536 8.41917 9.16536 7.4987C9.16536 6.57822 8.41917 5.83203 7.4987 5.83203C6.57822 5.83203 5.83203 6.57822 5.83203 7.4987C5.83203 8.41917 6.57822 9.16536 7.4987 9.16536Z"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 12.5011L14.9283 9.92938C14.6158 9.61693 14.1919 9.44141 13.75 9.44141C13.3081 9.44141 12.8842 9.61693 12.5717 9.92938L5 17.501"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const GifIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V15.8333C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8333V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5Z"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.46667 12.3467C6.93778 12.3467 6.48889 12.2467 6.12 12.0467C5.75556 11.8467 5.47778 11.5667 5.28667 11.2067C5.09556 10.8467 5 10.4244 5 9.94C5 9.56667 5.05556 9.23111 5.16667 8.93333C5.28222 8.63111 5.44667 8.37556 5.66 8.16667C5.87778 7.95333 6.14 7.78889 6.44667 7.67333C6.75778 7.55778 7.10889 7.5 7.5 7.5C7.74 7.5 7.98 7.52667 8.22 7.58C8.46 7.63333 8.69111 7.72222 8.91333 7.84667C9.00667 7.9 9.06889 7.96889 9.1 8.05333C9.13556 8.13333 9.14444 8.22 9.12667 8.31333C9.11333 8.40222 9.07778 8.48222 9.02 8.55333C8.96667 8.62 8.89556 8.66444 8.80667 8.68667C8.72222 8.70444 8.62444 8.68667 8.51333 8.63333C8.36667 8.55333 8.21111 8.49556 8.04667 8.46C7.88222 8.42 7.70222 8.4 7.50667 8.4C7.19111 8.4 6.92667 8.46 6.71333 8.58C6.5 8.69556 6.34 8.86889 6.23333 9.1C6.13111 9.32667 6.08 9.60667 6.08 9.94C6.08 10.4422 6.2 10.8222 6.44 11.08C6.68444 11.3378 7.04444 11.4667 7.52 11.4667C7.68 11.4667 7.84444 11.4511 8.01333 11.42C8.18222 11.3889 8.34889 11.3444 8.51333 11.2867L8.32 11.7067V10.4267H7.72C7.58667 10.4267 7.48444 10.3933 7.41333 10.3267C7.34222 10.26 7.30667 10.1689 7.30667 10.0533C7.30667 9.93333 7.34222 9.84222 7.41333 9.78C7.48444 9.71333 7.58667 9.68 7.72 9.68H8.76667C8.9 9.68 9 9.71556 9.06667 9.78667C9.13778 9.85778 9.17333 9.96 9.17333 10.0933V11.64C9.17333 11.7556 9.15111 11.8533 9.10667 11.9333C9.06222 12.0133 8.98667 12.0711 8.88 12.1067C8.68 12.1778 8.45556 12.2356 8.20667 12.28C7.95778 12.3244 7.71111 12.3467 7.46667 12.3467Z"
        fill="#888DAA"
      />
      <path
        d="M10.6079 12.3333C10.439 12.3333 10.3101 12.2867 10.2213 12.1933C10.1324 12.1 10.0879 11.9689 10.0879 11.8V8.04667C10.0879 7.87778 10.1324 7.74667 10.2213 7.65333C10.3101 7.56 10.439 7.51333 10.6079 7.51333C10.7724 7.51333 10.899 7.56 10.9879 7.65333C11.0768 7.74667 11.1212 7.87778 11.1212 8.04667V11.8C11.1212 11.9689 11.0768 12.1 10.9879 12.1933C10.9035 12.2867 10.7768 12.3333 10.6079 12.3333Z"
        fill="#888DAA"
      />
      <path
        d="M12.5938 12.3333C12.4249 12.3333 12.2937 12.2867 12.2004 12.1933C12.1115 12.1 12.0671 11.9644 12.0671 11.7867V8.11333C12.0671 7.94 12.1137 7.80667 12.2071 7.71333C12.3004 7.62 12.4337 7.57333 12.6071 7.57333H14.8871C15.0204 7.57333 15.1204 7.60889 15.1871 7.68C15.2582 7.74667 15.2937 7.84444 15.2937 7.97333C15.2937 8.10667 15.2582 8.20889 15.1871 8.28C15.1204 8.34667 15.0204 8.38 14.8871 8.38H13.1004V9.52667H14.7404C14.8737 9.52667 14.976 9.56222 15.0471 9.63333C15.1182 9.7 15.1538 9.79778 15.1538 9.92667C15.1538 10.0556 15.1182 10.1556 15.0471 10.2267C14.976 10.2978 14.8737 10.3333 14.7404 10.3333H13.1004V11.7867C13.1004 12.1511 12.9315 12.3333 12.5938 12.3333Z"
        fill="#888DAA"
      />
    </svg>
  );
};
export const VideosIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.16797 4.42673C4.16797 3.5945 5.08864 3.09186 5.78869 3.54189L14.4582 9.11516C15.1023 9.52923 15.1023 10.4708 14.4582 10.8848L5.78869 16.4581C5.08864 16.9081 4.16797 16.4055 4.16797 15.5733V4.42673Z"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const AudioIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 15V10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10V15"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 15.8346C17.5 16.2767 17.3244 16.7006 17.0118 17.0131C16.6993 17.3257 16.2754 17.5013 15.8333 17.5013H15C14.558 17.5013 14.134 17.3257 13.8215 17.0131C13.5089 16.7006 13.3333 16.2767 13.3333 15.8346V13.3346C13.3333 12.8926 13.5089 12.4687 13.8215 12.1561C14.134 11.8436 14.558 11.668 15 11.668H17.5V15.8346ZM2.5 15.8346C2.5 16.2767 2.67559 16.7006 2.98816 17.0131C3.30072 17.3257 3.72464 17.5013 4.16667 17.5013H5C5.44203 17.5013 5.86595 17.3257 6.17851 17.0131C6.49107 16.7006 6.66667 16.2767 6.66667 15.8346V13.3346C6.66667 12.8926 6.49107 12.4687 6.17851 12.1561C5.86595 11.8436 5.44203 11.668 5 11.668H2.5V15.8346Z"
        stroke="#888DAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const QuestionIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="13"
      height="14"
      viewBox="0 0 13 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.4987 12.4154C9.49024 12.4154 11.9154 9.99024 11.9154 6.9987C11.9154 4.00716 9.49024 1.58203 6.4987 1.58203C3.50716 1.58203 1.08203 4.00716 1.08203 6.9987C1.08203 9.99024 3.50716 12.4154 6.4987 12.4154Z"
        stroke="white"
        strokeWidth="1.08333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.92188 5.37482C5.04922 5.01281 5.30058 4.70754 5.63143 4.5131C5.96229 4.31866 6.35128 4.24758 6.72951 4.31246C7.10775 4.37733 7.45082 4.57398 7.69796 4.86756C7.9451 5.16115 8.08036 5.53273 8.07979 5.91649C8.07979 6.99982 6.45479 7.54149 6.45479 7.54149"
        stroke="white"
        strokeWidth="1.08333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 9.70703H6.50583"
        stroke="white"
        strokeWidth="1.08333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const AddIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 19C7.61305 19 5.32387 18.0518 3.63604 16.364C1.94821 14.6761 1 12.3869 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1C12.3869 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10C19 12.3869 18.0518 14.6761 16.364 16.364C14.6761 18.0518 12.3869 19 10 19V19Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6V14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 10H6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArchiveIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 4H4C2.89543 4 2 4.89543 2 6V7C2 8.10457 2.89543 9 4 9H20C21.1046 9 22 8.10457 22 7V6C22 4.89543 21.1046 4 20 4Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V9"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13H14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const GreyWorldIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="#45474D"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12H22"
        stroke="#45474D"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z"
        stroke="#45474D"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const GreyFBIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_7851_64991)">
        <path
          d="M9.68359 11.3125H14.3146"
          stroke="#45474D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.3175 7.45312H13.5075C12.9037 7.45339 12.3246 7.69337 11.8977 8.12034C11.4707 8.5473 11.2307 9.12631 11.2305 9.73013V16.5431"
          stroke="#45474D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.0707 4.92875C22.9757 8.83375 22.9757 15.1657 19.0707 19.0707C15.1657 22.9757 8.83375 22.9757 4.92875 19.0707C1.02375 15.1657 1.02375 8.83375 4.92875 4.92875C8.83375 1.02375 15.1657 1.02375 19.0707 4.92875"
          stroke="#45474D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_7851_64991">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
export const GreyTwitterIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 16.5516C3.029 16.5466 5.7 15.6516 5.7 15.6516C2.694 12.6126 2.466 8.11156 4.8 4.85156C5.907 6.91056 7.974 8.81056 10.2 9.35156C10.286 6.75156 12.049 4.85156 14.7 4.85156C16.505 4.85156 17.567 5.53956 18.3 6.65156H21L19.2 9.35156"
        stroke="#45474D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const ShareBigIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="20"
      height="17"
      viewBox="0 0 20 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.475 7.83076L9.58594 0.582031V5.03441H7.27344C3.54552 5.03441 0.523438 8.05646 0.523438 11.7844V16.4157L4.32042 13.0898C5.27773 12.2513 6.50703 11.789 7.77964 11.789H9.58594V16.4046L19.475 7.83076Z"
        fill="white"
      />
    </svg>
  );
};
export const BNBIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.41316 6.93871L8.0026 4.34927L10.5933 6.93983L12.0999 5.43316L8.0026 1.33594L3.9066 5.43194L5.41322 6.9386L5.41316 6.93871ZM1.33594 8.0026L2.84266 6.49567L4.34927 8.00228L2.84255 9.509L1.33594 8.0026ZM5.41316 9.06666L8.0026 11.6559L10.5932 9.06543L12.1007 10.5713L12.0999 10.5721L8.0026 14.6693L3.9066 10.5733L3.90447 10.5711L5.41332 9.0665L5.41316 9.06666ZM11.6559 8.00324L13.1627 6.49652L14.6693 8.00314L13.1626 9.50986L11.6559 8.00324Z"
        fill="#F3BA2F"
      />
      <path
        d="M9.53042 8.00154H9.53106L8.00231 6.47266L6.87234 7.60233L6.74252 7.7322L6.47479 8L6.47266 8.00208L6.47479 8.00426L8.00231 9.53203L9.53116 8.00314L9.53191 8.00229L9.53052 8.00154"
        fill="#F3BA2F"
      />
    </svg>
  );
};
export const AuctionIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.5 7.5V6C21.5 5.46957 21.2893 4.96086 20.9142 4.58579C20.5391 4.21071 20.0304 4 19.5 4H5.5C4.96957 4 4.46086 4.21071 4.08579 4.58579C3.71071 4.96086 3.5 5.46957 3.5 6V20C3.5 20.5304 3.71071 21.0391 4.08579 21.4142C4.46086 21.7893 4.96957 22 5.5 22H9"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 2V6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 2V6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 10H8.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 17.5L16.5 16.25V14"
        stroke="#E35259"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.5 16C22.5 17.5913 21.8679 19.1174 20.7426 20.2426C19.6174 21.3679 18.0913 22 16.5 22C14.9087 22 13.3826 21.3679 12.2574 20.2426C11.1321 19.1174 10.5 17.5913 10.5 16C10.5 14.4087 11.1321 12.8826 12.2574 11.7574C13.3826 10.6321 14.9087 10 16.5 10C18.0913 10 19.6174 10.6321 20.7426 11.7574C21.8679 12.8826 22.5 14.4087 22.5 16V16Z"
        stroke="#E35259"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const LoaderIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="31.9983"
        cy="32.0002"
        rx="24.01"
        ry="24.01"
        stroke="#2A2D3C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56.0122 32.0002C56.0122 36.749 54.604 41.391 51.9658 45.3395C49.3275 49.2879 45.5777 52.3653 41.1904 54.1826C36.8032 55.9998 31.9756 56.4753 27.3181 55.5489C22.6606 54.6225 18.3824 52.3357 15.0246 48.9779C11.6667 45.62 9.37996 41.3418 8.45353 36.6844C7.5271 32.0269 8.00258 27.1993 9.81984 22.812C11.6371 18.4248 14.7145 14.6749 18.6629 12.0366C22.6114 9.3984 27.2535 7.99023 32.0022 7.99023"
        stroke="url(#paint0_linear_8027_75054)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_8027_75054"
          x1="7.99219"
          y1="7.99023"
          x2="57.0425"
          y2="9.06678"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A9CDFF" />
          <stop offset="0.21875" stopColor="#72F6D1" />
          <stop offset="0.557292" stopColor="#A0ED8D" />
          <stop offset="0.817708" stopColor="#FED365" />
          <stop offset="1" stopColor="#FAA49E" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export const FacebookCircleIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.68359 11.314H14.3146"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3175 7.45496H13.5075C12.9037 7.45522 12.3246 7.6952 11.8977 8.12217C11.4707 8.54913 11.2307 9.12814 11.2305 9.73196V16.545"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.0707 4.92899C22.9757 8.83399 22.9757 15.166 19.0707 19.071C15.1657 22.976 8.83375 22.976 4.92875 19.071C1.02375 15.166 1.02375 8.83399 4.92875 4.92899C8.83375 1.02399 15.1657 1.02399 19.0707 4.92899"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DeleteCrossIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      className={props.className}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="24" stroke="#EA3943" strokeWidth="1.5" />
      <path
        d="M24 24L40 40"
        stroke="#EA3943"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 40L40 24"
        stroke="#EA3943"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export const Circle: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 402.06 402.06"
    >
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <circle cx="201.03" cy="201.03" r="200.53" />
        </g>
      </g>
    </svg>
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
