// @flow
import React from 'react';
import { getContactHref } from '../../../utils';
import styles from './Author.module.scss';
import { useSiteMetadata } from '../../../hooks';

// TODO: 작성자 정보 형태 수정 (jekyll 블로그 모양으로 수정하기)

const Author = () => {
  const { author } = useSiteMetadata();
  return (
    <div className={styles['author']}>
      <img className={styles['author__profile']} alt="author profile image" src={author.photo} />
      <p className={styles['author__bio']}>
        {author.bio}
        <a
          className={styles['author__bio-twitter']}
          href={getContactHref('github', author.contacts.github)}
          rel="noopener noreferrer"
          target="_blank"
        >
          <strong>{author.name}</strong> on Github
        </a>
      </p>
    </div>
  );
};

export default Author;
