import type { FC } from 'react';

interface PageTitleProps {
  title: string;
}

const PageTitle: FC<PageTitleProps> = ({ title }) => {
  return (
    <h1 className="text-3xl font-bold tracking-tight text-foreground">
      {title}
    </h1>
  );
};

export default PageTitle;
