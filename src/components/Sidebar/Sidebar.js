// @flow
import React from 'react';
import Author from './Author';
import Menu from './Menu';
import styles from './Sidebar.module.scss';
import { useSiteMetadata } from '../../hooks';

const Sidebar = () => {
  const { author, menu } = useSiteMetadata();
  return (
    <div className={styles['sidebar']}>
      <div className={styles['sidebar__inner']}>
        <Author author={author} />
        <Menu menu={menu} />
      </div>
    </div>
  );
};

export default Sidebar;
