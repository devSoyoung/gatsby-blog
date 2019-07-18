// @flow
import React from 'react';
import { Link } from 'gatsby';
import { Tag } from 'antd';
import styles from './Tags.module.scss';

type Props = {
  tags: string[],
  tagSlugs: string[]
};

const Tags = ({ tags, tagSlugs }: Props) => (
  <div className={styles['tags']}>
    <span>태그 : </span>
    <ul className={styles['tags__list']}>
      {tagSlugs && tagSlugs.map((slug, i) => (
        <li className={styles['tags__list-item']} key={tags[i]}>
          <Tag>
            <Link to={slug} className={styles['tags__list-item-link']}>
            {tags[i]}
            </Link>
          </Tag>
        </li>
      ))}
    </ul>
  </div>
);

export default Tags;
