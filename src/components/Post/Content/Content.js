// @flow
import React from 'react';
import styles from './Content.module.scss';
import Meta from '../Meta';

type Props = {
  body: string,
  title: string,
  date: string,
  category: string,
};

const Content = ({
  body, title, date, category,
}: Props) => (
  <div className={styles['content']}>
    <Meta date={date} category={category} />
    <h1 className={styles['content__title']}>{title}</h1>
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

export default Content;
