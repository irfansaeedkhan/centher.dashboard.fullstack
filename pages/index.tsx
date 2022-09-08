// React, Next, NPM Packages
import { NextPage } from "next";

// App Components and Data
import { Heading } from "@/components/heading";
import { AppRoutes } from "@/constants/app.routes";

// Current File's Components and Data
import { Button } from "@/pages.components/index";

const Home: NextPage = () => {
  return (
    <div>
      <Heading variant="h1">Hello world!</Heading>
      <Button component="a" href={AppRoutes.login}>
        Connect
      </Button>
    </div>
  );
};

export default Home;
