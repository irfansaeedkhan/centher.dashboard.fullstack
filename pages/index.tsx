// React, Next, NPM Packages
import { NextPage } from "next";

// App imports
import { AllPagesWrapper } from "@/components/all.pages.wrapper";
import { Heading } from "@/components/heading";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import { Button } from "@/pages.components/index";

const Home: NextPage = () => {
  return (
    <AllPagesWrapper>
      <div>
        <Heading variant="h1">Hello world!</Heading>
        <Button component="a" href={AppRoutes.login}>
          Connect
        </Button>
      </div>
    </AllPagesWrapper>
  );
};

export default Home;
