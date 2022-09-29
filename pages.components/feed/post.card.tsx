// React, Next, NPM Packages
import ctl from "@netlify/classnames-template-literals";

export const PostCard = () => {
  return (
    <div className={DiscoverCardContainer}>
      <div className="postCardContainer">
        <div className="iconProfile">
          <img src={""} width="48" height="48" className="rounded-full" />
        </div>
        <div className="postBtnsContainer">
          <div className="postBtn">
            <button>Start a post</button>
          </div>
          <div className="uploadBtns">
            <div>
              <label className="btnBox photo" style={{ display: "flex" }}>
                <img src={"/Image.png"} width="24" height="24" />
                <h5>Photo</h5>
                <input
                  type="file"
                  id="file"
                  name="files[]"
                  accept={"image"}
                  multiple
                />
                {/* <input type="file" id="file" name="file"/> */}
              </label>
            </div>
            <div>
              <label className="btnBox video" style={{ display: "flex" }}>
                <img src={"/Video.png"} width="24" height="24" />
                <h5>Video</h5>
                <input
                  type="file"
                  id="video"
                  name="files[]"
                  style={{ display: "none" }}
                  multiple
                />
              </label>
            </div>
            <div className="btnBox emoji">
              <img src={"/emoji.png"} width="24" height="24" />
              <h5>Emoji</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// styling
const DiscoverCardContainer = ctl(`
  w-full max-w-[272px] px-4 pt-4   rounded-10px bg-background-shade-3
`);
const DCTitle = ctl(`
  text-14px font-semibold text-white pb-4
`);
const DCTags = ctl(`
  text-12px font-medium text-gray-shade-7 pb-3
`);

// .postCardContainer {
//   background: #141414;
//   border-radius: 16px;
//   display: flex;
//   padding: 25px;
//   gap: 15px;

//   @media screen and (max-width: 1100px) {
//     flex-direction: column;
//     align-items: center;
//   }

//   .iconProfile {
//     width: 48px;

//     @media screen and (max-width: 1100px) {
//       width: 35%;
//     }

//     img {
//       width: 100%;
//     }
//   }

//   .postBtnsContainer {
//     width: 100%;

//     .postBtn {
//       background: #1f1f1f;
//       border-radius: 16px;
//       height: 48px;
//       padding: 14px 16px;
//       margin-bottom: 38px;

//       button {
//         font-weight: 600;
//         font-size: 1.8em;
//         line-height: 20px;
//         color: #5c5c5c;
//       }
//     }

//     .uploadBtns {
//       display: flex;
//       justify-content: space-between;
//       align-items: center;

//       .btnBox {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         gap: 15px;

//         img {
//           width: 24px;
//           height: 24px;
//         }

//         h5 {
//           font-weight: 700;
//           font-size: 1.4em;
//           line-height: 24px;
//           margin: 0;
//         }

//         &.photo {
//           h5 {
//             color: #feca43;
//           }
//         }

//         &.video {
//           h5 {
//             color: #157afb;
//           }
//         }

//         &.emoji {
//           h5 {
//             color: #00bf96;
//           }
//         }
//       }
//     }
//   }
// }
