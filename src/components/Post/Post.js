// @flow
import React from 'react';
import { Link } from 'gatsby';
import Content from './Content';
import styles from './Post.module.scss';
import type { Node } from '../../types';

type Props = {
  post: Node
};

const Post = ({ post }: Props) => {
  const { html } = post;
  const {
    tags, title, date, category
  } = post.frontmatter;
  return (
    <div className={styles['post']}>
      <Link className={styles['post__home-button']} to="/">Home</Link>

      <div className={styles['post__content']}>
        <Content body={html} title={title} date={date} tags={tags} category={category} />
      </div>
    </div>
  );
};

export default Post;
