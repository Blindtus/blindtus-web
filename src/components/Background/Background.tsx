import React from 'react';

import { cx } from 'class-variance-authority';

type BackgroundProps = {
  className?: string;
  withoutImage?: boolean;
};

const Background = ({ className = '', withoutImage = false }: BackgroundProps) => {
  return (
    <div className={cx('fixed inset-0 z-[-1]', className)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={
          !withoutImage
            ? {
                backgroundImage: `url(
            https://image.tmdb.org/t/p/original/xyXmtuvsoM5J3yNad0nvcetpBdY.jpg
          )`,
              }
            : {}
        }
      ></div>
      <div className="bg-gradient-primary absolute inset-0"></div>
    </div>
  );
};

export default Background;
