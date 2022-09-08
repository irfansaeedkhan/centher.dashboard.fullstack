// React, Next, NPM Packages
import React from "react";
import Link, { LinkProps } from "next/link";
import ctl from "@netlify/classnames-template-literals";

interface ButtonProps {
  children: React.ReactNode;
  component: "button";
}

interface ButtonLinkProps extends LinkProps {
  children: React.ReactNode;
  component: "a";
  href: string;
}

type Props = ButtonProps | ButtonLinkProps;

export const Button: React.FC<Props> = (props) => {
  if (props.component === "a") {
    const { children, component, ...linkProps } = props;
    return (
      <Link {...linkProps}>
        <a className={buttonClassName}>{children}</a>
      </Link>
    );
  }

  return <button className={buttonClassName}>{props.children}</button>;
};

const buttonClassName = ctl(`
  py-2
  px-4
  block
  w-max
  mx-auto
  rounded-lg
  font-bold
  text-yellow-300
  bg-black-shade-3
  mt-2
`);
