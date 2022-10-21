import React from "react";
import Image from "next/future/image";
import { Carousel } from "react-responsive-carousel";

import { PostMedia } from "@/models/post";
import { User } from "@/models/user";

interface PostCarouselProps {
  editedText: string;
  previewFilesUI: JSX.Element[];
  postMedia: PostMedia[];
  user: User;
  onMediaDelete: (media: PostMedia) => void;
  onPostTextEdit: (postText: string) => void;
}

export const PostCarousel: React.FC<PostCarouselProps> = ({
  editedText,
  previewFilesUI,
  postMedia,
  user,
  onMediaDelete,
  onPostTextEdit,
}) => {
  const [selectedItem, setSelectedItem] = React.useState(0);

  return (
    <div className={`px-4`}>
      <div>
        <Carousel
          onChange={(index) => {
            setSelectedItem(index);
          }}
          selectedItem={selectedItem}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          showArrows={previewFilesUI.length === 1 ? false : true}
        >
          {postMedia.map((media) => {
            return (
              <div
                key={media.url}
                className="h-full flex items-center justify-center relative"
              >
                {media.type == "image" ? (
                  <Image
                    src={media.url}
                    width={452}
                    height={312}
                    className={
                      "object-contain object-center w-full h-auto rounded-xl max-w-[25rem] max-h-[25rem] block"
                    }
                    alt={user.display_name ?? "profile image"}
                  />
                ) : (
                  <video
                    src={media.url}
                    width={452}
                    height={312}
                    className={
                      "object-contain object-center w-full h-auto rounded-xl max-w-[25rem] max-h-[15rem] block"
                    }
                    controls
                  ></video>
                )}
                <button
                  className={`absolute top-2 right-6 ml-auto border-0 text-gray-shade-3 opacity-100 outline-none leading-none font-semibold focus:outline-none transition bg-white/70  rounded-full hover:scale-110 z-30 w-[24px] h-[24px] flex items-center justify-center leading-0 text-2xl`}
                  onClick={() => {
                    setSelectedItem((prev) => prev - 1);
                    onMediaDelete(media);
                  }}
                >
                  x
                </button>
              </div>
            );
          })}
        </Carousel>
      </div>
      <div className={`pt-4 pb-2 w-full px-6`}>
        <textarea
          className={`text-14px rounded-10px w-full leading-6  text-white font-medium bg-background-shade-3`}
          cols={12}
          rows={4}
          placeholder="Type Here"
          maxLength={200}
          onChange={(e) => {
            onPostTextEdit(e.target.value);
          }}
          value={editedText}
        ></textarea>
      </div>
    </div>
  );
};
