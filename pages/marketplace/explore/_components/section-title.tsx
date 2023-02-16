import Link, { LinkProps } from "next/link";
import clsx from "clsx";

interface Common {
  title: string;
  className?: string;
}

interface ViewAllTrueProps extends Common {
  showViewAll: true;
  href: LinkProps["href"];
}

interface ViewAllFalseProps extends Common {
  showViewAll: false;
}

type Props = ViewAllTrueProps | ViewAllFalseProps;

export const SectionTitle: React.FC<Props> = ({
  className,
  title,
  ...props
}) => {
  return (
    <div className={clsx(`flex items-center gap-x-4`, className)}>
      <div className={`animationTextHeading text-xl fsm:text-2xl`}>{title}</div>

      {props.showViewAll && (
        <Link
          href={props.href}
          className={`inline-block rounded-md border border-gray-shade-3 px-3 py-1.5 text-xs font-medium text-white`}
        >
          View All
        </Link>
      )}
    </div>
  );
};
