// @flow
import React from 'react';
import moment from 'moment';
import styles from './Meta.module.scss';

type Props = {
  date: string
};

const Meta = ({ date }: Props) => (
  <div className={styles['meta']}>
      작성일 : <span className={styles['meta__date']}>{moment(date).format('YYYY-MM-DD')}</span>
  </div>
);

export default Meta;
