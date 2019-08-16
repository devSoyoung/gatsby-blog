// @flow
import React from 'react';
import { Tag } from 'antd';
import moment from 'moment';
import styles from './Meta.module.scss';

type Props = {
  date: string,
  tags: [],
};

const Meta = ({ date, tags }: Props) => (
  <div className={styles['meta']}>
    <div className={styles['meta__tags']}> {tags.map((tag) => <Tag>{tag}</Tag>)}</div>
    <div className={styles['meta__date']}>Written at {moment(date).format('MMM Do, YYYY')}</div>
  </div>
);

export default Meta;
