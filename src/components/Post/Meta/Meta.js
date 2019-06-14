// @flow
import React from 'react';
import moment from 'moment';
import styles from './Meta.module.scss';

type Props = {
  date: string
};

const Meta = ({ date }: Props) => (
  <div className={styles['meta']}>
      이 글은 <span className={styles['meta__date']}>{moment(date).format('YYYY-MM-DD')}</span> 에 작성되었습니다.
  </div>
);

export default Meta;
