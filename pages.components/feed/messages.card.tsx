// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

export const MessagesCard = () => {
  return (
    <div className={MessagesCardContainer}>
      <div className="topDetails p-4">
        <h5 className={MCTitle}>Messages</h5>
        <div className="searchBox">
          <div className="searchIcon">
            <img src={"/search.png"} width="16" height="16" />
          </div>
          <input type="text" placeholder="Search" />
        </div>
        <div className="contactCard">
          <div className="contactDetail">
            <div className="Icon">
              <img src={"/messageProfile.png"} width="48" height="48" />
            </div>
            <div className="detail">
              <h5>0xTs9...44e76</h5>
              <h6>Active 30m ago</h6>
            </div>
          </div>
          <button>Message</button>
        </div>
      </div>

      <div className="bottomBtn">
        <button>See all Conversations</button>
      </div>
    </div>
  );
};

// styling
const MessagesCardContainer = ctl(`
  w-full max-w-[272px] rounded-10px bg-background-shade-3
`);
const MCTitle = ctl(`
  text-14px font-semibold text-white pb-4
`);
const searchBox = ctl(`
  text-12px font-medium text-gray-shade-7 pb-3
`);

//   .searchBox {
//     margin: 24px 0;
//     width: 100%;
//     background: #1f1f1f;
//     border-radius: 16px;
//     padding: 14px;
//     height: 38px;
//     position: relative;

//     .searchIcon {
//       position: absolute;
//       top: 50%;
//       transform: translateY(-50%);
//       width: 16px;
//     }

//     input {
//       position: absolute;
//       top: 0;
//       left: 0;
//       width: 100%;
//       height: 100%;
//       color: #adadad;
//       font-weight: 400;
//       font-size: 1.4em;
//       line-height: 22px;
//       background: transparent;
//       padding: 8px 36px;
//       border: none;
//       outline: none;
//     }
//   }

//   .contactCard {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin: 10px 0;

//     .contactDetail {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       gap: 8px;

//       .Icon {
//         width: 48px;

//         img {
//           width: 100%;
//         }
//       }

//       .detail {
//         h5 {
//           font-weight: 700;
//           font-size: 1.4em;
//           line-height: 22px;
//           color: #ffffff;
//           margin: 0;
//         }

//         h6 {
//           font-weight: 400;
//           font-size: 1.2em;
//           line-height: 20px;
//           color: #adadad;
//           margin: 0;
//         }
//       }
//     }

//     button {
//       font-weight: 700;
//       font-size: 1.2em;
//       line-height: 24px;
//       color: #00bf96;
//     }
//   }

//   .bottomBtn {
//     border-top: 1px solid #1f1f1f;
//     text-align: center;

//     button {
//       font-weight: 700;
//       font-size: 1.4em;
//       line-height: 22px;
//       color: #00bf96;
//       padding: 14px;
//     }
//   }
// }
