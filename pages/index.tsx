// React, Next, NPM Packages
import { NextPage } from "next";

// App imports
import { Heading } from "@/components/heading";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import { Button } from "@/pages.components/index";
import { Sidebar } from "@/components/sidebar";
import Header from "@/components/header";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div>
          <Heading variant="h1">Hello world!</Heading>
          <Button component="a" href={AppRoutes.login}>
            Connect
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
