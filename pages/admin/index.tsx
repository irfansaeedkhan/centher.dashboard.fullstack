// React, Next, NPM Packages
import { NextPage } from "next";

// App imports
import { Heading } from "@/components/heading";
import { AppRoutes } from "@/constants/app.routes";

// Current directory imports
import { Button } from "@/pages.components/index";
import { AdminSidebar } from "@/components/sidebar/admin.sidebar";

const Admin: NextPage = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div>
        <Heading variant="h1">Hello world!</Heading>
        <Button component="a" href={AppRoutes.login}>
          Connect
        </Button>
      </div>
    </div>
  );
};

export default Admin;
