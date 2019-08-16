// @flow
import React from 'react';
import moment from 'moment';
import styles from './Meta.module.scss';

type Props = {
  date: string,
  category: string,
};

const Meta = ({ date, category }: Props) => (
  <div className={styles['meta']}>
    <span className={styles['meta__date']}>{moment(date).format('YYYY-MM-DD')}</span>
    <span className={styles['meta__category']}>{category}</span>
  </div>
);

export default Meta;
