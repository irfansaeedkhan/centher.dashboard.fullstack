import React from "react";

const LaunchpadSkeleton = () => {
  return (
    <>
      <div className="mb-4 flex h-[230px] max-w-[1000px] items-center justify-center rounded-2xl bg-[#131314] flg:h-[256px]">
        <div className="flex w-full justify-center">
          <div className="flex w-full flex-col items-center justify-center gap-5 flg:flex-row">
            <div className="w-full max-w-[200px] fsm:max-w-[300px] flg:max-w-[400px]">
              <div className="h-[30px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[40px] flg:h-[60px]"></div>
              <div className="mt-4 flex w-full justify-center gap-2 flg:justify-start">
                <div className="h-[15px] w-full max-w-[90px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[20px] fsm:max-w-[120px] flg:h-[30px] flg:max-w-[150px]"></div>
                <div className="h-[15px] w-full max-w-[90px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[20px] fsm:max-w-[120px] flg:h-[30px] flg:max-w-[150px]"></div>
              </div>
            </div>
            <div className="w-full max-w-[380px]">
              <div className="mx-auto h-[20px] w-full max-w-[150px] animate-pulse rounded-md bg-[#3C3F4A] fsm:max-w-[200px] flg:max-w-[300px]"></div>
              <div className="mt-4 flex justify-center gap-5">
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 h-[500px] max-w-[1000px] rounded-2xl bg-[#131314] flg:h-[324px]">
        <div className="flex h-[98px] items-center justify-center">
          <div className="h-[20px] w-full max-w-[200px] animate-pulse rounded-md bg-[#3C3F4A] fsm:max-w-[300px] flg:max-w-[400px]"></div>
        </div>
        <div className="h-[2px] w-full max-w-[1000px] animate-pulse bg-[#3C3F4A]"></div>

        <div className="mt-12 flex flex-col items-center justify-center gap-5 flg:flex-row">
          <div className="w-full max-w-[280px] fsm:max-w-[500px] fmd:max-w-[650px] flg:max-w-[354px]">
            <div className="mb-3 h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
            <div className="h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
          </div>

          <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-full bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>

          <div className="w-full max-w-[280px] fsm:max-w-[500px] fmd:max-w-[650px] flg:max-w-[354px]">
            <div className="mb-3 h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
            <div className="h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex h-[230px] max-w-[1000px] items-center justify-center rounded-2xl bg-[#131314] flg:h-[256px]">
        <div className="flex w-full justify-center">
          <div className="flex w-full flex-col items-center justify-center gap-5 flg:flex-row">
            <div className="w-full max-w-[200px] fsm:max-w-[300px] flg:max-w-[400px]">
              <div className="h-[30px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[40px] flg:h-[60px]"></div>
              <div className="mt-4 flex w-full justify-center gap-2 flg:justify-start">
                <div className="h-[15px] w-full max-w-[90px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[20px] fsm:max-w-[120px] flg:h-[30px] flg:max-w-[150px]"></div>
                <div className="h-[15px] w-full max-w-[90px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[20px] fsm:max-w-[120px] flg:h-[30px] flg:max-w-[150px]"></div>
              </div>
            </div>
            <div className="w-full max-w-[380px]">
              <div className="mx-auto h-[20px] w-full max-w-[150px] animate-pulse rounded-md bg-[#3C3F4A] fsm:max-w-[200px] flg:max-w-[300px]"></div>
              <div className="mt-4 flex justify-center gap-5">
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 h-[500px] max-w-[1000px] rounded-2xl bg-[#131314] flg:h-[324px]">
        <div className="flex h-[98px] items-center justify-center">
          <div className="h-[20px] w-full max-w-[200px] animate-pulse rounded-md bg-[#3C3F4A] fsm:max-w-[300px] flg:max-w-[400px]"></div>
        </div>
        <div className="h-[2px] w-full max-w-[1000px] animate-pulse bg-[#3C3F4A]"></div>

        <div className="mt-12 flex flex-col items-center justify-center gap-5 flg:flex-row">
          <div className="w-full max-w-[280px] fsm:max-w-[500px] fmd:max-w-[650px] flg:max-w-[354px]">
            <div className="mb-3 h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
            <div className="h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
          </div>

          <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-full bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>

          <div className="w-full max-w-[280px] fsm:max-w-[500px] fmd:max-w-[650px] flg:max-w-[354px]">
            <div className="mb-3 h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
            <div className="h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex h-[230px] max-w-[1000px] items-center justify-center rounded-2xl bg-[#131314] flg:h-[256px]">
        <div className="flex w-full justify-center">
          <div className="flex w-full flex-col items-center justify-center gap-5 flg:flex-row">
            <div className="w-full max-w-[200px] fsm:max-w-[300px] flg:max-w-[400px]">
              <div className="h-[30px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[40px] flg:h-[60px]"></div>
              <div className="mt-4 flex w-full justify-center gap-2 flg:justify-start">
                <div className="h-[15px] w-full max-w-[90px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[20px] fsm:max-w-[120px] flg:h-[30px] flg:max-w-[150px]"></div>
                <div className="h-[15px] w-full max-w-[90px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[20px] fsm:max-w-[120px] flg:h-[30px] flg:max-w-[150px]"></div>
              </div>
            </div>
            <div className="w-full max-w-[380px]">
              <div className="mx-auto h-[20px] w-full max-w-[150px] animate-pulse rounded-md bg-[#3C3F4A] fsm:max-w-[200px] flg:max-w-[300px]"></div>
              <div className="mt-4 flex justify-center gap-5">
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
                <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 h-[500px] max-w-[1000px] rounded-2xl bg-[#131314] flg:h-[324px]">
        <div className="flex h-[98px] items-center justify-center">
          <div className="h-[20px] w-full max-w-[200px] animate-pulse rounded-md bg-[#3C3F4A] fsm:max-w-[300px] flg:max-w-[400px]"></div>
        </div>
        <div className="h-[2px] w-full max-w-[1000px] animate-pulse bg-[#3C3F4A]"></div>

        <div className="mt-12 flex flex-col items-center justify-center gap-5 flg:flex-row">
          <div className="w-full max-w-[280px] fsm:max-w-[500px] fmd:max-w-[650px] flg:max-w-[354px]">
            <div className="mb-3 h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
            <div className="h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
          </div>

          <div className="h-[48px] w-full max-w-[48px] animate-pulse rounded-full bg-[#3C3F4A] fsm:h-[60px] fsm:max-w-[60px] flg:h-[80px] flg:max-w-[80px]"></div>

          <div className="w-full max-w-[280px] fsm:max-w-[500px] fmd:max-w-[650px] flg:max-w-[354px]">
            <div className="mb-3 h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
            <div className="h-[40px] w-full animate-pulse rounded-md bg-[#3C3F4A] fsm:h-[50px] flg:h-[64px]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LaunchpadSkeleton;

//98 + 364 = 462
